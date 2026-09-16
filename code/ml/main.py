from preprocessing.preprocess import (
    load_data as load_raw_data,
    clean_data,
    create_features
)

from analytics.financial_analysis import (
    calculate_total_income,
    calculate_total_expenses,
    calculate_total_savings,
    monthly_summary,
    category_spending
)

from behaviour.behaviour_analysis import (
    monthly_spending_trend,
    increasing_categories,
    recurring_transactions,
    weekend_behaviour
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


INPUT_FILE = "data/raw/transactions.csv"


def main():

    print("==========================================")
    print(" SMART PERSONAL FINANCE & GOAL MANAGEMENT ")
    print("==========================================")



    print("\n[1] Loading transaction data...")

    df = load_raw_data(INPUT_FILE)

    df = clean_data(df)
    df = create_features(df)

    print("Preprocessing completed.")

 

    print("\n[2] Financial Analysis")

    total_income = calculate_total_income(df)
    total_expenses = calculate_total_expenses(df)
    total_savings = calculate_total_savings(df)

    print(f"Total Income   : ₹{total_income:,.2f}")
    print(f"Total Expenses : ₹{total_expenses:,.2f}")
    print(f"Total Savings  : ₹{total_savings:,.2f}")

    print("\nCategory-wise Spending:")
    print(category_spending(df))



    print("\n[3] Behaviour Analysis")

    print("\nMonthly Spending:")
    print(
        monthly_spending_trend(df)
        .tail(6)
        .to_string(index=False)
    )

    print("\nIncreasing Categories:")

    increasing = increasing_categories(df)

    if len(increasing) > 0:
        print(increasing.to_string(index=False))
    else:
        print("No increasing categories detected.")

    print("\nRecurring Transactions:")

    recurring = recurring_transactions(df)

    if len(recurring) > 0:
        print(
            recurring.head(5)
            .to_string(index=False)
        )
    else:
        print("No recurring transactions detected.")


    print("\n[4] Anomaly Detection")

    anomaly_result = detect_anomalies(df)

    anomalies = anomaly_result[
        anomaly_result["is_anomaly"] == True
    ]

    print("Anomalies detected:", len(anomalies))

    if len(anomalies) > 0:

        print("\nTop unusual transactions:")

        print(
            anomalies[
                ["date", "amount", "category", "merchant"]
            ]
            .sort_values(
                "amount",
                ascending=False
            )
            .head(5)
            .to_string(index=False)
        )



    print("\n[5] Expense Forecasting")

    monthly_data = prepare_monthly_data(df)

    model, forecast = forecast_expenses(
        monthly_data,
        future_months=3
    )

    print("\nNext 3 Months Forecast:")

    print(
        forecast.to_string(index=False)
    )


    print("\n[6] Monte Carlo Simulation")

    monthly_finances = get_monthly_financial_data(df)

    simulation_result = monte_carlo_simulation(
        monthly_finances,
        goal_amount=200000,
        current_savings=50000,
        months=12,
        simulations=1000
    )

    print(
        "Goal Amount: "
        f"₹{simulation_result['goal_amount']:,.2f}"
    )

    print(
        "Goal Achievement Probability: "
        f"{simulation_result['probability_of_achieving_goal']}%"
    )

   

    print("\n[7] Smart Recommendations")

    recommendations = generate_recommendations(df)

    if len(recommendations) > 0:

        for number, recommendation in enumerate(
            recommendations,
            start=1
        ):
            print(
                f"{number}. {recommendation}"
            )

    else:
        print("No recommendations at this time.")

    print(" ML PIPELINE COMPLETED SUCCESSFULLY")
   


if __name__ == "__main__":
    main()
