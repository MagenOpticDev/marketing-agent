import { cn } from "@/lib/utils/cn";
import { STATUS_LABELS, STATUS_COLORS } from "@/lib/utils/format";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        STATUS_COLORS[status] || "bg-slate-100 text-slate-700",
        className
      )}
    >
      {STATUS_LABELS[status] || status}
    </span>
  );
}
