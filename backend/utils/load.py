import os
import json
from fastapi import HTTPException

# Function to load all stored predictions from the JSON file
def load_predictions_from_json(file):
    try:
        if os.path.exists(file):
            with open(file, "r") as f:
                return json.load(f)
        else:
            return []
    except FileNotFoundError:  # Handle case where file not found
        raise HTTPException(status_code=404, detail="Prediction file not found.")
    except json.JSONDecodeError:  # Handle case where JSON is corrupted
        raise HTTPException(status_code=500, detail="Error decoding JSON data.")
    except Exception as e:
        # General error handling
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")