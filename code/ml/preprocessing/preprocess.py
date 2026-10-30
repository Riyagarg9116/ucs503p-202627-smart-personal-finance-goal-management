import pandas as pd
import os

INPUT_FILE = "data/raw/transactions.csv"
OUTPUT_FILE = "data/processed/clean_transactions.csv"


def load_data(file_path):

    df = pd.read_csv(file_path)

    print("Dataset loaded successfully.")
    print("Number of rows:", len(df))

    return df

def clean_data(df):

    df["date"] = pd.to_datetime(
        df["date"],
        errors="coerce"
    )
    df["amount"] = pd.to_numeric(
        df["amount"],
        errors="coerce"
    )
    df = df.dropna(
        subset=[
            "date",
            "amount",
            "type",
            "category"
        ]
    )

    df = df.drop_duplicates(
        subset=["transaction_id"]
    )

    df = df[df["amount"] > 0]

    df["type"] = (
        df["type"]
        .str.strip()
        .str.lower()
    )

    df["category"] = (
        df["category"]
        .str.strip()
        .str.title()
    )

    df["merchant"] = (
        df["merchant"]
        .str.strip()
        .str.title()
    )

    return df


def create_features(df):

    df["month"] = (
        df["date"]
        .dt.to_period("M")
        .astype(str)
    )

    df["year"] = df["date"].dt.year

    df["month_number"] = df["date"].dt.month

    df["day"] = df["date"].dt.day

    df["day_of_week"] = (
        df["date"].dt.dayofweek
    )

    df["is_weekend"] = (
        df["day_of_week"] >= 5
    )

 
    df["income"] = 0.0

    df.loc[
        df["type"] == "income",
        "income"
    ] = df["amount"]

    # Expense amount
    df["expense"] = 0.0

    df.loc[
        df["type"] == "expense",
        "expense"
    ] = df["amount"]

    return df




def save_data(df, output_file):


    os.makedirs(
        os.path.dirname(output_file),
        exist_ok=True
    )

    df.to_csv(
        output_file,
        index=False
    )

    print(
        "\nClean dataset saved to:"
    )

    print(output_file)

def main():
  
    print("FINANCIAL DATA PREPROCESSING")
    df = load_data(INPUT_FILE)
    df = clean_data(df)

    print(
        "Rows after cleaning:",
        len(df)
    )

    # Feature engineering
    df = create_features(df)

    # Save
    save_data(
        df,
        OUTPUT_FILE
    )

    print(
        "\nPreprocessing completed!"
    )

    print(
        "\nFinal columns:"
    )

    print(
        df.columns.tolist()
    )

    print(
        "\nFirst 5 rows:"
    )

    print(
        df.head()
    )

if __name__ == "__main__":
    main()
