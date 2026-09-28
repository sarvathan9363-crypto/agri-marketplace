import os
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from dotenv import load_dotenv

# Load env from backend/.env if available
load_dotenv("backend/.env")


def extract_orders_from_mongodb() -> tuple[pd.DataFrame | None, str]:
    """
    Extracts orders from AgriBazaar MongoDB database.
    Returns (DataFrame, dataSource) where dataSource is either 'AgriBazaar Orders' or 'Demo/Bootstrap'.
    """
    mongo_uri = os.getenv("MONGODB_URI")
    if not mongo_uri or "<db_username>" in mongo_uri:
        print("[Demand Prep] Valid MONGODB_URI not found in backend/.env.")
        return None, "Demo/Bootstrap"

    try:
        from pymongo import MongoClient
        client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
        db = client.get_default_database()
        if db is None:
            # Fallback to agribazaar db name
            db = client["agribazaar"]

        orders_col = db["orders"]
        # Match confirmed, dispatched, or delivered orders
        query = {"orderStatus": {"$in": ["CONFIRMED", "DISPATCHED", "DELIVERED", "CREATED"]}}
        orders = list(orders_col.find(query, {
            "productName": 1,
            "quantity": 1,
            "unit": 1,
            "pricePerUnit": 1,
            "totalAmount": 1,
            "deliveryCity": 1,
            "deliveryState": 1,
            "createdAt": 1
        }))

        if len(orders) < 30:
            print(f"[Demand Prep] Found only {len(orders)} orders in MongoDB. Minimum 30 required for ML time series.")
            return None, "Demo/Bootstrap"

        df = pd.DataFrame(orders)
        df["date"] = pd.to_datetime(df["createdAt"]).dt.floor("d")
        df["product"] = df["productName"].str.strip().str.title()
        df["location"] = df["deliveryCity"].fillna(df["deliveryState"]).fillna("Local").str.strip().str.title()
        df["quantity"] = pd.to_numeric(df["quantity"], errors="coerce").fillna(0)
        df["pricePerUnit"] = pd.to_numeric(df["pricePerUnit"], errors="coerce").fillna(0)

        # Aggregate daily demand
        agg = df.groupby(["date", "product", "location"], as_index=False).agg(
            quantity_sold=("quantity", "sum"),
            num_orders=("quantity", "count"),
            avg_selling_price=("pricePerUnit", "mean")
        )

        unique_days = agg["date"].nunique()
        if unique_days < 30:
            print(f"[Demand Prep] Order data spans only {unique_days} day(s). Insufficient history for time-series.")
            return None, "Demo/Bootstrap"

        print(f"[Demand Prep] Successfully extracted {len(agg)} daily order aggregates spanning {unique_days} days.")
        return agg, "AgriBazaar Orders"

    except Exception as e:
        print(f"[Demand Prep] MongoDB order extraction exception: {e}")
        return None, "Demo/Bootstrap"


def generate_bootstrap_demand_series(days: int = 120) -> pd.DataFrame:
    """
    Builds a realistic bootstrap demand dataset for AgriBazaar crops across representative regional hubs.
    Explicitly tagged as bootstrap/demo.
    """
    np.random.seed(42)
    end_date = datetime.now().date()
    dates = [pd.Timestamp(end_date - timedelta(days=d)) for d in range(days, -1, -1)]

    crops_profiles = [
        {"product": "Tomato", "base_daily_kg": 450, "volatility": 0.15, "base_price": 28.0, "unit": "KG"},
        {"product": "Onion", "base_daily_kg": 600, "volatility": 0.10, "base_price": 32.0, "unit": "KG"},
        {"product": "Potato", "base_daily_kg": 550, "volatility": 0.08, "base_price": 22.0, "unit": "KG"},
        {"product": "Paddy", "base_daily_kg": 1200, "volatility": 0.12, "base_price": 25.0, "unit": "KG"},
        {"product": "Wheat", "base_daily_kg": 950, "volatility": 0.09, "base_price": 26.0, "unit": "KG"},
        {"product": "Banana", "base_daily_kg": 380, "volatility": 0.14, "base_price": 35.0, "unit": "KG"},
        {"product": "Brinjal", "base_daily_kg": 220, "volatility": 0.18, "base_price": 24.0, "unit": "KG"},
        {"product": "Green Chilli", "base_daily_kg": 140, "volatility": 0.20, "base_price": 45.0, "unit": "KG"}
    ]

    locations = ["Coimbatore", "Pune", "Nashik", "Karnal", "Bengaluru", "Indore"]

    rows = []
    for crop in crops_profiles:
        for loc in locations:
            # Regional factor
            loc_factor = np.random.uniform(0.7, 1.4)
            daily_mean = crop["base_daily_kg"] * loc_factor

            for dt in dates:
                dow = dt.weekday()
                # Weekend surge for consumer crops
                dow_factor = 1.25 if dow in [5, 6] else 0.95
                noise = np.random.normal(0, crop["volatility"])
                
                qty = max(10.0, daily_mean * dow_factor * (1.0 + noise))
                avg_order_size = np.random.uniform(20.0, 45.0)
                num_orders = max(1, int(round(qty / avg_order_size)))
                price_noise = np.random.normal(0, 0.04)
                price = max(5.0, crop["base_price"] * (1.0 + price_noise))

                rows.append({
                    "date": dt,
                    "product": crop["product"],
                    "location": loc,
                    "quantity_sold": round(qty, 2),
                    "num_orders": num_orders,
                    "avg_selling_price": round(price, 2),
                    "unit": crop["unit"],
                    "is_bootstrap": True
                })

    return pd.DataFrame(rows)


def load_and_preprocess_demand_data() -> tuple[pd.DataFrame, str]:
    """
    Loads demand data from AgriBazaar orders or falls back cleanly to bootstrap mode.
    Returns (DataFrame, dataSource).
    """
    df, data_source = extract_orders_from_mongodb()

    if df is not None and len(df) >= 30:
        os.makedirs("ml/data/demand", exist_ok=True)
        df.to_csv("ml/data/demand/agribazaar_orders.csv", index=False)
        return df, data_source

    print("[Demand Prep] Activating DEMO/BOOTSTRAP demand series...")
    df_bootstrap = generate_bootstrap_demand_series(days=120)
    os.makedirs("ml/data/demand", exist_ok=True)
    df_bootstrap.to_csv("ml/data/demand/agribazaar_orders_bootstrap.csv", index=False)
    return df_bootstrap, "Demo/Bootstrap"
