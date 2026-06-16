// Pregnancy math + baby-size content, shared by the Dashboard and Guide.

const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

// Weeks along, from a due date (40 weeks = full term). Null if no date set.
export function weeksPregnant(dueDate: string | null | undefined): number | null {
  if (!dueDate) return null;
  const weeksToGo = (new Date(dueDate).getTime() - Date.now()) / MS_PER_WEEK;
  const week = Math.round(40 - weeksToGo);
  return Math.min(42, Math.max(0, week));
}

export function trimesterOf(week: number): 1 | 2 | 3 {
  return week <= 13 ? 1 : week <= 27 ? 2 : 3;
}

export type BabyInfo = { size: string; length: string; note: string };

// Reference points; we snap to the nearest one at or below the given week.
const TABLE: Record<number, BabyInfo> = {
  8: { size: "a raspberry", length: "~1.6 cm", note: "Tiny fingers and toes are starting to form." },
  12: { size: "a lime", length: "~5.4 cm", note: "Reflexes are developing — they can already curl their fingers." },
  16: { size: "an avocado", length: "~11.6 cm", note: "They can hear muffled sounds from outside the womb." },
  20: { size: "a banana", length: "~25 cm", note: "Halfway there. You may start to feel gentle kicks." },
  24: { size: "a corn cob", length: "~30 cm", note: "Their inner ear is formed, so they can hear your voice." },
  28: { size: "an eggplant", length: "~37 cm", note: "Eyes can open and close, and they sleep and wake in cycles." },
  32: { size: "a squash", length: "~42 cm", note: "Bones are hardening and they're practising breathing." },
  36: { size: "a honeydew melon", length: "~47 cm", note: "They're gaining fat and getting ready for birth." },
  40: { size: "a small pumpkin", length: "~51 cm", note: "Full term — your baby could arrive any day now." },
};

export function babyInfo(week: number): BabyInfo {
  const keys = Object.keys(TABLE).map(Number).sort((a, b) => a - b);
  let pick = keys[0];
  for (const k of keys) if (week >= k) pick = k;
  return TABLE[pick];
}