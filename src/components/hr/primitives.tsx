import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, useEffect, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export const btn = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground shadow-primary hover:bg-primary-hover",
        outline: "border border-input bg-card text-secondary-foreground hover:bg-secondary",
        ghost: "text-muted-foreground hover:bg-secondary hover:text-foreground",
        danger: "bg-destructive text-destructive-foreground hover:bg-destructive-hover",
        dangerGhost: "text-muted-foreground hover:bg-destructive-soft hover:text-destructive",
      },
      size: {
        sm: "h-8 px-3",
        md: "h-10 px-4",
        lg: "h-11 px-5",
        icon: "h-8 w-8",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof btn>;

export const Btn = forwardRef<HTMLButtonElement, BtnProps>(({ className, variant, size, type, ...props }, ref) => (
  <button ref={ref} type={type ?? "button"} className={cn(btn({ variant, size }), className)} {...props} />
));
Btn.displayName = "Btn";

export function FieldLabel({ htmlFor, children, optional }: { htmlFor: string; children: ReactNode; optional?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      {children}
      {optional ? <span className="ml-1 font-normal normal-case tracking-normal">(optional)</span> : <span className="ml-0.5 text-primary">*</span>}
    </label>
  );
}

export function Modal({
  testId,
  labelledBy,
  onClose,
  children,
  className,
}: {
  testId: string;
  labelledBy: string;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0 animate-fade-in bg-overlay backdrop-blur-[2px]" onClick={onClose} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        data-testid={testId}
        className={cn("relative z-10 w-full animate-modal-in rounded-2xl border border-border bg-card shadow-pop", className)}
      >
        {children}
      </div>
    </div>
  );
}
