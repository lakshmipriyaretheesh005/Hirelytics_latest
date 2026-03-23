import { useEffect, useState } from "react";
import StudentHeader from "@/components/dashboard/StudentHeader";
import { Calendar, Clock3 } from "lucide-react";
import { getDrives } from "@/lib/adminData";
import type { PlacementDrive } from "@/data/drives";

const getStatusClasses = (status: string) => {
  if (status === "Open") return "bg-primary/10 text-primary";
  if (status === "Interview In Progress") return "bg-accent text-accent-foreground";
  return "bg-muted text-muted-foreground";
};

const DrivesPage = () => {
  const [drives, setDrives] = useState<PlacementDrive[]>([]);

  useEffect(() => {
    setDrives(getDrives());
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <StudentHeader />
      <main className="container mx-auto section-padding py-8">
        <h1 className="font-display font-bold text-2xl text-foreground mb-1">Placement Drives</h1>
        <p className="text-muted-foreground mb-8">Track active placement drives, round dates, and current status.</p>

        <div className="space-y-4">
          {drives.map((drive) => (
            <div key={drive.id} className="p-5 rounded-2xl border border-border bg-card hover:shadow-md transition-shadow">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-foreground">{drive.company}</h3>
                    <p className="text-sm text-muted-foreground">{drive.role}</p>
                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock3 className="w-3.5 h-3.5" />
                      <span>Application deadline: {drive.applicationDeadline}</span>
                    </div>
                  </div>
                </div>
                <span className={`self-start text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap ${getStatusClasses(drive.status)}`}>
                  {drive.status}
                </span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {drive.rounds.map((round, index) => (
                  <div key={`${drive.id}-${round.name}`} className="rounded-xl bg-secondary/50 px-4 py-3">
                    <p className="text-xs font-medium text-muted-foreground">Round {index + 1}</p>
                    <p className="mt-1 text-sm font-medium text-foreground">{round.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{round.date}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default DrivesPage;
