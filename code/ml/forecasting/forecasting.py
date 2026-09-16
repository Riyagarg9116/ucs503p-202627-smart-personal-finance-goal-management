import pandas as pd
from sklearn.linear_model import LinearRegression

INPUT_FILE = "data/processed/clean_transactions.csv"


def load_data(file_path):
    df = pd.read_csv(file_path, parse_dates=["date"])
    return df


def prepare_monthly_data(df):
    expenses = df[df["type"] == "expense"].copy()

    monthly = (
        expenses.groupby("month")["amount"]
        .sum()
        .reset_index()
    )

    monthly = monthly.sort_values("month").reset_index(drop=True)

    monthly["month_number"] = range(1, len(monthly) + 1)

    return monthly


def forecast_expenses(monthly_data, future_months=3):

    X = monthly_data[["month_number"]]
    y = monthly_data["amount"]

    model = LinearRegression()
    model.fit(X, y)

    last_month = monthly_data["month_number"].max()

    future_numbers = list(
        range(
            last_month + 1,
            last_month + future_months + 1
        )
    )

    future_predictions = model.predict(
        pd.DataFrame(
            {"month_number": future_numbers}
        )
    )

    forecast = pd.DataFrame({
        "future_month_number": future_numbers,
        "predicted_expenses": future_predictions.round(2)
    })

    return model, forecast


def main():

   
    print("SMART FINANCE - EXPENSE FORECAST")
    

    df = load_data(INPUT_FILE)

    monthly_data = prepare_monthly_data(df)

    print("\n--- HISTORICAL MONTHLY EXPENSES ---")
    print(monthly_data.to_string(index=False))

    model, forecast = forecast_expenses(
        monthly_data,
        future_months=3
    )

    print(" FORECASTED EXPENSES ")
    print(forecast.to_string(index=False))


if __name__ == "__main__":
    main()
