import { useEffect, useState } from "react";
import StudentHeader from "@/components/dashboard/StudentHeader";
import type { StudentNotification, NotificationType } from "@/data/notifications";
import { Bell, Megaphone, CalendarClock, TriangleAlert } from "lucide-react";
import { Link } from "react-router-dom";
import { getManagedNotifications } from "@/lib/adminData";

const typeConfig: Record<NotificationType, { label: string; icon: React.ReactNode }> = {
  admin: { label: "Admin Updates", icon: <Megaphone className="w-4 h-4" /> },
  drive: { label: "Upcoming Drives & Events", icon: <CalendarClock className="w-4 h-4" /> },
  alert: { label: "Student Alerts", icon: <TriangleAlert className="w-4 h-4" /> },
};

const priorityClasses = {
  high: "bg-red-100 text-red-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-green-100 text-green-700",
} as const;

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<StudentNotification[]>([]);

  useEffect(() => {
    setNotifications(getManagedNotifications());
  }, []);

  const adminUpdates = notifications.filter((item) => item.type === "admin");
  const driveUpdates = notifications.filter((item) => item.type === "drive");
  const alerts = notifications.filter((item) => item.type === "alert");

  const sections = [
    { key: "admin", items: adminUpdates },
    { key: "drive", items: driveUpdates },
    { key: "alert", items: alerts },
  ] as const;

  return (
    <div className="min-h-screen bg-background">
      <StudentHeader />
      <main className="container mx-auto section-padding py-8 max-w-5xl">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
            <Bell className="w-4 h-4" />
            Notifications Center
          </div>
          <h1 className="font-display font-bold text-2xl text-foreground mb-1">Notifications</h1>
          <p className="text-muted-foreground">
            Stay updated with admin announcements, upcoming drives/events, and important student alerts.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-8">
          {sections.map((section) => (
            <div key={section.key} className="rounded-2xl border border-border bg-card p-5">
              <div className="text-primary mb-3">{typeConfig[section.key].icon}</div>
              <p className="font-display font-bold text-3xl text-foreground tabular-nums">{section.items.length}</p>
              <p className="text-sm text-muted-foreground">{typeConfig[section.key].label}</p>
            </div>
          ))}
        </div>

        <div className="space-y-8">
          {sections.map((section) => (
            <section key={section.key} className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="text-primary">{typeConfig[section.key].icon}</div>
                <h2 className="font-display font-semibold text-lg text-foreground">
                  {typeConfig[section.key].label}
                </h2>
              </div>

              <div className="space-y-4">
                {section.items.map((item) => (
                  <div key={item.id} className="rounded-xl bg-secondary/40 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${priorityClasses[item.priority]}`}>
                            {item.priority} priority
                          </span>
                          <span className="text-xs text-muted-foreground">{item.date}</span>
                        </div>
                        <p className="font-medium text-foreground">{item.title}</p>
                        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{item.message}</p>
                      </div>
                      {item.actionLabel && item.actionPath ? (
                        <Link
                          to={item.actionPath}
                          className="shrink-0 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary/60 transition-colors"
                        >
                          {item.actionLabel}
                        </Link>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
};

export default NotificationsPage;
