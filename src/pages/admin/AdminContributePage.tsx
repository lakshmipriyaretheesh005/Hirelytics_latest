import { useEffect, useMemo, useState } from "react";
import { PenSquare, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";
import AdminHeader from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { prepQuestions, type QuestionCategory } from "@/data/prepQuestions";
import { getCompanies, upsertCompany } from "@/lib/adminData";
import { getContributions, saveContribution, type Contribution } from "@/lib/contributions";
import { getCanonicalCompanyLabel } from "@/lib/companyLabels";

const rounds = [
  "Online Assessment",
  "Aptitude Round",
  "Coding Round",
  "Technical Interview",
  "HR Interview",
  "Managerial Round",
  "Group Discussion",
];

const questionCategories: Array<{ value: QuestionCategory; label: string }> = [
  { value: "aptitude", label: "Aptitude" },
  { value: "coding", label: "Coding" },
  { value: "interview", label: "Interview" },
];

const AdminContributePage = () => {
  const { user } = useAuth();
  const companyOptions = useMemo(() => getCompanies().map((company) => company.name), []);
  const [company, setCompany] = useState(companyOptions[0] ?? "EY");
  const [round, setRound] = useState(rounds[0]);
  const [questionCategory, setQuestionCategory] = useState<QuestionCategory>("aptitude");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [entries, setEntries] = useState<Contribution[]>([]);
  const [resumeCompany, setResumeCompany] = useState(companyOptions[0] ?? "EY");
  const [sampleResumeName, setSampleResumeName] = useState("");
  const [sampleResumeData, setSampleResumeData] = useState("");

  useEffect(() => {
    setEntries(getContributions().filter((item) => item.userId === user?.id));
  }, [user]);

  useEffect(() => {
    if (companyOptions.length > 0 && !companyOptions.includes(company)) {
      setCompany(companyOptions[0]);
    }
  }, [company, companyOptions]);

  useEffect(() => {
    if (companyOptions.length > 0 && !companyOptions.includes(resumeCompany)) {
      setResumeCompany(companyOptions[0]);
    }
  }, [resumeCompany, companyOptions]);

  const tagOptions = useMemo(
    () =>
      Array.from(
        new Set(
          prepQuestions
            .filter((item) => item.category === questionCategory)
            .flatMap((item) => item.tags)
        )
      ).sort(),
    [questionCategory]
  );

  useEffect(() => {
    setSelectedTags((current) => current.filter((item) => tagOptions.includes(item)));
  }, [tagOptions]);

  const addTag = (tag: string) => {
    const normalized = tag.trim();
    if (!normalized) return;
    setSelectedTags((current) => (current.includes(normalized) ? current : [...current, normalized]));
  };

  const removeTag = (tag: string) => {
    setSelectedTags((current) => current.filter((item) => item !== tag));
  };

  const handleSubmit = () => {
    if (!user) return;

    if (!question.trim() || !answer.trim() || selectedTags.length === 0) {
      toast.error("Please fill in category, tags, question, and answer.");
      return;
    }

    const contribution: Contribution = {
      id: crypto.randomUUID(),
      userId: user.id,
      userName: user.user_metadata?.full_name || user.email || "Admin",
      userEmail: user.email || "",
      type: "question",
      company: getCanonicalCompanyLabel(company),
      round,
      title: `${getCanonicalCompanyLabel(company)} ${questionCategories.find((item) => item.value === questionCategory)?.label} Question`,
      content: question.trim(),
      questionData: {
        category: questionCategory,
        tags: selectedTags,
        question: question.trim(),
        answer: answer.trim(),
      },
      status: "approved",
      createdAt: new Date().toISOString(),
      approvedAt: new Date().toISOString(),
    };

    saveContribution(contribution);
    setEntries(getContributions().filter((item) => item.userId === user.id));
    setSelectedTags([]);
    setCustomTag("");
    setQuestion("");
    setAnswer("");
    toast.success("Resource added directly to the student view.");
  };

  const handleSampleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      toast.error("Please upload a PDF resume format.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSampleResumeData(String(reader.result || ""));
      setSampleResumeName(file.name);
      toast.success("PDF selected. Publish to save it for students.");
    };
    reader.readAsDataURL(file);
  };

  const publishSampleResume = () => {
    const selectedCompany = getCompanies().find((item) => item.name === resumeCompany);
    if (!selectedCompany) {
      toast.error("Select a valid company before publishing a resume format.");
      return;
    }

    if (!sampleResumeData) {
      toast.error("Choose a PDF file before publishing.");
      return;
    }

    upsertCompany({
      ...selectedCompany,
      sampleResume: sampleResumeData,
    });
    window.dispatchEvent(new CustomEvent("hirelytics:companies-updated"));
    toast.success(`Sample resume published for ${resumeCompany}.`);
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <main className="container mx-auto section-padding py-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="font-display font-bold text-2xl text-foreground mb-1">Add Resources</h1>
          <p className="text-muted-foreground">
            Add company-specific preparation resources directly. Admin entries go live immediately without request approval.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display font-semibold text-lg text-foreground mb-4">New Resource</h2>

            <div className="grid gap-4 sm:grid-cols-2 mb-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Company</label>
                <Select value={company} onValueChange={setCompany}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {companyOptions.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Round</label>
                <Select value={round} onValueChange={setRound}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {rounds.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 mb-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Question category</label>
                <Select value={questionCategory} onValueChange={(value) => setQuestionCategory(value as QuestionCategory)}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {questionCategories.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Add tags</label>
                <Select value="" onValueChange={addTag}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Choose one or more tags" />
                  </SelectTrigger>
                  <SelectContent>
                    {tagOptions.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mb-4">
              <label className="text-sm font-medium text-foreground mb-1.5 block">Custom tag</label>
              <div className="flex gap-2">
                <Input
                  value={customTag}
                  onChange={(event) => setCustomTag(event.target.value)}
                  placeholder="Add your own tag if needed"
                  className="h-10"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    addTag(customTag);
                    setCustomTag("");
                  }}
                >
                  Add
                </Button>
              </div>
            </div>

            <div className="mb-4">
              <label className="text-sm font-medium text-foreground mb-1.5 block">Selected tags</label>
              {selectedTags.length === 0 ? (
                <p className="text-sm text-muted-foreground">No tags selected yet.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {selectedTags.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => removeTag(item)}
                      className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                    >
                      {item} x
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="text-sm font-medium text-foreground mb-1.5 block">Question</label>
              <Textarea
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="Add the exact question."
                className="min-h-[140px]"
              />
            </div>

            <div className="mb-5">
              <label className="text-sm font-medium text-foreground mb-1.5 block">Answer</label>
              <Textarea
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                placeholder="Add the answer or explanation."
                className="min-h-[140px]"
              />
            </div>

            <div className="flex justify-end rounded-xl bg-secondary/50 p-4">
              <Button onClick={handleSubmit}>
                <Send className="w-4 h-4 mr-2" />
                Publish directly
              </Button>
            </div>
          </section>

          <section className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-display font-semibold text-lg text-foreground mb-4">Sample Resume PDF</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Upload a sample resume format for any company. Students can download it from AI Predictor.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Company</label>
                  <Select value={resumeCompany} onValueChange={setResumeCompany}>
                    <SelectTrigger className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {companyOptions.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <label
                    htmlFor="sample-resume-upload"
                    className="inline-flex h-10 cursor-pointer items-center justify-center rounded-md border border-input bg-background px-4 text-sm text-foreground hover:bg-accent"
                  >
                    Choose PDF
                  </label>
                  <Input
                    id="sample-resume-upload"
                    type="file"
                    accept="application/pdf,.pdf"
                    className="hidden"
                    onChange={handleSampleResumeUpload}
                  />
                  <span className="text-sm text-muted-foreground">
                    {sampleResumeName || "No PDF selected yet"}
                  </span>
                </div>
                <div className="flex justify-end">
                  <Button onClick={publishSampleResume}>
                    Publish Resume
                  </Button>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-display font-semibold text-lg text-foreground mb-4">What Goes Live</h2>
              <div className="space-y-3">
                <div className="rounded-xl bg-secondary/40 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <PenSquare className="w-4 h-4 text-primary" />
                    <p className="font-medium text-foreground">Prep Hub Questions</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Questions added here appear immediately in the student Preparation Hub for the selected company and category.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-display font-semibold text-lg text-foreground mb-4">Recent Direct Entries</h2>
              {entries.length === 0 ? (
                <p className="text-sm text-muted-foreground">No direct entries yet.</p>
              ) : (
                <div className="space-y-3">
                  {entries
                    .filter((item) => item.status === "approved")
                    .slice(0, 5)
                    .map((item) => (
                      <div key={item.id} className="rounded-xl bg-secondary/40 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-medium text-foreground">{item.title}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {item.company} · {item.round}
                              {item.questionData ? ` · ${item.questionData.category}` : ""}
                            </p>
                          </div>
                          <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                            live
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <p className="font-medium text-foreground">Admin Shortcut</p>
              </div>
              <p className="text-sm text-muted-foreground">
                This page bypasses the student request queue. Use it for verified content you want visible immediately.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminContributePage;
