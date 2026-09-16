import pandas as pd

INPUT_FILE = "data/processed/clean_transactions.csv"


def load_data(file_path):
    df = pd.read_csv(file_path, parse_dates=["date"])
    return df


def generate_recommendations(df):

    recommendations = []

    expenses = df[df["type"] == "expense"]

    total_income = df["income"].sum()
    total_expenses = df["expense"].sum()

    if total_income > 0:

        savings = total_income - total_expenses

        savings_rate = (
            savings / total_income
        ) * 100

        if savings_rate < 20:
            recommendations.append(
                "Your savings rate is below 20%. "
                "Consider reducing discretionary expenses."
            )

        elif savings_rate >= 30:
            recommendations.append(
                "Your savings rate is healthy. "
                "Continue maintaining your current saving pattern."
            )

    category_spending = (
        expenses.groupby("category")["amount"]
        .sum()
        .sort_values(ascending=False)
    )

    if len(category_spending) > 0:

        highest_category = category_spending.index[0]
        highest_amount = category_spending.iloc[0]

        recommendations.append(
            f"{highest_category} is your highest spending "
            f"category with total spending of "
            f"₹{highest_amount:,.2f}. "
            f"Consider reviewing expenses in this category."
        )

    weekend_spending = expenses[
        expenses["is_weekend"] == True
    ]["amount"].sum()

    weekday_spending = expenses[
        expenses["is_weekend"] == False
    ]["amount"].sum()

    if weekend_spending > weekday_spending:
        recommendations.append(
            "Your weekend spending is higher than "
            "your weekday spending. Consider monitoring "
            "discretionary weekend expenses."
        )

    return recommendations


def main():

   
    print("SMART FINANCE - RECOMMENDATIONS")
    

    df = load_data(INPUT_FILE)

    recommendations = generate_recommendations(df)

    print("\n--- SMART RECOMMENDATIONS ---")

    if len(recommendations) == 0:

        print("No specific recommendations at this time.")

    else:

        for number, recommendation in enumerate(
            recommendations,
            start=1
        ):
            print(f"{number}. {recommendation}")


if __name__ == "__main__":
    main()
