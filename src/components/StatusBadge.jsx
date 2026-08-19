import React from "react";
import { STATUS_STYLES, STATUS_LABELS } from "@/lib/format";

export default function StatusBadge({ status }) {
  const cls = STATUS_STYLES[status] || "bg-muted text-muted-foreground border-border";
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cls}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {STATUS_LABELS[status] || status}
    </span>
  );
}