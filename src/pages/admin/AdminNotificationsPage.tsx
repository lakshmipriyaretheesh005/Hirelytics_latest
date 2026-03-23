import { useEffect, useState } from "react";
import { toast } from "sonner";
import AdminHeader from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { deleteNotification, getManagedNotifications, upsertNotification } from "@/lib/adminData";
import type { StudentNotification } from "@/data/notifications";
import { getContributions } from "@/lib/contributions";

const emptyNotification: StudentNotification = {
  id: "",
  title: "",
  message: "",
  type: "admin",
  priority: "medium",
  date: "",
};

const AdminNotificationsPage = () => {
  const [notifications, setNotifications] = useState<StudentNotification[]>([]);
  const [form, setForm] = useState<StudentNotification>(emptyNotification);

  useEffect(() => {
    setNotifications(getManagedNotifications());
  }, []);

  const pendingRequests = getContributions().filter((item) => item.status === "pending").length;

  const saveNotification = () => {
    if (!form.title.trim() || !form.message.trim()) {
      toast.error("Title and message are required.");
      return;
    }
    setNotifications(upsertNotification(form));
    setForm(emptyNotification);
    toast.success("Notification saved.");
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <main className="container mx-auto section-padding py-8">
        <div className="mb-8">
          <h1 className="font-display font-bold text-2xl text-foreground mb-1">Notifications Management</h1>
          <p className="text-muted-foreground">Send updates to students and keep an eye on incoming student requests.</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 mb-6">
          <p className="font-medium text-foreground">Pending student requests</p>
          <p className="text-sm text-muted-foreground mt-1">{pendingRequests} submissions are waiting for admin review.</p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[420px,1fr]">
          <section className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <Textarea placeholder="Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="min-h-[140px]" />
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="Type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as StudentNotification["type"] })} />
              <Input placeholder="Priority" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as StudentNotification["priority"] })} />
            </div>
            <Input placeholder="Date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            <Input placeholder="Action label" value={form.actionLabel || ""} onChange={(e) => setForm({ ...form, actionLabel: e.target.value })} />
            <Input placeholder="Action path" value={form.actionPath || ""} onChange={(e) => setForm({ ...form, actionPath: e.target.value })} />
            <div className="flex gap-3">
              <Button onClick={saveNotification}>Save Notification</Button>
              <Button variant="outline" onClick={() => setForm(emptyNotification)}>Reset</Button>
            </div>
          </section>

          <section className="space-y-4">
            {notifications.map((item) => (
              <div key={item.id} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex flex-col gap-3 lg:flex-row lg:justify-between">
                  <div>
                    <h3 className="font-display font-semibold text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{item.type} · {item.priority} · {item.date}</p>
                    <p className="text-sm text-muted-foreground mt-2">{item.message}</p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setForm(item)}>Edit</Button>
                    <Button variant="outline" onClick={() => { setNotifications(deleteNotification(item.id)); toast.success("Notification deleted."); }}>Delete</Button>
                  </div>
                </div>
              </div>
            ))}
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminNotificationsPage;
