export type RiskLevel = "low" | "mid" | "high";

export type Profile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  due_date: string | null;
  trimester: string | null;
  current_week: number | null;
  risk_level: RiskLevel;
  language: "en" | "rw";
};

export type Factor = { feature: string; impact: number };

// The result your FastAPI /predict endpoint returns.
export type Prediction = {
  risk_level: RiskLevel;
  confidence: number;
  top_factors: Factor[];
};

// The raw inputs the mother entered (body temp kept in Celsius for display).
export type ReadingInput = {
  age: number;
  systolic_bp: number;
  diastolic_bp: number;
  blood_sugar: number;
  body_temp_c: number;
  heart_rate: number;
};

export type Reading = ReadingInput & {
  id: string;
  risk_level: RiskLevel;
  confidence: number;
  factors: Factor[];
  created_at: string;
};
