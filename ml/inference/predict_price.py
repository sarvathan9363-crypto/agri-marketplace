import os
import json
import joblib
import numpy as np
import pandas as pd
from datetime import datetime, timedelta

from ml.features.price_features import get_agricultural_season

# Model singletons loaded once at startup
_PRICE_MODEL = None
_PRICE_PREPROCESSOR = None
_PRICE_METADATA = None
_PRICE_HISTORY_DF = None


def load_price_inference_artifacts():
    global _PRICE_MODEL, _PRICE_PREPROCESSOR, _PRICE_METADATA, _PRICE_HISTORY_DF

    if _PRICE_MODEL is None:
        model_path = "ml/models/price_model.joblib"
        prep_path = "ml/models/price_preprocessor.joblib"
        meta_path = "ml/models/price_metadata.json"

        if not os.path.exists(model_path) or not os.path.exists(prep_path):
            raise FileNotFoundError("Price model or preprocessor artifact not found. Please run train_price.py first.")

        _PRICE_MODEL = joblib.load(model_path)
        _PRICE_PREPROCESSOR = joblib.load(prep_path)

        with open(meta_path, "r") as f:
            _PRICE_METADATA = json.load(f)

        # Load recent price history for lag retrieval
        history_path = "ml/data/price/calibrated_historical_mandi_prices.csv"
        if not os.path.exists(history_path):
            history_path = "ml/data/price/commodity_price.csv"
        
        if os.path.exists(history_path):
            df_h = pd.read_csv(history_path)
            # Ensure proper columns
            rename_map = {"Arrival_Date": "date", "State": "state", "District": "district", "Market": "market", "Commodity": "commodity", "Modal_x0020_Price": "modal_price"}
            df_h = df_h.rename(columns={k: v for k, v in rename_map.items() if k in df_h.columns})
            df_h["date"] = pd.to_datetime(df_h["date"], errors="coerce")
            _PRICE_HISTORY_DF = df_h.sort_values(by="date")

    return _PRICE_MODEL, _PRICE_PREPROCESSOR, _PRICE_METADATA, _PRICE_HISTORY_DF


def predict_price(commodity: str, state: str = "", district: str = "", market: str = "", horizon_days: int = 7) -> dict:
    """
    Predicts future modal price for a given commodity and mandi/location over horizon_days.
    """
    model, preprocessor, meta, history_df = load_price_inference_artifacts()

    commodity_clean = commodity.strip().title()
    state_clean = state.strip().title() if state else "All-India"
    district_clean = district.strip().title() if district else ""
    market_clean = market.strip().title() if market else district_clean or "Mandi"

    # Find historical series for this commodity
    sub = pd.DataFrame()
    if history_df is not None:
        if market_clean:
            sub = history_df[(history_df["commodity"].str.title() == commodity_clean) & (history_df["market"].str.title() == market_clean)]
        if sub.empty and district_clean:
            sub = history_df[(history_df["commodity"].str.title() == commodity_clean) & (history_df["district"].str.title() == district_clean)]
        if sub.empty:
            sub = history_df[history_df["commodity"].str.title() == commodity_clean]

    now = datetime.now()
    ref_date = now.date()

    if not sub.empty:
        recent = sub.tail(30).copy()
        current_price = float(recent["modal_price"].iloc[-1])
        prices_series = recent["modal_price"].values
        l1 = float(prices_series[-1]) if len(prices_series) >= 1 else current_price
        l3 = float(prices_series[-3]) if len(prices_series) >= 3 else l1
        l7 = float(prices_series[-7]) if len(prices_series) >= 7 else l3
        l14 = float(prices_series[-14]) if len(prices_series) >= 14 else l7
        l30 = float(prices_series[-30]) if len(prices_series) >= 30 else l14
        r_mean_7 = float(np.mean(prices_series[-7:]))
        r_mean_14 = float(np.mean(prices_series[-14:]))
        r_mean_30 = float(np.mean(prices_series[-30:]))
        r_std_7 = float(np.std(prices_series[-7:]))
        r_std_30 = float(np.std(prices_series[-30:]))
    else:
        # Commodity default reference
        current_price = 2200.0
        l1 = l3 = l7 = l14 = l30 = current_price
        r_mean_7 = r_mean_14 = r_mean_30 = current_price
        r_std_7 = r_std_30 = 25.0

    p_change_1 = (current_price - l1) / (l1 + 1e-6)
    p_change_7 = (current_price - l7) / (l7 + 1e-6)

    target_date = ref_date + timedelta(days=horizon_days)
    month = target_date.month
    week = int(target_date.isocalendar()[1])
    day_of_week = target_date.weekday()
    quarter = (month - 1) // 3 + 1
    year = target_date.year
    season = get_agricultural_season(month)

    input_df = pd.DataFrame([{
        "commodity": commodity_clean,
        "state": state_clean,
        "district": district_clean,
        "market": market_clean,
        "variety": "Common",
        "grade": "Faq",
        "season": season,
        "current_modal_price": current_price,
        "lag_1": l1,
        "lag_3": l3,
        "lag_7": l7,
        "lag_14": l14,
        "lag_30": l30,
        "rolling_mean_7": r_mean_7,
        "rolling_mean_14": r_mean_14,
        "rolling_mean_30": r_mean_30,
        "rolling_std_7": r_std_7,
        "rolling_std_30": r_std_30,
        "price_change_1": p_change_1,
        "price_change_7": p_change_7,
        "month": month,
        "week": week,
        "day_of_week": day_of_week,
        "quarter": quarter,
        "year": year
    }])

    X = preprocessor.transform(input_df[meta["allFeatures"]])
    raw_pred = float(model.predict(X)[0])
    predicted_price = round(max(50.0, raw_pred), 2)

    # Build historical trend for charts (last 7 points)
    hist_points = []
    if not sub.empty:
        hist_slice = sub.tail(7)
        for _, r in hist_slice.iterrows():
            d_val = pd.to_datetime(r["date"]).strftime("%Y-%m-%d")
            hist_points.append({"date": d_val, "price": round(float(r["modal_price"]), 2)})
    else:
        for i in range(7, 0, -1):
            d = ref_date - timedelta(days=i)
            hist_points.append({"date": d.strftime("%Y-%m-%d"), "price": round(current_price * (1.0 + (i * -0.005)), 2)})

    # Build forecast trajectory
    forecast_points = []
    # Interpolate from current price to predicted price at horizon
    for i in range(1, horizon_days + 1):
        d = ref_date + timedelta(days=i)
        step_price = current_price + ((predicted_price - current_price) * (i / horizon_days))
        forecast_points.append({
            "date": d.strftime("%Y-%m-%d"),
            "predictedPrice": round(step_price, 2)
        })

    return {
        "success": True,
        "commodity": commodity_clean,
        "state": state_clean,
        "district": district_clean,
        "market": market_clean,
        "location": district_clean or state_clean,
        "horizonDays": horizon_days,
        "currentPrice": round(current_price, 2),
        "predictedPrice": predicted_price,
        "currency": "INR",
        "unit": "QUINTAL",
        "model": "xgboost",
        "forecastDate": target_date.strftime("%Y-%m-%d"),
        "historicalSeries": hist_points,
        "forecastSeries": forecast_points,
        "metrics": meta.get("metrics", {})
    }
