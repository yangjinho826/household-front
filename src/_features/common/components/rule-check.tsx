import { Check } from "lucide-react";
import { C } from "_styles/design-tokens";

export function RuleCheck({ ok, text }: { ok: boolean; text: string }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-4 h-4 rounded-full flex items-center justify-center"
        style={{ background: ok ? C.blue : C.borderStrong }}
      >
        <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
      </div>
      <span
        className="text-xs font-semibold"
        style={{ color: ok ? C.text : C.textMuted }}
      >
        {text}
      </span>
    </div>
  );
}
