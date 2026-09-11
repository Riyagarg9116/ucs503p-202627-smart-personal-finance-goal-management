import pandas as pd

INPUT_FILE = "data/processed/clean_transactions.csv"


def load_data(file_path):

    df = pd.read_csv(
        file_path,
        parse_dates=["date"]
    )

    return df

def calculate_total_income(df):

    total_income = df["income"].sum()

    return round(total_income, 2)

def calculate_total_expenses(df):

    total_expenses = df["expense"].sum()

    return round(total_expenses, 2)

def calculate_total_savings(df):

    total_income = calculate_total_income(df)
    total_expenses = calculate_total_expenses(df)

    savings = total_income - total_expenses

    return round(savings, 2)

def monthly_summary(df):

    summary = (
        df.groupby("month")
        .agg(
            income=("income", "sum"),
            expenses=("expense", "sum")
        )
        .reset_index()
    )

    summary["savings"] = (
        summary["income"]
        - summary["expenses"]
    )

    summary["savings_rate"] = (
        summary["savings"]
        / summary["income"]
        * 100
    )

    summary["savings_rate"] = (
        summary["savings_rate"]
        .round(2)
    )

    return summary

def category_spending(df):

    expenses = df[
        df["type"] == "expense"
    ]

    category_summary = (
        expenses
        .groupby("category")["amount"]
        .sum()
        .sort_values(
            ascending=False
        )
    )

    return category_summary.round(2)


def average_expense(df):

    expenses = df[
        df["type"] == "expense"
    ]

    average = expenses["amount"].mean()

    return round(average, 2)

def highest_spending_category(df):

    category_summary = category_spending(df)

    if len(category_summary) == 0:
        return None

    return category_summary.index[0]

def weekend_vs_weekday(df):

    expenses = df[
        df["type"] == "expense"
    ]

    weekend_spending = expenses[
        expenses["is_weekend"] == True
    ]["amount"].sum()

    weekday_spending = expenses[
        expenses["is_weekend"] == False
    ]["amount"].sum()

    return {
        "weekend_spending":
            round(weekend_spending, 2),

        "weekday_spending":
            round(weekday_spending, 2)
    }


def main():


    print(
        "SMART FINANCE - FINANCIAL ANALYSIS"
    )


    df = load_data(INPUT_FILE)

    total_income = calculate_total_income(df)
    total_expenses = calculate_total_expenses(df)
    total_savings = calculate_total_savings(df)

    print(
        "\n--- OVERALL FINANCIAL SUMMARY ---"
    )

    print(
        f"Total Income   : ₹{total_income:,.2f}"
    )

    print(
        f"Total Expenses : ₹{total_expenses:,.2f}"
    )

    print(
        f"Total Savings  : ₹{total_savings:,.2f}"
    )

    print(
        "\n MONTHLY SUMMARY "
    )

    print(
        monthly_summary(df).to_string(
            index=False
        )
    )

    
    print(
        "\n CATEGORY-WISE SPENDING "
    )

    print(
        category_spending(df)
    )

    print(
        " AVERAGE EXPENSE "
    )

    print(
        f"₹{average_expense(df):,.2f}"
    )

    print(
        "\n HIGHEST SPENDING CATEGORY "
    )

    print(
        highest_spending_category(df)
    )

    print(
        "\n--- WEEKEND VS WEEKDAY ---"
    )

    result = weekend_vs_weekday(df)

    print(
        f"Weekend : ₹{result['weekend_spending']:,.2f}"
    )

    print(
        f"Weekday : ₹{result['weekday_spending']:,.2f}"
    )


if __name__ == "__main__":
    main()
