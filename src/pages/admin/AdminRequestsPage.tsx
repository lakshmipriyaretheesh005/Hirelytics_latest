import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Star } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { prepQuestions, type QuestionCategory } from "@/data/prepQuestions";
import { getContributions, updateContributionStatus, type Contribution, type ContributionType } from "@/lib/contributions";

const companies = ["EY", "IBM", "Infosys", "TCS"];
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

type EditDraft = {
  type: ContributionType;
  company: string;
  round: string;
  questionCategory: QuestionCategory;
  selectedTags: string[];
  customTag: string;
  question: string;
  answer: string;
  experienceTitle: string;
  experienceContent: string;
  experienceRating: number;
};

const createDraft = (item: Contribution): EditDraft => ({
  type: item.type,
  company: item.company,
  round: item.round,
  questionCategory: item.questionData?.category ?? "aptitude",
  selectedTags: item.questionData?.tags ?? [],
  customTag: "",
  question: item.questionData?.question ?? "",
  answer: item.questionData?.answer ?? "",
  experienceTitle: item.experienceData?.title ?? item.title,
  experienceContent: item.experienceData?.experience ?? item.content,
  experienceRating: item.experienceData?.rating ?? 5,
});

const AdminRequestsPage = () => {
  const [requests, setRequests] = useState<Contribution[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<EditDraft | null>(null);
  const [hoveredExperienceRating, setHoveredExperienceRating] = useState<number | null>(null);

  useEffect(() => {
    setRequests(getContributions());
  }, []);

  const pending = requests.filter((item) => item.status === "pending");
  const tagOptions = useMemo(
    () =>
      Array.from(
        new Set(
          prepQuestions
            .filter((item) => item.category === (draft?.questionCategory ?? "aptitude"))
            .flatMap((item) => item.tags)
        )
      ).sort(),
    [draft?.questionCategory]
  );

  useEffect(() => {
    if (!draft || draft.type !== "question") return;
    setDraft((current) =>
      current
        ? {
            ...current,
            selectedTags: current.selectedTags.filter((item) => tagOptions.includes(item)),
          }
        : current
    );
  }, [tagOptions]);

  const persistRequests = (updated: Contribution[]) => {
    setRequests(updated);
    window.localStorage.setItem("hirelytics:contributions", JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("hirelytics:contributions-updated"));
  };

  const approve = (item: Contribution) => {
    const updated = updateContributionStatus(item.id, "approved", item.type === "question" ? 10 : 20);
    setRequests(updated);
    setEditingId(null);
    setDraft(null);
    setHoveredExperienceRating(null);
    toast.success("Request approved.");
  };

  const reject = (item: Contribution) => {
    const updated = updateContributionStatus(item.id, "rejected");
    setRequests(updated);
    setEditingId(null);
    setDraft(null);
    setHoveredExperienceRating(null);
    toast.success("Request rejected.");
  };

  const startEdit = (item: Contribution) => {
    setEditingId(item.id);
    setDraft(createDraft(item));
    setHoveredExperienceRating(null);
  };

  const addTag = (tag: string) => {
    const normalized = tag.trim();
    if (!normalized) return;
    setDraft((current) =>
      current
        ? {
            ...current,
            selectedTags: current.selectedTags.includes(normalized)
              ? current.selectedTags
              : [...current.selectedTags, normalized],
            customTag: "",
          }
        : current
    );
  };

  const removeTag = (tag: string) => {
    setDraft((current) =>
      current
        ? {
            ...current,
            selectedTags: current.selectedTags.filter((item) => item !== tag),
          }
        : current
    );
  };

  const saveEdit = (item: Contribution) => {
    if (!draft) return;

    if (draft.type === "question" && (!draft.question.trim() || !draft.answer.trim() || draft.selectedTags.length === 0)) {
      toast.error("Please fill in company, round, category, tags, question, and answer.");
      return;
    }

    if (draft.type === "experience" && (!draft.experienceTitle.trim() || !draft.experienceContent.trim())) {
      toast.error("Please fill in company, round, title, rating, and experience details.");
      return;
    }

    const updated = requests.map((request) =>
      request.id === item.id
        ? {
            ...request,
            type: draft.type,
            company: draft.company,
            round: draft.round,
            title:
              draft.type === "question"
                ? `${draft.company} ${questionCategories.find((entry) => entry.value === draft.questionCategory)?.label} Question`
                : draft.experienceTitle.trim(),
            content: draft.type === "question" ? draft.question.trim() : draft.experienceContent.trim(),
            questionData:
              draft.type === "question"
                ? {
                    category: draft.questionCategory,
                    tags: draft.selectedTags,
                    question: draft.question.trim(),
                    answer: draft.answer.trim(),
                  }
                : undefined,
            experienceData:
              draft.type === "experience"
                ? {
                    title: draft.experienceTitle.trim(),
                    experience: draft.experienceContent.trim(),
                    rating: draft.experienceRating,
                  }
                : undefined,
          }
        : request
    );

    persistRequests(updated);
    setEditingId(null);
    setDraft(null);
    setHoveredExperienceRating(null);
    toast.success("Submission updated.");
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <main className="container mx-auto section-padding py-8">
        <div className="mb-8">
          <h1 className="font-display font-bold text-2xl text-foreground mb-1">Requests</h1>
          <p className="text-muted-foreground">Review student contributions, edit full details, then approve or reject.</p>
        </div>

        <div className="space-y-4">
          {pending.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">No pending requests.</div>
          ) : (
            pending.map((item) => {
              const isEditing = editingId === item.id && draft;

              return (
                <div key={item.id} className="rounded-2xl border border-border bg-card p-6">
                  <div className="flex flex-col gap-4">
                    {!isEditing ? (
                      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground mb-2">{item.company} · {item.round} · {item.type}</p>
                          <h3 className="font-medium text-foreground">{item.title}</h3>
                          <p className="text-sm text-muted-foreground mt-2">{item.questionData ? item.questionData.question : item.content}</p>
                          {item.questionData ? <p className="text-sm text-muted-foreground mt-2">Answer: {item.questionData.answer}</p> : null}
                          {item.experienceData ? <p className="text-sm text-muted-foreground mt-2">Rating: {item.experienceData.rating}/5</p> : null}
                        </div>
                        <div className="flex gap-3 self-start">
                          <Button variant="outline" onClick={() => startEdit(item)}>Edit</Button>
                          <Button variant="outline" onClick={() => reject(item)}>Reject</Button>
                          <Button onClick={() => approve(item)}>Approve</Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <label className="text-sm font-medium text-foreground mb-1.5 block">Contribution type</label>
                            <Select value={draft.type} onValueChange={(value) => setDraft({ ...draft, type: value as ContributionType })}>
                              <SelectTrigger className="h-10">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="question">Add Question</SelectItem>
                                <SelectItem value="experience">Share Experience</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-foreground mb-1.5 block">Company</label>
                            <Select value={draft.company} onValueChange={(value) => setDraft({ ...draft, company: value })}>
                              <SelectTrigger className="h-10">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {companies.map((company) => (
                                  <SelectItem key={company} value={company}>
                                    {company}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-foreground mb-1.5 block">Round</label>
                          <Select value={draft.round} onValueChange={(value) => setDraft({ ...draft, round: value })}>
                            <SelectTrigger className="h-10">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {rounds.map((round) => (
                                <SelectItem key={round} value={round}>
                                  {round}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {draft.type === "question" ? (
                          <>
                            <div className="grid gap-4 sm:grid-cols-2">
                              <div>
                                <label className="text-sm font-medium text-foreground mb-1.5 block">Question category</label>
                                <Select value={draft.questionCategory} onValueChange={(value) => setDraft({ ...draft, questionCategory: value as QuestionCategory })}>
                                  <SelectTrigger className="h-10">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {questionCategories.map((category) => (
                                      <SelectItem key={category.value} value={category.value}>
                                        {category.label}
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
                                    {tagOptions.map((tag) => (
                                      <SelectItem key={tag} value={tag}>
                                        {tag}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            <div>
                              <label className="text-sm font-medium text-foreground mb-1.5 block">Custom tag</label>
                              <div className="flex gap-2">
                                <Input value={draft.customTag} onChange={(e) => setDraft({ ...draft, customTag: e.target.value })} placeholder="Add custom tag" className="h-10" />
                                <Button type="button" variant="outline" onClick={() => addTag(draft.customTag)}>Add</Button>
                              </div>
                            </div>

                            <div>
                              <label className="text-sm font-medium text-foreground mb-1.5 block">Selected tags</label>
                              {draft.selectedTags.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No tags selected yet.</p>
                              ) : (
                                <div className="flex flex-wrap gap-2">
                                  {draft.selectedTags.map((tag) => (
                                    <button
                                      key={tag}
                                      type="button"
                                      onClick={() => removeTag(tag)}
                                      className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                                    >
                                      {tag} x
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>

                            <div>
                              <label className="text-sm font-medium text-foreground mb-1.5 block">Question</label>
                              <Textarea value={draft.question} onChange={(e) => setDraft({ ...draft, question: e.target.value })} className="min-h-[140px]" />
                            </div>

                            <div>
                              <label className="text-sm font-medium text-foreground mb-1.5 block">Answer</label>
                              <Textarea value={draft.answer} onChange={(e) => setDraft({ ...draft, answer: e.target.value })} className="min-h-[140px]" />
                            </div>
                          </>
                        ) : (
                          <>
                            <div>
                              <label className="text-sm font-medium text-foreground mb-1.5 block">Experience title</label>
                              <Input value={draft.experienceTitle} onChange={(e) => setDraft({ ...draft, experienceTitle: e.target.value })} className="h-10" />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-foreground mb-1.5 block">Rating</label>
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((rating) => (
                                  <button
                                    key={rating}
                                    type="button"
                                    onClick={() => setDraft({ ...draft, experienceRating: rating })}
                                    onMouseEnter={() => setHoveredExperienceRating(rating)}
                                    onMouseLeave={() => setHoveredExperienceRating(null)}
                                    className="transition-transform hover:scale-110"
                                    aria-label={`Rate ${rating} stars`}
                                  >
                                    <Star
                                      className={`h-7 w-7 ${
                                        rating <= (hoveredExperienceRating ?? draft.experienceRating)
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "text-muted-foreground/30"
                                      }`}
                                    />
                                  </button>
                                ))}
                                <span className="ml-2 text-sm text-muted-foreground">
                                  {hoveredExperienceRating ?? draft.experienceRating}/5
                                </span>
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-foreground mb-1.5 block">Experience details</label>
                              <Textarea value={draft.experienceContent} onChange={(e) => setDraft({ ...draft, experienceContent: e.target.value })} className="min-h-[180px]" />
                            </div>
                          </>
                        )}

                        <div className="flex gap-3 self-start">
                          <Button variant="outline" onClick={() => { setEditingId(null); setDraft(null); }}>Cancel</Button>
                          <Button variant="outline" onClick={() => reject(item)}>Reject</Button>
                          <Button variant="outline" onClick={() => saveEdit(item)}>Save</Button>
                          <Button onClick={() => approve(item)}>Approve</Button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminRequestsPage;
