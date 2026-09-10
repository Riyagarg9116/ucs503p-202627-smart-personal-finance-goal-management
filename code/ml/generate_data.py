import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import os


#  Reproducibility


np.random.seed(42)


#  Dataset configuration


NUM_TRANSACTIONS = 5000
USER_ID = 1

START_DATE = datetime(2025, 1, 1)
END_DATE = datetime(2026, 8, 31)



#  Categories


expense_categories = [
    "Food",
    "Transport",
    "Shopping",
    "Bills",
    "Entertainment",
    "Healthcare",
    "Education",
    "Rent"
]

merchants = {
    "Food": [
        "Zomato",
        "Swiggy",
        "Cafe",
        "Restaurant"
    ],

    "Transport": [
        "Uber",
        "Ola",
        "Metro",
        "Fuel Station"
    ],

    "Shopping": [
        "Amazon",
        "Flipkart",
        "Myntra",
        "Mall"
    ],

    "Bills": [
        "Electricity",
        "Internet",
        "Mobile",
        "Water"
    ],

    "Entertainment": [
        "Netflix",
        "Spotify",
        "Movie",
        "Gaming"
    ],

    "Healthcare": [
        "Pharmacy",
        "Hospital",
        "Doctor"
    ],

    "Education": [
        "Udemy",
        "Online Course",
        "Books",
        "Training"
    ],

    "Rent": [
        "Landlord"
    ]
}



# 4. Generate transactions


transactions = []

date_range = (
    END_DATE - START_DATE
).days


for transaction_id in range(
    1,
    NUM_TRANSACTIONS + 1
):

    random_days = np.random.randint(
        0,
        date_range + 1
    )

    date = START_DATE + timedelta(
        days=int(random_days)
    )

    # Generate salary transactions
    

    if (
        date.day <= 3
        and np.random.random() < 0.18
    ):

        category = "Salary"

        merchant = "Company"

        transaction_type = "income"

        amount = np.random.normal(
            50000,
            3000
        )

    # Generate expense transactions
   

    else:

        category = np.random.choice(
            expense_categories,
            p=[
                0.25, 
                0.15,  
                0.15,  
                0.15,  
                0.10,  
                0.05,  
                0.05,  
                0.10   
            ]
        )

        merchant = np.random.choice(
            merchants[category]
        )

        transaction_type = "expense"

        # --------------------------------
        # Category-specific spending ranges
        # --------------------------------

        amount_ranges = {

            "Food": (150, 1500),

            "Transport": (50, 1000),

            "Shopping": (500, 10000),

            "Bills": (500, 8000),

            "Entertainment": (200, 3000),

            "Healthcare": (500, 8000),

            "Education": (500, 10000),

            "Rent": (12000, 20000)
        }

        low, high = amount_ranges[
            category
        ]

        amount = np.random.uniform(
            low,
            high
        )

    # Store transaction
   

    transactions.append({

        "transaction_id":
            transaction_id,

        "user_id":
            USER_ID,

        "date":
            date.strftime("%Y-%m-%d"),

        "amount":
            round(abs(amount), 2),

        "type":
            transaction_type,

        "category":
            category,

        "merchant":
            merchant,

        "payment_method":
            np.random.choice([
                "UPI",
                "Card",
                "Cash",
                "Bank Transfer"
            ])
    })



#  Convert to DataFrame


df = pd.DataFrame(
    transactions
)


#  Sort by date

df = df.sort_values(
    "date"
).reset_index(
    drop=True
)


#  Create output directory

output_directory = "data/raw"

os.makedirs(
    output_directory,
    exist_ok=True
)

#  Save CSV

output_file = (
    f"{output_directory}/transactions.csv"
)

df.to_csv(
    output_file,
    index=False
)

#  Display information

print(
    "Transaction dataset generated!"
)

print(
    f"Total transactions: {len(df)}"
)

print(
    f"Date range: "
    f"{df['date'].min()} "
    f"to "
    f"{df['date'].max()}"
)

print(
    "\nTransaction types:"
)

print(
    df["type"].value_counts()
)

print(
    "\nCategories:"
)

print(
    df["category"].value_counts()
)

print(
    "\nFirst 10 transactions:"
)

print(
    df.head(10)
)
