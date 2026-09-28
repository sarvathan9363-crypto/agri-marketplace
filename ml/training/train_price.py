import os
import json
import joblib
import numpy as np
import pandas as pd
from datetime import datetime
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OrdinalEncoder, StandardScaler
import xgboost as xgb

from ml.preprocessing.price_prep import load_and_preprocess_price_data
from ml.features.price_features import build_price_features
from ml.evaluation.metrics import evaluate_forecast


def train_price_model(data_path: str = "ml/data/price/commodity_price.csv"):
    print("=" * 60)
    print("AGRIBAZAAR PRICE PREDICTION — TRAINING PIPELINE")
    print("=" * 60)

    # 1. Load & Preprocess
    df_raw = load_and_preprocess_price_data(data_path)

    # 2. Feature Engineering
    print("\n[Step 1/5] Engineering time-series features (lags, rolling stats, calendar)...")
    df_featured = build_price_features(df_raw, horizon_days=7)

    # Drop rows without complete target or lag_30 to avoid cold-start bias
    valid_mask = (~df_featured["target"].isna()) & (~df_featured["lag_7"].isna())
    df_clean = df_featured[valid_mask].copy()

    # Fill any remaining NaNs in lag_14/lag_30 with lag_7 or current_modal_price
    for col in ["lag_14", "lag_30", "rolling_mean_14", "rolling_mean_30"]:
        df_clean[col] = df_clean[col].fillna(df_clean["lag_7"])

    print(f"[Step 1/5] Total clean feature rows for model: {len(df_clean)}")

    # 3. Chronological Train / Val / Test Split
    print("\n[Step 2/5] Performing chronological train/val/test split (no random shuffling)...")
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
    cat_features = ["commodity", "state", "district", "market", "variety", "grade", "season"]
    num_features = [
        "current_modal_price",
        "lag_1", "lag_3", "lag_7", "lag_14", "lag_30",
        "rolling_mean_7", "rolling_mean_14", "rolling_mean_30",
        "rolling_std_7", "rolling_std_30",
        "price_change_1", "price_change_7",
        "month", "week", "day_of_week", "quarter", "year"
    ]

    all_features = cat_features + num_features
    target_col = "target"

    # Preprocessor
    print("\n[Step 3/5] Fitting preprocessor on training data only (preventing leakage)...")
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
    print("\n[Step 4/5] Training XGBoost Regressor...")
    model = xgb.XGBRegressor(
        n_estimators=150,
        max_depth=6,
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

    # Baseline comparison (7-day rolling average / current price)
    baseline_preds = test_df["baseline_pred"].values
    baseline_metrics = evaluate_forecast(y_test, baseline_preds)

    print("\n" + "=" * 50)
    print("EVALUATION RESULTS (TEST SET):")
    print(f"  Baseline (7-day rolling / prev price):")
    print(f"    MAE:  INR {baseline_metrics['mae']}")
    print(f"    RMSE: INR {baseline_metrics['rmse']}")
    print(f"    MAPE: {baseline_metrics['mape']}%")
    print(f"    R2:   {baseline_metrics['r2']}")
    print(f"\n  XGBoost Regressor:")
    print(f"    MAE:  INR {xgb_metrics['mae']}")
    print(f"    RMSE: INR {xgb_metrics['rmse']}")
    print(f"    MAPE: {xgb_metrics['mape']}%")
    print(f"    R2:   {xgb_metrics['r2']}")
    print("=" * 50)

    # Save Models and Metadata
    os.makedirs("ml/models", exist_ok=True)
    model_path = "ml/models/price_model.joblib"
    prep_path = "ml/models/price_preprocessor.joblib"
    meta_path = "ml/models/price_metadata.json"

    joblib.dump(model, model_path)
    joblib.dump(preprocessor, prep_path)

    metadata = {
        "model": "XGBoost Regressor",
        "version": "1.0",
        "target": "future_modal_price",
        "forecastHorizon": 7,
        "horizonUnit": "days",
        "trainingDate": datetime.now().isoformat(),
        "trainingRows": int(len(train_df)),
        "validationRows": int(len(val_df)),
        "testingRows": int(len(test_df)),
        "catFeatures": cat_features,
        "numFeatures": num_features,
        "allFeatures": all_features,
        "metrics": xgb_metrics,
        "baselineMetrics": baseline_metrics,
        "dataSource": "Agmarknet Mandi Dataset",
        "dateRange": {
            "start": str(unique_dates[0]),
            "end": str(unique_dates[-1])
        },
        "availableCommodities": sorted([str(c) for c in df_clean["commodity"].unique()]),
        "availableStates": sorted([str(s) for s in df_clean["state"].unique()]),
        "availableMarkets": sorted([str(m) for m in df_clean["market"].unique()])
    }

    with open(meta_path, "w") as f:
        json.dump(metadata, f, indent=2)

    print(f"\n[OK] Price model saved: {model_path}")
    print(f"[OK] Price preprocessor saved: {prep_path}")
    print(f"[OK] Price metadata saved: {meta_path}")

    return metadata


if __name__ == "__main__":
    train_price_model()
