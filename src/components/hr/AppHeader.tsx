import { LogOut, RotateCcw, Users } from "lucide-react";
import { useHr } from "@/hooks/use-hr";
import { Btn } from "./primitives";

export function AppHeader({ onLogout }: { onLogout: () => void }) {
  const { user, resetDemoData } = useHr();
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-primary-foreground shadow-primary">
            <Users className="h-5 w-5" />
          </span>
          <span className="text-base font-extrabold tracking-tight text-foreground">PeopleCore HR</span>
        </div>
        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <span data-testid="user-badge" className="inline-flex rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary-soft-foreground sm:text-sm">
            Welcome, {user}
          </span>
          <Btn variant="outline" size="sm" data-testid="reset-data-btn" onClick={resetDemoData}>
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset Demo Data</span><span className="sr-only sm:hidden">Reset Demo Data</span>
          </Btn>
          <Btn variant="ghost" size="sm" data-testid="logout-button" onClick={onLogout}>
            <LogOut className="h-3.5 w-3.5" />
            <span>Logout</span>
          </Btn>
        </div>
      </div>
    </header>
  );
}
