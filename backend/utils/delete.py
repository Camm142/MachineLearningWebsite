import os
import json
from fastapi import HTTPException
# Function to delete a prediction by ID from the JSON file and reassign IDs
def delete_prediction_from_json(file, prediction_id: int):
    try:
        if os.path.exists(file):
            with open(file, "r") as f:
                data = json.load(f)
            # Check if the prediction exists
            updated_data = [entry for entry in data if entry["id"] != prediction_id]

            if len(updated_data) == len(data):
                raise HTTPException(status_code=404, detail="Prediction not found")
            # Reassign the IDs to maintain sequential order
            for i, entry in enumerate(updated_data, start=1):
                entry["id"] = i

            # Write the updated data back to the JSON file
            with open(file, "w") as f:
                json.dump(updated_data, f, indent=4)
        else:
            raise HTTPException(status_code=404, detail="Prediction file not found.")
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Prediction file not found.")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Error decoding JSON data.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred while deleting the prediction: {str(e)}")