import numpy as np
import pandas as pd


def get_agricultural_season(month: int) -> str:
    """
    Returns Indian agricultural season based on month:
    - Kharif (Monsoon crops): June - October
    - Rabi (Winter crops): November - March
    - Zaid (Summer crops): April - May
    """
    if month in [6, 7, 8, 9, 10]:
        return "Kharif"
    elif month in [11, 12, 1, 2, 3]:
        return "Rabi"
    else:
        return "Zaid"


def build_price_features(df: pd.DataFrame, horizon_days: int = 7) -> pd.DataFrame:
    """
    Constructs time-series features strictly without lookahead bias.
    Target: future_modal_price at horizon_days in the future.
    """
    # Ensure sorted chronologically per commodity & market series
    df = df.copy()
    df["date"] = pd.to_datetime(df["date"])
    df = df.sort_values(by=["commodity", "market", "date"]).reset_index(drop=True)

    # Group series identifier
    group_cols = ["commodity", "market"]

    # Target: 7 days into future
    df["target"] = df.groupby(group_cols)["modal_price"].shift(-horizon_days)

    # Lags (relative to current observation time t)
    df["lag_1"] = df.groupby(group_cols)["modal_price"].shift(1)
    df["lag_3"] = df.groupby(group_cols)["modal_price"].shift(3)
    df["lag_7"] = df.groupby(group_cols)["modal_price"].shift(7)
    df["lag_14"] = df.groupby(group_cols)["modal_price"].shift(14)
    df["lag_30"] = df.groupby(group_cols)["modal_price"].shift(30)

    # Current price at time t (known before predicting horizon_days ahead)
    df["current_modal_price"] = df["modal_price"]

    # Rolling window stats (strictly backwards from current observation)
    # Using closed='both' or rolling on shifted to avoid target leakage
    grouped_price = df.groupby(group_cols)["modal_price"]

    df["rolling_mean_7"] = grouped_price.transform(lambda s: s.rolling(window=7, min_periods=3).mean())
    df["rolling_mean_14"] = grouped_price.transform(lambda s: s.rolling(window=14, min_periods=5).mean())
    df["rolling_mean_30"] = grouped_price.transform(lambda s: s.rolling(window=30, min_periods=7).mean())

    df["rolling_std_7"] = grouped_price.transform(lambda s: s.rolling(window=7, min_periods=3).std()).fillna(0)
    df["rolling_std_30"] = grouped_price.transform(lambda s: s.rolling(window=30, min_periods=7).std()).fillna(0)

    # Price momentum / pct changes
    df["price_change_1"] = (df["current_modal_price"] - df["lag_1"]) / (df["lag_1"] + 1e-6)
    df["price_change_7"] = (df["current_modal_price"] - df["lag_7"]) / (df["lag_7"] + 1e-6)

    # Calendar features
    df["month"] = df["date"].dt.month
    df["week"] = df["date"].dt.isocalendar().week.astype(int)
    df["day_of_week"] = df["date"].dt.dayofweek
    df["quarter"] = df["date"].dt.quarter
    df["year"] = df["date"].dt.year
    df["season"] = df["month"].apply(get_agricultural_season)

    # Baseline for 7-day ahead forecast:
    # 7-day rolling average or current modal price
    df["baseline_pred"] = df["rolling_mean_7"].fillna(df["current_modal_price"])

    return df
