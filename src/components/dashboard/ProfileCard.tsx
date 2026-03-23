import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User, Pencil, Check, X } from "lucide-react";
import { toast } from "sonner";

const ProfileCard = () => {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    cgpa: "",
    linkedin_url: "",
    skills: [] as string[],
  });
  const [form, setForm] = useState(profile);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          const p = {
            full_name: data.full_name || "",
            email: data.email || "",
            cgpa: data.cgpa?.toString() || "",
            linkedin_url: data.linkedin_url || "",
            skills: data.skills || [],
          };
          setProfile(p);
          setForm(p);
        }
      });
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);

    const cgpaNum = form.cgpa ? parseFloat(form.cgpa) : null;
    if (form.cgpa && (isNaN(cgpaNum!) || cgpaNum! < 0 || cgpaNum! > 10)) {
      toast.error("CGPA must be between 0 and 10");
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: form.full_name,
        cgpa: cgpaNum,
        linkedin_url: form.linkedin_url || null,
        skills: form.skills,
      })
      .eq("user_id", user.id);

    setLoading(false);
    if (error) {
      toast.error("Failed to update profile");
      return;
    }
    setProfile(form);
    setEditing(false);
    window.dispatchEvent(new CustomEvent("hirelytics:profile-updated"));
    toast.success("Profile updated");
  };

  const handleCancel = () => {
    setForm(profile);
    setEditing(false);
  };

  return (
    <div className="p-6 rounded-2xl border border-border bg-card">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          <h2 className="font-display font-semibold text-lg text-foreground">Profile</h2>
        </div>
        {!editing ? (
          <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
            <Pencil className="w-4 h-4 mr-1" />
            Edit
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={handleCancel} disabled={loading}>
              <X className="w-4 h-4" />
            </Button>
            <Button size="sm" onClick={handleSave} disabled={loading}>
              <Check className="w-4 h-4 mr-1" />
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-xs text-muted-foreground">Name</Label>
          {editing ? (
            <Input
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              className="mt-1 h-9"
            />
          ) : (
            <p className="text-sm font-medium text-foreground mt-0.5">{profile.full_name || "—"}</p>
          )}
        </div>

        <div>
          <Label className="text-xs text-muted-foreground">Email</Label>
          <p className="text-sm text-foreground mt-0.5">{profile.email}</p>
        </div>

        <div>
          <Label className="text-xs text-muted-foreground">CGPA</Label>
          {editing ? (
            <Input
              type="number"
              step="0.01"
              min="0"
              max="10"
              placeholder="e.g. 8.45"
              value={form.cgpa}
              onChange={(e) => setForm({ ...form, cgpa: e.target.value })}
              className="mt-1 h-9"
            />
          ) : (
            <p className="text-sm font-medium text-foreground mt-0.5 tabular-nums">
              {profile.cgpa || "Not set"}
            </p>
          )}
        </div>

        <div>
          <Label className="text-xs text-muted-foreground">LinkedIn</Label>
          {editing ? (
            <Input
              type="url"
              placeholder="https://linkedin.com/in/yourprofile"
              value={form.linkedin_url}
              onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })}
              className="mt-1 h-9"
            />
          ) : (
            <p className="text-sm text-foreground mt-0.5">
              {profile.linkedin_url ? (
                <a
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {profile.linkedin_url.replace(/https?:\/\/(www\.)?linkedin\.com\/in\//, "")}
                </a>
              ) : (
                "Not set"
              )}
            </p>
          )}
        </div>

        <div>
          <Label className="text-xs text-muted-foreground">Skills</Label>
          {editing ? (
            <Input
              placeholder="React, Python, SQL (comma-separated)"
              value={form.skills.join(", ")}
              onChange={(e) =>
                setForm({
                  ...form,
                  skills: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                })
              }
              className="mt-1 h-9"
            />
          ) : (
            <div className="flex flex-wrap gap-1.5 mt-1">
              {profile.skills.length > 0 ? (
                profile.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No skills added</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
