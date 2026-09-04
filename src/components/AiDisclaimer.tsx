import { Info } from "lucide-react";

export function AiDisclaimer() {
  return (
    <p className="mt-4 flex items-start gap-2 rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
      <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
      <span>
        AI-generated content may contain errors. Review and edit all information before using
        or sharing it.
      </span>
    </p>
  );
}
