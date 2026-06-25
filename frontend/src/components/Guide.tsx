import { useEffect, useState } from "react";
import { getProfile } from "../lib/db";
import { weeksPregnant, trimesterOf, babyInfo } from "../lib/pregnancy";
import type { Profile } from "../lib/types";

const HAPPENING: Record<number, { t: string; d: string }[]> = {
  1: [
    { t: "Major organs forming", d: "The brain, heart, and spine are taking shape in these early weeks." },
    { t: "A tiny heartbeat", d: "The heart starts beating and can be seen on an early ultrasound." },
    { t: "Be gentle with yourself", d: "Nausea and tiredness are common now — rest whenever you can." },
  ],
  2: [
    { t: "Lungs developing", d: "The lungs begin making surfactant, which helps them expand after birth." },
    { t: "Responding to sound", d: "Your baby can hear your voice now — talking or singing reaches them." },
    { t: "Facial features formed", d: "Eyes, eyelashes, and eyebrows are in place, though the eyes stay closed for now." },
  ],
  3: [
    { t: "Gaining weight fast", d: "Your baby is filling out with fat to stay warm after birth." },
    { t: "Practising for birth", d: "They rehearse breathing movements and become more active." },
    { t: "Getting into position", d: "Most babies settle head-down in these final weeks, ready for delivery." },
  ],
};

// A small pool of common, widely-available foods. We rotate through it by week
// so the suggestions change over time rather than showing one fixed set.
const FOODS = [
  { name: "Beans", note: "Protein and iron" },
  { name: "Eggs", note: "Protein and choline" },
  { name: "Isombe", note: "Iron and folate" },
  { name: "Dodo", note: "Iron and vitamin A" },
  { name: "Avocado", note: "Healthy fats" },
  { name: "Orange sweet potato", note: "Vitamin A and energy" },
  { name: "Milk", note: "Calcium for strong bones" },
  { name: "Banana", note: "Potassium and energy" },
];

// What each trimester tends to need most — framed as general guidance, not a rule.
const TRI_FOCUS: Record<number, string> = {
  1: "In the first trimester, foods with folate support your baby's early development. Small, frequent meals can help if you feel nauseous.",
  2: "In the second trimester, iron and calcium matter most, as your blood volume rises and your baby's bones grow.",
  3: "In the third trimester, protein and iron help your baby gain weight and prepare your body for birth.",
};

function pickFoods(week: number | null, tri: number) {
  const start = (week ?? tri * 2) % FOODS.length;
  return Array.from({ length: 4 }, (_, i) => FOODS[(start + i) % FOODS.length]);
}

const NORMAL = ["Mild swelling in the ankles", "Occasional heartburn", "Frequent baby movements"];
const DANGER = ["Severe headache or blurred vision", "Sudden, excessive swelling", "Any vaginal bleeding"];

const TRI_NAME = ["", "first", "second", "third"];

