# backend/import_scoring_from_csv.py

import os

import pandas as pd
from database import engine
from sqlalchemy import text
from sqlalchemy.orm import Session

CSV_PATH = os.path.join(
    os.path.dirname(__file__),
    "data",
    "output(PointScore).csv"
)

def import_scoring():
    if not os.path.exists(CSV_PATH):
        raise FileNotFoundError(f"CSV not found: {CSV_PATH}")

    # Load CSV
    df = pd.read_csv(CSV_PATH)

    # Ensure required columns exist
    required = ["PointScore", "Percentage"]
    for col in required:
        if col not in df.columns:
            raise ValueError(f"Missing column in CSV: {col}")

    with Session(engine) as session:

        for idx, row in df.iterrows():

            user_id = idx + 101  # assign each row a user_id
            point = float(row["PointScore"])
            percent = float(row["Percentage"])

            print(f"Inserting user_id={user_id}, score={point}, pct={percent}")

            session.execute(
                text("""
                    INSERT INTO scoring_table (user_id, point_score, percentage)
                    VALUES (:uid, :ps, :pct)
                    ON DUPLICATE KEY UPDATE
                        point_score = VALUES(point_score),
                        percentage = VALUES(percentage)
                """),
                {"uid": user_id, "ps": point, "pct": percent}
            )

        session.commit()

    print("✅ Scoring data import completed successfully!")


if __name__ == "__main__":
    import_scoring()
