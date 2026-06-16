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

const accent: Record<string, string> = { low: "bg-emerald-600", mid: "bg-amber-500", high: "bg-red-600" };
const meterPos: Record<string, string> = { low: "16%", mid: "50%", high: "84%" };

export default function App({ lang = "en" }: { lang?: Lang }) {
  const [form, setForm] = useState<Record<string, string>>({});
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const t = translations[lang];

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

  const label: Record<string, string> = { low: t.low, mid: t.mid, high: t.high };
  const rec: Record<string, string> = { low: t.recLow, mid: t.recMid, high: t.recHigh };

  return (
    <main className="mx-auto max-w-5xl px-5 py-8 text-stone-800">
        <h1 className="text-3xl font-semibold text-stone-900">{t.tagline}</h1>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <section className="rounded-2xl border border-stone-200 bg-white p-6">
            <h2 className="text-lg font-medium text-stone-900">{t.yourReadings}</h2>
            <p className="mt-1 text-sm text-stone-500">{t.formHelp}</p>

            <div className="mt-5 grid gap-4">
              {fields.map(([key, lbl]) => (
                <label key={key} className="flex flex-col gap-1.5 text-sm text-stone-600">
                  {lbl}
                  <input type="number" value={form[key] || ""}
                    placeholder={ranges[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="rounded-lg border border-stone-300 px-3 py-2 text-base text-stone-900 placeholder:text-stone-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </label>
              ))}
            </div>

            <button onClick={submit} disabled={loading}
              className="mt-6 w-full rounded-lg bg-primary py-3 font-medium text-white hover:bg-primary-dark disabled:opacity-60">
              {loading ? t.checking : t.checkRisk}
            </button>
            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          </section>

          <section className="rounded-2xl border border-stone-200 bg-white">
            {!result ? (
              <div className="flex h-full min-h-64 flex-col items-center justify-center p-8 text-center">
                <div className="mb-3 h-12 w-12 rounded-full border-2 border-dashed border-stone-300" />
                <p className="max-w-xs text-sm text-stone-400">{t.resultEmpty}</p>
              </div>
            ) : (
              <div>
                <div className={`flex items-baseline justify-between rounded-t-2xl px-6 py-4 text-white ${accent[result.risk_level]}`}>
                  <span className="text-sm uppercase tracking-wide opacity-90">{t.resultTitle}</span>
                  <span className="text-2xl font-semibold">
                    {label[result.risk_level]} {t.risk}
                  </span>
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

                  <p className="mt-5 text-sm text-stone-500">
                    {t.confidence}: <span className="font-medium text-stone-800">{Math.round(result.confidence * 100)}%</span>
                  </p>

                  <h3 className="mt-5 text-sm font-medium text-stone-900">{t.mainFactors}</h3>
                  <ul className="mt-2 space-y-1.5">
                    {result.top_factors.map((f) => (
                      <li key={f.feature} className="flex items-center gap-2 text-sm text-stone-600">
                        <span className={`inline-block h-1.5 w-1.5 rounded-full ${f.impact > 0 ? "bg-red-500" : "bg-emerald-500"}`} />
                        {f.feature}: {f.impact > 0 ? t.raises : t.lowers} {t.yourRisk}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5 rounded-lg border-l-4 border-tertiary bg-canvas p-3 text-sm text-stone-700">{rec[result.risk_level]}</div>
                  <p className="mt-4 text-xs text-stone-400">{t.disclaimer}</p>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
  );
}