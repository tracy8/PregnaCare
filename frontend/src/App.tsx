import { useState } from "react";
import { translations } from "./translations";
import { saveReading } from "./lib/db";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

type Lang = "en" | "rw";
type Result = {
  risk_level: string;
  confidence: number;
  top_factors: { feature: string; impact: number }[];
};

const riskGradient: Record<string, string> = {
  low: "from-emerald-500 to-emerald-600",
  mid: "from-amber-400 to-amber-500",
  high: "from-red-500 to-red-600",
};

const recTint: Record<string, string> = {
  low: "border-emerald-500 bg-emerald-50 text-emerald-900",
  mid: "border-amber-500 bg-amber-50 text-amber-900",
  high: "border-red-500 bg-red-50 text-red-900",
};
const meterPos: Record<string, string> = { low: "16%", mid: "50%", high: "84%" };

export default function App({ lang = "en" }: { lang?: Lang }) {
  const [form, setForm] = useState<Record<string, string>>({});
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [signs, setSigns] = useState<Record<string, boolean>>({});
  const t = translations[lang];

  const fields: [string, string][] = [
    ["age", t.age],
    ["systolic_bp", t.systolic],
    ["diastolic_bp", t.diastolic],
    ["blood_sugar", t.bloodSugar],
    ["body_temp_c", t.temp],
    ["heart_rate", t.heartRate],
  ];

  const ranges: Record<string, string> = {
    age: "10–60",
    systolic_bp: "70–200",
    diastolic_bp: "40–140",
    blood_sugar: "2–30",
    body_temp_c: "35–41",
    heart_rate: "40–160",
  };

  const submit = async () => {
    setError("");
    setResult(null);
    const missing = fields.some(
      ([key]) => form[key] === undefined || form[key] === "" || Number.isNaN(Number(form[key]))
    );
    if (missing) {
      setError(t.fillAll);
      return;
    }
    setLoading(true);
    try {
      const payload = {
        age: Number(form.age),
        systolic_bp: Number(form.systolic_bp),
        diastolic_bp: Number(form.diastolic_bp),
        blood_sugar: Number(form.blood_sugar),
        body_temp: (Number(form.body_temp_c) * 9) / 5 + 32,
        heart_rate: Number(form.heart_rate),
      };
      const res = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.status === 422) {
        const data = await res.json().catch(() => null);
        const backendToKey: Record<string, string> = {
          age: "age",
          systolic_bp: "systolic_bp",
          diastolic_bp: "diastolic_bp",
          blood_sugar: "blood_sugar",
          body_temp: "body_temp_c",
          heart_rate: "heart_rate",
        };
        const labelByKey = Object.fromEntries(fields);
        const bad: string[] = (data?.detail ?? [])
          .map((d: { loc?: (string | number)[] }) => String(d?.loc?.[1] ?? ""))
          .filter(Boolean)
          .map((bk: string) => {
            const key = backendToKey[bk] ?? bk;
            return `${labelByKey[key] ?? key} (${ranges[key] ?? "?"})`;
          });
        setError(bad.length ? `${t.outOfRange} ${bad.join(", ")}` : t.outOfRange);
        return;
      }
      if (!res.ok) {
        setError(t.serverError);
        return;
      }
      const data = await res.json();
      setResult(data);
      try {
        await saveReading(
          {
            age: Number(form.age),
            systolic_bp: Number(form.systolic_bp),
            diastolic_bp: Number(form.diastolic_bp),
            blood_sugar: Number(form.blood_sugar),
            body_temp_c: Number(form.body_temp_c),
            heart_rate: Number(form.heart_rate),
          },
          data
        );
      } catch (e) {
        console.error("Could not save reading:", e); // never blocks the result
      }
    } catch {
      setError(t.error);
    } finally {
      setLoading(false);
    }
  };

  const findClinic = () => {
    const open = (url: string) => window.open(url, "_blank", "noopener,noreferrer");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          open(`https://www.google.com/maps/search/health+center/@${pos.coords.latitude},${pos.coords.longitude},14z`),
        () => open("https://www.google.com/maps/search/health+center+near+me"),
        { timeout: 8000 }
      );
    } else {
      open("https://www.google.com/maps/search/health+center+near+me");
    }
  };

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [key]: e.target.value });

  const inputClass =
    "rounded-xl border border-stone-300 bg-white px-4 py-3.5 text-xl text-stone-900 placeholder:text-stone-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30";

  const label: Record<string, string> = { low: t.low, mid: t.mid, high: t.high };
  const rec: Record<string, string> = { low: t.recLow, mid: t.recMid, high: t.recHigh };

  const dangerSigns: [string, string][] = [
    ["bleeding", t.dsBleeding],
    ["headache", t.dsHeadache],
    ["vision", t.dsVision],
    ["swelling", t.dsSwelling],
    ["pain", t.dsPain],
    ["fever", t.dsFever],
    ["movement", t.dsMovement],
    ["fits", t.dsFits],
  ];
  const anySign = Object.values(signs).some(Boolean);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 text-stone-800 sm:px-5">
      <header className="border-b border-stone-200 pb-6">
        <h1 className="mt-2 max-w-2xl font-display text-3xl font-semibold leading-tight text-stone-900 sm:text-4xl">
          {t.tagline}
        </h1>
      </header>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {/* Readings */}
        <section className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-primary to-[#0c4a45] px-5 py-4 text-white sm:px-6">
            <h2 className="text-xl font-semibold">📋 {t.yourReadings}</h2>
            <p className="mt-1 text-sm text-white/80">{t.formHelp}</p>
          </div>

          <div className="grid gap-5 p-5 sm:p-6">
            {/* Age */}
            <label className="flex flex-col gap-2">
              <span className="flex items-center gap-2.5 text-lg font-medium text-stone-700"> {t.age}</span>
              <input type="number" inputMode="numeric" value={form.age || ""} placeholder={ranges.age}
                onChange={set("age")} className={inputClass} />
            </label>

            {/* Blood pressure — one reading, two numbers stacked */}
            <div className="rounded-2xl border border-primary/20 bg-sage/40 p-4 sm:p-5">
              <div className="flex items-center gap-2.5 text-lg font-medium text-stone-800"> {t.bpTitle}</div>
              <p className="mt-1.5 text-sm text-stone-500">{t.bpHelp}</p>
              <div className="mt-3 grid gap-3">
                <label className="flex flex-col gap-1 text-base text-stone-500">
                  {t.bpTop}
                  <input type="number" inputMode="numeric" value={form.systolic_bp || ""}
                    placeholder={ranges.systolic_bp} onChange={set("systolic_bp")} className={inputClass} />
                </label>
                <label className="flex flex-col gap-1 text-base text-stone-500">
                  {t.bpBottom}
                  <input type="number" inputMode="numeric" value={form.diastolic_bp || ""}
                    placeholder={ranges.diastolic_bp} onChange={set("diastolic_bp")} className={inputClass} />
                </label>
              </div>
              <p className="mt-2 text-sm text-stone-400">{t.bpTool}</p>
            </div>

            {/* Blood sugar */}
            <label className="flex flex-col gap-2">
              <span className="flex items-center gap-2.5 text-lg font-medium text-stone-700"> {t.bloodSugar}</span>
              <input type="number" inputMode="decimal" value={form.blood_sugar || ""} placeholder={ranges.blood_sugar}
                onChange={set("blood_sugar")} className={inputClass} />
              <span className="text-sm text-stone-400">{t.bloodSugarTool}</span>
            </label>

            {/* Body temperature */}
            <label className="flex flex-col gap-2">
              <span className="flex items-center gap-2.5 text-lg font-medium text-stone-700"> {t.temp}</span>
              <input type="number" inputMode="decimal" value={form.body_temp_c || ""} placeholder={ranges.body_temp_c}
                onChange={set("body_temp_c")} className={inputClass} />
              <span className="text-sm text-stone-400">{t.tempTool}</span>
            </label>

            {/* Heart rate */}
            <label className="flex flex-col gap-2">
              <span className="flex items-center gap-2.5 text-lg font-medium text-stone-700"> {t.heartRate}</span>
              <input type="number" inputMode="numeric" value={form.heart_rate || ""} placeholder={ranges.heart_rate}
                onChange={set("heart_rate")} className={inputClass} />
              <span className="text-sm text-stone-400">{t.heartRateTool}</span>
            </label>

            <button onClick={submit} disabled={loading}
              className="mt-1 w-full rounded-xl bg-primary py-4 text-lg font-semibold text-white shadow-sm transition hover:bg-primary-dark disabled:opacity-60">
              {loading ? t.checking : `${t.checkRisk} →`}
            </button>
            {error && <p className="rounded-lg bg-red-50 p-3 text-base text-red-700">{error}</p>}
          </div>
        </section>

        {/* Result */}
        <section className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
          {!result ? (
            <div className="flex h-full min-h-72 flex-col items-center justify-center p-8 text-center">
              <div className="relative mb-5 h-16 w-16">
                <span className="absolute inset-0 rounded-full border-2 border-dashed border-primary/30" />
                <span className="absolute inset-3 rounded-full bg-primary/10" />
              </div>
              <p className="max-w-xs text-lg text-stone-400">{t.resultEmpty}</p>
            </div>
          ) : (
            <div>
              <div className={`flex items-center justify-between bg-gradient-to-r px-6 py-5 text-white ${riskGradient[result.risk_level]}`}>
                <div>
                  <div className="text-xs uppercase tracking-wide opacity-90">{t.resultTitle}</div>
                  <div className="mt-0.5 text-3xl font-semibold">{label[result.risk_level]} {t.risk}</div>
                </div>
              </div>

              <div className="p-6">
                <div className="relative h-3 rounded-full"
                  style={{ background: "linear-gradient(to right,#059669,#f59e0b,#dc2626)" }}>
                  <div className="absolute -top-1 h-5 w-1.5 -translate-x-1/2 rounded-full border-2 border-white bg-stone-800"
                    style={{ left: meterPos[result.risk_level] }} />
                </div>
                <div className="mt-1.5 flex justify-between text-xs text-stone-400">
                  <span>{t.meterLow}</span><span>{t.meterHigh}</span>
                </div>

                <div className="mt-6">
                  <div className="flex items-center justify-between text-base text-stone-500">
                    <span>{t.confidence}</span>
                    <span className="text-lg font-semibold text-stone-800">{Math.round(result.confidence * 100)}%</span>
                  </div>
                  <div className="mt-1.5 h-2.5 rounded-full bg-stone-100">
                    <div className="h-2.5 rounded-full bg-primary" style={{ width: `${Math.round(result.confidence * 100)}%` }} />
                  </div>
                  <p className="mt-2 text-sm text-stone-400">{t.confidenceWhat}</p>
                </div>

                <h3 className="mt-6 text-lg font-semibold text-stone-900">{t.mainFactors}</h3>
                <ul className="mt-2 space-y-2">
                  {result.top_factors.map((f) => (
                    <li key={f.feature} className="rounded-xl bg-canvas px-3.5 py-3">
                      <div className="flex items-center gap-2.5 text-base">
                        <span className={`text-lg ${f.impact > 0 ? "text-red-500" : "text-emerald-600"}`}>{f.impact > 0 ? "▲" : "▼"}</span>
                        <span className="font-medium text-stone-800">{f.feature}</span>
                        <span className="text-stone-500">{f.impact > 0 ? t.raises : t.lowers} {t.yourRisk}</span>
                      </div>
                      {t.factorWhy[f.feature] && (
                        <p className="mt-1 pl-7 text-sm text-stone-500">{t.factorWhy[f.feature]}</p>
                      )}
                    </li>
                  ))}
                </ul>

                <div className={`mt-6 rounded-xl border-l-4 p-4 text-lg ${recTint[result.risk_level]}`}>{rec[result.risk_level]}</div>
                <p className="mt-4 text-sm text-stone-400">{t.disclaimer}</p>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Danger signs */}
      <section className="mt-6 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
        <div className="bg-gradient-to-r from-secondary to-secondary-dark px-5 py-4 text-white sm:px-6">
          <h2 className="text-xl font-semibold">⚠️ {t.dsTitle}</h2>
          <p className="mt-1 text-sm text-white/90">{t.dsIntro}</p>
        </div>

        <div className="p-5 sm:p-6">
          <div className="grid gap-3 sm:grid-cols-2">
            {dangerSigns.map(([key, lbl]) => (
              <label key={key}
                className={`flex items-start gap-3 rounded-xl border p-4 text-lg transition ${
                  signs[key] ? "border-red-300 bg-red-50 text-red-900" : "border-stone-200 text-stone-700 hover:border-stone-300"
                }`}>
                <input type="checkbox" checked={!!signs[key]}
                  onChange={(e) => setSigns({ ...signs, [key]: e.target.checked })}
                  className="mt-1 h-5 w-5 accent-red-600" />
                {lbl}
              </label>
            ))}
          </div>
            <p className="mt-3 text-sm text-stone-400">{t.dsNote}</p>
          {anySign && (
            <div className="mt-4 space-y-3">
              <div className="flex items-start gap-2 rounded-xl border-l-4 border-red-600 bg-red-50 p-4 text-lg font-medium text-red-800">
                <span className="text-xl">🚨</span> {t.dsAlert}
              </div>
              <div className="flex justify-center">
                <button onClick={findClinic}
                  className="flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-lg font-semibold text-white shadow-sm transition hover:bg-primary-dark">
                  {t.dsFindClinic}
                </button>
              </div>
            </div>
          )}

        </div>
      </section>
    </main>
  );
}