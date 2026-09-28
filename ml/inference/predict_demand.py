import os
import json
import joblib
import numpy as np
import pandas as pd
from datetime import datetime, timedelta

from ml.features.price_features import get_agricultural_season

_DEMAND_MODEL = None
_DEMAND_PREPROCESSOR = None
_DEMAND_METADATA = None
_DEMAND_HISTORY_DF = None


def load_demand_inference_artifacts():
    global _DEMAND_MODEL, _DEMAND_PREPROCESSOR, _DEMAND_METADATA, _DEMAND_HISTORY_DF

    if _DEMAND_MODEL is None:
        model_path = "ml/models/demand_model.joblib"
        prep_path = "ml/models/demand_preprocessor.joblib"
        meta_path = "ml/models/demand_metadata.json"

        if not os.path.exists(model_path) or not os.path.exists(prep_path):
            raise FileNotFoundError("Demand model or preprocessor artifact not found. Please run train_demand.py first.")

        _DEMAND_MODEL = joblib.load(model_path)
        _DEMAND_PREPROCESSOR = joblib.load(prep_path)

        with open(meta_path, "r") as f:
            _DEMAND_METADATA = json.load(f)

        data_path = "ml/data/demand/agribazaar_orders.csv"
        if not os.path.exists(data_path):
            data_path = "ml/data/demand/agribazaar_orders_bootstrap.csv"

        if os.path.exists(data_path):
            df_d = pd.read_csv(data_path)
            df_d["date"] = pd.to_datetime(df_d["date"], errors="coerce")
            _DEMAND_HISTORY_DF = df_d.sort_values(by="date")

    return _DEMAND_MODEL, _DEMAND_PREPROCESSOR, _DEMAND_METADATA, _DEMAND_HISTORY_DF


def predict_demand(product: str, location: str = "", horizon_days: int = 7) -> dict:
    """
    Predicts future quantity demand (KG) for a product and location.
    """
    model, preprocessor, meta, history_df = load_demand_inference_artifacts()

    prod_clean = product.strip().title()
    loc_clean = location.strip().title() if location else "Coimbatore"

    sub = pd.DataFrame()
    if history_df is not None:
        sub = history_df[(history_df["product"].str.title() == prod_clean) & (history_df["location"].str.title() == loc_clean)]
        if sub.empty:
            sub = history_df[history_df["product"].str.title() == prod_clean]

    now = datetime.now()
    ref_date = now.date()

    if not sub.empty:
        recent = sub.tail(30).copy()
        current_demand = float(recent["quantity_sold"].iloc[-1])
        q_series = recent["quantity_sold"].values
        l1 = float(q_series[-1]) if len(q_series) >= 1 else current_demand
        l3 = float(q_series[-3]) if len(q_series) >= 3 else l1
        l7 = float(q_series[-7]) if len(q_series) >= 7 else l3
        l14 = float(q_series[-14]) if len(q_series) >= 14 else l7
        l28 = float(q_series[-28]) if len(q_series) >= 28 else l14
        r_mean_7 = float(np.mean(q_series[-7:]))
        r_mean_14 = float(np.mean(q_series[-14:]))
        r_mean_28 = float(np.mean(q_series[-28:]))
        r_std_7 = float(np.std(q_series[-7:]))
        avg_price = float(recent.get("avg_selling_price", pd.Series([25.0])).iloc[-1])
        num_orders = int(recent.get("num_orders", pd.Series([10])).iloc[-1])

        # Compute empirical quantiles for High / Medium / Low
        p33 = float(np.percentile(q_series, 33))
        p66 = float(np.percentile(q_series, 66))
    else:
        current_demand = 450.0
        l1 = l3 = l7 = l14 = l28 = current_demand
        r_mean_7 = r_mean_14 = r_mean_28 = current_demand
        r_std_7 = 30.0
        avg_price = 25.0
        num_orders = 12
        p33 = 350.0
        p66 = 550.0

    target_date = ref_date + timedelta(days=horizon_days)
    month = target_date.month
    week = int(target_date.isocalendar()[1])
    day_of_week = target_date.weekday()
    quarter = (month - 1) // 3 + 1
    year = target_date.year
    season = get_agricultural_season(month)

    input_df = pd.DataFrame([{
        "product": prod_clean,
        "location": loc_clean,
        "season": season,
        "current_demand": current_demand,
        "lag_1": l1,
        "lag_3": l3,
        "lag_7": l7,
        "lag_14": l14,
        "lag_28": l28,
        "previous_week_demand": l7,
        "previous_month_demand": l28,
        "rolling_mean_7": r_mean_7,
        "rolling_mean_14": r_mean_14,
        "rolling_mean_28": r_mean_28,
        "rolling_std_7": r_std_7,
        "average_price": avg_price,
        "price_change": 0.0,
        "number_of_orders": num_orders,
        "average_order_quantity": current_demand / max(1, num_orders),
        "month": month,
        "week": week,
        "day_of_week": day_of_week,
        "quarter": quarter,
        "year": year
    }])

    X = preprocessor.transform(input_df[meta["allFeatures"]])
    raw_pred = float(model.predict(X)[0])
    predicted_demand = round(max(10.0, raw_pred), 1)

    # Dynamic Demand Level based on empirical distribution quantiles
    if predicted_demand < p33:
        demand_level = "Low"
    elif predicted_demand <= p66:
        demand_level = "Medium"
    else:
        demand_level = "High"

    # Historical demand series
    hist_points = []
    if not sub.empty:
        for _, r in sub.tail(7).iterrows():
            hist_points.append({
                "date": pd.to_datetime(r["date"]).strftime("%Y-%m-%d"),
                "demand": round(float(r["quantity_sold"]), 1)
            })
    else:
        for i in range(7, 0, -1):
            d = ref_date - timedelta(days=i)
            hist_points.append({
                "date": d.strftime("%Y-%m-%d"),
                "demand": round(current_demand * (1.0 + (i * -0.01)), 1)
            })

    # Forecast series
    forecast_points = []
    for i in range(1, horizon_days + 1):
        d = ref_date + timedelta(days=i)
        step_demand = current_demand + ((predicted_demand - current_demand) * (i / horizon_days))
        forecast_points.append({
            "date": d.strftime("%Y-%m-%d"),
            "predictedDemand": round(step_demand, 1)
        })

    return {
        "success": True,
        "product": prod_clean,
        "location": loc_clean,
        "horizonDays": horizon_days,
        "currentDemand": round(current_demand, 1),
        "predictedDemand": predicted_demand,
        "demandLevel": demand_level,
        "unit": meta.get("unit", "KG"),
        "model": "xgboost",
        "dataSource": meta.get("dataSource", "Demo/Bootstrap"),
        "isBootstrap": meta.get("isBootstrap", True),
        "forecastDate": target_date.strftime("%Y-%m-%d"),
        "historicalSeries": hist_points,
        "forecastSeries": forecast_points,
        "metrics": meta.get("metrics", {})
    }
