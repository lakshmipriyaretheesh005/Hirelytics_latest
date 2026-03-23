import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users, Building2, FileText, Bell, Plus, ClipboardCheck, Megaphone } from "lucide-react";
import { toast } from "sonner";
import { getContributions, updateContributionStatus, type Contribution } from "@/lib/contributions";
import { getCompanies, getDrives, getManagedMockTests, getManagedNotifications } from "@/lib/adminData";
import AdminHeader from "@/components/admin/AdminHeader";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [companyCount, setCompanyCount] = useState(0);
  const [activeDriveCount, setActiveDriveCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);
  const [releasedMockTests, setReleasedMockTests] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const loadDashboard = async () => {
      setContributions(getContributions());
      setCompanyCount(getCompanies().length);
      setActiveDriveCount(getDrives().filter((item) => item.status === "Open" || item.status === "Interview In Progress").length);
      setReleasedMockTests(getManagedMockTests().filter((item) => item.released).length);
      setNotificationCount(getManagedNotifications().length);

      const [{ data: profiles, error: profilesError }, { data: roles, error: rolesError }] = await Promise.all([
        supabase.from("profiles").select("user_id"),
        supabase.from("user_roles").select("user_id, role"),
      ]);

      if (profilesError) {
        return;
      }

      if (rolesError) {
        setStudentCount((profiles || []).filter((profile) => profile.user_id !== user?.id).length);
        return;
      }

      const studentIds = new Set((roles || []).filter((item) => item.role === "student").map((item) => item.user_id));
      const filteredProfiles = (profiles || []).filter((profile) => studentIds.has(profile.user_id) && profile.user_id !== user?.id);

      if (filteredProfiles.length === 0 && (profiles || []).length > 0) {
        setStudentCount((profiles || []).filter((profile) => profile.user_id !== user?.id).length);
        return;
      }

      setStudentCount(filteredProfiles.length);
    };

    loadDashboard();
  }, [user?.id]);

  const pendingContributions = useMemo(
    () => contributions.filter((item) => item.status === "pending"),
    [contributions]
  );

  const handleDecision = (contributionId: string, decision: "approved" | "rejected", points = 0) => {
    const updated = updateContributionStatus(contributionId, decision, points);
    setContributions(updated);
    toast.success(
      decision === "approved" ? `Contribution approved. ${points} points awarded.` : "Contribution rejected."
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />

      <main className="container mx-auto section-padding py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-bold text-2xl text-foreground mb-1">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage placements, companies, and students.</p>
          </div>
          <Button size="sm" asChild>
            <Link to="/admin/companies">
            <Plus className="w-4 h-4 mr-1" />
            Add company
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Students", value: String(studentCount), icon: <Users className="w-5 h-5" />, path: "/admin/students" },
            { label: "Active Companies", value: String(companyCount), icon: <Building2 className="w-5 h-5" />, path: "/admin/companies" },
            { label: "Active Drives", value: String(activeDriveCount), icon: <FileText className="w-5 h-5" />, path: "/admin/drives" },
            { label: "Pending Requests", value: String(pendingContributions.length), icon: <Bell className="w-5 h-5" />, path: "/admin/requests" },
          ].map((stat) => (
            <Link
              key={stat.label}
              to={stat.path}
              className="p-5 rounded-2xl border border-border bg-card hover:shadow-md transition-shadow block"
            >
              <div className="text-primary mb-3">{stat.icon}</div>
              <p className="font-display font-bold text-2xl tabular-nums text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </Link>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Link to="/admin/mock-tests" className="rounded-2xl border border-border bg-card p-5 hover:shadow-md transition-shadow">
            <div className="text-primary mb-3">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <p className="text-sm text-muted-foreground">Released mock tests</p>
            <p className="font-display font-bold text-3xl text-foreground mt-2">{releasedMockTests}</p>
          </Link>
          <Link to="/admin/notifications" className="rounded-2xl border border-border bg-card p-5 hover:shadow-md transition-shadow">
            <div className="text-primary mb-3">
              <Megaphone className="w-5 h-5" />
            </div>
            <p className="text-sm text-muted-foreground">Notifications sent</p>
            <p className="font-display font-bold text-3xl text-foreground mt-2">{notificationCount}</p>
            <p className="text-xs text-primary mt-2">Open notifications management</p>
          </Link>
        </div>

        <div className="p-6 rounded-2xl border border-border bg-card mb-8">
          <h2 className="font-display font-semibold text-lg text-foreground mb-4">Contribution Approvals</h2>
          {pendingContributions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No pending student contributions.</p>
          ) : (
            <div className="space-y-4">
              {pendingContributions.map((item) => {
                const approvalPoints = item.type === "question" ? 10 : 20;

                return (
                  <div key={item.id} className="rounded-xl bg-secondary/40 p-4">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                            {item.type === "question" ? "Question" : "Interview Experience"}
                          </span>
                          <span className="rounded-full bg-secondary px-2.5 py-1 text-xs text-muted-foreground">
                            {item.company} · {item.round}
                          </span>
                          {item.questionData?.tags?.length ? (
                            <span className="rounded-full bg-secondary px-2.5 py-1 text-xs text-muted-foreground">
                              {item.questionData.category}
                            </span>
                          ) : null}
                        </div>
                        <p className="font-medium text-foreground">{item.title}</p>
                        {item.questionData ? (
                          <div className="mt-2 space-y-2">
                            <div className="flex flex-wrap gap-2">
                              {item.questionData.tags.map((tag) => (
                                <span key={tag} className="rounded-full bg-secondary px-2.5 py-1 text-xs text-muted-foreground">
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              <span className="font-medium text-foreground">Question:</span> {item.questionData.question}
                            </p>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              <span className="font-medium text-foreground">Answer:</span> {item.questionData.answer}
                            </p>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{item.content}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-3">
                          Submitted by {item.userName} ({item.userEmail})
                        </p>
                      </div>
                      <div className="flex gap-3 shrink-0">
                        <Button variant="outline" onClick={() => handleDecision(item.id, "rejected")}>
                          Reject
                        </Button>
                        <Button onClick={() => handleDecision(item.id, "approved", approvalPoints)}>
                          Approve +{approvalPoints}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="p-6 rounded-2xl border border-border bg-card">
          <h2 className="font-display font-semibold text-lg text-foreground mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {[
              { text: "New drive created: Infosys Campus Recruitment", time: "2 hours ago" },
              { text: "Student contribution approved: TCS interview experience", time: "5 hours ago" },
              { text: "Company profile updated: EY", time: "1 day ago" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <p className="text-sm text-foreground">{item.text}</p>
                <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
