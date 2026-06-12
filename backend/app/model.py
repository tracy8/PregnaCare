from pathlib import Path
import joblib
import pandas as pd
import shap

_bundle = joblib.load(Path(__file__).parent / "pregnacare_model.pkl")
_model = _bundle["model"]
_features = _bundle["features"]
_classes = _bundle["classes"]
_explainer = shap.TreeExplainer(_model)

_READABLE = {
    "Age": "Age", "SystolicBP": "Systolic blood pressure",
    "DiastolicBP": "Diastolic blood pressure", "BS": "Blood sugar",
    "BodyTemp": "Body temperature", "HeartRate": "Heart rate",
    "MAP": "Mean arterial pressure", "PulsePressure": "Pulse pressure",
}


def _build_row(v):
    sbp, dbp = v.systolic_bp, v.diastolic_bp
    row = {
        "Age": v.age, "SystolicBP": sbp, "DiastolicBP": dbp,
        "BS": v.blood_sugar, "BodyTemp": v.body_temp, "HeartRate": v.heart_rate,
        "MAP": (sbp + 2 * dbp) / 3, "PulsePressure": sbp - dbp,
    }
    return pd.DataFrame([row])[_features]


def predict(v):
    X = _build_row(v)
    pred = int(_model.predict(X)[0])
    proba = _model.predict_proba(X)[0]

    sv = _explainer.shap_values(X)
    vals = sv[pred][0] if isinstance(sv, list) else sv[0, :, pred]
    contrib = sorted(zip(_features, vals), key=lambda t: abs(t[1]), reverse=True)[:3]

    return {
        "risk_level": _classes[pred],
        "confidence": round(float(proba[pred]), 3),
        "top_factors": [
            {"feature": _READABLE.get(f, f), "impact": round(float(val), 3)}
            for f, val in contrib
        ],
    }