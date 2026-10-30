from typing import Any
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException
from pathlib import Path
import sys

# Allow imports from the ML project folder
ML_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(ML_DIR))

app = FastAPI(
    title="Smart Personal Finance ML API",
    description="ML insights for the Smart Personal Finance project",
    version="1.0.0"
)
class TransactionInput(BaseModel):
    transaction_id: str
    date: str
    amount: float
    type: str
    category: str
    merchant: str = "Unknown"


class InsightsRequest(BaseModel):
    transactions: list[TransactionInput]


@app.get("/")
def home():
    return {
        "message": "Smart Personal Finance ML API is running!",
        "status": "success"
    }


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.get("/insights")
def get_insights():
    try:
        from preprocessing.preprocess import (
            load_data as load_raw_data,
            clean_data,
            create_features
        )
        from analytics.financial_analysis import (
            calculate_total_income,
            calculate_total_expenses,
            calculate_total_savings
        )
        from anomaly.anomaly_detection import detect_anomalies
        from forecasting.forecasting import (
            prepare_monthly_data,
            forecast_expenses
        )
        from simulation.monte_carlo import (
            get_monthly_financial_data,
            monte_carlo_simulation
        )
        from recommendations.recommendation import (
            generate_recommendations
        )

        data_file = ML_DIR / "data" / "raw" / "transactions.csv"

        if not data_file.exists():
            raise HTTPException(
                status_code=404,
                detail=f"Transaction dataset not found: {data_file}"
            )

        df = load_raw_data(str(data_file))
        df = clean_data(df)
        df = create_features(df)

        income = float(calculate_total_income(df))
        expenses = float(calculate_total_expenses(df))
        savings = float(calculate_total_savings(df))

        anomaly_result = detect_anomalies(df)
        anomalies = anomaly_result[
            anomaly_result["is_anomaly"] == True
        ]

        monthly_data = prepare_monthly_data(df)
        _, forecast = forecast_expenses(
            monthly_data,
            future_months=3
        )

        monthly_finances = get_monthly_financial_data(df)
        simulation = monte_carlo_simulation(
            monthly_finances,
            goal_amount=200000,
            current_savings=50000,
            months=12,
            simulations=1000
        )

        recommendations = generate_recommendations(df)

        return {
            "status": "success",
            "financial_summary": {
                "total_income": income,
                "total_expenses": expenses,
                "total_savings": savings
            },
            "anomaly_detection": {
                "total_anomalies": int(len(anomalies)),
                "unusual_transactions": (
                    anomalies[
                        ["date", "amount", "category", "merchant"]
                    ]
                    .sort_values("amount", ascending=False)
                    .head(10)
                    .assign(
                        date=lambda x: x["date"].astype(str)
                    )
                    .to_dict(orient="records")
                )
            },
            "expense_forecast": forecast.to_dict(orient="records"),
            "goal_simulation": {
                "goal_amount": float(simulation["goal_amount"]),
                "achievement_probability": float(
                    simulation["probability_of_achieving_goal"]
                )
            },
            "recommendations": [
                str(item) for item in recommendations
            ]
        }

    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"ML pipeline error: {str(exc)}"
        ) from exc

    
@app.post("/insights")
def get_insights_from_transactions(request: InsightsRequest):
    try:
        import pandas as pd

        from analytics.financial_analysis import (
            calculate_total_income,
            calculate_total_expenses,
            calculate_total_savings
        )
        from anomaly.anomaly_detection import detect_anomalies
        from forecasting.forecasting import (
            prepare_monthly_data,
            forecast_expenses
        )
        from simulation.monte_carlo import (
            get_monthly_financial_data,
            monte_carlo_simulation
        )
        from recommendations.recommendation import (
            generate_recommendations
        )

        if not request.transactions:
            raise HTTPException(
                status_code=400,
                detail="At least one transaction is required."
            )

        df = pd.DataFrame([
            {
                "transaction_id": tx.transaction_id,
                "date": tx.date,
                "amount": tx.amount,
                "type": tx.type.strip().lower(),
                "category": tx.category.strip().title(),
                "merchant": tx.merchant.strip().title()
            }
            for tx in request.transactions
        ])

        df["date"] = pd.to_datetime(df["date"], errors="coerce")
        df["amount"] = pd.to_numeric(df["amount"], errors="coerce")
        df = df.dropna(subset=["date", "amount", "type", "category"])
        df = df[df["amount"] > 0]
        df = df[df["type"].isin(["income", "expense"])]

        if df.empty:
            raise HTTPException(
                status_code=400,
                detail="No valid income or expense transactions were provided."
            )

        from preprocessing.preprocess import create_features
        df = create_features(df)

        income = float(calculate_total_income(df))
        expenses = float(calculate_total_expenses(df))
        savings = float(calculate_total_savings(df))

        # Anomaly detection needs enough expense data to be meaningful.
        expense_df = df[df["type"] == "expense"]
        if len(expense_df) >= 5:
            anomaly_result = detect_anomalies(df)
            anomalies = anomaly_result[
                anomaly_result["is_anomaly"] == True
            ]
            unusual_transactions = (
                anomalies[["date", "amount", "category", "merchant"]]
                .sort_values("amount", ascending=False)
                .head(10)
                .assign(date=lambda x: x["date"].astype(str))
                .to_dict(orient="records")
            )
        else:
            unusual_transactions = []

        # Forecasting needs enough historical data to be useful.
        if df["date"].dt.to_period("M").nunique() >= 2:
            monthly_data = prepare_monthly_data(df)
            _, forecast = forecast_expenses(
                monthly_data,
                future_months=3
            )
            expense_forecast = forecast.to_dict(orient="records")
        else:
            expense_forecast = []

        monthly_finances = get_monthly_financial_data(df)
        simulation = monte_carlo_simulation(
            monthly_finances,
            goal_amount=200000,
            current_savings=max(savings, 0),
            months=12,
            simulations=1000
        )

        recommendations = generate_recommendations(df)

        return {
            "status": "success",
            "financial_summary": {
                "total_income": income,
                "total_expenses": expenses,
                "total_savings": savings
            },
            "anomaly_detection": {
                "total_anomalies": len(unusual_transactions),
                "unusual_transactions": unusual_transactions
            },
            "expense_forecast": expense_forecast,
            "goal_simulation": {
                "goal_amount": float(simulation["goal_amount"]),
                "achievement_probability": float(
                    simulation["probability_of_achieving_goal"]
                )
            },
            "recommendations": [str(item) for item in recommendations]
        }

    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"ML pipeline error: {str(exc)}"
        ) from exc

