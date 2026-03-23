import { useEffect, useState } from "react";
import { Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import { getDrives } from "@/lib/adminData";
import type { PlacementDrive } from "@/data/drives";

const getStatusClasses = (status: string) => {
  if (status === "Open") return "bg-primary/10 text-primary";
  if (status === "Interview In Progress") return "bg-accent text-accent-foreground";
  return "bg-muted text-muted-foreground";
};

const UpcomingDrives = () => {
  const [featuredDrives, setFeaturedDrives] = useState<PlacementDrive[]>([]);

  useEffect(() => {
    setFeaturedDrives(getDrives().slice(0, 4));
  }, []);

  return (
    <div className="p-6 rounded-2xl border border-border bg-card">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-primary" />
          <h2 className="font-display font-semibold text-lg text-foreground">Upcoming Drives</h2>
        </div>
        <Link to="/drives" className="text-xs text-primary font-medium hover:underline">
          View all →
        </Link>
      </div>
      <div className="space-y-3">
        {featuredDrives.map((drive) => (
          <div
            key={drive.id}
            className="flex items-center justify-between p-3.5 rounded-xl bg-secondary/50 hover:bg-secondary/80 transition-colors"
          >
            <div>
              <p className="font-medium text-sm text-foreground">{drive.company}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {drive.role} · {drive.rounds[0]?.date}
              </p>
            </div>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusClasses(drive.status)}`}>
              {drive.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingDrives;
