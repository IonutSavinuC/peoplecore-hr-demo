import { Pencil, SearchX, Trash2 } from "lucide-react";
import { formatSalary, fullName, initialsAvatar, type Employee } from "@/lib/hr";
import { cn } from "@/lib/utils";
import { Btn } from "./primitives";

const head = "px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-muted-foreground";

export function EmployeeTable({
  employees,
  onEdit,
  onDelete,
}: {
  employees: Employee[];
  onEdit: (e: Employee) => void;
  onDelete: (e: Employee) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table data-testid="employee-table" className="w-full min-w-[880px] border-collapse">
        <thead className="border-b border-border bg-background">
          <tr>
            <th className={head}>Avatar</th>
            <th className={head}>Employee ID</th>
            <th className={head}>Full Name</th>
            <th className={head}>Role</th>
            <th className={head}>Department</th>
            <th className={cn(head, "text-right")}>Annual Salary</th>
            <th className={head}>Status</th>
            <th className={cn(head, "text-right")}>Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {employees.map((e) => (
            <tr key={e.id} data-testid="employee-row" data-employee-id={e.id} className="transition-colors hover:bg-background">
              <td className="px-4 py-3">
                <img
                  data-testid="row-avatar"
                  src={e.avatar ?? initialsAvatar(e.firstName, e.lastName)}
                  alt={`${fullName(e)} avatar`}
                  className="h-9 w-9 rounded-full border border-border object-cover"
                />
              </td>
              <td data-testid="row-id" className="px-4 py-3 font-mono text-xs font-medium text-muted-foreground">
                {e.id}
              </td>
              <td className="px-4 py-3">
                <span data-testid="row-name" className="block text-sm font-semibold text-foreground">
                  {fullName(e)}
                </span>
                <span className="block text-xs text-muted-foreground">{e.email}</span>
              </td>
              <td data-testid="row-role" className="px-4 py-3 text-sm text-secondary-foreground">
                {e.role}
              </td>
              <td data-testid="row-department" className="px-4 py-3 text-sm text-secondary-foreground">
                {e.department}
              </td>
              <td data-testid="row-salary" className="px-4 py-3 text-right text-sm font-semibold tabular-nums text-foreground">
                {formatSalary(e.salary)}
              </td>
              <td className="px-4 py-3">
                <span
                  data-testid="row-status"
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold",
                    e.status === "Active" ? "bg-success-soft text-success-foreground" : "bg-warning-soft text-warning-foreground",
                  )}
                >
                  <span className={cn("h-1.5 w-1.5 rounded-full", e.status === "Active" ? "bg-success" : "bg-warning")} />
                  {e.status}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-1">
                  <Btn variant="ghost" size="sm" data-testid="edit-employee-btn" onClick={() => onEdit(e)} aria-label={`Edit ${fullName(e)}`}>
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </Btn>
                  <Btn variant="dangerGhost" size="sm" data-testid="delete-employee-btn" onClick={() => onDelete(e)} aria-label={`Delete ${fullName(e)}`}>
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </Btn>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {employees.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-muted-foreground">
            <SearchX className="h-5 w-5" />
          </span>
          <p data-testid="empty-table-message" className="text-sm font-medium text-muted-foreground">
            No employees found matching your criteria
          </p>
        </div>
      )}
    </div>
  );
}
