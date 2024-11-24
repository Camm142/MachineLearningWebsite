## Source code for Housing Market Website

This project is a comprehensive application that integrates a front-end user interface with a back-end server and AI model capabilities. We perform a housing market website using Machine Learning model to make prediction for you.

This guide provides steps to configure the project environment and how to run it.

## Table of Contents

- [Setup Instructions](#setup-instructions)
- [Necessary Libraries](#necessary-libraries)
- [Running Instructions](#running-instructions)
- [AI Model Integration Configuration](#ai-model-integration-configuration)

## Setup Instructions

We using VSCode to setup this project.

1. Setup for Frontend

- Ensure your computer has nodejs installed.
- Open the terminal, install the required dependencies

```bash
    npm install d3 bootstrap react-router-dom vite
```

2. Setup for Backend

- Open the folder and in terminal, install the required library using pip

```bash
    pip install fastpi uvicorn pydantic scikit-learn
```

## Necessary Libraries

1. Frontend Used Library

- d3 (v7.9): For data visulization
- bootstrap (v5.3): For website style and responsiveness
- react-router-dom (v6.27.0): Use to manage navigation and routing in React applications
- vite (v5.4.10)

2. Backend Used Library

- sys: To interact with the interpreter
- json: To work with JSON data
- os: To interact with operating system
- numpy
- pandas
- scikit-learn (import as sklearn): For training Machine Learning model
- uvicorn: To run the application
- fastapi: For builing APIs
- pydantic: A library to validate data

## Running Instruction

1. Run Backend first to create API. First, direct to backend folder using command

```bash
    cd backend
```

2. Run the FastAPI Application using command

```bash
    uvicorn main:app --reload
```

3. Wait until terminal prompt out the notification saying that "Application startup complete", the server is now running on http://127.0.0.1:8000
4. Run Frontend. First, direct to the frontend folder.

```bash
    cd frontend
```

If you are currently in backend, return back to the main folder first before direct to frontend folder.

```bash
    cd ../frontend
```

5. Run the application using command

```bash
    npm run dev
```

6. When the application finished running, the website now running on http://localhost:5173/

## AI Model Integration Configuration

1. Import necessary libraris: FastAPI for create API. numpy, pandas, scikit-learn for data manipulation and model operations.
2. Directory and Module Structure

- All Machine Learning models stored in models folder.
- In main.py, set the current directory and define the paths to the models using command

```bash
    current_dir = os.path.dirname(__file__)
    models_dir = os.path.join(current_dir, 'models')
    sys.path.append(models_dir)
```

- Import required model into main.py

```bash
    from prediction_model import PropertyPriceModel
    from classification_model import predict_status
```

3. Initialize Machine Learning models in the main.py

- Initialize for predicted price model

```bash
    property_price_model = PropertyPriceModel()
```

4. All of the intructions above has already integrated into main.py, you only need to run

```bash
    uvicorn main:app --reload
```

to start the whole backend server. You don't have to do the AI Model Integration Configuration instruction to run the file, I just write it out for you to know the instruction to integrate the model into Backend.
