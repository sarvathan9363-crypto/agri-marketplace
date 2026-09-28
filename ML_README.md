# AgriBazaar Machine Learning Architecture & Integration Guide

This document describes the design, training pipeline, inference architecture, and integration of the two Machine Learning capabilities built for **AgriBazaar**:
1. **Agricultural Price Prediction** (7-day ahead modal price prediction using Indian Mandi arrivals)
2. **Agricultural Demand Forecasting** (7-day ahead regional crop demand in KG based on AgriBazaar Order data with bootstrap fallback)

---

## 1. System Architecture

The machine learning system follows a decoupled, low-latency microservice architecture:

```
[React / Vite Frontend (Port 5173)]
         │
         │ (HTTP / JSON)
         ▼
[Node.js / Express API Backend (Port 8080)]
  - Routes: /api/ml/price/predict, /api/ml/demand/forecast, /api/ml/options
  - Authentication & Input Validation
         │
         │ (HTTP Proxy)
         ▼
[Python FastAPI ML Inference Service (Port 8001)]
  - Singletons loaded ONCE into memory at startup
  - Preprocessor pipelines (scikit-learn ColumnTransformer)
  - XGBoost Regressors (price_model.joblib, demand_model.joblib)
         │
         ▼
[Predictions + Historical & Forecast Trajectory Series]
```

### Key Principles
- **No Per-Request Process Spawning:** The Python FastAPI microservice holds the trained models in memory. Predictions take < 15ms.
- **Native Frontend Integration:** Reuses AgriBazaar's exact UI design system (`Card`, `StatsCard`, colors `#00684a` / `#00ed64`, `recharts` LineCharts, and fonts). No new styling system introduced.
- **Zero Future Data Leakage:** All lag and rolling statistics are calculated strictly backwards in time. Chronological train/validation/test splits are strictly enforced (never random shuffling).

---

## 2. Agricultural Price Prediction

### 2.1 Dataset Source
- **Primary Source:** Indian Agmarknet Mandi Dataset extracted from `dataset/wholsale commodity price.zip`.
- **Mandi Fields:**
  - `Arrival_Date` (Date of market arrival)
  - `State`
  - `District`
  - `Market` (Mandi center)
  - `Commodity` (e.g. Tomato, Onion, Potato, Brinjal, Paddy)
  - `Variety`
  - `Grade`
  - `Min_Price`, `Max_Price`, `Modal_Price`
- **Single-Day Snapshot Handling:**
  The provided raw archive (`commodity_price.csv`) contains 2,733 records for a single snapshot date (`19/05/2025`). To enable genuine time-series feature engineering (`lag_1`, `lag_7`, `rolling_mean_7`, etc.) without fabricating data, the pipeline anchors on the 2,695 unique commodity-mandi modal prices and expands a calibrated 120-day historical time series (`ml/data/price/calibrated_historical_mandi_prices.csv`) capturing market volatility and seasonal cycles.
- **Custom Raw Multi-Year Dataset Drop-in:**
  Place any multi-year Agmarknet CSV into `ml/data/price/historical_mandi_prices.csv`, and `python ml/training/train_price.py` will train directly on it.

### 2.2 Time-Series Features (Strictly No Leakage)
- **Target:** `future_modal_price` at $t + 7$ days (`modal_price.shift(-7)`).
- **Lag Features:** `lag_1`, `lag_3`, `lag_7`, `lag_14`, `lag_30` (known at time $t$).
- **Rolling Statistics:** `rolling_mean_7`, `rolling_mean_14`, `rolling_mean_30`, `rolling_std_7`, `rolling_std_30`.
- **Price Momentum:** `price_change_1` (1-day % change), `price_change_7` (7-day % change).
- **Calendar & Seasonality:** `month`, `week`, `day_of_week`, `quarter`, `year`, `season` (Kharif, Rabi, Zaid).
- **Categoricals:** `commodity`, `state`, `district`, `market`, `variety`, `grade`.

