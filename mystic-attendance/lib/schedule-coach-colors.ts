type CoachTone = {
  swatch: string;
  event: string;
};

const NAMED_COACH_TONES: Record<string, CoachTone> = {
  lloyd: {
    swatch: "bg-teal-500",
    event:
      "border-l-teal-500 bg-teal-400/20 text-foreground hover:bg-teal-400/25",
  },
  kiahmin: {
    swatch: "bg-sky-300",
    event:
      "border-l-sky-400 bg-sky-200/40 text-foreground hover:bg-sky-200/50",
  },
  mabel: {
    swatch: "bg-violet-600",
    event:
      "border-l-violet-600 bg-violet-500/15 text-foreground hover:bg-violet-500/20",
  },
  zaiyang: {
    swatch: "bg-amber-800",
    event:
      "border-l-amber-800 bg-amber-700/15 text-foreground hover:bg-amber-700/20",
  },
  jasmine: {
    swatch: "bg-pink-400",
    event:
      "border-l-pink-400 bg-pink-300/25 text-foreground hover:bg-pink-300/35",
  },
  seana: {
    swatch: "bg-orange-300",
    event:
      "border-l-orange-400 bg-orange-200/40 text-foreground hover:bg-orange-200/50",
  },
};

const FALLBACK_TONES: CoachTone[] = [
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
  {
    swatch: "bg-lime-600",
    event:
      "border-l-lime-600 bg-lime-500/15 text-foreground hover:bg-lime-500/20",
  },
  {
    swatch: "bg-fuchsia-600",
    event:
      "border-l-fuchsia-600 bg-fuchsia-500/15 text-foreground hover:bg-fuchsia-500/20",
  },
  {
    swatch: "bg-cyan-700",
    event:
      "border-l-cyan-700 bg-cyan-600/15 text-foreground hover:bg-cyan-600/20",
  },
  {
    swatch: "bg-rose-700",
    event:
      "border-l-rose-700 bg-rose-600/15 text-foreground hover:bg-rose-600/20",
  },
];

const UNASSIGNED_TONE: CoachTone = {
  swatch: "bg-muted-foreground/50",
  event:
    "border-l-muted-foreground/50 bg-muted text-muted-foreground hover:bg-muted/80",
};

function hashCoachId(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function firstNameKey(fullName: string | null | undefined) {
  const first = fullName?.trim().split(/\s+/)[0];
  return first?.toLowerCase() ?? "";
}

type CoachRef = { id: string; full_name: string };

function toneForCoach(
  coachId: string | null | undefined,
  coaches: CoachRef[]
): CoachTone {
  if (!coachId) return UNASSIGNED_TONE;

  const coach = coaches.find((item) => item.id === coachId);
  const named = NAMED_COACH_TONES[firstNameKey(coach?.full_name)];
  if (named) return named;

  return FALLBACK_TONES[hashCoachId(coachId) % FALLBACK_TONES.length];
}

export function coachEventTone(
  coachId: string | null | undefined,
  coaches: CoachRef[]
) {
  return toneForCoach(coachId, coaches).event;
}

export function coachSwatchClass(
  coachId: string | null | undefined,
  coaches: CoachRef[]
) {
  return toneForCoach(coachId, coaches).swatch;
}
