import pandas as pd

INPUT_FILE = "data/processed/clean_transactions.csv"


def load_data(file_path):
    df = pd.read_csv(file_path, parse_dates=["date"])
    return df


def get_average_monthly_finances(df):

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

    return {
        "average_income": monthly["income"].mean(),
        "average_expenses": monthly["expenses"].mean(),
        "average_savings": monthly["savings"].mean()
    }


def calculate_scenario(
    average_income,
    average_expenses,
    months=12,
    extra_saving=0,
    expense_change=0
):

    adjusted_expenses = (
        average_expenses * (1 + expense_change)
    )

    monthly_savings = (
        average_income
        - adjusted_expenses
        + extra_saving
    )

    future_savings = monthly_savings * months

    return {
        "monthly_income": round(average_income, 2),
        "monthly_expenses": round(adjusted_expenses, 2),
        "monthly_savings": round(monthly_savings, 2),
        "future_savings": round(future_savings, 2)
    }


def main():

    
    print("SMART FINANCE - SCENARIO ANALYSIS")
    

    df = load_data(INPUT_FILE)

    finances = get_average_monthly_finances(df)

    income = finances["average_income"]
    expenses = finances["average_expenses"]

    print("\nAverage Monthly Finances")
    print(f"Income   : ₹{income:,.2f}")
    print(f"Expenses : ₹{expenses:,.2f}")

    current = calculate_scenario(
        income,
        expenses,
        months=12
    )

    extra_saving = calculate_scenario(
        income,
        expenses,
        months=12,
        extra_saving=5000
    )

    higher_expenses = calculate_scenario(
        income,
        expenses,
        months=12,
        expense_change=0.10
    )

    print("\n--- SCENARIO COMPARISON ---")

    print("\nScenario 1: Current Behaviour")
    print(
        f"Monthly Savings : "
        f"₹{current['monthly_savings']:,.2f}"
    )
    print(
        f"12-Month Savings: "
        f"₹{current['future_savings']:,.2f}"
    )

    print("\nScenario 2: Save ₹5,000 Extra")
    print(
        f"Monthly Savings : "
        f"₹{extra_saving['monthly_savings']:,.2f}"
    )
    print(
        f"12-Month Savings: "
        f"₹{extra_saving['future_savings']:,.2f}"
    )

    print("\nScenario 3: Expenses Increase by 10%")
    print(
        f"Monthly Savings : "
        f"₹{higher_expenses['monthly_savings']:,.2f}"
    )
    print(
        f"12-Month Savings: "
        f"₹{higher_expenses['future_savings']:,.2f}"
    )


if __name__ == "__main__":
    main()
