import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { STORAGE_KEYS, VALID_USERNAME, checkCredentials, getSeedEmployees, type Employee } from "@/lib/hr";

interface Toast {
  id: number;
  message: string;
  tone: "success" | "info" | "danger";
}

interface HrContextValue {
  ready: boolean;
  user: string | null;
  employees: Employee[];
  toast: Toast | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  addEmployee: (e: Employee) => void;
  updateEmployee: (originalId: string, e: Employee) => void;
  deleteEmployee: (id: string) => void;
  resetDemoData: () => void;
  dismissToast: () => void;
}

const HrContext = createContext<HrContextValue | null>(null);

function readEmployees(): Employee[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.employees);
    if (!raw) return getSeedEmployees();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Employee[]) : getSeedEmployees();
  } catch {
    return getSeedEmployees();
  }
}

function writeEmployees(list: Employee[]) {
  try {
    window.localStorage.setItem(STORAGE_KEYS.employees, JSON.stringify(list));
  } catch (err) {
    console.warn("Could not persist employees", err);
  }
}

export function HrProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [toast, setToast] = useState<Toast | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const counter = useRef(0);

  useEffect(() => {
    setUser(window.localStorage.getItem(STORAGE_KEYS.session));
    const list = readEmployees();
    setEmployees(list);
    if (!window.localStorage.getItem(STORAGE_KEYS.employees)) writeEmployees(list);
    setReady(true);
  }, []);

  const showToast = useCallback((message: string, tone: Toast["tone"] = "success") => {
    if (timer.current) clearTimeout(timer.current);
    counter.current += 1;
    setToast({ id: counter.current, message, tone });
    timer.current = setTimeout(() => setToast(null), 4000);
  }, []);

  const dismissToast = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setToast(null);
  }, []);

  const commit = useCallback((updater: (prev: Employee[]) => Employee[]) => {
    setEmployees((prev) => {
      const next = updater(prev);
      writeEmployees(next);
      return next;
    });
  }, []);

  const value: HrContextValue = {
    ready,
    user,
    employees,
    toast,
    login: (username, password) => {
      if (!checkCredentials(username, password)) return false;
      window.localStorage.setItem(STORAGE_KEYS.session, VALID_USERNAME);
      setUser(VALID_USERNAME);
      return true;
    },
    logout: () => {
      window.localStorage.removeItem(STORAGE_KEYS.session);
      setUser(null);
      dismissToast();
    },
    addEmployee: (e) => {
      commit((prev) => [...prev, e]);
      showToast("Employee added successfully");
    },
    updateEmployee: (originalId, e) => {
      commit((prev) => prev.map((x) => (x.id === originalId ? e : x)));
      showToast("Employee updated");
    },
    deleteEmployee: (id) => {
      commit((prev) => prev.filter((x) => x.id !== id));
      showToast("Employee removed", "danger");
    },
    resetDemoData: () => {
      commit(() => getSeedEmployees());
      showToast("Demo data has been reset", "info");
    },
    dismissToast,
  };

  return <HrContext.Provider value={value}>{children}</HrContext.Provider>;
}

export function useHr() {
  const ctx = useContext(HrContext);
  if (!ctx) throw new Error("useHr must be used inside HrProvider");
  return ctx;
}
