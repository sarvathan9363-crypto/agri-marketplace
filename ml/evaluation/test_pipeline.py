import os
import json
import pytest
import requests

BACKEND_URL = "http://localhost:8080/api/ml"
ML_SERVICE_URL = "http://127.0.0.1:8001"


def test_ml_service_health():
    res = requests.get(f"{ML_SERVICE_URL}/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "online"
    print("[PASS] ML Service Health: PASS")


def test_price_prediction_commodities():
    commodities = ["Tomato", "Onion", "Potato"]
    locations = [
        {"state": "Tamil Nadu", "district": "Coimbatore", "market": "Mettupalayam"},
        {"state": "Maharashtra", "district": "Pune", "market": "Pune"},
        {"state": "Punjab", "district": "Karnal", "market": "Karnal"},
    ]

    for crop in commodities:
        for loc in locations:
            res = requests.post(f"{BACKEND_URL}/price/predict", json={
                "commodity": crop,
                "state": loc["state"],
                "district": loc["district"],
                "market": loc["market"],
                "horizonDays": 7
            })
            assert res.status_code == 200, f"Failed for {crop} at {loc}"
            data = res.json()
            assert data["success"] is True
            assert data["commodity"] == crop
            assert data["horizonDays"] == 7
            assert data["predictedPrice"] > 0
            assert data["unit"] == "QUINTAL"
            assert data["model"] == "xgboost"
            assert len(data["historicalSeries"]) > 0
            assert len(data["forecastSeries"]) == 7
            print(f"[PASS] Price Predict: {crop} ({loc['market']}) -> INR {data['predictedPrice']}/Quintal")


def test_price_validation_errors():
    # Invalid horizon
    res = requests.post(f"{BACKEND_URL}/price/predict", json={
        "commodity": "Tomato",
        "horizonDays": 0
    })
    assert res.status_code == 400
    print("[PASS] Horizon 0 rejected with 400")

    res = requests.post(f"{BACKEND_URL}/price/predict", json={
        "commodity": "Tomato",
        "horizonDays": 35
    })
    assert res.status_code == 400
    print("[PASS] Horizon 35 rejected with 400")

    # Empty commodity
    res = requests.post(f"{BACKEND_URL}/price/predict", json={
        "commodity": "",
        "horizonDays": 7
    })
    assert res.status_code == 400
    print("[PASS] Empty commodity rejected with 400")

    # NaN commodity
    res = requests.post(f"{BACKEND_URL}/price/predict", json={
        "commodity": "NaN",
        "horizonDays": 7
    })
    assert res.status_code == 400
    print("[PASS] NaN value rejected with 400")


def test_demand_forecast_products():
    products = ["Tomato", "Onion", "Potato"]
    locations = ["Coimbatore", "Pune", "Nashik"]

    for prod in products:
        for loc in locations:
            res = requests.post(f"{BACKEND_URL}/demand/forecast", json={
                "product": prod,
                "location": loc,
                "horizonDays": 7
            })
            assert res.status_code == 200, f"Demand failed for {prod} at {loc}"
            data = res.json()
            assert data["success"] is True
            assert data["product"] == prod
            assert data["horizonDays"] == 7
            assert data["predictedDemand"] > 0
            assert data["unit"] == "KG"
            assert data["model"] == "xgboost"
            assert data["demandLevel"] in ["High", "Medium", "Low"]
            assert data["dataSource"] in ["AgriBazaar Orders", "Demo/Bootstrap"]
            assert len(data["forecastSeries"]) == 7
            print(f"[PASS] Demand Forecast: {prod} ({loc}) -> {data['predictedDemand']} KG ({data['demandLevel']} demand)")


def test_demand_validation_errors():
    # Empty product
    res = requests.post(f"{BACKEND_URL}/demand/forecast", json={
        "product": "",
        "location": "Coimbatore",
        "horizonDays": 7
    })
    assert res.status_code == 400
    print("[PASS] Empty product rejected with 400")


def test_metadata_and_options():
    res = requests.get(f"{BACKEND_URL}/options")
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert "Tomato" in data["commodities"]
    assert "priceMetrics" in data
    assert "demandMetrics" in data
    print("[PASS] Options & Metadata Endpoint: PASS")


if __name__ == "__main__":
    print("\n--- RUNNING AGRIBAZAAR ML INTEGRATION SUITE ---")
    test_ml_service_health()
    test_price_prediction_commodities()
    test_price_validation_errors()
    test_demand_forecast_products()
    test_demand_validation_errors()
    test_metadata_and_options()
    print("\n[SUCCESS] ALL ML TESTS PASSED SUCCESSFULLY!")
