import pandas as pd
from sklearn.ensemble import IsolationForest

INPUT_FILE = "data/processed/clean_transactions.csv"


def load_data(file_path):
    df = pd.read_csv(file_path, parse_dates=["date"])
    return df


def detect_anomalies(df):
    expenses = df[df["type"] == "expense"].copy()

   
    features = expenses[["amount"]]

    model = IsolationForest(
        contamination=0.02,
        random_state=42
    )

    model.fit(features)

    expenses["anomaly"] = model.predict(features)

    # -1 = anomaly, 1 = normal
    expenses["is_anomaly"] = expenses["anomaly"] == -1

    return expenses


def main():

  
    print("SMART FINANCE - ANOMALY DETECTION")

    df = load_data(INPUT_FILE)

    result = detect_anomalies(df)

    anomalies = result[result["is_anomaly"] == True]

    print("\nTotal expense transactions:", len(result))
    print("Anomalies detected:", len(anomalies))

    print("\n--- UNUSUAL TRANSACTIONS ---")

    if len(anomalies) > 0:

        columns = [
            "date",
            "amount",
            "category",
            "merchant"
        ]

        print(
            anomalies[columns]
            .sort_values("amount", ascending=False)
            .head(10)
            .to_string(index=False)
        )

    else:
        print("No unusual transactions detected.")


if __name__ == "__main__":
    main()
