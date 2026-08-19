import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, IdCard, Building2, Phone, Loader2, Save } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const DEPARTMENTS = ["Computer Science", "Engineering", "Business", "Arts & Humanities", "Sciences", "Medicine", "Law"];

export default function StudentProfile() {
  const { user } = useAuth();
  const [form, setForm] = useState({ fullName: "", studentId: "", department: "", phone: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName || "",
        studentId: user.studentId || "",
        department: user.department || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.studentId) {
      toast({ title: "Required fields missing", description: "Name and Student ID are required.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await base44.auth.updateMe(form);
      toast({ title: "Profile updated", description: "Your details have been saved." });
    } catch (err) {
      toast({ title: "Update failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your personal information.</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-2xl font-bold text-primary-foreground">
          {(form.fullName || user?.email || "S").charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-foreground">{form.fullName || "Student"}</p>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field id="fullName" label="Full Name" icon={User} value={form.fullName} onChange={set("fullName")} required />
              <Field id="studentId" label="Student ID" icon={IdCard} value={form.studentId} onChange={set("studentId")} required />
              <Field id="phone" label="Phone Number" icon={Phone} value={form.phone} onChange={set("phone")} />
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <select
                    id="department"
                    value={form.department}
                    onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
                    className="flex h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select department</option>
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="email" value={user?.email || ""} disabled className="pl-10 h-11 bg-muted" />
              </div>
              <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ id, label, icon: Icon, ...props }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input id={id} className="pl-10 h-11" {...props} />
      </div>
    </div>
  );
}