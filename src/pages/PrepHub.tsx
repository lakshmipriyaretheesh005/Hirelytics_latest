import { useEffect, useMemo, useState } from "react";
import StudentHeader from "@/components/dashboard/StudentHeader";
import { prepQuestions, type QuestionCategory, type Difficulty } from "@/data/prepQuestions";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Search, Code, MessageSquare, Calculator, ChevronDown, ChevronUp, Lightbulb } from "lucide-react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { useSearchParams } from "react-router-dom";
import { getContributions } from "@/lib/contributions";
import { getCompanies } from "@/lib/adminData";
import { getCanonicalCompanyLabel } from "@/lib/companyLabels";

const categoryConfig: Record<QuestionCategory, { label: string; icon: React.ReactNode }> = {
  aptitude: { label: "Aptitude", icon: <Calculator className="w-4 h-4" /> },
  coding: { label: "Coding", icon: <Code className="w-4 h-4" /> },
  interview: { label: "Interview", icon: <MessageSquare className="w-4 h-4" /> },
};

const difficultyColor: Record<Difficulty, string> = {
  Easy: "bg-green-100 text-green-700",
  Medium: "bg-amber-100 text-amber-700",
  Hard: "bg-red-100 text-red-700",
};

const PrepHub = () => {
  const [searchParams] = useSearchParams();
  const [contributionVersion, setContributionVersion] = useState(0);
  const companyOptions = useMemo(() => {
    const baseCompanies = prepQuestions.map((question) => question.company);
    const contributedCompanies = getContributions()
      .filter((item) => item.status === "approved" && item.type === "question" && item.questionData)
      .map((item) => getCanonicalCompanyLabel(item.company));
    const managedCompanies = getCompanies().map((company) => getCanonicalCompanyLabel(company.name));

    return ["All", ...Array.from(new Set([...baseCompanies, ...contributedCompanies, ...managedCompanies]))];
  }, [contributionVersion]);
  const initialCompany = companyOptions.includes(searchParams.get("company") ?? "")
    ? (searchParams.get("company") as string)
    : "All";
  const initialCategory = (["aptitude", "coding", "interview"] as QuestionCategory[]).includes(
    (searchParams.get("category") as QuestionCategory) ?? "aptitude"
  )
    ? (searchParams.get("category") as QuestionCategory)
    : "aptitude";
  const [search, setSearch] = useState("");
  const [company, setCompany] = useState(initialCompany);
  const [difficulty, setDifficulty] = useState("All");
  const [category, setCategory] = useState<QuestionCategory>(initialCategory);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { ref, isVisible } = useScrollReveal(0.05);

  useEffect(() => {
    const companyParam = searchParams.get("company");
    const categoryParam = searchParams.get("category");

    if (companyParam && companyOptions.includes(companyParam)) {
      setCompany(companyParam);
    }

    if (categoryParam && (["aptitude", "coding", "interview"] as QuestionCategory[]).includes(categoryParam as QuestionCategory)) {
      setCategory(categoryParam as QuestionCategory);
    }
  }, [searchParams]);

  useEffect(() => {
    const handleContributionsUpdated = () => {
      setContributionVersion((current) => current + 1);
    };

    window.addEventListener("hirelytics:contributions-updated", handleContributionsUpdated);
    window.addEventListener("storage", handleContributionsUpdated);

    return () => {
      window.removeEventListener("hirelytics:contributions-updated", handleContributionsUpdated);
      window.removeEventListener("storage", handleContributionsUpdated);
    };
  }, []);

  const filtered = useMemo(() => {
    const approvedQuestions = getContributions()
      .filter((item) => item.status === "approved" && item.type === "question" && item.questionData)
      .map((item) => ({
        id: item.id,
        company: getCanonicalCompanyLabel(item.company),
        category: item.questionData!.category,
        difficulty: "Medium" as Difficulty,
        question: item.questionData!.question,
        answer: item.questionData!.answer,
        tags: item.questionData!.tags,
      }));

    return [...prepQuestions, ...approvedQuestions].filter((q) => {
      if (q.category !== category) return false;
      if (company !== "All" && q.company !== company) return false;
      if (difficulty !== "All" && q.difficulty !== difficulty) return false;
      if (search) {
        const s = search.toLowerCase();
        if (
          !q.question.toLowerCase().includes(s) &&
          !q.tags.some((t) => t.toLowerCase().includes(s))
        )
          return false;
      }
      return true;
    });
  }, [search, company, difficulty, category, contributionVersion]);

  const counts = useMemo(() => {
    const approvedQuestions = getContributions()
      .filter((item) => item.status === "approved" && item.type === "question" && item.questionData)
      .map((item) => ({
        id: item.id,
        company: getCanonicalCompanyLabel(item.company),
        category: item.questionData!.category,
        difficulty: "Medium" as Difficulty,
        question: item.questionData!.question,
        answer: item.questionData!.answer,
        tags: item.questionData!.tags,
      }));
    const base = [...prepQuestions, ...approvedQuestions].filter((q) => {
      if (company !== "All" && q.company !== company) return false;
      if (difficulty !== "All" && q.difficulty !== difficulty) return false;
      return true;
    });
    return {
      aptitude: base.filter((q) => q.category === "aptitude").length,
      coding: base.filter((q) => q.category === "coding").length,
      interview: base.filter((q) => q.category === "interview").length,
    };
  }, [company, difficulty, contributionVersion]);

  return (
    <div className="min-h-screen bg-background">
      <StudentHeader />
      <main className="container mx-auto section-padding py-8 max-w-4xl">
        <div className="mb-8" ref={ref}>
          <div className={`${isVisible ? "animate-fade-up" : "opacity-0"}`}>
            <h1 className="font-display font-bold text-2xl text-foreground mb-1">Preparation Hub</h1>
            <p className="text-muted-foreground">
              Company-specific practice questions to sharpen your skills.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search questions or tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10"
            />
          </div>
          <Select value={company} onValueChange={setCompany}>
            <SelectTrigger className="w-[140px] h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {companyOptions.map((c) => (
                <SelectItem key={c} value={c}>{c === "All" ? "All Companies" : c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger className="w-[130px] h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Levels</SelectItem>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Category tabs */}
        <Tabs value={category} onValueChange={(value) => setCategory(value as QuestionCategory)} className="space-y-6">
          <TabsList className="bg-secondary/70 p-1 w-full sm:w-auto">
            {(Object.keys(categoryConfig) as QuestionCategory[]).map((cat) => (
              <TabsTrigger key={cat} value={cat} className="gap-1.5">
                {categoryConfig[cat].icon}
                {categoryConfig[cat].label}
                <span className="ml-1 text-xs tabular-nums text-muted-foreground">
                  ({counts[cat]})
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          {(Object.keys(categoryConfig) as QuestionCategory[]).map((cat) => (
            <TabsContent key={cat} value={cat}>
              {filtered.length === 0 ? (
                <div className="text-center py-16">
                  <BookOpen className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-muted-foreground">No questions match your filters.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filtered.map((q, idx) => {
                    const isOpen = expandedId === q.id;
                    return (
                      <div
                        key={q.id}
                        className="rounded-2xl border border-border bg-card overflow-hidden hover:shadow-sm transition-shadow"
                      >
                        <button
                          onClick={() => setExpandedId(isOpen ? null : q.id)}
                          className="w-full text-left p-5 flex items-start gap-4"
                        >
                          <span className="font-display font-bold text-sm text-muted-foreground tabular-nums mt-0.5 shrink-0 w-6">
                            {idx + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground leading-relaxed pr-4">
                              {q.question}
                            </p>
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${difficultyColor[q.difficulty]}`}>
                                {q.difficulty}
                              </span>
                              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                                {q.company}
                              </span>
                              {q.tags.map((t) => (
                                <span key={t} className="text-xs text-muted-foreground">
                                  #{t}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="shrink-0 text-muted-foreground mt-0.5">
                            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </div>
                        </button>

                        {isOpen && (q.answer || q.options || q.explanation) && (
                          <div className="px-5 pb-5 pt-0 ml-10 border-t border-border mt-0 pt-4">
                            {/* MCQ options */}
                            {q.options && (
                              <div className="space-y-2 mb-4">
                                {q.options.map((opt, i) => (
                                  <div
                                    key={i}
                                    className={`text-sm px-3 py-2 rounded-lg ${
                                      opt === q.answer
                                        ? "bg-primary/10 text-primary font-medium border border-primary/20"
                                        : "bg-secondary/50 text-foreground"
                                    }`}
                                  >
                                    {String.fromCharCode(65 + i)}. {opt}
                                    {opt === q.answer && " ✓"}
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Code answer */}
                            {q.answer && !q.options && (
                              <pre className="text-xs bg-foreground/5 rounded-xl p-4 overflow-x-auto mb-4 text-foreground font-mono leading-relaxed">
                                {q.answer}
                              </pre>
                            )}

                            {/* Explanation */}
                            {q.explanation && (
                              <div className="flex items-start gap-2 p-3 rounded-lg bg-accent/50">
                                <Lightbulb className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                <p className="text-xs text-foreground leading-relaxed">{q.explanation}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
};

export default PrepHub;
