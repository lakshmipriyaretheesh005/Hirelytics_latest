import { useEffect, useState } from "react";
import { toast } from "sonner";
import AdminHeader from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { deleteCompany, getCompanies, upsertCompany } from "@/lib/adminData";
import type { CompanyData } from "@/data/companies";

const emptyCompany: CompanyData = {
  id: "",
  name: "",
  logo: "",
  sampleResume: "",
  status: "Upcoming",
  minCgpa: 6,
  packageLpa: 3,
  about: "",
  roles: [],
  interviewDate: "",
  skillsRequired: [],
  resources: [],
  selectionProcess: [],
  experiences: [],
};

const statusOptions: CompanyData["status"][] = ["Active", "Upcoming", "Closed"];

const toDateInputValue = (value: string) => {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toISOString().slice(0, 10);
};

const AdminCompaniesPage = () => {
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [form, setForm] = useState<CompanyData>(emptyCompany);
  const [rolesInput, setRolesInput] = useState("");
  const [skillsInput, setSkillsInput] = useState("");
  const [resourcesInput, setResourcesInput] = useState("");

  useEffect(() => {
    setCompanies(getCompanies());
  }, []);

  const loadForm = (company: CompanyData) => {
    setForm(company);
    setRolesInput(company.roles.join(", "));
    setSkillsInput(company.skillsRequired.join(", "));
    setResourcesInput(company.resources.join(", "));
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "image/png") {
      toast.error("Please upload a PNG logo.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm((current) => ({ ...current, logo: String(reader.result || "") }));
      toast.success("Logo uploaded.");
    };
    reader.readAsDataURL(file);
  };

  const updateSelectionStep = (index: number, field: "round" | "description", value: string) => {
    setForm((current) => ({
      ...current,
      selectionProcess: current.selectionProcess.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addSelectionStep = () => {
    setForm((current) => ({
      ...current,
      selectionProcess: [...current.selectionProcess, { round: "", description: "" }],
    }));
  };

  const removeSelectionStep = (index: number) => {
    setForm((current) => ({
      ...current,
      selectionProcess: current.selectionProcess.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const saveCompany = () => {
    if (!form.name.trim()) {
      toast.error("Company name is required.");
      return;
    }
    const payload: CompanyData = {
      ...form,
      logo: form.logo || form.name.slice(0, 3).toUpperCase(),
      roles: rolesInput.split(",").map((item) => item.trim()).filter(Boolean),
      skillsRequired: skillsInput.split(",").map((item) => item.trim()).filter(Boolean),
      resources: resourcesInput.split(",").map((item) => item.trim()).filter(Boolean),
      selectionProcess: form.selectionProcess
        .filter((item) => item.round.trim())
        .map((item) => ({
          round: item.round.trim(),
          description: item.description.trim(),
        })),
    };
    setCompanies(upsertCompany(payload));
    loadForm(emptyCompany);
    toast.success("Company saved.");
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <main className="container mx-auto section-padding py-8">
        <div className="mb-8">
          <h1 className="font-display font-bold text-2xl text-foreground mb-1">Companies Management</h1>
          <p className="text-muted-foreground">Add, edit, or remove companies and manage packages, CGPA, process, and resources.</p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[420px,1fr]">
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display font-semibold text-lg text-foreground mb-4">
              {form.id ? "Edit Company" : "Add Company"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Company name</label>
                <Input placeholder="Company name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Logo</label>
                  <label
                    htmlFor="company-logo-upload"
                    className="flex h-10 cursor-pointer items-center justify-center rounded-md border border-input bg-background px-3 text-sm text-foreground hover:bg-accent"
                  >
                    PNG
                  </label>
                  <Input
                    id="company-logo-upload"
                    type="file"
                    accept="image/png"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  {form.logo ? (
                    <div className="mt-3 flex items-center gap-3 rounded-xl border border-border bg-secondary/30 p-3">
                      {form.logo.startsWith("data:image") ? (
                        <img src={form.logo} alt={`${form.name || "Company"} logo`} className="h-10 w-10 rounded-lg object-contain bg-background" />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background text-xs font-semibold text-foreground">
                          {form.logo}
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {form.logo.startsWith("data:image") ? "PNG selected" : "Text logo"}
                      </p>
                    </div>
                  ) : null}
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Status</label>
                  <Select value={form.status} onValueChange={(value) => setForm({ ...form, status: value as CompanyData["status"] })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Package (LPA)</label>
                  <Input type="number" placeholder="Package LPA" value={form.packageLpa} onChange={(e) => setForm({ ...form, packageLpa: Number(e.target.value) })} />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Minimum CGPA</label>
                  <Input type="number" placeholder="Min CGPA" value={form.minCgpa} onChange={(e) => setForm({ ...form, minCgpa: Number(e.target.value) })} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Interview date</label>
                <Input type="date" value={toDateInputValue(form.interviewDate)} onChange={(e) => setForm({ ...form, interviewDate: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">About company</label>
                <Textarea placeholder="About company" value={form.about} onChange={(e) => setForm({ ...form, about: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Roles (comma-separated)</label>
                <Input placeholder="Roles (comma-separated)" value={rolesInput} onChange={(e) => setRolesInput(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Skills required (comma-separated)</label>
                <Input placeholder="Skills required (comma-separated)" value={skillsInput} onChange={(e) => setSkillsInput(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Resources (comma-separated)</label>
                <Input placeholder="Resources (comma-separated)" value={resourcesInput} onChange={(e) => setResourcesInput(e.target.value)} />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-foreground">Selection process</label>
                  <Button type="button" variant="outline" size="sm" onClick={addSelectionStep}>
                    Add Round
                  </Button>
                </div>
                <div className="space-y-3">
                  {form.selectionProcess.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No rounds added yet.</p>
                  ) : (
                    form.selectionProcess.map((step, index) => (
                      <div key={`${form.id || "new"}-${index}`} className="rounded-xl border border-border bg-secondary/20 p-3">
                        <div className="grid gap-3 md:grid-cols-[0.9fr,1.1fr,auto]">
                          <Input
                            placeholder="Round name"
                            value={step.round}
                            onChange={(e) => updateSelectionStep(index, "round", e.target.value)}
                          />
                          <Input
                            placeholder="Round description"
                            value={step.description}
                            onChange={(e) => updateSelectionStep(index, "description", e.target.value)}
                          />
                          <Button type="button" variant="outline" onClick={() => removeSelectionStep(index)}>
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                <Button onClick={saveCompany}>{form.id ? "Update Company" : "Add Company"}</Button>
                <Button variant="outline" onClick={() => loadForm(emptyCompany)}>Reset</Button>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            {companies.map((company) => (
              <div key={company.id} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <h3 className="font-display font-semibold text-foreground">{company.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      ₹{company.packageLpa} LPA · CGPA {company.minCgpa} · {company.status}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">Resources: {company.resources.join(", ") || "None"}</p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => loadForm({ ...company, interviewDate: toDateInputValue(company.interviewDate) })}>Edit</Button>
                    <Button variant="outline" onClick={() => { setCompanies(deleteCompany(company.id)); toast.success("Company deleted."); }}>Delete</Button>
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

export default AdminCompaniesPage;
