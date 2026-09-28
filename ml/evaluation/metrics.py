import numpy as np
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score


def compute_mape(y_true, y_pred, epsilon=1e-8):
    """
    Computes Mean Absolute Percentage Error (MAPE) safely avoiding division by zero.
    """
    y_true = np.asarray(y_true, dtype=float)
    y_pred = np.asarray(y_pred, dtype=float)
    mask = np.abs(y_true) > epsilon
    if not np.any(mask):
        return 0.0
    return float(np.mean(np.abs((y_true[mask] - y_pred[mask]) / y_true[mask])) * 100.0)


def evaluate_forecast(y_true, y_pred):
    """
    Computes MAE, RMSE, MAPE, and R² for predictions against true values.
    Returns a dictionary of float values rounded to 4 decimal places.
    """
    y_true = np.asarray(y_true, dtype=float)
    y_pred = np.asarray(y_pred, dtype=float)

    mae = float(mean_absolute_error(y_true, y_pred))
    rmse = float(np.sqrt(mean_squared_error(y_true, y_pred)))
    mape = compute_mape(y_true, y_pred)
    r2 = float(r2_score(y_true, y_pred))

    return {
        "mae": round(mae, 4),
        "rmse": round(rmse, 4),
        "mape": round(mape, 4),
        "r2": round(r2, 4),
    }
