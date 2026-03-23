import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Bell, Building2, ClipboardCheck, BarChart3, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getCompanies, getDrives } from "@/lib/adminData";
import { supabase } from "@/integrations/supabase/client";

type AttemptRecord = {
  testId: string;
  company: string;
  score: number;
  totalQuestions: number;
  submittedAt: string;
};

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  linkTo?: string;
  linkLabel?: string;
}

const StatCard = ({ label, value, icon, linkTo, linkLabel }: StatCardProps) => {
  const content = (
    <div className="group p-5 rounded-2xl border border-border bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 cursor-pointer">
      <div className="flex items-start justify-between mb-3">
        <div className="text-primary">{icon}</div>
        {linkTo && (
          <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </div>
      <p className="font-display font-bold text-3xl tabular-nums text-foreground mb-0.5">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
      {linkLabel && (
        <p className="text-xs text-primary font-medium mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {linkLabel} →
        </p>
      )}
    </div>
  );

  if (linkTo) {
    return <Link to={linkTo}>{content}</Link>;
  }
  return content;
};

const StatsGrid = () => {
  const { user } = useAuth();
  const [attempts, setAttempts] = useState<AttemptRecord[]>([]);
  const [cgpa, setCgpa] = useState<number | null>(null);

  const loadCgpa = async () => {
    if (!user) {
      setCgpa(null);
      return;
    }

    const { data } = await supabase
      .from("profiles")
      .select("cgpa")
      .eq("user_id", user.id)
      .maybeSingle();

    setCgpa(data?.cgpa ?? null);
  };

  useEffect(() => {
    if (!user) {
      setAttempts([]);
      return;
    }

    const saved = window.localStorage.getItem(`hirelytics:mock-test-progress:${user.id}`);
    if (!saved) {
      setAttempts([]);
      return;
    }

    try {
      setAttempts(JSON.parse(saved) as AttemptRecord[]);
    } catch {
      setAttempts([]);
    }
  }, [user]);

  useEffect(() => {
    loadCgpa();
  }, [user]);

  useEffect(() => {
    const handleProfileUpdated = () => {
      loadCgpa();
    };

    window.addEventListener("hirelytics:profile-updated", handleProfileUpdated);
    return () => window.removeEventListener("hirelytics:profile-updated", handleProfileUpdated);
  }, [user]);

  const averageScore = useMemo(() => {
    if (attempts.length === 0) return 0;
    const percentages = attempts.map((attempt) => (attempt.score / attempt.totalQuestions) * 100);
    return Math.round(percentages.reduce((sum, score) => sum + score, 0) / attempts.length);
  }, [attempts]);

  const activeDrives = getDrives().filter((item) => item.status === "Open" || item.status === "Interview In Progress").length;
  const eligibleCompanies = cgpa === null
    ? 0
    : getCompanies().filter((item) => item.status !== "Closed" && cgpa >= item.minCgpa).length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Active Drives"
        value={String(activeDrives)}
        icon={<Bell className="w-5 h-5" />}
        linkTo="/drives"
        linkLabel="View all drives"
      />
      <StatCard
        label="Eligible Companies"
        value={String(eligibleCompanies)}
        icon={<Building2 className="w-5 h-5" />}
        linkTo="/companies"
        linkLabel="Browse companies"
      />
      <StatCard
        label="Mock Tests Taken"
        value={String(attempts.length)}
        icon={<ClipboardCheck className="w-5 h-5" />}
        linkTo="/mock-tests"
        linkLabel="Take a mock test"
      />
      <StatCard
        label="Prep Score"
        value={`${averageScore}%`}
        icon={<BarChart3 className="w-5 h-5" />}
      />
    </div>
  );
};

export default StatsGrid;
