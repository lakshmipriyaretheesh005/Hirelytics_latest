import { useParams, Link, Navigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import StudentHeader from "@/components/dashboard/StudentHeader";
import type { CompanyData } from "@/data/companies";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Calendar, CheckCircle2, XCircle, AlertTriangle, BookOpen, Star } from "lucide-react";
import type { QuestionCategory } from "@/data/prepQuestions";
import { getCompanies } from "@/lib/adminData";
import { getContributions } from "@/lib/contributions";
import CompanyLogo from "@/components/companies/CompanyLogo";
import { getCanonicalCompanyLabel } from "@/lib/companyLabels";

const CompanyDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [companiesLoaded, setCompaniesLoaded] = useState(false);
  const [userCgpa, setUserCgpa] = useState<number | null>(null);
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [contributionVersion, setContributionVersion] = useState(0);

  useEffect(() => {
    setCompanies(getCompanies());
    setCompaniesLoaded(true);
  }, []);

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

  const company = companies.find((c) => c.id === id);
  const prepHubCompany = !company ? null : getCanonicalCompanyLabel(company.name);
  const approvedExperiences = useMemo(
    () =>
      !prepHubCompany
        ? []
        : getContributions()
            .filter((item) => item.status === "approved" && item.type === "experience" && item.company === prepHubCompany)
            .map((item) => ({
              name: item.userName,
              batch: "Student Contribution",
              text: item.experienceData?.experience || item.content,
              rating: item.experienceData?.rating ?? 5,
            })),
    [prepHubCompany, contributionVersion]
  );

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("cgpa, skills")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setUserCgpa(data.cgpa ?? null);
          setUserSkills(data.skills ?? []);
        }
      });
  }, [user]);

  if (!companiesLoaded) {
    return (
      <div className="min-h-screen bg-background">
        <StudentHeader />
        <main className="container mx-auto section-padding py-8 max-w-4xl">
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </main>
      </div>
    );
  }

  if (!company) return <Navigate to="/companies" replace />;

  const cgpaEligible = userCgpa !== null && userCgpa >= company.minCgpa;
  const matchedSkills = company.skillsRequired.filter((s) =>
    userSkills.some((us) => us.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(us.toLowerCase()))
  );
  const missingSkills = company.skillsRequired.filter(
    (s) => !matchedSkills.includes(s)
  );
  const resourceTiles: Array<{ label: string; category?: QuestionCategory }> = [
    { label: "Aptitude Questions", category: "aptitude" },
    { label: "Coding Problems", category: "coding" },
    { label: "Interview Questions", category: "interview" },
    { label: "Company Guide" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <StudentHeader />
      <main className="container mx-auto section-padding py-8 max-w-4xl">
        <Link
          to="/companies"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to companies
        </Link>

        {/* Company header */}
        <div className="mb-8 flex items-end gap-3">
          <CompanyLogo company={company} size="xl" className="shrink-0" />
          <div className="min-w-0 pb-1">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  company.status === "Active"
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {company.status === "Active" ? "🟢 Active Drive" : company.status}
            </span>
            </div>
            <p className="text-sm text-muted-foreground">
              ₹{company.packageLpa} LPA · Min CGPA {company.minCgpa} ·{" "}
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {company.interviewDate}
              </span>
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-secondary/70 p-1">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
            <TabsTrigger value="process">Selection Process</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          {/* OVERVIEW */}
          <TabsContent value="overview" className="space-y-6">
            <Card title="About">
              <h1 className="font-display font-bold text-lg text-foreground mb-3">{company.name}</h1>
              <p className="text-sm text-foreground leading-relaxed">{company.about}</p>
            </Card>

            <Card title="Packages & Roles">
              <div className="flex items-baseline gap-2 mb-3">
                <span className="font-display font-bold text-3xl tabular-nums text-foreground">
                  ₹{company.packageLpa}
                </span>
                <span className="text-muted-foreground text-sm">LPA (CTC)</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {company.roles.map((r) => (
                  <span key={r} className="text-xs px-3 py-1 rounded-full bg-secondary text-secondary-foreground font-medium">
                    {r}
                  </span>
                ))}
              </div>
            </Card>

            <Card title="Student Experiences">
              {[...company.experiences, ...approvedExperiences].map((exp, index) => (
                <div key={`${exp.name}-${index}`} className="p-4 rounded-xl bg-secondary/50">
                  <div className="flex gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${s <= ("rating" in exp ? exp.rating : 5) ? "fill-primary text-primary" : "text-muted-foreground/30"}`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-foreground leading-relaxed mb-3">"{exp.text}"</p>
                  <p className="text-xs text-muted-foreground font-medium">
                    {exp.name} · {exp.batch}
                  </p>
                </div>
              ))}
            </Card>
          </TabsContent>

          {/* ELIGIBILITY */}
          <TabsContent value="eligibility" className="space-y-6">
            {/* CGPA check */}
            <Card title="CGPA Requirement">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50">
                {userCgpa === null ? (
                  <>
                    <AlertTriangle className="w-5 h-5 text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">CGPA not set</p>
                      <p className="text-xs text-muted-foreground">
                        Update your profile with your CGPA to check eligibility.
                      </p>
                    </div>
                  </>
                ) : cgpaEligible ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        You're eligible! Your CGPA ({userCgpa}) meets the minimum ({company.minCgpa}).
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-destructive shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Your CGPA ({userCgpa}) is below the minimum ({company.minCgpa}).
                      </p>
                    </div>
                  </>
                )}
              </div>
            </Card>

            {/* Skills */}
            <Card title="Skills Required">
              <div className="space-y-3">
                {company.skillsRequired.map((skill) => {
                  const has = matchedSkills.includes(skill);
                  return (
                    <div
                      key={skill}
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        has ? "bg-primary/5" : "bg-secondary/50"
                      }`}
                    >
                      {has ? (
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-muted-foreground shrink-0" />
                      )}
                      <span className={`text-sm ${has ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                        {skill}
                      </span>
                    </div>
                  );
                })}
              </div>

              {missingSkills.length > 0 && (
                <div className="mt-4 p-4 rounded-xl border border-border bg-accent/30">
                  <p className="text-sm font-medium text-foreground mb-1">💡 Suggestion</p>
                  <p className="text-xs text-muted-foreground">
                    Focus on learning <strong>{missingSkills.join(", ")}</strong> to improve your eligibility. Check the Preparation Hub for resources.
                  </p>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* SELECTION PROCESS */}
          <TabsContent value="process">
            <Card title="Selection Rounds">
              <div className="space-y-0">
                {company.selectionProcess.map((step, i) => (
                  <div key={step.round} className="flex gap-4 relative">
                    {/* Timeline line */}
                    {i < company.selectionProcess.length - 1 && (
                      <div className="absolute left-[15px] top-9 bottom-0 w-px bg-border" />
                    )}
                    {/* Circle */}
                    <div className="w-[31px] h-[31px] rounded-full border-2 border-primary bg-card flex items-center justify-center shrink-0 z-10">
                      <span className="text-xs font-bold text-primary tabular-nums">{i + 1}</span>
                    </div>
                    <div className="pb-6 flex-1">
                      <p className="font-medium text-sm text-foreground">{step.round}</p>
                      {step.description ? (
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{step.description}</p>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* RESOURCES */}
          <TabsContent value="resources">
            <Card title="Preparation Resources">
              {prepHubCompany ? (
                <>
                  <p className="text-sm text-muted-foreground mb-4">
                    Use the Preparation Hub to practice company-specific questions and improve your scores.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {resourceTiles.map((resource) => {
                      const params = new URLSearchParams({ company: prepHubCompany });
                      if (resource.category) {
                        params.set("category", resource.category);
                      }

                      return (
                        <Link
                          key={resource.label}
                          to={`/prep-hub?${params.toString()}`}
                          className="flex items-center gap-3 p-4 rounded-xl border border-border bg-secondary/30 hover:bg-secondary/60 transition-colors"
                        >
                          <BookOpen className="w-5 h-5 text-primary shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-foreground">{resource.label}</p>
                            <p className="text-xs text-muted-foreground">For {company.name}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="rounded-xl border border-dashed border-border bg-secondary/20 p-6 text-sm text-muted-foreground">
                  No company-specific preparation resources are available yet for {company.name}.
                </div>
              )}
              {company.resources.length > 0 ? (
                <div className="mt-5">
                  <p className="text-sm font-medium text-foreground mb-3">Company resources</p>
                  <div className="flex flex-wrap gap-2">
                    {company.resources.map((resource) => (
                      <span key={resource} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                        {resource}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="p-6 rounded-2xl border border-border bg-card">
    <h3 className="font-display font-semibold text-base text-foreground mb-4">{title}</h3>
    {children}
  </div>
);

export default CompanyDetailPage;
