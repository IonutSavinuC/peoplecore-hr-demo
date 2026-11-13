import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Building2, Search, UserCheck, Users } from "lucide-react";
import { useHr } from "@/hooks/use-hr";
import {
  ALL_DEPARTMENTS,
  DEPARTMENTS,
  SORT_OPTIONS,
  countDepartments,
  filterEmployees,
  sortEmployees,
  type Employee,
  type SortKey,
} from "@/lib/hr";
import { AppHeader } from "@/components/hr/AppHeader";
import { EmployeeTable } from "@/components/hr/EmployeeTable";
import { EmployeeModal } from "@/components/hr/EmployeeModal";
import { DeleteModal } from "@/components/hr/DeleteModal";
import { Btn } from "@/components/hr/primitives";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Employee Directory — PeopleCore HR" },
      { name: "description", content: "Browse, search, add and edit employees in the PeopleCore HR directory." },
      { property: "og:title", content: "Employee Directory — PeopleCore HR" },
      { property: "og:description", content: "Browse, search, add and edit employees in the PeopleCore HR directory." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

type ModalState = { kind: "none" } | { kind: "add" } | { kind: "edit"; employee: Employee } | { kind: "delete"; employee: Employee };

function Dashboard() {
  const hr = useHr();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState<string>(ALL_DEPARTMENTS);
  const [sort, setSort] = useState<SortKey>("name-asc");
  const [modal, setModal] = useState<ModalState>({ kind: "none" });

  useEffect(() => {
    if (hr.ready && !hr.user) navigate({ to: "/", replace: true });
  }, [hr.ready, hr.user, navigate]);

  const rows = useMemo(
    () => sortEmployees(filterEmployees(hr.employees, search, department), sort),
    [hr.employees, search, department, sort],
  );
  const activeCount = hr.employees.filter((e) => e.status === "Active").length;

  if (!hr.ready || !hr.user) {
    return <div className="min-h-screen bg-background" aria-busy="true" />;
  }

  const close = () => setModal({ kind: "none" });

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        onLogout={() => {
          hr.logout();
          navigate({ to: "/", replace: true });
        }}
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Employee Directory</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage people records across every department.</p>
        </div>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Kpi icon={Users} label="Total Employees" value={hr.employees.length} testId="kpi-total-employees" />
          <Kpi icon={Building2} label="Active Departments" value={countDepartments(hr.employees)} testId="kpi-departments" />
          <Kpi icon={UserCheck} label="Currently Active" value={activeCount} testId="kpi-active-employees" />
        </section>

        <section className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-card">
          <div className="flex flex-col gap-3 border-b border-border p-4 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                aria-label="Search employees"
                data-testid="search-input"
                className="field pl-9"
                placeholder="Search by name, email or employee ID"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <select
                aria-label="Filter by department"
                data-testid="department-filter"
                className="field sm:w-52"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                <option value={ALL_DEPARTMENTS}>{ALL_DEPARTMENTS}</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <select
                aria-label="Sort employees"
                data-testid="sort-select"
                className="field sm:w-52"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <Btn data-testid="add-employee-btn" onClick={() => setModal({ kind: "add" })}>
                + Add Employee
              </Btn>
            </div>
          </div>

          <EmployeeTable
            employees={rows}
            onEdit={(employee) => setModal({ kind: "edit", employee })}
            onDelete={(employee) => setModal({ kind: "delete", employee })}
          />

          <div className="border-t border-border px-4 py-3 text-xs text-muted-foreground">
            Showing {rows.length} of {hr.employees.length} employees
          </div>
        </section>
      </main>

      {(modal.kind === "add" || modal.kind === "edit") && (
        <EmployeeModal
          key={modal.kind === "edit" ? modal.employee.id : "new"}
          employee={modal.kind === "edit" ? modal.employee : null}
          employees={hr.employees}
          onClose={close}
          onSave={(employee, originalId) => {
            if (originalId) hr.updateEmployee(originalId, employee);
            else hr.addEmployee(employee);
            close();
          }}
        />
      )}

      {modal.kind === "delete" && (
        <DeleteModal
          employee={modal.employee}
          onCancel={close}
          onConfirm={() => {
            hr.deleteEmployee(modal.employee.id);
            close();
          }}
        />
      )}
    </div>
  );
}

function Kpi({ icon: Icon, label, value, testId }: { icon: typeof Users; label: string; value: number; testId: string }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-card">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
        <p data-testid={testId} className="mt-0.5 text-2xl font-extrabold tabular-nums text-foreground">
          {value}
        </p>
      </div>
    </div>
  );
}
