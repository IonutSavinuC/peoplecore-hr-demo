import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { AlertCircle, Lock, User, Users } from "lucide-react";
import { useHr } from "@/hooks/use-hr";
import { Btn } from "@/components/hr/primitives";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sign in — PeopleCore HR" },
      { name: "description", content: "Sign in to PeopleCore HR to manage your employee directory." },
      { property: "og:title", content: "Sign in — PeopleCore HR" },
      { property: "og:description", content: "Sign in to PeopleCore HR to manage your employee directory." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { ready, user, login } = useHr();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (ready && user) navigate({ to: "/dashboard", replace: true });
  }, [ready, user, navigate]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (login(username, password)) {
      setError(false);
      navigate({ to: "/dashboard" });
    } else {
      setError(true);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-panel p-12 text-primary-foreground lg:flex lg:flex-col">
        <div className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-foreground/15 ring-1 ring-primary-foreground/25">
            <Users className="h-5 w-5" />
          </span>
          <span className="text-lg font-extrabold tracking-tight">PeopleCore HR</span>
        </div>
        <div className="mt-auto max-w-md">
          <h2 className="text-4xl font-extrabold leading-tight tracking-tight">Every person on your team, in one clear place.</h2>
          <p className="mt-4 text-base text-primary-foreground/75">
            Search, update and organise employee records across Engineering, QA, Product and HR.
          </p>
        </div>
      </aside>

      <main className="flex items-center justify-center bg-background px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-primary-foreground">
              <Users className="h-5 w-5" />
            </span>
            <span className="text-base font-extrabold tracking-tight text-foreground">PeopleCore HR</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to your admin workspace.</p>

          <form data-testid="login-form" onSubmit={submit} noValidate className="mt-8 space-y-4 rounded-2xl border border-border bg-card p-6 shadow-card">
            {error && (
              <div role="alert" data-testid="login-error" className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive-soft px-3 py-2.5 text-sm font-medium text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                Invalid username or password
              </div>
            )}
            <div>
              <label htmlFor="username" className="mb-1.5 block text-sm font-semibold text-foreground">
                Username
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  data-testid="username-input"
                  className="field pl-9"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Admin"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-foreground">
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  data-testid="password-input"
                  className="field pl-9"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>
            <Btn type="submit" size="lg" data-testid="login-button" className="w-full">
              Sign In
            </Btn>
          </form>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Demo credentials: <span className="font-mono font-semibold text-secondary-foreground">Admin</span> /{" "}
            <span className="font-mono font-semibold text-secondary-foreground">admin123</span>
          </p>
        </div>
      </main>
    </div>
  );
}
