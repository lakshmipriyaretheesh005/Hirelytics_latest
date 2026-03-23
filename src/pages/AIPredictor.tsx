import { useState, useCallback, useEffect, useMemo } from "react";
import StudentHeader from "@/components/dashboard/StudentHeader";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, Download, BrainCircuit, Loader2, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { getCompanies } from "@/lib/adminData";
import { getCanonicalCompanyLabel } from "@/lib/companyLabels";
import type { CompanyData } from "@/data/companies";

interface SectionScore {
  score: number;
  feedback: string;
}

interface Analysis {
  overallScore: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  sections: {
    education: SectionScore;
    skills: SectionScore;
    projects: SectionScore;
    experience: SectionScore;
    formatting: SectionScore;
  };
  companyFit: {
    score: number;
    feedback: string;
    suggestions: string[];
  };
}

const AIPredictor = () => {
  const [resumeText, setResumeText] = useState("");
  const [company, setCompany] = useState("general");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const { ref, isVisible } = useScrollReveal(0.05);

  const loadCompanies = () => {
    setCompanies(getCompanies());
  };

  useEffect(() => {
    loadCompanies();

    const handleCompaniesUpdated = () => loadCompanies();
    window.addEventListener("hirelytics:companies-updated", handleCompaniesUpdated);
    window.addEventListener("storage", handleCompaniesUpdated);

    return () => {
      window.removeEventListener("hirelytics:companies-updated", handleCompaniesUpdated);
      window.removeEventListener("storage", handleCompaniesUpdated);
    };
  }, []);

  const companyOptions = useMemo(
    () => [
      { value: "general", label: "General (All Companies)" },
      ...companies.map((item) => ({
        value: getCanonicalCompanyLabel(item.name),
        label: item.name,
      })),
    ],
    [companies]
  );

  const selectedCompany = companies.find((item) => getCanonicalCompanyLabel(item.name) === company) ?? null;
  const sampleResumeHref =
    company === "general"
      ? null
      : selectedCompany?.sampleResume ||
        ({
          EY: "/sample-resumes/ey-sample-resume.pdf",
          IBM: "/sample-resumes/ibm-sample-resume.pdf",
          Infosys: "/sample-resumes/infosys-sample-resume.pdf",
          TCS: "/sample-resumes/tcs-sample-resume.pdf",
        } as Record<string, string>)[company] ||
        null;

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "text/plain" && !file.name.endsWith(".txt")) {
      toast.info("For best results, paste your resume text directly or upload a .txt file.");
    }

    const text = await file.text();
    setResumeText(text);
    toast.success("Resume loaded");
  }, []);

  const handleAnalyze = async () => {
    if (resumeText.trim().length < 20) {
      toast.error("Please enter at least a few lines of your resume");
      return;
    }

    setLoading(true);
    setError("");
    setAnalysis(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("analyze-resume", {
        body: {
          resumeText,
          company: company === "general" ? null : company,
        },
      });

      if (fnError) throw new Error(fnError.message);
      if (data?.error) throw new Error(data.error);

      setAnalysis(data);
    } catch (err: any) {
      const msg = err?.message || "Analysis failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const downloadFeedback = () => {
    if (!analysis) return;
    const lines = [
      `HIRELYTICS RESUME ANALYSIS`,
      `Company: ${company === "general" ? "General" : company}`,
      `Overall Score: ${analysis.overallScore}/100`,
      ``,
      `SUMMARY`,
      analysis.summary,
      ``,
      `STRENGTHS`,
      ...analysis.strengths.map((s) => `  ✓ ${s}`),
      ``,
      `IMPROVEMENTS`,
      ...analysis.improvements.map((s) => `  • ${s}`),
      ``,
      `SECTION SCORES`,
      ...Object.entries(analysis.sections).map(
        ([key, val]) => `  ${key}: ${val.score}/100 — ${val.feedback}`
      ),
      ``,
      `COMPANY FIT: ${analysis.companyFit.score}/100`,
      analysis.companyFit.feedback,
      ``,
      `SUGGESTIONS`,
      ...analysis.companyFit.suggestions.map((s) => `  • ${s}`),
    ];

    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `resume-analysis-${company}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <StudentHeader />
      <main className="container mx-auto section-padding py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="font-display font-bold text-2xl text-foreground mb-1">AI Resume Predictor</h1>
          <p className="text-muted-foreground">
            Get AI-powered feedback on your resume and improve your placement chances.
          </p>
        </div>

        {/* Upload section */}
        <div
          ref={ref}
          className={`p-6 rounded-2xl border border-border bg-card mb-6 ${isVisible ? "animate-fade-up" : "opacity-0"}`}
        >
          <div className="flex items-center gap-2 mb-5">
            <BrainCircuit className="w-5 h-5 text-primary" />
            <h2 className="font-display font-semibold text-lg text-foreground">Upload Your Resume</h2>
          </div>

          {/* Company selector */}
          <div className="mb-4">
            <label className="text-sm font-medium text-foreground mb-1.5 block">Target Company</label>
            <Select value={company} onValueChange={setCompany}>
              <SelectTrigger className="w-full sm:w-64 h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {companyOptions.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {sampleResumeHref && (
              <div className="mt-3">
                <Button variant="outline" size="sm" asChild>
                  <a href={sampleResumeHref} download>
                    <Download className="w-4 h-4 mr-2" />
                    Download {company} sample resume
                  </a>
                </Button>
              </div>
            )}
          </div>

          {/* File upload */}
          <div className="mb-4">
            <label
              htmlFor="resume-upload"
              className="flex items-center justify-center gap-2 p-8 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
            >
              <Upload className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Upload .txt file or paste resume below
              </span>
            </label>
            <input
              id="resume-upload"
              type="file"
              accept=".txt"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>

          {/* Text area */}
          <Textarea
            placeholder="Paste your resume content here..."
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            className="min-h-[180px] mb-4 text-sm"
          />

          <Button onClick={handleAnalyze} disabled={loading || resumeText.trim().length < 20} className="w-full sm:w-auto">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <BrainCircuit className="w-4 h-4 mr-2" />
                Analyze Resume
              </>
            )}
          </Button>
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 rounded-xl border border-destructive/30 bg-destructive/5 flex items-start gap-3 mb-6">
            <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Results */}
        {analysis && (
          <div className="space-y-6 animate-fade-up">
            {/* Overall score */}
            <div className="p-6 rounded-2xl border border-border bg-card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-semibold text-lg text-foreground">Analysis Results</h2>
                <Button variant="outline" size="sm" onClick={downloadFeedback}>
                  <Download className="w-4 h-4 mr-1" />
                  Download Report
                </Button>
              </div>

              {/* Score circle */}
              <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
                <div className="relative w-28 h-28 shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--secondary))" strokeWidth="8" />
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${(analysis.overallScore / 100) * 264} 264`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-display font-bold text-2xl tabular-nums text-foreground">
                      {analysis.overallScore}
                    </span>
                    <span className="text-xs text-muted-foreground">/100</span>
                  </div>
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <p className="text-sm text-foreground leading-relaxed">{analysis.summary}</p>
                </div>
              </div>

              {/* Strengths & Improvements */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-primary/5">
                  <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    Strengths
                  </p>
                  <ul className="space-y-2">
                    {analysis.strengths.map((s, i) => (
                      <li key={i} className="text-sm text-foreground flex items-start gap-2">
                        <span className="text-primary mt-1 shrink-0">•</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 rounded-xl bg-secondary/50">
                  <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-1.5">
                    <XCircle className="w-4 h-4 text-muted-foreground" />
                    Areas to Improve
                  </p>
                  <ul className="space-y-2">
                    {analysis.improvements.map((s, i) => (
                      <li key={i} className="text-sm text-foreground flex items-start gap-2">
                        <span className="text-muted-foreground mt-1 shrink-0">•</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Section scores */}
            <div className="p-6 rounded-2xl border border-border bg-card">
              <h3 className="font-display font-semibold text-base text-foreground mb-4">Section Breakdown</h3>
              <div className="space-y-4">
                {Object.entries(analysis.sections).map(([key, val]) => (
                  <div key={key}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-medium text-foreground capitalize">{key}</span>
                      <span className="tabular-nums text-muted-foreground">{val.score}/100</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-secondary mb-1.5">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-700"
                        style={{ width: `${val.score}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">{val.feedback}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Company fit */}
            <div className="p-6 rounded-2xl border border-border bg-card">
              <h3 className="font-display font-semibold text-base text-foreground mb-4">
                <FileText className="w-4 h-4 inline mr-1.5 text-primary" />
                Company Fit — {company === "general" ? "General IT" : company}
              </h3>
              <div className="flex items-center gap-3 mb-4">
                <span className="font-display font-bold text-3xl tabular-nums text-foreground">
                  {analysis.companyFit.score}
                </span>
                <span className="text-sm text-muted-foreground">/100 fit score</span>
              </div>
              <p className="text-sm text-foreground mb-4 leading-relaxed">{analysis.companyFit.feedback}</p>
              <div className="space-y-2">
                {analysis.companyFit.suggestions.map((s, i) => (
                  <div key={i} className="flex items-start gap-2 p-3 rounded-lg bg-secondary/50">
                    <span className="text-primary mt-0.5 shrink-0">💡</span>
                    <p className="text-sm text-foreground">{s}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AIPredictor;
