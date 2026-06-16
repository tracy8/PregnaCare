import { useEffect, useState } from "react";
import { getProfile, getReadings, updateProfile } from "../lib/db";
import { weeksPregnant, trimesterOf, babyInfo } from "../lib/pregnancy";
import type { Profile, Reading } from "../lib/types";

const RISK: Record<string, { label: string; text: string; bg: string; bar: string }> = {
  low: { label: "Low", text: "text-emerald-700", bg: "bg-emerald-100", bar: "bg-emerald-600" },
  mid: { label: "Medium", text: "text-amber-700", bg: "bg-amber-100", bar: "bg-amber-500" },
  high: { label: "High", text: "text-red-700", bg: "bg-red-100", bar: "bg-red-600" },
};

export default function Dashboard({ onNavigate }: { onNavigate?: (v: string) => void }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [readings, setReadings] = useState<Reading[]>([]);
  const [loading, setLoading] = useState(true);
  const [dueInput, setDueInput] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([getProfile(), getReadings(5)])
      .then(([p, r]) => {
        setProfile(p);
        setReadings(r);
      })
      .catch((e) => console.error("Dashboard load failed:", e))
      .finally(() => setLoading(false));
  }, []);

  const saveDueDate = async () => {
    if (!dueInput) return;
    setSaving(true);
    try {
      await updateProfile({ due_date: dueInput });
      setProfile((p) => (p ? { ...p, due_date: dueInput } : p));
    } catch (e) {
      console.error("Could not save due date:", e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="grid min-h-64 place-items-center text-stone-400">Loading…</div>;
  }

  const firstName = profile?.full_name?.split(" ")[0] ?? "there";
  const week = weeksPregnant(profile?.due_date);
  const latest = readings[0];
  const baby = week !== null ? babyInfo(week) : null;

  return (
    <div className="mx-auto max-w-5xl px-5 py-8">
      {/* Greeting */}
      <h1 className="text-3xl font-semibold text-stone-900">
        Muraho, <span className="text-primary">{firstName}</span>
      </h1>
      <p className="mt-1 text-stone-500">
        {week !== null
          ? `You're in week ${week} — trimester ${trimesterOf(week)}. Keep up the great work.`
          : "Let's set up your pregnancy timeline."}
      </p>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        {/* Health risk summary */}
        <section className="rounded-2xl border border-stone-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-stone-900">Health risk summary</h2>
            {latest && (
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${RISK[latest.risk_level].bg} ${RISK[latest.risk_level].text}`}>
                {RISK[latest.risk_level].label}
              </span>
            )}
          </div>

          {latest ? (
            <>
              <p className="mt-4 text-sm text-stone-500">
                Your last check was{" "}
                <span className="font-medium text-stone-800">{RISK[latest.risk_level].label.toLowerCase()} risk</span>{" "}
                with {Math.round(latest.confidence * 100)}% confidence
                {latest.factors?.[0] && (
                  <> — mostly driven by {latest.factors[0].feature.toLowerCase()}.</>
                )}
              </p>
              <button
                onClick={() => onNavigate?.("risk")}
                className="mt-5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
              >
                Check again
              </button>
            </>
          ) : (
            <>
              <p className="mt-4 text-sm text-stone-500">
                You haven't run a risk check yet. It takes under a minute and helps you spot anything early.
              </p>
              <button
                onClick={() => onNavigate?.("risk")}
                className="mt-5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
              >
                Take your first check
              </button>
            </>
          )}
        </section>

        {/* Pregnancy progress */}
        <section className="rounded-2xl border border-stone-200 bg-white p-6">
          {week !== null && baby ? (
            <div className="flex items-center gap-6">
              <WeekRing week={week} />
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                  This week
                </div>
                <div className="mt-1 text-lg font-semibold text-stone-900">
                  About the size of {baby.size}
                </div>
                <div className="text-sm text-stone-500">{baby.length}</div>
                <p className="mt-2 text-sm text-stone-600">{baby.note}</p>
              </div>
            </div>
          ) : (
            <>
              <h2 className="font-semibold text-stone-900">Set your due date</h2>
              <p className="mt-1 text-sm text-stone-500">
                Add it to see your week-by-week progress and your baby's growth.
              </p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <input
                  type="date"
                  value={dueInput}
                  onChange={(e) => setDueInput(e.target.value)}
                  className="flex-1 rounded-lg border border-stone-300 px-3 py-2 text-base text-stone-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <button
                  onClick={saveDueDate}
                  disabled={saving || !dueInput}
                  className="rounded-lg bg-primary px-4 py-2 font-medium text-white hover:bg-primary-dark disabled:opacity-60"
                >
                  {saving ? "Saving…" : "Save"}
                </button>
              </div>
            </>
          )}
        </section>
      </div>

      {/* Quick actions */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <button
          onClick={() => onNavigate?.("risk")}
          className="rounded-2xl border border-stone-200 bg-white p-5 text-left hover:shadow-sm"
        >
          <div className="font-semibold text-stone-900">Start a risk assessment</div>
          <div className="mt-1 text-sm text-stone-500">Update your readings for today</div>
        </button>
        <button
          onClick={() => onNavigate?.("guide")}
          className="rounded-2xl border border-stone-200 bg-white p-5 text-left hover:shadow-sm"
        >
          <div className="font-semibold text-stone-900">Read this week's guide</div>
          <div className="mt-1 text-sm text-stone-500">
            {week !== null ? `Tips for week ${week}` : "Weekly development and tips"}
          </div>
        </button>
      </div>

      {/* Recent checks */}
      {readings.length > 0 && (
        <section className="mt-5 rounded-2xl border border-stone-200 bg-white p-6">
          <h2 className="font-semibold text-stone-900">Recent checks</h2>
          <ul className="mt-3 divide-y divide-stone-100">
            {readings.map((r) => (
              <li key={r.id} className="flex items-center justify-between py-2.5 text-sm">
                <span className="text-stone-500">
                  {new Date(r.created_at).toLocaleDateString(undefined, {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-3">
                  <span className="text-stone-400">{Math.round(r.confidence * 100)}%</span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${RISK[r.risk_level].bg} ${RISK[r.risk_level].text}`}>
                    {RISK[r.risk_level].label}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function WeekRing({ week }: { week: number }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - Math.min(week, 40) / 40);
  return (
    <div className="relative h-32 w-32 flex-none">
      <svg viewBox="0 0 128 128" className="h-32 w-32 -rotate-90">
        <circle cx="64" cy="64" r={r} fill="none" stroke="#e7e5e4" strokeWidth="10" />
        <circle
          cx="64"
          cy="64"
          r={r}
          fill="none"
          stroke="currentColor"
          className="text-primary"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-semibold text-stone-900">{week}</span>
        <span className="text-[11px] uppercase tracking-wide text-stone-400">of 40 weeks</span>
      </div>
    </div>
  );
}