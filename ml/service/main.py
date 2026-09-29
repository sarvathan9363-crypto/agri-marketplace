import os
import sys
from pathlib import Path
from contextlib import asynccontextmanager
from typing import Optional
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator

# Ensure project root is in sys.path and set as current working directory
# so ml.* packages and model artifacts resolve regardless of how the script is launched
BASE_DIR = Path(__file__).resolve().parent.parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))
os.chdir(BASE_DIR)

from ml.inference.predict_price import load_price_inference_artifacts, predict_price
from ml.inference.predict_demand import load_demand_inference_artifacts, predict_demand


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Pre-load models once at startup
    print("\n[ML Service] Initializing AgriBazaar ML models into memory...")
    try:
        load_price_inference_artifacts()
        print("[ML Service] Price XGBoost model & preprocessor loaded successfully.")
    except Exception as e:
        print(f"[ML Service] Warning: Price model could not be loaded: {e}")

    try:
        load_demand_inference_artifacts()
        print("[ML Service] Demand XGBoost model & preprocessor loaded successfully.")
    except Exception as e:
        print(f"[ML Service] Warning: Demand model could not be loaded: {e}")

    print("[ML Service] Ready to serve inference requests.\n")
    yield
    print("[ML Service] Shutting down...")


app = FastAPI(
    title="AgriBazaar ML Inference Service",
    description="Dedicated microservice for Agricultural Price Prediction and Demand Forecasting using XGBoost.",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request Schemas
class PricePredictionRequest(BaseModel):
    commodity: str = Field(..., min_length=1, max_length=100, description="Crop or commodity name")
    state: Optional[str] = Field(default="", max_length=100, description="Indian State")
    district: Optional[str] = Field(default="", max_length=100, description="District")
    market: Optional[str] = Field(default="", max_length=100, description="Mandi or market center")
    horizonDays: int = Field(default=7, ge=1, le=30, description="Forecast horizon in days (1-30)")

    @field_validator("commodity")
    @classmethod
    def check_commodity(cls, v: Optional[str]) -> str:
        if v is None:
            raise ValueError("Commodity is required and cannot be blank")
        v_str = str(v).strip()
        if not v_str:
            raise ValueError("Commodity cannot be blank")
        if v_str.lower() in ["nan", "null", "none", "infinity", "-infinity"]:
            raise ValueError("Value cannot be NaN, null, or Infinity")
        return v_str

    @field_validator("state", "district", "market")
    @classmethod
    def check_optional_location(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return ""
        v_str = str(v).strip()
        if v_str.lower() in ["nan", "null", "none", "infinity", "-infinity"]:
            raise ValueError("Value cannot be NaN, null, or Infinity")
        return v_str


class DemandForecastRequest(BaseModel):
    product: str = Field(..., min_length=1, max_length=100, description="Product or crop name")
    location: Optional[str] = Field(default="Coimbatore", max_length=100, description="City or district")
    horizonDays: int = Field(default=7, ge=1, le=30, description="Forecast horizon in days (1-30)")

    @field_validator("product")
    @classmethod
    def check_product(cls, v: Optional[str]) -> str:
        if v is None:
            raise ValueError("Product is required and cannot be blank")
        v_str = str(v).strip()
        if not v_str:
            raise ValueError("Product cannot be blank")
        if v_str.lower() in ["nan", "null", "none", "infinity", "-infinity"]:
            raise ValueError("Value cannot be NaN, null, or Infinity")
        return v_str

    @field_validator("location")
    @classmethod
    def check_location(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return "Coimbatore"
        v_str = str(v).strip()
        if v_str.lower() in ["nan", "null", "none", "infinity", "-infinity"]:
            raise ValueError("Value cannot be NaN, null, or Infinity")
        return v_str or "Coimbatore"


@app.get("/health")
def health():
    return {
        "status": "online",
        "service": "agribazaar-ml",
        "version": "1.0.0"
    }


@app.get("/meta/price")
def get_price_metadata():
    try:
        _, _, meta, _ = load_price_inference_artifacts()
        return {
            "success": True,
            "metadata": meta
        }
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=f"Price model metadata unavailable: {str(e)}")


@app.get("/meta/demand")
def get_demand_metadata():
    try:
        _, _, meta, _ = load_demand_inference_artifacts()
        return {
            "success": True,
            "metadata": meta
        }
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=f"Demand model metadata unavailable: {str(e)}")


@app.post("/predict/price")
def predict_price_endpoint(req: PricePredictionRequest):
    try:
        result = predict_price(
            commodity=req.commodity,
            state=req.state or "",
            district=req.district or "",
            market=req.market or "",
            horizon_days=req.horizonDays
        )
        return result
    except FileNotFoundError as fnf:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(fnf))
    except Exception as e:
        print(f"[ML Service] Error during price prediction: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Price prediction failed internally: {str(e)}")


@app.post("/forecast/demand")
def forecast_demand_endpoint(req: DemandForecastRequest):
    try:
        result = predict_demand(
            product=req.product,
            location=req.location or "Coimbatore",
            horizon_days=req.horizonDays
        )
        return result
    except FileNotFoundError as fnf:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(fnf))
    except Exception as e:
        print(f"[ML Service] Error during demand forecast: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Demand forecast failed internally: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("ML_PORT", 8001))
    uvicorn.run(app, host="127.0.0.1", port=port)
