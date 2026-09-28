import numpy as np
import pandas as pd
from ml.features.price_features import get_agricultural_season


def build_demand_features(df: pd.DataFrame, horizon_days: int = 7) -> pd.DataFrame:
    """
    Constructs demand features strictly without lookahead bias.
    Target: future_quantity_demand at horizon_days into the future.
    """
    df = df.copy()
    df["date"] = pd.to_datetime(df["date"])
    df = df.sort_values(by=["product", "location", "date"]).reset_index(drop=True)

    group_cols = ["product", "location"]

    # Target: demand 7 days ahead
    df["target"] = df.groupby(group_cols)["quantity_sold"].shift(-horizon_days)

    # Lags (relative to current observation time t)
    df["current_demand"] = df["quantity_sold"]
    df["lag_1"] = df.groupby(group_cols)["quantity_sold"].shift(1)
    df["lag_3"] = df.groupby(group_cols)["quantity_sold"].shift(3)
    df["lag_7"] = df.groupby(group_cols)["quantity_sold"].shift(7)
    df["lag_14"] = df.groupby(group_cols)["quantity_sold"].shift(14)
    df["lag_28"] = df.groupby(group_cols)["quantity_sold"].shift(28)

    # Previous week and previous month demand
    df["previous_week_demand"] = df["lag_7"]
    df["previous_month_demand"] = df["lag_28"]

    # Rolling statistics
    grouped_qty = df.groupby(group_cols)["quantity_sold"]
    df["rolling_mean_7"] = grouped_qty.transform(lambda s: s.rolling(window=7, min_periods=3).mean())
    df["rolling_mean_14"] = grouped_qty.transform(lambda s: s.rolling(window=14, min_periods=5).mean())
    df["rolling_mean_28"] = grouped_qty.transform(lambda s: s.rolling(window=28, min_periods=7).mean())
    df["rolling_std_7"] = grouped_qty.transform(lambda s: s.rolling(window=7, min_periods=3).std()).fillna(0)

    # Pricing & order features
    df["average_price"] = df.get("avg_selling_price", 25.0)
    prev_price = df.groupby(group_cols)["average_price"].shift(1).fillna(df["average_price"])
    df["price_change"] = (df["average_price"] - prev_price) / (prev_price + 1e-6)

    df["number_of_orders"] = df.get("num_orders", 1)
    df["average_order_quantity"] = df["current_demand"] / (df["number_of_orders"] + 1e-6)

    # Calendar features
    df["month"] = df["date"].dt.month
    df["week"] = df["date"].dt.isocalendar().week.astype(int)
    df["day_of_week"] = df["date"].dt.dayofweek
    df["quarter"] = df["date"].dt.quarter
    df["year"] = df["date"].dt.year
    df["season"] = df["month"].apply(get_agricultural_season)

    # Baseline for demand forecast: 7-day rolling average or previous week demand
    df["baseline_pred"] = df["rolling_mean_7"].fillna(df["previous_week_demand"]).fillna(df["current_demand"])

    return df
