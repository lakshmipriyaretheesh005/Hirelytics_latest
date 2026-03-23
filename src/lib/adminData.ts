import { companiesData, type CompanyData } from "@/data/companies";
import { placementDrives, type PlacementDrive } from "@/data/drives";
import { mockTests, type MockTest } from "@/data/mockTests";
import { studentNotifications, type StudentNotification } from "@/data/notifications";

export type StudentRecord = {
  id: string;
  name: string;
  email: string;
  branch: string;
  cgpa: number;
  progress: number;
  mockScore: number;
  profileCompletion: number;
};

const COMPANIES_KEY = "hirelytics:admin:companies";
const DRIVES_KEY = "hirelytics:admin:drives";
const MOCK_TESTS_KEY = "hirelytics:admin:mock-tests";
const NOTIFICATIONS_KEY = "hirelytics:admin:notifications";
const STUDENTS_KEY = "hirelytics:admin:students";

const defaultStudents: StudentRecord[] = [];

const isBrowser = typeof window !== "undefined";

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const readSeeded = <T,>(key: string, fallback: T): T => {
  if (!isBrowser) return clone(fallback);
  const raw = window.localStorage.getItem(key);
  if (!raw) {
    const seeded = clone(fallback);
    window.localStorage.setItem(key, JSON.stringify(seeded));
    return seeded;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    const seeded = clone(fallback);
    window.localStorage.setItem(key, JSON.stringify(seeded));
    return seeded;
  }
};

const writeSeeded = (key: string, value: unknown) => {
  if (!isBrowser) return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const getCompanies = () => readSeeded<CompanyData[]>(COMPANIES_KEY, companiesData);
export const saveCompanies = (value: CompanyData[]) => writeSeeded(COMPANIES_KEY, value);
export const upsertCompany = (company: CompanyData) => {
  const current = getCompanies();
  const next = current.some((item) => item.id === company.id)
    ? current.map((item) => (item.id === company.id ? company : item))
    : [...current, { ...company, id: company.id || slugify(company.name) }];
  saveCompanies(next);
  return next;
};
export const deleteCompany = (companyId: string) => {
  const next = getCompanies().filter((item) => item.id !== companyId);
  saveCompanies(next);
  return next;
};

export const getDrives = () => readSeeded<PlacementDrive[]>(DRIVES_KEY, placementDrives);
export const saveDrives = (value: PlacementDrive[]) => writeSeeded(DRIVES_KEY, value);
export const upsertDrive = (drive: PlacementDrive) => {
  const current = getDrives();
  const next = current.some((item) => item.id === drive.id)
    ? current.map((item) => (item.id === drive.id ? drive : item))
    : [...current, { ...drive, id: drive.id || slugify(`${drive.company}-${drive.role}`) }];
  saveDrives(next);
  return next;
};
export const deleteDrive = (driveId: string) => {
  const next = getDrives().filter((item) => item.id !== driveId);
  saveDrives(next);
  return next;
};

export const getManagedMockTests = () => readSeeded<MockTest[]>(MOCK_TESTS_KEY, mockTests);
export const saveManagedMockTests = (value: MockTest[]) => writeSeeded(MOCK_TESTS_KEY, value);
export const upsertMockTest = (test: MockTest) => {
  const current = getManagedMockTests();
  const normalized = { ...test, id: test.id || slugify(`${test.company}-${test.title}`) };
  const remaining = current.filter((item) => item.id !== normalized.id);
  const next = [normalized, ...remaining];
  saveManagedMockTests(next);
  return next;
};
export const deleteMockTest = (testId: string) => {
  const next = getManagedMockTests().filter((item) => item.id !== testId);
  saveManagedMockTests(next);
  return next;
};

export const getManagedNotifications = () =>
  readSeeded<StudentNotification[]>(NOTIFICATIONS_KEY, studentNotifications);
export const saveManagedNotifications = (value: StudentNotification[]) => writeSeeded(NOTIFICATIONS_KEY, value);
export const upsertNotification = (notification: StudentNotification) => {
  const current = getManagedNotifications();
  const next = current.some((item) => item.id === notification.id)
    ? current.map((item) => (item.id === notification.id ? notification : item))
    : [...current, { ...notification, id: notification.id || slugify(notification.title) }];
  saveManagedNotifications(next);
  return next;
};
export const deleteNotification = (notificationId: string) => {
  const next = getManagedNotifications().filter((item) => item.id !== notificationId);
  saveManagedNotifications(next);
  return next;
};

export const getStudentRecords = () => readSeeded<StudentRecord[]>(STUDENTS_KEY, defaultStudents);
