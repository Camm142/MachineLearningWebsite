import os
import json
from fastapi import HTTPException

def save_prediction_to_json(file, input_data, predicted_price):
    if os.path.exists(file):
        try:
            with open(file, "r") as f:
                data = json.load(f)
        except json.JSONDecodeError:
            data = []  # Initialize as empty list if file is corrupted or empty
    else:
        data = []

    # Determine ID for each record
    if data:
        last_id = max([entry["id"] for entry in data])
        new_id = last_id + 1
    else:
        new_id = 1

    # Append new prediction data
    new_entry = {
        "id": new_id,
        "house_data": input_data,
        "predicted_price": round(predicted_price, 2)
    }
    data.append(new_entry)

    # Write the updated data back to the JSON file
    with open(file, "w") as f:
        json.dump(data, f, indent=4)