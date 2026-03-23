import { useMemo, useState, useEffect } from "react";
import { toast } from "sonner";
import AdminHeader from "@/components/admin/AdminHeader";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

type StudentProfile = {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  cgpa: number | null;
  linkedin_url?: string | null;
  skills?: string[] | null;
};

type AttemptRecord = {
  testId: string;
  company: string;
  score: number;
  totalQuestions: number;
  submittedAt: string;
};

const AdminStudentsPage = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const loadStudents = async () => {
    setLoading(true);
    const [{ data: profiles, error: profilesError }, { data: roles, error: rolesError }] = await Promise.all([
      supabase.from("profiles").select("id, user_id, full_name, email, cgpa, linkedin_url, skills").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("user_id, role"),
    ]);

    setLoading(false);

    if (profilesError || rolesError) {
      if (profilesError) {
        toast.error("Failed to load students.");
        return;
      }

      const fallbackProfiles = (profiles || []).filter((profile) => profile.user_id !== user?.id);
      setStudents(fallbackProfiles);
      toast.warning("Loaded profiles without role filtering. Apply the latest Supabase migration for full admin filtering.");
      return;
    }

    const studentIds = new Set((roles || []).filter((item) => item.role === "student").map((item) => item.user_id));
    const filteredProfiles = (profiles || []).filter((profile) => studentIds.has(profile.user_id) && profile.user_id !== user?.id);

    if (filteredProfiles.length === 0 && (profiles || []).length > 0) {
      setStudents((profiles || []).filter((profile) => profile.user_id !== user?.id));
      toast.warning("No student roles were readable, so all non-admin profiles are shown as a fallback.");
      return;
    }

    setStudents(filteredProfiles);
  };

  useEffect(() => {
    loadStudents();
  }, [user?.id]);

  const metricsByUserId = useMemo(() => {
    return Object.fromEntries(
      students.map((student) => {
        const rawAttempts = window.localStorage.getItem(`hirelytics:mock-test-progress:${student.user_id}`);
        let attempts: AttemptRecord[] = [];

        if (rawAttempts) {
          try {
            attempts = JSON.parse(rawAttempts) as AttemptRecord[];
          } catch {
            attempts = [];
          }
        }

        const percentages = attempts
          .filter((attempt) => attempt.totalQuestions > 0)
          .map((attempt) => Math.round((attempt.score / attempt.totalQuestions) * 100));

        const mockScore = percentages.length
          ? Math.round(percentages.reduce((sum, score) => sum + score, 0) / percentages.length)
          : 0;

        const profileFields = [
          student.full_name?.trim(),
          student.email?.trim(),
          student.cgpa !== null ? String(student.cgpa) : "",
          student.linkedin_url?.trim() ?? "",
          student.skills?.length ? "skills" : "",
        ];

        const completedFields = profileFields.filter(Boolean).length;
        const profileCompletion = Math.round((completedFields / profileFields.length) * 100);
        const progress = Math.round((profileCompletion + mockScore) / 2);

        return [
          student.user_id,
          {
            profileCompletion,
            mockScore,
            progress,
          },
        ];
      })
    );
  }, [students]);

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <main className="container mx-auto section-padding py-8">
        <div className="mb-8">
          <h1 className="font-display font-bold text-2xl text-foreground mb-1">Students</h1>
          <p className="text-muted-foreground">View student profiles and track progress, mock scores, and profile completion.</p>
        </div>

        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="grid grid-cols-[1.4fr,1.2fr,0.8fr,0.8fr,0.9fr] gap-4 border-b border-border px-5 py-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <span>Student</span>
            <span>Profile</span>
            <span>Progress</span>
            <span>Mock Score</span>
            <span>Profile %</span>
          </div>
          {loading ? (
            <div className="px-5 py-10 text-sm text-muted-foreground">Loading students...</div>
          ) : students.length === 0 ? (
            <div className="px-5 py-10 text-sm text-muted-foreground">No students found.</div>
          ) : students.map((student) => {
            const metric = metricsByUserId[student.user_id] ?? { progress: 0, mockScore: 0, profileCompletion: 0 };
            return (
            <div key={student.id} className="grid grid-cols-[1.4fr,1.2fr,0.8fr,0.8fr,0.9fr] gap-4 px-5 py-4 border-b border-border last:border-b-0">
              <div>
                <p className="font-medium text-foreground">{student.full_name || "Student"}</p>
                <p className="text-xs text-muted-foreground mt-1">{student.email}</p>
              </div>
              <div>
                <p className="text-sm text-foreground">{student.skills?.length ? `${student.skills.length} skills added` : "No skills added"}</p>
                <p className="text-xs text-muted-foreground mt-1">CGPA {student.cgpa ?? "Not set"}</p>
              </div>
              <p className="text-sm text-foreground">{metric.progress}%</p>
              <p className="text-sm text-foreground">{metric.mockScore}%</p>
              <p className="text-sm text-foreground">{metric.profileCompletion}%</p>
            </div>
          )})}
        </div>
      </main>
    </div>
  );
};

export default AdminStudentsPage;
