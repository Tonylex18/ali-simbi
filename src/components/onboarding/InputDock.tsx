"use client";

import type { Answer, InputSpec } from "@/lib/onboarding/types";
import { MultiChoice, SingleChoice } from "./inputs/ChoiceInput";
import FileAnswer from "./inputs/FileAnswer";
import MoneyAnswer from "./inputs/MoneyAnswer";
import StateLgaAnswer from "./inputs/StateLgaAnswer";
import StepperAnswer from "./inputs/StepperAnswer";
import TextAnswer from "./inputs/TextAnswer";

type Props = {
  spec: InputSpec;
  onSubmit: (a: Answer) => void;
  skip?: string;
  onSkip: () => void;
  canGoBack: boolean;
  onBack: () => void;
};

/** The reply area under the chat: shows the right kind of input for the current question. */
export default function InputDock({ spec, onSubmit, skip, onSkip, canGoBack, onBack }: Props) {
  return (
    <div className="animate-rise flex flex-col gap-3">
      {spec.kind === "text" && <TextAnswer spec={spec} onSubmit={onSubmit} />}
      {spec.kind === "single" && <SingleChoice options={spec.options} onSubmit={onSubmit} />}
      {spec.kind === "multi" && <MultiChoice options={spec.options} min={spec.min} max={spec.max} customLabel={spec.customLabel} cta={spec.cta} onSubmit={onSubmit} />}
      {spec.kind === "stateLga" && <StateLgaAnswer stateLabel={spec.stateLabel} onSubmit={onSubmit} />}
      {spec.kind === "money" && <MoneyAnswer spec={spec} onSubmit={onSubmit} />}
      {spec.kind === "stepper" && <StepperAnswer spec={spec} onSubmit={onSubmit} />}
      {spec.kind === "file" && <FileAnswer spec={spec} onSubmit={onSubmit} />}

      {(skip || canGoBack) && (
        <div className="flex items-center justify-between gap-3 text-[15px]">
          {canGoBack ? (
            <button type="button" onClick={onBack} className="font-semibold text-muted underline-offset-4 hover:text-ink hover:underline">
              ← Change my last answer
            </button>
          ) : (
            <span />
          )}
          {skip && (
            <button type="button" onClick={onSkip} className="font-semibold text-leaf-800 underline-offset-4 hover:underline">
              {skip}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
