import pandas as pd

INPUT_FILE = "data/processed/clean_transactions.csv"


def load_data(file_path):
    df = pd.read_csv(file_path, parse_dates=["date"])
    return df


def monthly_spending_trend(df):
    expenses = df[df["type"] == "expense"]

    monthly = (
        expenses.groupby("month")["amount"]
        .sum()
        .reset_index()
    )

    monthly = monthly.sort_values("month")

    return monthly


def increasing_categories(df):
    expenses = df[df["type"] == "expense"]

    monthly_category = (
        expenses.groupby(["month", "category"])["amount"]
        .sum()
        .reset_index()
    )

    results = []

    for category in monthly_category["category"].unique():

        category_data = monthly_category[
            monthly_category["category"] == category
        ].sort_values("month")

        if len(category_data) < 2:
            continue

        first_value = category_data.iloc[0]["amount"]
        last_value = category_data.iloc[-1]["amount"]

        if last_value > first_value:
            increase_percentage = (
                (last_value - first_value)
                / first_value
            ) * 100

            results.append({
                "category": category,
                "first_month_spending": round(first_value, 2),
                "last_month_spending": round(last_value, 2),
                "increase_percentage": round(
                    increase_percentage, 2
                )
            })

    return pd.DataFrame(results)


def recurring_transactions(df):
    expenses = df[df["type"] == "expense"]

    recurring = (
        expenses.groupby(["merchant", "category"])
        .agg(
            transaction_count=("transaction_id", "count"),
            total_amount=("amount", "sum"),
            average_amount=("amount", "mean")
        )
        .reset_index()
    )

    recurring = recurring[
        recurring["transaction_count"] >= 3
    ]

    recurring["total_amount"] = recurring[
        "total_amount"
    ].round(2)

    recurring["average_amount"] = recurring[
        "average_amount"
    ].round(2)

    return recurring.sort_values(
        "transaction_count",
        ascending=False
    )


def weekend_behaviour(df):
    expenses = df[df["type"] == "expense"]

    weekend = expenses[
        expenses["is_weekend"] == True
    ]

    weekday = expenses[
        expenses["is_weekend"] == False
    ]

    weekend_average = weekend["amount"].mean()
    weekday_average = weekday["amount"].mean()

    return {
        "weekend_average_expense": round(
            weekend_average, 2
        ),
        "weekday_average_expense": round(
            weekday_average, 2
        )
    }


def main():

    print("====================================")
    print("SMART FINANCE - BEHAVIOUR ANALYSIS")
    print("====================================")

    df = load_data(INPUT_FILE)

    print("\n--- MONTHLY SPENDING TREND ---")

    monthly = monthly_spending_trend(df)
    print(monthly.to_string(index=False))

    print("\n--- INCREASING SPENDING CATEGORIES ---")

    increasing = increasing_categories(df)

    if len(increasing) > 0:
        print(increasing.to_string(index=False))
    else:
        print("No increasing categories detected.")

    print("\n--- RECURRING TRANSACTIONS ---")

    recurring = recurring_transactions(df)

    if len(recurring) > 0:
        print(recurring.head(10).to_string(index=False))
    else:
        print("No recurring transactions detected.")

    print("\n--- WEEKEND VS WEEKDAY BEHAVIOUR ---")

    behaviour = weekend_behaviour(df)

    print(
        f"Average Weekend Expense : "
        f"₹{behaviour['weekend_average_expense']:,.2f}"
    )

    print(
        f"Average Weekday Expense : "
        f"₹{behaviour['weekday_average_expense']:,.2f}"
    )


if __name__ == "__main__":
    main()
