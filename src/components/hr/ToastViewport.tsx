import { CheckCircle2, Info, Trash2, X } from "lucide-react";
import { useHr } from "@/hooks/use-hr";
import { cn } from "@/lib/utils";

const icons = { success: CheckCircle2, info: Info, danger: Trash2 };
const tones = {
  success: "bg-success-soft text-success-foreground",
  info: "bg-primary-soft text-primary-soft-foreground",
  danger: "bg-destructive-soft text-destructive",
};

export function ToastViewport() {
  const { toast, dismissToast } = useHr();
  if (!toast) return null;
  const Icon = icons[toast.tone];
  return (
    <div className="pointer-events-none fixed right-4 top-20 z-50 flex w-[min(360px,calc(100vw-2rem))] flex-col gap-2">
      <div
        key={toast.id}
        role="status"
        aria-live="polite"
        data-testid="toast-notification"
        className="pointer-events-auto flex animate-toast-in items-center gap-3 rounded-xl border border-border bg-card p-3 pr-2 shadow-pop"
      >
        <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", tones[toast.tone])}>
          <Icon className="h-4 w-4" />
        </span>
        <p className="flex-1 text-sm font-medium text-foreground">{toast.message}</p>
        <button
          type="button"
          onClick={dismissToast}
          aria-label="Dismiss notification"
          className="rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
