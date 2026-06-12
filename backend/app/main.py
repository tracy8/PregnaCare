from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import VitalsInput, PredictionOutput
from app.model import predict

app = FastAPI(title="PregnaCare API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/predict", response_model=PredictionOutput)
def predict_risk(vitals: VitalsInput):
    return predict(vitals)