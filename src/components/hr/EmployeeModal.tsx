import { useState, type ChangeEvent, type FormEvent } from "react";
import { ImagePlus, X } from "lucide-react";
import {
  DEPARTMENTS,
  STATUSES,
  formToEmployee,
  initialsAvatar,
  validateEmployeeForm,
  type Employee,
  type EmployeeFormValues,
} from "@/lib/hr";
import { Btn, FieldLabel, Modal } from "./primitives";

const empty: EmployeeFormValues = {
  firstName: "",
  lastName: "",
  id: "",
  role: "",
  department: "",
  salary: "",
  status: "Active",
  avatar: null,
};

function toForm(e: Employee): EmployeeFormValues {
  return {
    firstName: e.firstName,
    lastName: e.lastName,
    id: e.id,
    role: e.role,
    department: e.department,
    salary: String(e.salary),
    status: e.status,
    avatar: e.avatar,
  };
}

/** Reads the file as a Data URL, then shrinks it so it fits comfortably in localStorage. */
function readAvatar(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const dataUrl = String(reader.result);
      const img = new Image();
      img.onload = () => {
        try {
          const size = 160;
          const canvas = document.createElement("canvas");
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext("2d");
          if (!ctx) return resolve(dataUrl);
          const side = Math.min(img.width, img.height);
          ctx.drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size);
          resolve(canvas.toDataURL("image/jpeg", 0.85));
        } catch {
          resolve(dataUrl);
        }
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  });
}

export function EmployeeModal({
  employee,
  employees,
  onClose,
  onSave,
}: {
  employee: Employee | null;
  employees: Employee[];
  onClose: () => void;
  onSave: (employee: Employee, originalId: string | null) => void;
}) {
  const isEdit = employee !== null;
  const [values, setValues] = useState<EmployeeFormValues>(() => (employee ? toForm(employee) : empty));
  const [error, setError] = useState<string | null>(null);

  const set = (key: keyof EmployeeFormValues) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  const onAvatar = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Profile avatar must be an image file");
      return;
    }
    const avatar = await readAvatar(file);
    setValues((v) => ({ ...v, avatar }));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const message = validateEmployeeForm(values, employees, employee?.id ?? null);
    if (message) {
      setError(message);
      return;
    }
    onSave(formToEmployee(values), employee?.id ?? null);
  };

  const preview = values.avatar ?? initialsAvatar(values.firstName || "?", values.lastName);

  return (
    <Modal testId="employee-modal" labelledBy="employee-modal-title" onClose={onClose} className="max-w-xl">
      <form onSubmit={submit} noValidate>
        <div className="flex items-start justify-between border-b border-border px-6 py-5">
          <div>
            <h2 id="employee-modal-title" className="text-lg font-bold text-foreground">
              {isEdit ? "Edit Employee" : "Add Employee"}
            </h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {isEdit ? "Update this person's record." : "Create a new record in the directory."}
            </p>
          </div>
          <Btn variant="ghost" size="icon" onClick={onClose} aria-label="Close">
            <X className="h-4 w-4" />
          </Btn>
        </div>

        <div className="max-h-[65vh] space-y-5 overflow-y-auto px-6 py-5">
          <div className="flex items-center gap-4">
            <img
              src={preview}
              alt="Avatar preview"
              data-testid="avatar-preview"
              className="h-16 w-16 rounded-full border border-border object-cover"
            />
            <div className="flex-1">
              <FieldLabel htmlFor="avatar-upload" optional>
                Profile Avatar
              </FieldLabel>
              <label
                htmlFor="avatar-upload"
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-input px-3 py-2 text-sm font-medium text-secondary-foreground hover:border-primary hover:text-primary"
              >
                <ImagePlus className="h-4 w-4" />
                {values.avatar ? "Change photo" : "Upload photo"}
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                data-testid="avatar-upload"
                onChange={onAvatar}
                className="sr-only"
              />
              {values.avatar && (
                <button
                  type="button"
                  onClick={() => setValues((v) => ({ ...v, avatar: null }))}
                  className="ml-3 text-sm text-muted-foreground hover:text-destructive"
                >
                  Remove
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="first-name">First Name</FieldLabel>
              <input id="first-name" className="field" data-testid="first-name-input" value={values.firstName} onChange={set("firstName")} placeholder="Jane" />
            </div>
            <div>
              <FieldLabel htmlFor="last-name">Last Name</FieldLabel>
              <input id="last-name" className="field" data-testid="last-name-input" value={values.lastName} onChange={set("lastName")} placeholder="Doe" />
            </div>
            <div>
              <FieldLabel htmlFor="employee-id">Employee ID</FieldLabel>
              <input id="employee-id" className="field font-mono" data-testid="employee-id-input" value={values.id} onChange={set("id")} placeholder="EMP-105" />
            </div>
            <div>
              <FieldLabel htmlFor="role">Role</FieldLabel>
              <input id="role" className="field" data-testid="role-input" value={values.role} onChange={set("role")} placeholder="Software Engineer" />
            </div>
            <div>
              <FieldLabel htmlFor="department">Department</FieldLabel>
              <select id="department" className="field" data-testid="department-select" value={values.department} onChange={set("department")}>
                <option value="" disabled>
                  Select department
                </option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <FieldLabel htmlFor="salary">Annual Salary (USD)</FieldLabel>
              <input id="salary" type="number" min={0} step={1000} className="field" data-testid="salary-input" value={values.salary} onChange={set("salary")} placeholder="85000" />
            </div>
            <div className="sm:col-span-2">
              <FieldLabel htmlFor="status">Status</FieldLabel>
              <select id="status" className="field" data-testid="status-select" value={values.status} onChange={set("status")}>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div role="alert" data-testid="form-error" className="rounded-lg border border-destructive/30 bg-destructive-soft px-3 py-2 text-sm font-medium text-destructive">
              {error}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-border bg-background/60 px-6 py-4">
          <Btn variant="outline" data-testid="cancel-modal-btn" onClick={onClose}>
            Cancel
          </Btn>
          <Btn type="submit" data-testid="save-employee-btn">
            Save Employee
          </Btn>
        </div>
      </form>
    </Modal>
  );
}