export default function Guide() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile()
      .then(setProfile)
      .catch((e) => console.error("Guide load failed:", e))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="grid min-h-64 place-items-center text-stone-400">Loading…</div>;
  }

  const week = weeksPregnant(profile?.due_date);
  const triFromProfile = profile?.trimester ? Number(profile.trimester.replace("t", "")) || 2 : 2;
  const tri = week !== null ? trimesterOf(week) : triFromProfile;
  const baby = week !== null ? babyInfo(week) : null;
  const foods = pickFoods(week, tri);

  return (
    <div className="mx-auto max-w-5xl px-5 py-8">

      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-[#0c4a45] p-7 text-white shadow-lg sm:p-9">
        <Blobs className="text-white/10" />
        <div className="relative flex flex-col-reverse items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm font-semibold uppercase tracking-widest text-white/60">
              {TRI_NAME[tri]} trimester
            </div>
            <h1 className="mt-1 font-display text-4xl font-semibold leading-tight sm:text-5xl">
              {week === null ? "Your guide" : week >= 40 ? "Full term" : `Week ${week}`}
            </h1>
            {baby ? (
              <>
                <p className="mt-3 text-xl text-white/90">About the size of {baby.size}</p>
                <p className="text-base text-white/55">{baby.length}</p>
              </>
            ) : (
              <p className="mt-3 max-w-xs text-base text-white/80">
                Add your due date on the Dashboard to see your baby's size, week by week.
              </p>
            )}
          </div>
          {week !== null && <WeekRing week={week} />}
        </div>
        {baby && <p className="relative mt-6 max-w-xl text-base leading-relaxed text-white/80">{baby.note}</p>}
      </section>

      {/* What's happening */}
      <h2 className="mt-8 text-lg font-semibold text-stone-900">What's happening now</h2>
      <p className="mt-1 text-sm text-stone-500">General guidance for the {TRI_NAME[tri]} trimester. Every pregnancy is different.</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {HAPPENING[tri].map((h) => (
          <div key={h.t} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:shadow-md">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
              <PulseIcon />
            </span>
            <div className="mt-3 font-semibold text-stone-900">{h.t}</div>
            <p className="mt-1 text-sm leading-relaxed text-stone-500">{h.d}</p>
          </div>
        ))}
      </div>

      {/* Nutrition */}
      <section className="mt-8 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-stone-900">Foods that can help this stage</h2>
        <p className="mt-1 text-sm text-stone-500">{TRI_FOCUS[tri]}</p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {foods.map((f) => (
            <div key={f.name} className="rounded-2xl bg-secondary/15 p-4 text-center">
              <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-white text-tertiary shadow-sm">
                <LeafIcon />
              </span>
              <div className="mt-2 font-semibold text-tertiary">{f.name}</div>
              <div className="mt-0.5 text-xs leading-snug text-stone-500">{f.note}</div>
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-r-xl border-l-4 border-secondary bg-canvas p-4 text-sm leading-relaxed text-stone-600">
          These are general suggestions, not medical advice. Eat a variety of foods as you're able, and
          always follow the guidance of your antenatal care provider, especially if you have a condition
          such as diabetes or high blood pressure.
        </div>
      </section>

      {/* Watch for */}
      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Normal symptoms</h3>
          <ul className="mt-3 space-y-2.5">
            {NORMAL.map((s) => (
              <li key={s} className="flex items-center gap-2.5 text-sm text-stone-700">
                <CheckIcon /> {s}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-red-100 bg-red-50/60 p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-red-700">Danger signs — get care now</h3>
          <ul className="mt-3 space-y-2.5">
            {DANGER.map((s) => (
              <li key={s} className="flex items-center gap-2.5 text-sm font-medium text-stone-800">
                <WarnIcon /> {s}
              </li>
            ))}
          </ul>
          <a href="https://www.google.com/maps/search/health+center+near+me" target="_blank" rel="noreferrer"
            className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-white transition hover:bg-primary-dark">
            <PinIcon /> Find the nearest clinic
          </a>
        </section>
      </div>

      {/* Honest footer note */}
      <p className="mt-8 text-center text-xs text-stone-400">
        PregnaCare offers general information, not a medical diagnosis or personal medical advice.
        Always follow your health worker's guidance.
      </p>
    </div>
  );
}

function WeekRing({ week }: { week: number }) {
  const full = week >= 40;
  const capped = Math.min(week, 40);
  const r = 50;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - capped / 40);
  return (
    <div className="relative h-32 w-32 flex-none sm:h-36 sm:w-36">
      <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90">
        <circle cx="64" cy="64" r={r} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="10" />
        <circle cx="64" cy="64" r={r} fill="none" stroke="#e8ad74" strokeWidth="10"
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
        <span className={full ? "text-xl font-semibold" : "text-xl font-semibold"}>{full ? "Full term" : week}</span>
        <span className="text-[11px] uppercase tracking-wide text-white/70">{full ? "week 40+" : "of 40"}</span>
      </div>
    </div>
  );
}

function PulseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12h4l2-5 4 10 2-5h6" />
    </svg>
  );
}
function LeafIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 4 13c0-5 5-9 16-9 0 9-4 16-9 16z" />
      <path d="M8 16c2-4 5-6 9-7" />
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
function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 flex-none text-emerald-600" fill="none"
         stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
function WarnIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 flex-none text-red-500" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 9v4M12 17h.01M10.3 3.9 2 18a2 2 0 0 0 1.7 3h16.6a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
    </svg>
  );
}
function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s-7-5.2-7-11a7 7 0 1 1 14 0c0 5.8-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}