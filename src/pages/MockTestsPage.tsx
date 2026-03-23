import { useEffect, useMemo, useState } from "react";
import { BarChart3, BookOpenCheck, Building2, Clock3, RotateCcw } from "lucide-react";
import StudentHeader from "@/components/dashboard/StudentHeader";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import type { MockTest } from "@/data/mockTests";
import { getManagedMockTests } from "@/lib/adminData";

type AttemptRecord = {
  testId: string;
  company: string;
  score: number;
  totalQuestions: number;
  submittedAt: string;
};

const MockTestsPage = () => {
  const { user } = useAuth();
  const storageKey = user ? `hirelytics:mock-test-progress:${user.id}` : null;
  const [tests, setTests] = useState<MockTest[]>([]);

  const [selectedCompany, setSelectedCompany] = useState("All");
  const [activeTestId, setActiveTestId] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [attempts, setAttempts] = useState<AttemptRecord[]>([]);
  const [submittedResult, setSubmittedResult] = useState<AttemptRecord | null>(null);

  const loadReleasedTests = () => {
    const releasedTests = getManagedMockTests().filter((test) => test.released);
    setTests(releasedTests);
    setActiveTestId(releasedTests[0]?.id ?? "");
  };

  useEffect(() => {
    loadReleasedTests();

    const handleMockTestsUpdated = () => {
      loadReleasedTests();
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadReleasedTests();
      }
    };

    window.addEventListener("hirelytics:mock-tests-updated", handleMockTestsUpdated);
    window.addEventListener("storage", handleMockTestsUpdated);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("hirelytics:mock-tests-updated", handleMockTestsUpdated);
      window.removeEventListener("storage", handleMockTestsUpdated);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const companies = ["All", ...Array.from(new Set(tests.map((test) => test.company)))];

  useEffect(() => {
    if (!storageKey) return;

    const saved = localStorage.getItem(storageKey);
    if (!saved) {
      setAttempts([]);
      return;
    }

    try {
      setAttempts(JSON.parse(saved) as AttemptRecord[]);
    } catch {
      setAttempts([]);
    }
  }, [storageKey]);

  useEffect(() => {
    if (!storageKey) return;
    localStorage.setItem(storageKey, JSON.stringify(attempts));
  }, [attempts, storageKey]);

  const filteredTests = useMemo(() => {
    return selectedCompany === "All"
      ? tests
      : tests.filter((test) => test.company === selectedCompany);
  }, [selectedCompany, tests]);

  useEffect(() => {
    if (!filteredTests.some((test) => test.id === activeTestId)) {
      setActiveTestId(filteredTests[0]?.id ?? "");
      setAnswers({});
      setSubmittedResult(null);
    }
  }, [activeTestId, filteredTests]);

  const activeTest = filteredTests.find((test) => test.id === activeTestId) ?? filteredTests[0] ?? null;

  const overallProgress = useMemo(() => {
    if (attempts.length === 0) {
      return { testsTaken: 0, averageScore: 0, bestScore: 0 };
    }

    const percentages = attempts.map((attempt) => (attempt.score / attempt.totalQuestions) * 100);

    return {
      testsTaken: attempts.length,
      averageScore: Math.round(percentages.reduce((sum, percent) => sum + percent, 0) / attempts.length),
      bestScore: Math.round(Math.max(...percentages)),
    };
  }, [attempts]);

  const companyProgress = useMemo(() => {
    return filteredTests.map((test) => {
      const relevantAttempts = attempts.filter((attempt) => attempt.testId === test.id);
      const latestAttempt = relevantAttempts[0];
      const bestPercent = relevantAttempts.length
        ? Math.max(...relevantAttempts.map((attempt) => (attempt.score / attempt.totalQuestions) * 100))
        : 0;

      return {
        test,
        attemptCount: relevantAttempts.length,
        latestPercent: latestAttempt ? Math.round((latestAttempt.score / latestAttempt.totalQuestions) * 100) : 0,
        bestPercent: Math.round(bestPercent),
      };
    });
  }, [attempts, filteredTests]);

  const handleSelectTest = (testId: string) => {
    setActiveTestId(testId);
    setAnswers({});
    setSubmittedResult(null);
  };

  const handleSubmit = () => {
    if (!activeTest) return;

    const attempt: AttemptRecord = {
      testId: activeTest.id,
      company: activeTest.company,
      score: activeTest.questions.reduce((sum, question) => {
        return sum + (answers[question.id] === question.correctAnswer ? 1 : 0);
      }, 0),
      totalQuestions: activeTest.questions.length,
      submittedAt: new Date().toISOString(),
    };

    setAttempts((current) => [attempt, ...current]);
    setSubmittedResult(attempt);
  };

  const handleRetake = () => {
    setAnswers({});
    setSubmittedResult(null);
  };

  const unansweredCount = activeTest
    ? activeTest.questions.filter((question) => !answers[question.id]).length
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <StudentHeader />
      <main className="container mx-auto section-padding py-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between mb-8">
          <div>
            <h1 className="font-display font-bold text-2xl text-foreground mb-1">Mock Tests</h1>
            <p className="text-muted-foreground">
              Take company-wise aptitude and MCQ mock tests, submit instantly, and track your progress.
            </p>
          </div>
          <Select value={selectedCompany} onValueChange={setSelectedCompany}>
            <SelectTrigger className="w-full lg:w-[220px] h-10">
              <SelectValue placeholder="Filter by company" />
            </SelectTrigger>
            <SelectContent>
              {companies.map((company) => (
                <SelectItem key={company} value={company}>
                  {company === "All" ? "All Companies" : company}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <div className="rounded-2xl border border-border bg-card p-5">
            <BookOpenCheck className="w-5 h-5 text-primary mb-3" />
            <p className="font-display font-bold text-3xl text-foreground tabular-nums">{overallProgress.testsTaken}</p>
            <p className="text-sm text-muted-foreground">Mock tests taken</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <BarChart3 className="w-5 h-5 text-primary mb-3" />
            <p className="font-display font-bold text-3xl text-foreground tabular-nums">{overallProgress.averageScore}%</p>
            <p className="text-sm text-muted-foreground">Average score</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <Building2 className="w-5 h-5 text-primary mb-3" />
            <p className="font-display font-bold text-3xl text-foreground tabular-nums">{overallProgress.bestScore}%</p>
            <p className="text-sm text-muted-foreground">Best score</p>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[320px,1fr]">
          <aside className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-5">
              <h2 className="font-display font-semibold text-lg text-foreground mb-4">Available Tests</h2>
              <div className="space-y-3">
                {companyProgress.map(({ test, attemptCount, latestPercent, bestPercent }) => {
                  const isActive = test.id === activeTestId;

                  return (
                    <button
                      key={test.id}
                      onClick={() => handleSelectTest(test.id)}
                      className={`w-full text-left rounded-xl border px-4 py-4 transition-colors ${
                        isActive ? "border-primary bg-primary/5" : "border-border bg-secondary/40 hover:bg-secondary/70"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium text-foreground">{test.company}</p>
                          <p className="text-xs text-muted-foreground mt-1">{test.title}</p>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-accent text-accent-foreground">
                          {test.questions.length} Qs
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                        <Clock3 className="w-3.5 h-3.5" />
                        <span>{test.durationMinutes} mins</span>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                        <div className="rounded-lg bg-background px-3 py-2">
                          <p className="text-muted-foreground">Attempts</p>
                          <p className="font-medium text-foreground tabular-nums">{attemptCount}</p>
                        </div>
                        <div className="rounded-lg bg-background px-3 py-2">
                          <p className="text-muted-foreground">Best</p>
                          <p className="font-medium text-foreground tabular-nums">{bestPercent}%</p>
                        </div>
                      </div>
                      {attemptCount > 0 && (
                        <p className="mt-2 text-xs text-muted-foreground">Latest score: {latestPercent}%</p>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          <section>
            {!activeTest ? (
              <div className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
                No mock tests found for this company.
              </div>
            ) : (
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between mb-6">
                  <div>
                    <h2 className="font-display font-semibold text-xl text-foreground">{activeTest.title}</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      {activeTest.company} mock test with Aptitude and MCQ sections.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">Aptitude</span>
                    <span className="rounded-full bg-accent px-3 py-1 font-medium text-accent-foreground">MCQ</span>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3 mb-6">
                  <div className="rounded-xl bg-secondary/50 p-4">
                    <p className="text-xs text-muted-foreground">Duration</p>
                    <p className="mt-1 font-medium text-foreground">{activeTest.durationMinutes} minutes</p>
                  </div>
                  <div className="rounded-xl bg-secondary/50 p-4">
                    <p className="text-xs text-muted-foreground">Questions</p>
                    <p className="mt-1 font-medium text-foreground">{activeTest.questions.length}</p>
                  </div>
                  <div className="rounded-xl bg-secondary/50 p-4">
                    <p className="text-xs text-muted-foreground">Pending</p>
                    <p className="mt-1 font-medium text-foreground">{submittedResult ? 0 : unansweredCount}</p>
                  </div>
                </div>

                <div className="space-y-5">
                  {activeTest.questions.map((question, index) => (
                    <div key={question.id} className="rounded-2xl border border-border p-5">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="text-xs rounded-full bg-secondary px-2.5 py-1 text-muted-foreground">
                          Q{index + 1}
                        </span>
                        <span className="text-xs rounded-full bg-primary/10 px-2.5 py-1 font-medium text-primary">
                          {question.section}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-foreground leading-relaxed">{question.prompt}</p>
                      <div className="mt-4 space-y-2">
                        {question.options.map((option) => {
                          const isSelected = answers[question.id] === option;
                          const isCorrect = Boolean(submittedResult && option === question.correctAnswer);
                          const isWrongSelection = Boolean(
                            submittedResult && isSelected && option !== question.correctAnswer
                          );

                          return (
                            <button
                              key={option}
                              onClick={() => {
                                if (submittedResult) return;
                                setAnswers((current) => ({ ...current, [question.id]: option }));
                              }}
                              className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                                isCorrect
                                  ? "border-green-200 bg-green-50 text-green-700"
                                  : isWrongSelection
                                  ? "border-red-200 bg-red-50 text-red-700"
                                  : isSelected
                                  ? "border-primary bg-primary/5 text-foreground"
                                  : "border-border bg-background hover:bg-secondary/50"
                              }`}
                            >
                              {option}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-col gap-4 rounded-2xl bg-secondary/50 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    {submittedResult ? (
                      <>
                        <p className="font-display font-semibold text-foreground">
                          Score: {submittedResult.score}/{submittedResult.totalQuestions}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          You scored {Math.round((submittedResult.score / submittedResult.totalQuestions) * 100)}%.
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="font-display font-semibold text-foreground">Ready to submit?</p>
                        <p className="text-sm text-muted-foreground">
                          {unansweredCount === 0
                            ? "All questions answered."
                            : `${unansweredCount} question${unansweredCount === 1 ? "" : "s"} still unanswered.`}
                        </p>
                      </>
                    )}
                  </div>
                  <div className="flex gap-3">
                    {submittedResult ? (
                      <Button variant="outline" onClick={handleRetake}>
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Retake Test
                      </Button>
                    ) : (
                      <Button onClick={handleSubmit}>Submit Test</Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>

        {attempts.length > 0 && (
          <section className="mt-8 rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display font-semibold text-lg text-foreground">Stored Progress</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Recent submissions are saved on this device for your account.
            </p>
            <div className="mt-5 space-y-4">
              {attempts.slice(0, 5).map((attempt) => {
                const percent = Math.round((attempt.score / attempt.totalQuestions) * 100);
                return (
                  <div key={`${attempt.testId}-${attempt.submittedAt}`} className="rounded-xl bg-secondary/40 p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-medium text-foreground">{attempt.company}</p>
                        <p className="text-xs text-muted-foreground">
                          Submitted on {new Date(attempt.submittedAt).toLocaleString()}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-foreground">
                        {attempt.score}/{attempt.totalQuestions} correct
                      </p>
                    </div>
                    <Progress className="mt-3 h-2" value={percent} />
                    <p className="mt-2 text-xs text-muted-foreground">{percent}% score</p>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default MockTestsPage;
