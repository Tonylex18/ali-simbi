export type Track = "corper" | "seeker" | "company";

/** What we remember from sign-up (mock). Replace with your real session. */
export type MockSession = {
  name: string;
  identifier: string;
  side: "seeker" | "company";
  corper: boolean;
  company?: string;
};

/** A saved answer: the raw value plus the text shown in the chat and the side panel. */
export type Answer = { value: unknown; label: string; skipped?: boolean };
export type Answers = Record<string, Answer | undefined>;

export type Progress = {
  answers: Record<string, Answer>;
  /** Introductions the person asked for on the results screen. */
  requested: string[];
};

export type Option = { label: string; value: string; hint?: string };

export type Ctx = { first: string; company: string; answers: Answers };

export type Currency = "NGN" | "USD" | "GBP" | "EUR";

export type InputSpec =
  | {
      kind: "text";
      placeholder: string;
      suggestions?: string[];
      validate?: (v: string) => string | null;
      transform?: (v: string) => string;
      autoCapitalize?: "none" | "words" | "characters";
    }
  | { kind: "single"; options: Option[] }
  | { kind: "multi"; options: Option[]; min?: number; max?: number; customLabel?: string; cta?: string }
  | { kind: "stateLga"; stateLabel: string }
  | { kind: "money"; currencies: Currency[]; suggestions: Record<Currency, number[]>; unit: string; notSure?: string }
  | { kind: "stepper"; min: number; max: number; initial: number; unit: string }
  | { kind: "file"; accept: string; title: string; hint: string; stages: string[] };

/** A message from the agent: plain text, or a small widget shown in the thread. */
export type WidgetKey = "cv-score";
export type Msg = string | { widget: WidgetKey };

export type Step = {
  id: string;
  /** Label for the "What Ali knows about you" panel. */
  fact?: string;
  ask: (c: Ctx) => string[];
  /** A short reply to the answer, said at the start of the next step. */
  ack?: (a: Answer, c: Ctx) => string | null;
  /** A widget shown after the ack when the answer is not skipped. */
  widget?: WidgetKey;
  input: InputSpec | ((c: Ctx) => InputSpec);
  /** Label for the skip button; omit when the step is required. */
  skip?: string;
  when?: (a: Answers) => boolean;
};
