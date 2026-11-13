import { describe, expect, it } from "vitest";
import {
  ALL_DEPARTMENTS,
  checkCredentials,
  countDepartments,
  filterEmployees,
  formatSalary,
  getSeedEmployees,
  sortEmployees,
  validateEmployeeForm,
  type EmployeeFormValues,
} from "./hr";

const base: EmployeeFormValues = {
  firstName: "Ana",
  lastName: "Pop",
  id: "EMP-105",
  role: "Engineer",
  department: "Engineering",
  salary: "90000",
  status: "Active",
  avatar: null,
};

describe("login", () => {
  it("accepts only Admin / admin123", () => {
    expect(checkCredentials("Admin", "admin123")).toBe(true);
    expect(checkCredentials("admin", "admin123")).toBe(false);
    expect(checkCredentials("Admin", "wrong")).toBe(false);
  });
});

describe("seed data", () => {
  it("has the 4 demo employees", () => {
    const seed = getSeedEmployees();
    expect(seed.map((e) => e.id)).toEqual(["EMP-101", "EMP-102", "EMP-103", "EMP-104"]);
    expect(seed[3]?.status).toBe("On Leave");
    expect(countDepartments(seed)).toBe(4);
  });
});

describe("salary format", () => {
  it("formats as $XX,XXX", () => {
    expect(formatSalary(95000)).toBe("$95,000");
    expect(formatSalary(130000)).toBe("$130,000");
  });
});

describe("search, filter and sort", () => {
  const seed = getSeedEmployees();
  it("searches by name, email and id", () => {
    expect(filterEmployees(seed, "sarah", ALL_DEPARTMENTS).map((e) => e.id)).toEqual(["EMP-101"]);
    expect(filterEmployees(seed, "marcus.vance@", ALL_DEPARTMENTS).map((e) => e.id)).toEqual(["EMP-102"]);
    expect(filterEmployees(seed, "emp-103", ALL_DEPARTMENTS).map((e) => e.id)).toEqual(["EMP-103"]);
    expect(filterEmployees(seed, "nobody", ALL_DEPARTMENTS)).toHaveLength(0);
  });
  it("filters by department", () => {
    expect(filterEmployees(seed, "", "Product").map((e) => e.id)).toEqual(["EMP-103"]);
  });
  it("sorts by name and salary", () => {
    expect(sortEmployees(seed, "name-asc")[0]?.id).toBe("EMP-104");
    expect(sortEmployees(seed, "name-desc")[0]?.id).toBe("EMP-101");
    expect(sortEmployees(seed, "salary-asc")[0]?.salary).toBe(78000);
    expect(sortEmployees(seed, "salary-desc")[0]?.salary).toBe(130000);
  });
});

describe("employee form validation", () => {
  const seed = getSeedEmployees();
  it("rejects empty required fields", () => {
    expect(validateEmployeeForm({ ...base, role: "" }, seed, null)).toMatch(/required/);
  });
  it("rejects a duplicate ID on creation", () => {
    expect(validateEmployeeForm({ ...base, id: "EMP-101" }, seed, null)).toMatch(/already exists/);
  });
  it("allows keeping the same ID when editing", () => {
    expect(validateEmployeeForm({ ...base, id: "EMP-101" }, seed, "EMP-101")).toBeNull();
  });
  it("accepts a valid new employee", () => {
    expect(validateEmployeeForm(base, seed, null)).toBeNull();
  });
});
