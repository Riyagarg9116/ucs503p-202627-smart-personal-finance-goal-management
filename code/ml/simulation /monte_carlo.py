import pandas as pd
import numpy as np

INPUT_FILE = "data/processed/clean_transactions.csv"


def load_data(file_path):
    df = pd.read_csv(file_path, parse_dates=["date"])
    return df


def get_monthly_financial_data(df):

    monthly = (
        df.groupby("month")
        .agg(
            income=("income", "sum"),
            expenses=("expense", "sum")
        )
        .reset_index()
    )

    monthly["savings"] = (
        monthly["income"] - monthly["expenses"]
    )

    return monthly


def monte_carlo_simulation(
    monthly_data,
    goal_amount=200000,
    current_savings=50000,
    months=12,
    simulations=1000
):

    historical_savings = monthly_data["savings"]

    mean_savings = historical_savings.mean()
    std_savings = historical_savings.std()

    results = []

    for _ in range(simulations):

        simulated_savings = np.random.normal(
            mean_savings,
            std_savings,
            months
        )

        future_savings = (
            current_savings +
            simulated_savings.sum()
        )

        results.append(future_savings)

    results = np.array(results)

    successful_simulations = (
        results >= goal_amount
    ).sum()

    probability = (
        successful_simulations /
        simulations
    ) * 100

    return {
        "goal_amount": goal_amount,
        "current_savings": current_savings,
        "average_future_savings": round(
            results.mean(), 2
        ),
        "minimum_future_savings": round(
            results.min(), 2
        ),
        "maximum_future_savings": round(
            results.max(), 2
        ),
        "probability_of_achieving_goal": round(
            probability, 2
        )
    }


def main():

    
    print("SMART FINANCE - MONTE CARLO SIMULATION")
    

    df = load_data(INPUT_FILE)

    monthly_data = get_monthly_financial_data(df)

    result = monte_carlo_simulation(
        monthly_data,
        goal_amount=200000,
        current_savings=50000,
        months=12,
        simulations=1000
    )

    print("\n--- SIMULATION RESULTS ---")

    print(
        f"Goal Amount              : "
        f"₹{result['goal_amount']:,.2f}"
    )

    print(
        f"Current Savings          : "
        f"₹{result['current_savings']:,.2f}"
    )

    print(
        f"Average Future Savings   : "
        f"₹{result['average_future_savings']:,.2f}"
    )

    print(
        f"Minimum Future Savings   : "
        f"₹{result['minimum_future_savings']:,.2f}"
    )

    print(
        f"Maximum Future Savings   : "
        f"₹{result['maximum_future_savings']:,.2f}"
    )

    print(
        f"Goal Achievement Chance  : "
        f"{result['probability_of_achieving_goal']}%"
    )


if __name__ == "__main__":
    main()
