import { useEffect, useMemo, useState } from "react";
import { Gift, MessageSquareShare, PenSquare, Send, Sparkles, Star } from "lucide-react";
import { toast } from "sonner";
import StudentHeader from "@/components/dashboard/StudentHeader";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { prepQuestions, type QuestionCategory } from "@/data/prepQuestions";
import {
  getContributions,
  getUserRewardPoints,
  saveContribution,
  type Contribution,
  type ContributionType,
} from "@/lib/contributions";

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

const contributionTypeConfig: Record<ContributionType, { label: string; points: number }> = {
  question: { label: "Add Question", points: 10 },
  experience: { label: "Share Experience", points: 20 },
};

const ContributePage = () => {
  const { user } = useAuth();
  const [type, setType] = useState<ContributionType>("question");
  const [company, setCompany] = useState(companies[0]);
  const [round, setRound] = useState(rounds[0]);
  const [questionCategory, setQuestionCategory] = useState<QuestionCategory>("aptitude");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [experienceTitle, setExperienceTitle] = useState("");
  const [experienceContent, setExperienceContent] = useState("");
  const [experienceRating, setExperienceRating] = useState(5);
  const [hoveredExperienceRating, setHoveredExperienceRating] = useState<number | null>(null);
  const [userPoints, setUserPoints] = useState(0);
  const [submissions, setSubmissions] = useState<Contribution[]>([]);

  useEffect(() => {
    setUserPoints(getUserRewardPoints(user?.id));
    setSubmissions(getContributions().filter((item) => item.userId === user?.id));
  }, [user]);

  const pendingCount = useMemo(
    () => submissions.filter((item) => item.status === "pending").length,
    [submissions]
  );
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
    const isQuestion = type === "question";

    if (isQuestion && (!question.trim() || !answer.trim() || selectedTags.length === 0)) {
      toast.error("Please fill in category, tags, question, and answer.");
      return;
    }

    if (!isQuestion && (!experienceTitle.trim() || !experienceContent.trim())) {
      toast.error("Please fill in title, rating, and experience details.");
      return;
    }

    const contribution: Contribution = {
      id: crypto.randomUUID(),
      userId: user.id,
      userName: user.user_metadata?.full_name || user.email || "Student",
      userEmail: user.email || "",
      type,
      company,
      round,
      title: isQuestion ? `${company} ${questionCategories.find((item) => item.value === questionCategory)?.label} Question` : experienceTitle.trim(),
      content: isQuestion ? question.trim() : experienceContent.trim(),
      questionData: isQuestion
        ? {
            category: questionCategory,
            tags: selectedTags,
            question: question.trim(),
            answer: answer.trim(),
          }
        : undefined,
      experienceData: !isQuestion
        ? {
            title: experienceTitle.trim(),
            experience: experienceContent.trim(),
            rating: experienceRating,
          }
        : undefined,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    saveContribution(contribution);
    setSubmissions(getContributions().filter((item) => item.userId === user.id));
    setSelectedTags([]);
    setCustomTag("");
    setQuestion("");
    setAnswer("");
    setExperienceTitle("");
    setExperienceContent("");
    setExperienceRating(5);
    setHoveredExperienceRating(null);
    toast.success("Submitted for admin approval.");
  };

  return (
    <div className="min-h-screen bg-background">
      <StudentHeader />
      <main className="container mx-auto section-padding py-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="font-display font-bold text-2xl text-foreground mb-1">Contribute</h1>
          <p className="text-muted-foreground">
            Add company questions or share interview experiences. Approved submissions earn reward points.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <div className="rounded-2xl border border-border bg-card p-5">
            <Gift className="w-5 h-5 text-primary mb-3" />
            <p className="font-display font-bold text-3xl text-foreground tabular-nums">{userPoints}</p>
            <p className="text-sm text-muted-foreground">Reward points earned</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <Send className="w-5 h-5 text-primary mb-3" />
            <p className="font-display font-bold text-3xl text-foreground tabular-nums">{submissions.length}</p>
            <p className="text-sm text-muted-foreground">Total submissions</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <Sparkles className="w-5 h-5 text-primary mb-3" />
            <p className="font-display font-bold text-3xl text-foreground tabular-nums">{pendingCount}</p>
            <p className="text-sm text-muted-foreground">Pending approval</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display font-semibold text-lg text-foreground mb-4">New Submission</h2>

            <div className="grid gap-4 sm:grid-cols-2 mb-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Contribution type</label>
                <Select value={type} onValueChange={(value) => setType(value as ContributionType)}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(contributionTypeConfig).map(([value, config]) => (
                      <SelectItem key={value} value={value}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Company</label>
                <Select value={company} onValueChange={setCompany}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mb-4">
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

            {type === "question" ? (
              <>
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
                    <Select
                      value=""
                      onValueChange={(value) => {
                        addTag(value);
                      }}
                    >
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
                    placeholder="Add the exact question so it can later be reviewed and integrated into Prep Hub."
                    className="min-h-[140px]"
                  />
                </div>

                <div className="mb-5">
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Answer</label>
                  <Textarea
                    value={answer}
                    onChange={(event) => setAnswer(event.target.value)}
                    placeholder="Add the answer or expected solution/explanation."
                    className="min-h-[140px]"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="mb-4">
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Experience title</label>
                  <Input
                    value={experienceTitle}
                    onChange={(event) => setExperienceTitle(event.target.value)}
                    placeholder="Example: My IBM technical interview experience"
                    className="h-10"
                  />
                </div>
                <div className="mb-4">
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Rating</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setExperienceRating(rating)}
                        onMouseEnter={() => setHoveredExperienceRating(rating)}
                        onMouseLeave={() => setHoveredExperienceRating(null)}
                        className="transition-transform hover:scale-110"
                        aria-label={`Rate ${rating} stars`}
                      >
                        <Star
                          className={`h-7 w-7 ${
                            rating <= (hoveredExperienceRating ?? experienceRating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground/30"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-muted-foreground">
                      {hoveredExperienceRating ?? experienceRating}/5
                    </span>
                  </div>
                </div>
                <div className="mb-5">
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Experience details</label>
                  <Textarea
                    value={experienceContent}
                    onChange={(event) => setExperienceContent(event.target.value)}
                    placeholder="Describe the round flow, difficulty, key questions, and what helped you clear it."
                    className="min-h-[180px]"
                  />
                </div>
              </>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl bg-secondary/50 p-4">
              <p className="text-sm text-muted-foreground">
                If approved, this {type === "question" ? "question" : "experience"} adds{" "}
                <span className="font-medium text-foreground">{contributionTypeConfig[type].points} points</span>.
              </p>
              <Button onClick={handleSubmit}>
                <Send className="w-4 h-4 mr-2" />
                Submit for approval
              </Button>
            </div>
          </section>

          <section className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-display font-semibold text-lg text-foreground mb-4">What You Can Share</h2>
              <div className="space-y-3">
                <div className="rounded-xl bg-secondary/40 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <PenSquare className="w-4 h-4 text-primary" />
                    <p className="font-medium text-foreground">Add Questions</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    MCQs, aptitude questions, coding prompts, or technical questions from a specific company round.
                  </p>
                </div>
                <div className="rounded-xl bg-secondary/40 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquareShare className="w-4 h-4 text-primary" />
                    <p className="font-medium text-foreground">Share Interview Experiences</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Round-by-round experience, difficulty level, common questions, and preparation tips for juniors.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-display font-semibold text-lg text-foreground mb-4">Your Recent Contributions</h2>
              {submissions.length === 0 ? (
                <p className="text-sm text-muted-foreground">No submissions yet.</p>
              ) : (
                <div className="space-y-3">
                  {submissions.slice(0, 5).map((item) => (
                    <div key={item.id} className="rounded-xl bg-secondary/40 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium text-foreground">{item.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {item.company} · {item.round}
                            {item.questionData ? ` · ${item.questionData.category}` : ""}
                            {item.experienceData ? ` · ${item.experienceData.rating}/5` : ""}
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            item.status === "approved"
                              ? "bg-green-100 text-green-700"
                              : item.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                      {item.status === "approved" && item.pointsAwarded ? (
                        <p className="mt-2 text-xs text-muted-foreground">+{item.pointsAwarded} points awarded</p>
                      ) : null}
                      {item.questionData?.tags?.length ? (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {item.questionData.tags.map((itemTag) => (
                            <span key={itemTag} className="rounded-full bg-secondary px-2.5 py-1 text-xs text-muted-foreground">
                              {itemTag}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ContributePage;