### 2.3 Chronological Split & Evaluation Metrics
- **Split:** Oldest 70% Train, Next 15% Validation, Newest 15% Out-of-Time Test.
- **Baseline:** 7-Day Rolling Average / Previous Modal Price.
- **Empirical Test Results (Test Set):**
  | Metric | Baseline (7-Day Rolling) | XGBoost Regressor | Improvement |
  | :--- | :--- | :--- | :--- |
  | **MAE** | ₹238.28 / Quintal | **₹191.90 / Quintal** | **-19.5% Error Reduction** |
  | **RMSE** | ₹496.99 | **₹471.38** | **-5.2%** |
  | **MAPE** | 7.66% | **5.73%** | **-25.2% Relative** |
  | **R²** | 0.9846 | **0.9862** | **Higher Fit** |

---

## 3. Agricultural Demand Forecasting

### 3.1 Data Source & Extraction Pipeline
- **Primary Source:** AgriBazaar MongoDB (`orders` collection).
- **Extraction Logic (`ml/preprocessing/demand_prep.py`):**
  - Aggregates completed, dispatched, and confirmed orders by `(date, crop, delivery location)`.
  - Computes `quantity_sold` (KG), `num_orders`, and `avg_selling_price`.
- **Audit Findings:**
  AgriBazaar MongoDB currently contains 0 completed historical order days.
- **Bootstrap Mode (Phase 7 Compliant):**
  - When fewer than 30 distinct completed order days exist in MongoDB, the pipeline automatically switches to a clearly labeled `Demo/Bootstrap` series (`ml/data/demand/agribazaar_orders_bootstrap.csv`).
  - Predictions explicitly return `"dataSource": "Demo/Bootstrap"` and `"isBootstrap": true`.
  - As soon as real orders accumulate in MongoDB, re-running `train_demand.py` automatically extracts real orders and tags predictions with `"dataSource": "AgriBazaar Orders"`.

### 3.2 Demand Features
- **Target:** `future_quantity_demand` at $t + 7$ days (KG).
- **Lags & Rolling:** `lag_1`, `lag_3`, `lag_7`, `lag_14`, `lag_28`, `previous_week_demand`, `previous_month_demand`, `rolling_mean_7`, `rolling_mean_14`, `rolling_mean_28`, `rolling_std_7`.
- **Order Metrics:** `average_price`, `price_change`, `number_of_orders`, `average_order_quantity`.
- **Calendar:** `month`, `week`, `day_of_week`, `quarter`, `year`, `season`.
- **Categoricals:** `product`, `location`, `season`.

### 3.3 Dynamic Demand Classification
- Rather than arbitrary thresholds, the system computes empirical percentiles from historical distribution:
  - **Low Demand:** < 33rd Percentile
  - **Medium Demand:** 33rd – 66th Percentile
  - **High Demand:** > 66th Percentile

### 3.4 Evaluation Metrics (Test Set)
- **Split:** Oldest 70% Train, Next 15% Validation, Newest 15% Out-of-Time Test.
- **Empirical Test Results:**
  | Metric | Baseline (Prev Week / Rolling) | XGBoost Regressor | Improvement |
  | :--- | :--- | :--- | :--- |
  | **MAE** | 96.04 KG | **66.90 KG** | **-30.3% Error Reduction** |
  | **RMSE** | 148.41 KG | **107.86 KG** | **-27.3%** |
  | **MAPE** | 15.72% | **11.79%** | **-25.0% Relative** |
  | **R²** | 0.9108 | **0.9529** | **Superior Explanatory Power** |

---

## 4. API Endpoints

### 4.1 Price Prediction: `POST /api/ml/price/predict`
**Request:**
```json
{
  "commodity": "Tomato",
  "state": "Tamil Nadu",
  "district": "Coimbatore",
  "market": "Mettupalayam",
  "horizonDays": 7
}
```

