import { useEffect, useState } from "react";
import { getProfile, getReadings, updateProfile } from "../lib/db";
import { weeksPregnant, trimesterOf, babyInfo } from "../lib/pregnancy";
import type { Profile, Reading } from "../lib/types";

const RISK: Record<string, { label: string; chip: string }> = {
  low: { label: "Low", chip: "bg-emerald-100 text-emerald-700" },
  mid: { label: "Medium", chip: "bg-amber-100 text-amber-700" },
  high: { label: "High", chip: "bg-red-100 text-red-700" },
};

const todayStr = () => new Date().toISOString().slice(0, 10);
const maxDueStr = () => new Date(Date.now() + 300 * 864e5).toISOString().slice(0, 10);

export default function Dashboard({ onNavigate }: { onNavigate?: (v: string) => void }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [readings, setReadings] = useState<Reading[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    Promise.all([getProfile(), getReadings(5)])
      .then(([p, r]) => {
        setProfile(p);
        setReadings(r);
      })
      .catch((e) => console.error("Dashboard load failed:", e))
      .finally(() => setLoading(false));
  }, []);

  const saveDue = async (due: string) => {
    setSaving(true);
    try {
      await updateProfile({ due_date: due });
      setProfile((p) => (p ? { ...p, due_date: due } : p));
      setEditing(false);
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
  const fullTerm = week !== null && week >= 40;
  const latest = readings[0];
  const baby = week !== null ? babyInfo(week) : null;

  return (
    <div className="relative">
      <PageBackground />
      <div className="relative mx-auto max-w-5xl px-4 py-8 sm:px-5">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-[#0c4a45] p-6 text-white shadow-lg sm:p-8">
          <Blobs className="text-white/10" />
          <div className="relative flex items-center justify-between gap-5">
            <div className="min-w-0">
              <h1 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">
                Muraho, {firstName}
              </h1>
              <p className="mt-2 max-w-md text-white/85">
                {week === null
                  ? "Let's set up your pregnancy timeline below to see your weekly progress."
                  : fullTerm
                  ? "You're at full term. If your baby hasn't arrived yet, check in with your health worker about next steps."
                  : `You're in week ${week}, trimester ${trimesterOf(week)}. Keep up the great work.`}
              </p>
              {week !== null && (
                <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-sm font-medium">
                  {fullTerm ? "Full term" : `Trimester ${trimesterOf(week)}`}
                </span>
              )}
            </div>
            {week !== null && <HeroRing week={week} />}
          </div>
        </section>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          {/* Health risk summary */}
          <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icon><path d="M12 21s-7-5.2-7-11a7 7 0 1 1 14 0c0 5.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></Icon>
                </span>
                <h2 className="font-semibold text-stone-900">Health risk summary</h2>
              </div>
              {latest && (
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${RISK[latest.risk_level].chip}`}>
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
                  {latest.factors?.[0] && <> — mostly driven by {latest.factors[0].feature.toLowerCase()}.</>}
                </p>
                <button onClick={() => onNavigate?.("risk")}
                  className="mt-5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary-dark">
                  Check again
                </button>
              </>
            ) : (
              <>
                <p className="mt-4 text-sm text-stone-500">
                  You haven't run a risk check yet. It takes under a minute and helps you spot anything early.
                </p>
                <button onClick={() => onNavigate?.("risk")}
                  className="mt-5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary-dark">
                  Take your first check
                </button>
              </>
            )}
          </section>

          {/* This week / set due date */}
          {week !== null && baby ? (
            <section className="rounded-2xl border border-secondary/30 bg-secondary/10 p-6 shadow-sm">
              <div className="flex items-center gap-2.5">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-tertiary shadow-sm">
                  <Icon><path d="M12 21s-7-5.2-7-11a7 7 0 1 1 14 0c0 5.8-7 11-7 11z" /></Icon>
                </span>
                <div className="text-xs font-semibold uppercase tracking-wide text-tertiary-dark">This week</div>
              </div>
              <div className="mt-3 text-xl font-semibold text-stone-900">About the size of {baby.size}</div>
              <div className="text-sm text-stone-500">{baby.length}</div>
              <p className="mt-2 text-sm text-stone-600">{baby.note}</p>

              {!editing ? (
                <button onClick={() => setEditing(true)} className="mt-4 flex items-center gap-1.5 text-sm font-medium text-tertiary-dark hover:underline">
                  <Icon><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" /></Icon>
                  Edit due date
                </button>
              ) : (
                <div className="mt-4">
                  <DueDateForm initialDue={profile?.due_date ?? ""} saving={saving}
                    onSave={saveDue} onCancel={() => setEditing(false)} />
                </div>
              )}
            </section>
          ) : (
            <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2.5">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-secondary/20 text-tertiary-dark">
                  <Icon><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M3 9h18M8 2.5v4M16 2.5v4" /></Icon>
                </span>
                <h2 className="font-semibold text-stone-900">Set your due date</h2>
              </div>
              <p className="mt-2 text-sm text-stone-500">
                Add it from your antenatal card to see your week-by-week progress and your baby's growth.
              </p>
              <div className="mt-4">
                <DueDateForm initialDue="" saving={saving} onSave={saveDue} />
              </div>
            </section>
          )}
        </div>

        {/* Quick actions */}
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <button onClick={() => onNavigate?.("risk")}
            className="group flex items-center gap-4 rounded-2xl border border-stone-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <span className="grid h-12 w-12 flex-none place-items-center rounded-xl bg-primary/10 text-primary">
              <Icon><path d="M9 11l3 3 8-8" /><path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9" /></Icon>
            </span>
            <div>
              <div className="font-semibold text-stone-900">Start a risk assessment</div>
              <div className="mt-0.5 text-sm text-stone-500">Update your readings for today</div>
            </div>
          </button>
          <button onClick={() => onNavigate?.("guide")}
            className="group flex items-center gap-4 rounded-2xl border border-stone-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <span className="grid h-12 w-12 flex-none place-items-center rounded-xl bg-secondary/20 text-tertiary-dark">
              <Icon><path d="M6 4h9a2 2 0 0 1 2 2v13H8a2 2 0 0 0-2 2V4z" /><path d="M8 19h9" /></Icon>
            </span>
            <div>
              <div className="font-semibold text-stone-900">Read this week's guide</div>
              <div className="mt-0.5 text-sm text-stone-500">
                {week !== null && !fullTerm ? `Tips for week ${week}` : "Weekly development and tips"}
              </div>
            </div>
          </button>
        </div>

        {/* Recent checks */}
        {readings.length > 0 && (
          <section className="mt-5 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-stone-900">Recent checks</h2>
            <ul className="mt-3 divide-y divide-stone-100">
              {readings.map((r) => (
                <li key={r.id} className="flex items-center justify-between py-3 text-sm">
                  <span className="text-stone-500">
                    {new Date(r.created_at).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                  <span className="flex items-center gap-3">
                    <span className="text-stone-400">{Math.round(r.confidence * 100)}%</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${RISK[r.risk_level].chip}`}>
                      {RISK[r.risk_level].label}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}

/* Lets a woman set her timeline either by due date (future only) or, if she
   doesn't know it, by how many weeks along she is. Both end up as a due date. */
function DueDateForm({
  initialDue,
  saving,
  onSave,
  onCancel,
}: {
  initialDue: string;
  saving: boolean;
  onSave: (due: string) => void;
  onCancel?: () => void;
}) {
  const [mode, setMode] = useState<"date" | "weeks">("date");
  const [due, setDue] = useState(initialDue);
  const [weeks, setWeeks] = useState("");

  const inputCls =
    "w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-base text-stone-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30";

  const submit = () => {
    if (mode === "date") {
      if (!due) return;
      onSave(due);
    } else {
      const w = Number(weeks);
      if (!w || w < 1 || w > 42) return;
      // Convert "weeks along" into a due date: 40 weeks total, so the rest is time to go.
      const dueMs = Date.now() + (40 - w) * 7 * 864e5;
      onSave(new Date(dueMs).toISOString().slice(0, 10));
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-1 rounded-lg bg-stone-100 p-1 text-sm">
        <button onClick={() => setMode("date")}
          className={`flex-1 rounded-md py-1.5 font-medium transition ${mode === "date" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500"}`}>
          I know my due date
        </button>
        <button onClick={() => setMode("weeks")}
          className={`flex-1 rounded-md py-1.5 font-medium transition ${mode === "weeks" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500"}`}>
          I'm not sure
        </button>
      </div>

      {mode === "date" ? (
        <input type="date" value={due} min={todayStr()} max={maxDueStr()}
          onChange={(e) => setDue(e.target.value)} className={inputCls} />
      ) : (
        <div>
          <input type="number" value={weeks} min={1} max={42} placeholder="e.g. 20"
            onChange={(e) => setWeeks(e.target.value)} className={inputCls} />
          <p className="mt-1.5 text-xs text-stone-500">
            How many weeks pregnant are you now? Your antenatal card or health worker can tell you. We'll estimate your due date from this.
          </p>
        </div>
      )}

      <div className="flex gap-2">
        <button onClick={submit} disabled={saving}
          className="rounded-lg bg-primary px-5 py-2.5 font-medium text-white transition hover:bg-primary-dark disabled:opacity-60">
          {saving ? "Saving…" : "Save"}
        </button>
        {onCancel && (
          <button onClick={onCancel}
            className="rounded-lg border border-stone-300 px-4 py-2.5 font-medium text-stone-600 transition hover:bg-stone-100">
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}

function HeroRing({ week }: { week: number }) {
  const full = week >= 40;
  const capped = Math.min(week, 40);
  const r = 50;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - capped / 40);
  return (
    <div className="relative h-28 w-28 flex-none sm:h-32 sm:w-32">
      <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90">
        <circle cx="64" cy="64" r={r} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="10" />
        <circle cx="64" cy="64" r={r} fill="none" stroke="#e8ad74" strokeWidth="10"
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
        <span className={full ? "text-xl font-semibold" : "text-xl font-semibold"}>{full ? "Full term" : week}</span>
        <span className="text-[10px] uppercase tracking-wide text-white/70">{full ? "week 40+" : "of 40 weeks"}</span>
      </div>
    </div>
  );
}

function PageBackground() {
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="dashLine" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2d726e" stopOpacity="0.10" />
          <stop offset="100%" stopColor="#e8ad74" stopOpacity="0.10" />
        </linearGradient>
      </defs>
      <circle cx="6%" cy="38%" r="60" fill="#e8ad74" fillOpacity="0.06" />
      <circle cx="95%" cy="60%" r="90" fill="#2d726e" fillOpacity="0.05" />
      <path d="M-50 700 C 300 600 1200 760 1600 560" stroke="url(#dashLine)" strokeWidth="40" strokeLinecap="round" />
    </svg>
  );
}

function Blobs({ className = "" }: { className?: string }) {
  return (
    <svg className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} fill="currentColor" aria-hidden="true">
      <circle cx="88%" cy="20%" r="70" />
      <circle cx="70%" cy="85%" r="40" />
      <circle cx="96%" cy="70%" r="22" />
    </svg>
  );
}

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}