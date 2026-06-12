from pydantic import BaseModel, Field


class VitalsInput(BaseModel):
    age: int = Field(..., ge=10, le=60)
    systolic_bp: int = Field(..., ge=70, le=200)
    diastolic_bp: int = Field(..., ge=40, le=140)
    blood_sugar: float = Field(..., ge=2, le=30)      # mmol/L
    body_temp: float = Field(..., ge=95, le=106)      # Fahrenheit
    heart_rate: int = Field(..., ge=40, le=160)


class Factor(BaseModel):
    feature: str
    impact: float


class PredictionOutput(BaseModel):
    risk_level: str
    confidence: float
    top_factors: list[Factor]