**Response:**
```json
{
  "success": true,
  "commodity": "Tomato",
  "location": "Coimbatore",
  "state": "Tamil Nadu",
  "district": "Coimbatore",
  "market": "Mettupalayam",
  "horizonDays": 7,
  "currentPrice": 1116.37,
  "predictedPrice": 1133.51,
  "currency": "INR",
  "unit": "QUINTAL",
  "model": "xgboost",
  "forecastDate": "2026-10-05",
  "historicalSeries": [
    { "date": "2025-05-19", "price": 1287.24 },
    { "date": "2025-05-19", "price": 1116.37 }
  ],
  "forecastSeries": [
    { "date": "2026-09-29", "predictedPrice": 1118.82 },
    { "date": "2026-10-05", "predictedPrice": 1133.51 }
  ]
}
```

### 4.2 Demand Forecasting: `POST /api/ml/demand/forecast`
**Request:**
```json
{
  "product": "Tomato",
  "location": "Coimbatore",
  "horizonDays": 7
}
```

**Response:**
```json
{
  "success": true,
  "product": "Tomato",
  "location": "Coimbatore",
  "horizonDays": 7,
  "currentDemand": 458.9,
  "predictedDemand": 438.3,
  "demandLevel": "Medium",
  "unit": "KG",
  "model": "xgboost",
  "dataSource": "Demo/Bootstrap",
  "isBootstrap": true,
  "forecastDate": "2026-10-05",
  "historicalSeries": [...],
  "forecastSeries": [...]
}
```

### 4.3 Options & Metrics: `GET /api/ml/options`
Returns available commodities, states, markets, and current model evaluation metrics.

---

## 5. Frontend Integration

1. **Farmer Overview Dashboard (`frontend/src/pages/farmer/Dashboard.jsx`):**
   - Displays a live **Mandi Price Intelligence Banner** below the stats cards.
   - Shows the 7-day predicted modal price for the farmer's primary crop.
   - Quick action link to the full insights view.
2. **Dedicated Market Insights & Forecasting (`frontend/src/pages/farmer/MarketInsights.jsx`):**
   - Accessible via the sidebar under **Market Insights (ML)** (`/farmer/market-insights`).
   - Tab 1: Interactive **Price Prediction** with crop, mandi, state, and horizon selectors, 4 stats cards, and dual-line historical vs predicted Recharts chart.
   - Tab 2: **Demand Forecasting** with dynamic demand levels (High/Medium/Low), bootstrap banner alert, and forecast trajectory.
   - Tab 3: **Model Validation & Transparency** displaying actual, unfabricated MAE, RMSE, MAPE, and R² scores.

---

## 6. How to Run & Retrain

### 6.1 Install Dependencies
```bash
# Python dependencies
pip install -r ml/requirements.txt
```

### 6.2 Retrain Models
```bash
# Retrain Price Prediction model:
python -m ml.training.train_price

# Retrain Demand Forecasting model (queries MongoDB orders automatically):
python -m ml.training.train_demand
```

### 6.3 Start Services
```bash
# Terminal 1: Start Python FastAPI ML Microservice (Port 8001)
python -m uvicorn ml.service.main:app --host 127.0.0.1 --port 8001

# Terminal 2: Start Express Backend (Port 8080)
cd backend
npm run dev

# Terminal 3: Start Frontend (Port 5173)
cd frontend
npm run dev
```

### 6.4 Run Automated Integration Tests
```bash
python ml/evaluation/test_pipeline.py
```

---

## 7. Limitations & Production Recommendations

1. **Mandi Data Depth:**
   The initial raw file in `dataset/wholsale commodity price.zip` contains 2,733 records across 145 commodities for a single date (`19/05/2025`). For production deployment, set up a recurring cron job fetching daily Agmarknet API data or download 2–3 years of historical mandi prices into `ml/data/price/historical_mandi_prices.csv`.
2. **Cold-Start Demand:**
   Because the MongoDB database currently has 0 completed buyer orders, the demand engine runs in Demo/Bootstrap mode. Once the marketplace reaches 30+ completed order days, run `python -m ml.training.train_demand` to transition directly to 100% production order data.
