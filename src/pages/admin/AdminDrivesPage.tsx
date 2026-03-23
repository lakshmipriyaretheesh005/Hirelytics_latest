import { useEffect, useState } from "react";
import { toast } from "sonner";
import AdminHeader from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { deleteDrive, getCompanies, getDrives, upsertDrive } from "@/lib/adminData";
import type { PlacementDrive } from "@/data/drives";

const emptyDrive: PlacementDrive = {
  id: "",
  company: "",
  role: "",
  status: "Open",
  applicationDeadline: "",
  rounds: [],
};

const driveStatusOptions: PlacementDrive["status"][] = [
  "Open",
  "Application Closed",
  "Interview In Progress",
  "Results Awaited",
];

const toDateInputValue = (value: string) => {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toISOString().slice(0, 10);
};

const AdminDrivesPage = () => {
  const [drives, setDrives] = useState<PlacementDrive[]>([]);
  const [companyOptions, setCompanyOptions] = useState<string[]>([]);
  const [form, setForm] = useState<PlacementDrive>(emptyDrive);

  useEffect(() => {
    setDrives(getDrives());
    setCompanyOptions(getCompanies().map((item) => item.name.includes("(") ? item.name.split(" (")[0] : item.name));
  }, []);

  const addRound = () => {
    setForm((current) => ({
      ...current,
      rounds: [...current.rounds, { name: "", date: "" }],
    }));
  };

  const updateRound = (index: number, field: "name" | "date", value: string) => {
    setForm((current) => ({
      ...current,
      rounds: current.rounds.map((round, roundIndex) =>
        roundIndex === index ? { ...round, [field]: value } : round
      ),
    }));
  };

  const removeRound = (index: number) => {
    setForm((current) => ({
      ...current,
      rounds: current.rounds.filter((_, roundIndex) => roundIndex !== index),
    }));
  };

  const saveDrive = () => {
    if (!form.company.trim() || !form.role.trim()) {
      toast.error("Company and role are required.");
      return;
    }
    const payload = { ...form, rounds: form.rounds.filter((item) => item.name.trim() && item.date.trim()) };
    setDrives(upsertDrive(payload));
    setForm(emptyDrive);
    toast.success("Drive saved.");
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <main className="container mx-auto section-padding py-8">
        <div className="mb-8">
          <h1 className="font-display font-bold text-2xl text-foreground mb-1">Drives Management</h1>
          <p className="text-muted-foreground">Add or update drive details and round dates.</p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[420px,1fr]">
          <section className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Company</label>
              <Select value={form.company} onValueChange={(value) => setForm({ ...form, company: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select company" />
                </SelectTrigger>
                <SelectContent>
                  {companyOptions.map((company) => (
                    <SelectItem key={company} value={company}>
                      {company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Role</label>
              <Input placeholder="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Status</label>
              <Select value={form.status} onValueChange={(value) => setForm({ ...form, status: value as PlacementDrive["status"] })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {driveStatusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Application date</label>
              <Input
                type="date"
                value={toDateInputValue(form.applicationDeadline)}
                onChange={(e) => setForm({ ...form, applicationDeadline: e.target.value })}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-foreground">Rounds</label>
                <Button type="button" variant="outline" size="sm" onClick={addRound}>
                  Add Round
                </Button>
              </div>
              <div className="space-y-3">
                {form.rounds.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No rounds added yet.</p>
                ) : (
                  form.rounds.map((round, index) => (
                    <div key={`${form.id || "new"}-${index}`} className="rounded-xl border border-border bg-secondary/20 p-3">
                      <div className="grid gap-3 md:grid-cols-[1fr,1fr,auto]">
                        <Input
                          placeholder="Round name"
                          value={round.name}
                          onChange={(e) => updateRound(index, "name", e.target.value)}
                        />
                        <Input
                          type="date"
                          value={toDateInputValue(round.date)}
                          onChange={(e) => updateRound(index, "date", e.target.value)}
                        />
                        <Button type="button" variant="outline" onClick={() => removeRound(index)}>
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={saveDrive}>{form.id ? "Update Drive" : "Create Drive"}</Button>
              <Button variant="outline" onClick={() => setForm(emptyDrive)}>Reset</Button>
            </div>
          </section>

          <section className="space-y-4">
            {drives.map((drive) => (
              <div key={drive.id} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex flex-col gap-3 lg:flex-row lg:justify-between">
                  <div>
                    <h3 className="font-display font-semibold text-foreground">{drive.company}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{drive.role} · {drive.status}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {drive.rounds.map((item) => `${item.name}: ${item.date}`).join(" • ")}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setForm({
                      ...drive,
                      applicationDeadline: toDateInputValue(drive.applicationDeadline),
                      rounds: drive.rounds.map((item) => ({ ...item, date: toDateInputValue(item.date) })),
                    })}>Edit</Button>
                    <Button variant="outline" onClick={() => { setDrives(deleteDrive(drive.id)); toast.success("Drive deleted."); }}>Delete</Button>
                  </div>
                </div>
              </div>
            ))}
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminDrivesPage;
