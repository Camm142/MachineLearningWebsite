import sys
import json
import os
import numpy as np
import pandas as pd
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.cluster import KMeans
import uvicorn
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, validator

# Add the path to the models and utils directory
current_dir = os.path.dirname(__file__)
models_dir = os.path.join(current_dir, 'models')
utils_dir = os.path.join(current_dir, 'utils')
sys.path.append(models_dir)
sys.path.append(utils_dir)

# Import the prediction model
from prediction_model import PropertyPriceModel
from classification_model import predict_status
#import utils function
from load import load_predictions_from_json
from delete import delete_prediction_from_json
from save_predicted_price import save_prediction_to_json
from save_predicted_status import save_sale_prediction_to_json

# Initialize FastAPI app globally
app = FastAPI()

# CORS configuration to allow requests from http://localhost:5173
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Specify the frontend origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

# Define Pydantic model for input validation
class PropertyData(BaseModel):
    cbd_distance: float = None
    bedroom: int = None
    bathroom: int = None
    car_garage: int = None
    landsize: float = None
    building_area: float = None
    built_year: int = 2024
    suburb_name: str = 'Other'
    prop_type: str = 'u'

class HouseStatus(BaseModel):
    price: float
    cbd_distance: float
    bedroom: int
    bathroom: int
    car_garage: int
    landsize: float
    re_agency: str
    median_price: float
    median_rental: int

# Initialize the model
property_price_model = PropertyPriceModel()

#db files
PREDICTION_FILE = "db/predictions.json"
SALES_PREDICTION_FILE = "db/sale_predictions.json"

#House price Prediction Endpoints
# Endpoint for predicting house prices
@app.post("/predict")
async def predict_price(property_data: PropertyData):
    input_data = property_data.dict()
    predicted_price = property_price_model.predict_price(input_data)
    save_prediction_to_json(PREDICTION_FILE, input_data, predicted_price)
    return {"predicted_price": round(predicted_price, 2)}

# Endpoint for fetching all predictions
@app.get("/prediction-history/")
async def get_predictions():
    predictions = load_predictions_from_json(PREDICTION_FILE)
    return {"predictions": predictions}

# Endpoint for deleting a prediction by ID
@app.delete("/delete-prediction/{prediction_id}")
async def delete_prediction(prediction_id: int):
    delete_prediction_from_json(PREDICTION_FILE, prediction_id)
    return {"message": f"Prediction with ID {prediction_id} has been deleted."}


#House Potential Sell Predict Endpoint
@app.post("/predict-sale-potential")
async def predict_sale_potential(data: HouseStatus):
    input_data = {
        'Price': data.price,
        'CBD Distance': data.cbd_distance,
        'Bedroom': data.bedroom,
        'Bathroom': data.bathroom,
        'Car-Garage': data.car_garage,
        'Landsize': data.landsize,
        'RE Agency': data.re_agency,
        'Median Price': data.median_price,
        'Median Rental': data.median_rental
    }
    # Get the prediction result
    predicted_result = predict_status(input_data)
    if predicted_result < 40:
        predicted_status = "Bad"
    elif predicted_result >= 40 and predicted_result < 80:
        predicted_status = "Average"
    elif predicted_result >= 80:
        predicted_status = "Good"
    save_sale_prediction_to_json(SALES_PREDICTION_FILE, predicted_result, predicted_status, input_data['Price'], input_data['Median Price'], input_data['Median Rental'])
    return {"predicted_status": predicted_status, "predicted_result": predicted_result}

@app.get("/sale-prediction-history/")
async def get_sale_predictions():
    sale_predictions = load_predictions_from_json(SALES_PREDICTION_FILE)
    return {"predictions": sale_predictions}

# Endpoint for deleting a prediction by ID
@app.delete("/delete-sale-prediction/{prediction_id}")
async def delete_prediction(prediction_id: int):
    delete_prediction_from_json(SALES_PREDICTION_FILE, prediction_id)
    return {"message": f"Prediction with ID {prediction_id} has been deleted."}

# Custom 404 error handler
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    )

# Entry point for running the FastAPI app
if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)