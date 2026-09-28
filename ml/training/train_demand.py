import os
import json
import joblib
import numpy as np
import pandas as pd
from datetime import datetime
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OrdinalEncoder, StandardScaler
import xgboost as xgb

from ml.preprocessing.demand_prep import load_and_preprocess_demand_data
from ml.features.demand_features import build_demand_features
from ml.evaluation.metrics import evaluate_forecast


def train_demand_model():
    print("=" * 60)
    print("AGRIBAZAAR DEMAND FORECASTING — TRAINING PIPELINE")
    print("=" * 60)

    # 1. Load & Preprocess
    df_raw, data_source = load_and_preprocess_demand_data()

    # 2. Feature Engineering
    print(f"\n[Step 1/5] Engineering demand time-series features (source: {data_source})...")
    df_featured = build_demand_features(df_raw, horizon_days=7)

    # Filter complete rows (target and lag_7 must be non-null)
    valid_mask = (~df_featured["target"].isna()) & (~df_featured["lag_7"].isna())
    df_clean = df_featured[valid_mask].copy()

    # Fill any remaining NaNs in lag_14/lag_28 with lag_7 or current_demand
    for col in ["lag_14", "lag_28", "previous_month_demand", "rolling_mean_14", "rolling_mean_28"]:
        df_clean[col] = df_clean[col].fillna(df_clean["lag_7"])

    print(f"[Step 1/5] Total valid demand records: {len(df_clean)}")

    # 3. Chronological Train / Val / Test Split
    print("\n[Step 2/5] Chronological train/val/test split (no random shuffling)...")
    df_clean = df_clean.sort_values(by="date").reset_index(drop=True)
    unique_dates = df_clean["date"].sort_values().unique()

    n_dates = len(unique_dates)
    train_end_idx = int(n_dates * 0.70)
    val_end_idx = int(n_dates * 0.85)

    train_dates = unique_dates[:train_end_idx]
    val_dates = unique_dates[train_end_idx:val_end_idx]
    test_dates = unique_dates[val_end_idx:]

    train_df = df_clean[df_clean["date"].isin(train_dates)].copy()
    val_df = df_clean[df_clean["date"].isin(val_dates)].copy()
    test_df = df_clean[df_clean["date"].isin(test_dates)].copy()

    print(f"  Training set:   {len(train_df)} rows ({train_dates[0].strftime('%Y-%m-%d')} to {train_dates[-1].strftime('%Y-%m-%d')})")
    print(f"  Validation set: {len(val_df)} rows ({val_dates[0].strftime('%Y-%m-%d')} to {val_dates[-1].strftime('%Y-%m-%d')})")
    print(f"  Testing set:    {len(test_df)} rows ({test_dates[0].strftime('%Y-%m-%d')} to {test_dates[-1].strftime('%Y-%m-%d')})")

    # Features
    cat_features = ["product", "location", "season"]
    num_features = [
        "current_demand",
        "lag_1", "lag_3", "lag_7", "lag_14", "lag_28",
        "previous_week_demand", "previous_month_demand",
        "rolling_mean_7", "rolling_mean_14", "rolling_mean_28",
        "rolling_std_7",
        "average_price", "price_change",
        "number_of_orders", "average_order_quantity",
        "month", "week", "day_of_week", "quarter", "year"
    ]

    all_features = cat_features + num_features
    target_col = "target"

    # Preprocessor
    print("\n[Step 3/5] Fitting preprocessor on training data only...")
    preprocessor = ColumnTransformer(
        transformers=[
            ("cat", OrdinalEncoder(handle_unknown="use_encoded_value", unknown_value=-1), cat_features),
            ("num", StandardScaler(), num_features),
        ],
        remainder="drop"
    )

    X_train = preprocessor.fit_transform(train_df[all_features])
    y_train = train_df[target_col].values

    X_val = preprocessor.transform(val_df[all_features])
    y_val = val_df[target_col].values

    X_test = preprocessor.transform(test_df[all_features])
    y_test = test_df[target_col].values

    # 4. Train XGBoost Regressor
    print("\n[Step 4/5] Training Demand XGBoost Regressor...")
    model = xgb.XGBRegressor(
        n_estimators=120,
        max_depth=5,
        learning_rate=0.05,
        subsample=0.85,
        colsample_bytree=0.85,
        random_state=42,
        n_jobs=-1
    )

    model.fit(
        X_train, y_train,
        eval_set=[(X_val, y_val)],
        verbose=False
    )

    # 5. Evaluate on Test Split
    print("\n[Step 5/5] Evaluating on unseen chronological test split...")
    test_preds = model.predict(X_test)
    xgb_metrics = evaluate_forecast(y_test, test_preds)

    # Baseline comparison (7-day rolling average / previous week demand)
    baseline_preds = test_df["baseline_pred"].values
    baseline_metrics = evaluate_forecast(y_test, baseline_preds)

    print("\n" + "=" * 50)
    print(f"DEMAND EVALUATION RESULTS (TEST SET, Source: {data_source}):")
    print(f"  Baseline (7-day rolling / prev week):")
    print(f"    MAE:  {baseline_metrics['mae']} KG")
    print(f"    RMSE: {baseline_metrics['rmse']} KG")
    print(f"    MAPE: {baseline_metrics['mape']}%")
    print(f"    R2:   {baseline_metrics['r2']}")
    print(f"\n  XGBoost Regressor:")
    print(f"    MAE:  {xgb_metrics['mae']} KG")
    print(f"    RMSE: {xgb_metrics['rmse']} KG")
    print(f"    MAPE: {xgb_metrics['mape']}%")
    print(f"    R2:   {xgb_metrics['r2']}")
    print("=" * 50)

    # Save Models and Metadata
    os.makedirs("ml/models", exist_ok=True)
    model_path = "ml/models/demand_model.joblib"
    prep_path = "ml/models/demand_preprocessor.joblib"
    meta_path = "ml/models/demand_metadata.json"

    joblib.dump(model, model_path)
    joblib.dump(preprocessor, prep_path)

    metadata = {
        "model": "XGBoost Regressor",
        "version": "1.0",
        "target": "future_quantity_demand",
        "forecastHorizon": 7,
        "horizonUnit": "days",
        "unit": "KG",
        "trainingDate": datetime.now().isoformat(),
        "trainingRows": int(len(train_df)),
        "validationRows": int(len(val_df)),
        "testingRows": int(len(test_df)),
        "catFeatures": cat_features,
        "numFeatures": num_features,
        "allFeatures": all_features,
        "metrics": xgb_metrics,
        "baselineMetrics": baseline_metrics,
        "dataSource": data_source,
        "isBootstrap": (data_source == "Demo/Bootstrap"),
        "dateRange": {
            "start": str(unique_dates[0]),
            "end": str(unique_dates[-1])
        },
        "availableProducts": sorted([str(p) for p in df_clean["product"].unique()]),
        "availableLocations": sorted([str(l) for l in df_clean["location"].unique()])
    }

    with open(meta_path, "w") as f:
        json.dump(metadata, f, indent=2)

    print(f"\n[OK] Demand model saved: {model_path}")
    print(f"[OK] Demand preprocessor saved: {prep_path}")
    print(f"[OK] Demand metadata saved: {meta_path}")

    return metadata


if __name__ == "__main__":
    train_demand_model()
