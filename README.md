# Project: Hospital Queue Management System

This project consists of two main components:
1. **`hospital-queue`**: The Angular frontend application.
2. **`ifem_award_api`**: The Flask backend server.

---

## Prerequisites

Before working on this project, ensure you have the following installed:
- **Node.js**: Version 18.18
- **Angular CLI**: Version 18.2
- **Python**: Ensure Python is installed to run the Flask server.

---

## Setting Up the Project

### Step 1: Install Angular Dependencies
1. Navigate to the Angular app directory:
   ```bash
   cd hospital-queue
   ```
2. Install the required dependencies:
    ```bash
    npm install
    ```

### Step 2: Setting Up the Flask Server

1. Navigate to the Flask server directory:
    ```bash
    cd ifem_award_api
    ```
2. Create a Python virtual environment:
    ```bash
    python -m venv ifem-env
    ```
3. Activate the virtual environment:
    - Windows:
        ```bash
        python -m venv ifem-env
        ```
    - macOS/Linux:
        ```bash
        source ifem-env/bin/activate
        ```
4. Install the required dependencies:
    ```bash
    pip install -r requirements.txt
    ```
5. Deactivate the environment (when done):
    ```bash
    deactivate
    ```
# Running the Project

## Run the Flask Server
1. Navigate to the Flask server directory:
    ```bash
    cd ifem_award_api
    ```
2. Start the Flask server:
    ```bash
    python app.py
    ```

## Run the Angular App
1. Navigate to the Angular app directory:
    ```bash
    cd hospital-queue
    ```
2. Start the Angular development server:
    ```bash
    npm start
    ```

# Notes
- Ensure both the Flask server and the Angular app are running simultaneously for full functionality.
- If you encounter issues, check that all dependencies are correctly installed.