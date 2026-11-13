// Pure HR domain logic: types, seed data, validation, filtering, sorting.
// Kept free of React and browser globals so it can be unit tested.

export const DEPARTMENTS = [
  "Engineering",
  "Quality Assurance",
  "Product",
  "Human Resources",
] as const;
export type Department = (typeof DEPARTMENTS)[number];

export const STATUSES = ["Active", "On Leave"] as const;
export type Status = (typeof STATUSES)[number];

export const ALL_DEPARTMENTS = "All Departments";

export const SORT_OPTIONS = [
  { value: "name-asc", label: "Name (A-Z)" },
  { value: "name-desc", label: "Name (Z-A)" },
  { value: "salary-asc", label: "Salary (Low to High)" },
  { value: "salary-desc", label: "Salary (High to Low)" },
] as const;
export type SortKey = (typeof SORT_OPTIONS)[number]["value"];

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  department: Department;
  salary: number;
  status: Status;
  avatar: string | null;
}

export const VALID_USERNAME = "Admin";
export const VALID_PASSWORD = "admin123";

export const STORAGE_KEYS = {
  session: "peoplecore.session",
  employees: "peoplecore.employees",
} as const;

export function checkCredentials(username: string, password: string): boolean {
  return username === VALID_USERNAME && password === VALID_PASSWORD;
}

export function makeEmail(firstName: string, lastName: string): string {
  const clean = (s: string) => s.trim().toLowerCase().replace(/[^a-z0-9]+/g, "");
  return `${clean(firstName)}.${clean(lastName)}@peoplecore.com`;
}

export function fullName(e: Pick<Employee, "firstName" | "lastName">): string {
  return `${e.firstName} ${e.lastName}`.trim();
}

function seed(
  id: string,
  firstName: string,
  lastName: string,
  role: string,
  department: Department,
  salary: number,
  status: Status,
): Employee {
  return { id, firstName, lastName, email: makeEmail(firstName, lastName), role, department, salary, status, avatar: null };
}

export function getSeedEmployees(): Employee[] {
  return [
    seed("EMP-101", "Sarah", "Jenkins", "Senior QA Engineer", "Quality Assurance", 95000, "Active"),
    seed("EMP-102", "Marcus", "Vance", "Frontend Architect", "Engineering", 130000, "Active"),
    seed("EMP-103", "Elena", "Rostova", "Product Manager", "Product", 115000, "Active"),
    seed("EMP-104", "David", "Chen", "HR Specialist", "Human Resources", 78000, "On Leave"),
  ];
}

export function formatSalary(amount: number): string {
  return `$${Math.round(amount).toLocaleString("en-US")}`;
}

export function filterEmployees(list: Employee[], search: string, department: string): Employee[] {
  const q = search.trim().toLowerCase();
  return list.filter((e) => {
    if (department !== ALL_DEPARTMENTS && e.department !== department) return false;
    if (!q) return true;
    return (
      fullName(e).toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q) ||
      e.id.toLowerCase().includes(q)
    );
  });
}

export function sortEmployees(list: Employee[], sort: SortKey): Employee[] {
  const copy = [...list];
  switch (sort) {
    case "name-asc":
      return copy.sort((a, b) => fullName(a).localeCompare(fullName(b)));
    case "name-desc":
      return copy.sort((a, b) => fullName(b).localeCompare(fullName(a)));
    case "salary-asc":
      return copy.sort((a, b) => a.salary - b.salary);
    case "salary-desc":
      return copy.sort((a, b) => b.salary - a.salary);
  }
}

export function countDepartments(list: Employee[]): number {
  return new Set(list.map((e) => e.department)).size;
}

export interface EmployeeFormValues {
  firstName: string;
  lastName: string;
  id: string;
  role: string;
  department: string;
  salary: string;
  status: string;
  avatar: string | null;
}

/**
 * Returns an error message, or null when valid.
 * `originalId` is the id being edited (null when creating) so it is not counted as a duplicate.
 */
export function validateEmployeeForm(
  values: EmployeeFormValues,
  existing: Employee[],
  originalId: string | null,
): string | null {
  const required: [keyof EmployeeFormValues, string][] = [
    ["firstName", "First Name"],
    ["lastName", "Last Name"],
    ["id", "Employee ID"],
    ["role", "Role"],
    ["department", "Department"],
    ["salary", "Annual Salary"],
    ["status", "Status"],
  ];
  const missing = required
    .filter(([key]) => String(values[key] ?? "").trim() === "")
    .map(([, label]) => label);
  if (missing.length > 0) {
    return `Please fill in all required fields: ${missing.join(", ")}`;
  }
  const salary = Number(values.salary);
  if (!Number.isFinite(salary) || salary <= 0) {
    return "Annual Salary must be a positive number";
  }
  const id = values.id.trim().toUpperCase();
  const duplicate = existing.some(
    (e) => e.id.toUpperCase() === id && e.id.toUpperCase() !== (originalId ?? "").toUpperCase(),
  );
  if (duplicate) {
    return `Employee ID ${values.id.trim()} already exists`;
  }
  return null;
}

export function formToEmployee(values: EmployeeFormValues): Employee {
  const firstName = values.firstName.trim();
  const lastName = values.lastName.trim();
  return {
    id: values.id.trim(),
    firstName,
    lastName,
    email: makeEmail(firstName, lastName),
    role: values.role.trim(),
    department: values.department as Department,
    salary: Number(values.salary),
    status: values.status as Status,
    avatar: values.avatar,
  };
}

export function initials(firstName: string, lastName: string): string {
  return `${firstName.trim().charAt(0)}${lastName.trim().charAt(0)}`.toUpperCase() || "?";
}

/** Initials placeholder rendered as an SVG data URL so the avatar is always an <img>. */
export function initialsAvatar(firstName: string, lastName: string): string {
  const text = initials(firstName, lastName);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><rect width="80" height="80" rx="40" fill="#e0e7ff"/><text x="50%" y="50%" dy=".35em" text-anchor="middle" font-family="Arial, sans-serif" font-size="30" font-weight="700" fill="#4338ca">${text}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
