const COACH_TONES = [
  {
    swatch: "bg-primary",
    event:
      "border-l-primary bg-primary/15 text-foreground hover:bg-primary/20",
  },
  {
    swatch: "bg-chart-3",
    event:
      "border-l-chart-3 bg-chart-3/15 text-foreground hover:bg-chart-3/20",
  },
  {
    swatch: "bg-sky-600",
    event: "border-l-sky-600 bg-sky-500/15 text-foreground hover:bg-sky-500/20",
  },
  {
    swatch: "bg-violet-600",
    event:
      "border-l-violet-600 bg-violet-500/15 text-foreground hover:bg-violet-500/20",
  },
  {
    swatch: "bg-amber-600",
    event:
      "border-l-amber-600 bg-amber-500/15 text-foreground hover:bg-amber-500/20",
  },
  {
    swatch: "bg-rose-600",
    event:
      "border-l-rose-600 bg-rose-500/15 text-foreground hover:bg-rose-500/20",
  },
  {
    swatch: "bg-emerald-600",
    event:
      "border-l-emerald-600 bg-emerald-500/15 text-foreground hover:bg-emerald-500/20",
  },
  {
    swatch: "bg-indigo-600",
    event:
      "border-l-indigo-600 bg-indigo-500/15 text-foreground hover:bg-indigo-500/20",
  },
] as const;

const UNASSIGNED_TONE = {
  swatch: "bg-muted-foreground/50",
  event:
    "border-l-muted-foreground/50 bg-muted text-muted-foreground hover:bg-muted/80",
} as const;

function hashCoachId(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function coachToneIndex(
  coachId: string,
  coaches: { id: string }[]
) {
  const listed = coaches.findIndex((coach) => coach.id === coachId);
  if (listed >= 0) return listed % COACH_TONES.length;
  return hashCoachId(coachId) % COACH_TONES.length;
}

export function coachEventTone(
  coachId: string | null | undefined,
  coaches: { id: string }[]
) {
  if (!coachId) return UNASSIGNED_TONE.event;
  return COACH_TONES[coachToneIndex(coachId, coaches)].event;
}

export function coachSwatchClass(
  coachId: string | null | undefined,
  coaches: { id: string }[]
) {
  if (!coachId) return UNASSIGNED_TONE.swatch;
  return COACH_TONES[coachToneIndex(coachId, coaches)].swatch;
}
