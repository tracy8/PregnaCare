# PregnaCare

A machine-learning maternal-risk screening web app for pregnant women in Rwanda.
Enter clinical vitals, receive a low/moderate/high risk level with a plain-language
explanation of the main drivers.

## Structure
- `ml/` — model notebook and the saved model
- `backend/` — FastAPI service that serves predictions and SHAP explanations
- `frontend/` — React web app
- `docs/` — diagrams and API documentation

## Data
- **Rwanda DHS 2019-20** (context analysis): access-controlled. Register and download
  the Individual Recode from https://dhsprogram.com, then place `RWIR81FL.DTA` in `ml/data/`.
  Not redistributed here, per the DHS data-use agreement.
- **Maternal vitals dataset** (model training): fetched automatically in the notebook
  via the `ucimlrepo` package.

  Link to the design
  https://www.figma.com/design/p1Lj83MuduKd8hHHd0ZUQE/Pregnacare?node-id=0-1&t=EMDEGTRp59hnQxQL-1