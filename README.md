# PregnaCare

A web app that gives pregnant women a simple pregnancy-risk reading (low, moderate, or high) and explains in plain language what is driving it. Built as my BSE capstone project at African Leadership University.

## Structure

- `ml/` - data analysis and the model training notebook
- `backend/` - FastAPI service that serves the model
- `frontend/` - React + TypeScript interface
- `docs/` - proposal and project documents

## Tech stack

- Model: XGBoost, scikit-learn, SHAP, imbalanced-learn (SMOTE)
- Backend: Python, FastAPI
- Frontend: React, TypeScript, Vite, Tailwind CSS

## Running it

Backend:

    cd backend
    python -m venv .venv
    .venv\Scripts\activate
    pip install -r requirements.txt
    uvicorn app.main:app --reload

API docs are at http://127.0.0.1:8000/docs

Frontend:

    cd frontend
    npm install
    npm run dev

Notebook: open `ml/pregnacare_risk_model.ipynb` in Google Colab and run all cells.

## Deployment plan

The app has three parts: a React frontend, a FastAPI backend serving the model, and a PostgreSQL database. I will containerise the backend with Docker and deploy it to Render (or a small droplet); host the database on a managed PostgreSQL instance; build the React frontend as a static site on Netlify or Vercel with VITE_API_URL pointing to the live backend. Enable CORS and HTTPS, then test the /predict endpoint from the live site to confirm it works end to end.

## Demo

- Video walkthrough: https://youtu.be/L1QUBoimRl0
- UI designs: https://www.figma.com/design/p1Lj83MuduKd8hHHd0ZUQE/Pregnacare?node-id=0-1&t=EMDEGTRp59hnQxQL-1
- Repository: https://github.com/tracy8/PregnaCare.git


## Data

The model is trained on the public UCI Maternal Health Risk dataset (clinical vitals). The Rwanda DHS 2019-20 is used only for context analysis of the Rwandan setting. It is not committed here because access requires registration with the DHS Program.

