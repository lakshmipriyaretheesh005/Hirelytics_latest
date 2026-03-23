import { useAuth } from "@/contexts/AuthContext";
import StudentHeader from "@/components/dashboard/StudentHeader";
import StatsGrid from "@/components/dashboard/StatsGrid";
import ProgressCharts from "@/components/dashboard/ProgressCharts";
import ProfileCard from "@/components/dashboard/ProfileCard";
import UpcomingDrives from "@/components/dashboard/UpcomingDrives";

const StudentDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <StudentHeader />

      <main className="container mx-auto section-padding py-8">
        <div className="mb-8">
          <h1 className="font-display font-bold text-2xl text-foreground mb-1">
            Welcome back, {user?.user_metadata?.full_name || "Student"} 👋
          </h1>
          <p className="text-muted-foreground">Here's your placement preparation overview.</p>
        </div>

        {/* Clickable stats */}
        <div className="mb-8">
          <StatsGrid />
        </div>

        {/* Charts */}
        <div className="mb-8">
          <ProgressCharts />
        </div>

        {/* Bottom grid: drives + profile */}
        <div className="grid lg:grid-cols-2 gap-6">
          <UpcomingDrives />
          <ProfileCard />
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
