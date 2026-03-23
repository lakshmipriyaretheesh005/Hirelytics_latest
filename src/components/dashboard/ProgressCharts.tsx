import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { useEffect, useMemo, useState } from "react";
import { BookOpen } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getManagedMockTests } from "@/lib/adminData";

type AttemptRecord = {
  testId: string;
  company: string;
  score: number;
  totalQuestions: number;
  submittedAt: string;
};

const COLORS = [
  "hsl(0, 72%, 46%)",    // primary
  "hsl(0, 72%, 56%)",
  "hsl(0, 72%, 66%)",
  "hsl(30, 40%, 60%)",
  "hsl(30, 40%, 50%)",
  "hsl(0, 72%, 46%)",
  "hsl(0, 72%, 56%)",
];

const ProgressCharts = () => {
  const { user } = useAuth();
  const [attempts, setAttempts] = useState<AttemptRecord[]>([]);

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

  const testsById = useMemo(
    () => Object.fromEntries(getManagedMockTests().map((test) => [test.id, test])),
    []
  );

  const sectionScores = useMemo(() => {
    if (attempts.length === 0) {
      return { aptitude: 0, mcq: 0, overall: 0 };
    }

    let totalAptitudeCorrect = 0;
    let totalAptitudeQuestions = 0;
    let totalMcqCorrect = 0;
    let totalMcqQuestions = 0;
    let totalCorrect = 0;
    let totalQuestions = 0;

    attempts.forEach((attempt) => {
      const test = testsById[attempt.testId];
      if (!test) return;

      const aptitudeQuestions = test.questions.filter((question) => question.section === "Aptitude").length;
      const mcqQuestions = test.questions.filter((question) => question.section === "MCQ").length;
      const sectionTotal = aptitudeQuestions + mcqQuestions;

      totalQuestions += sectionTotal;
      totalCorrect += attempt.score;
      totalAptitudeQuestions += aptitudeQuestions;
      totalMcqQuestions += mcqQuestions;

      if (sectionTotal > 0) {
        totalAptitudeCorrect += (attempt.score * aptitudeQuestions) / sectionTotal;
        totalMcqCorrect += (attempt.score * mcqQuestions) / sectionTotal;
      }
    });

    return {
      aptitude: totalAptitudeQuestions ? Math.round((totalAptitudeCorrect / totalAptitudeQuestions) * 100) : 0,
      mcq: totalMcqQuestions ? Math.round((totalMcqCorrect / totalMcqQuestions) * 100) : 0,
      overall: totalQuestions ? Math.round((totalCorrect / totalQuestions) * 100) : 0,
    };
  }, [attempts, testsById]);

  const radarData = [
    { subject: "Aptitude", score: sectionScores.aptitude, fullMark: 100 },
    { subject: "Logical", score: sectionScores.aptitude, fullMark: 100 },
    { subject: "Coding", score: sectionScores.mcq, fullMark: 100 },
    { subject: "Verbal", score: sectionScores.aptitude, fullMark: 100 },
    { subject: "Interview", score: sectionScores.overall, fullMark: 100 },
  ];

  const weeklyData = useMemo(() => {
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - index));
      return {
        key: date.toISOString().slice(0, 10),
        day: dayNames[date.getDay()],
        score: 0,
        count: 0,
      };
    });

    attempts.forEach((attempt) => {
      const key = new Date(attempt.submittedAt).toISOString().slice(0, 10);
      const matchingDay = last7Days.find((entry) => entry.key === key);
      if (!matchingDay) return;

      matchingDay.score += (attempt.score / attempt.totalQuestions) * 100;
      matchingDay.count += 1;
    });

    return last7Days.map((entry) => ({
      day: entry.day,
      score: entry.count ? Math.round(entry.score / entry.count) : 0,
    }));
  }, [attempts]);

  const hasProgress = attempts.length > 0;

  return (
    <div className="p-6 rounded-2xl border border-border bg-card">
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="w-5 h-5 text-primary" />
        <h2 className="font-display font-semibold text-lg text-foreground">Preparation Progress</h2>
      </div>

      {!hasProgress ? (
        <div className="rounded-xl bg-secondary/40 px-4 py-10 text-center text-sm text-muted-foreground">
          No real progress data yet. Take a mock test to start seeing charts here.
        </div>
      ) : (
        <>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Radar chart */}
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-3">Skills Overview</p>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
              <PolarGrid stroke="hsl(30, 15%, 88%)" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: "hsl(0, 0%, 40%)", fontSize: 12 }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fill: "hsl(0, 0%, 40%)", fontSize: 10 }}
              />
              <Radar
                name="Score"
                dataKey="score"
                stroke="hsl(0, 72%, 46%)"
                fill="hsl(0, 72%, 46%)"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly bar chart */}
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-3">This Week's Activity</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={weeklyData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(30, 15%, 92%)" vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fill: "hsl(0, 0%, 40%)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: "hsl(0, 0%, 40%)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={30}
              />
              <Tooltip
                contentStyle={{
                  background: "hsl(0, 0%, 100%)",
                  border: "1px solid hsl(30, 15%, 88%)",
                  borderRadius: "8px",
                  fontSize: "13px",
                }}
              />
              <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                {weeklyData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Progress bars */}
      <div className="mt-6 pt-6 border-t border-border">
        <p className="text-sm font-medium text-muted-foreground mb-4">Category Breakdown</p>
        <div className="space-y-3">
          {[
            { label: "Aptitude", value: sectionScores.aptitude, color: "bg-primary" },
            { label: "MCQ", value: sectionScores.mcq, color: "bg-primary/80" },
            { label: "Overall", value: sectionScores.overall, color: "bg-primary/60" },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-foreground font-medium">{item.label}</span>
                <span className="text-muted-foreground tabular-nums">{item.value}%</span>
              </div>
              <div className="h-2.5 rounded-full bg-secondary">
                <div
                  className={`h-full rounded-full ${item.color} transition-all duration-700`}
                  style={{ width: `${item.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
        </>
      )}
    </div>
  );
};

export default ProgressCharts;
