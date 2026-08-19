import React, { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, Mail, Lock, Loader2, IdCard, Building2, Phone, Coffee } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "@/components/ui/use-toast";
import { safeReturnTo } from "@/lib/authReturnTo";

const DEPARTMENTS = ["Computer Science", "Engineering", "Business", "Arts & Humanities", "Sciences", "Medicine", "Law"];

export default function Register() {
  const [form, setForm] = useState({ fullName: "", studentId: "", department: "", phone: "", email: "" });
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (!form.fullName || !form.studentId || !form.department) {
      setError("Please complete all required fields");
      return;
    }
    setLoading(true);
    try {
      await base44.auth.register({ email: form.email, password });
      setShowOtp(true);
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await base44.auth.verifyOtp({ email: form.email, otpCode });
      if (result?.access_token) {
        base44.auth.setToken(result.access_token);
      }
      // Save profile details now that we are authenticated.
      try {
        await base44.auth.updateMe({
          fullName: form.fullName,
          studentId: form.studentId,
          department: form.department,
          phone: form.phone,
        });
      } catch {
        /* profile save is best-effort; user can edit later */
      }
      toast({ title: "Account created", description: "Welcome to UniCafé!" });
      window.location.href = safeReturnTo();
    } catch (err) {
      setError(err.message || "Invalid verification code");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    try {
      await base44.auth.resendOtp(form.email);
      toast({ title: "Code sent", description: "Check your email for the new code." });
    } catch (err) {
      setError(err.message || "Failed to resend code");
    }
  };

  if (showOtp) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted p-6">
        <div className="w-full max-w-sm bg-card rounded-2xl shadow-sm border border-border p-8">
          <div className="flex justify-center mb-5">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center">
              <Coffee className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-center text-foreground">Verify your email</h2>
          <p className="text-sm text-muted-foreground text-center mt-1">We sent a 6-digit code to {form.email}</p>

          {error && <div className="mt-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}

          <div className="flex justify-center my-6">
            <InputOTP maxLength={6} value={otpCode} onChange={setOtpCode} autoFocus autoComplete="one-time-code">
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button className="w-full h-11 font-medium" onClick={handleVerify} disabled={loading || otpCode.length < 6}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify & continue"
            )}
          </Button>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Didn't receive the code?{" "}
            <button onClick={handleResend} className="text-primary font-medium hover:underline">
              Resend
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-6">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-sm border border-border p-8">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Coffee className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <p className="font-bold text-foreground">UniCafé</p>
            <p className="text-xs text-muted-foreground">Create your student account</p>
          </div>
        </div>

        {error && <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <div className="relative">
              <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input id="fullName" placeholder="Jane Doe" value={form.fullName} onChange={set("fullName")} className="pl-10 h-11" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="studentId">Student ID</Label>
              <div className="relative">
                <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="studentId" placeholder="SC2026" value={form.studentId} onChange={set("studentId")} className="pl-10 h-11" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="phone" placeholder="+1 555 0100" value={form.phone} onChange={set("phone")} className="pl-10 h-11" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select value={form.department} onValueChange={(v) => setForm((f) => ({ ...f, department: v }))}>
              <SelectTrigger id="department" className="h-11">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <SelectValue placeholder="Select department" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {DEPARTMENTS.map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input id="email" type="email" placeholder="you@uni.edu" value={form.email} onChange={set("email")} className="pl-10 h-11" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="password" type="password" placeholder="••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 h-11" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">Confirm</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="confirm" type="password" placeholder="••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="pl-10 h-11" required />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full h-11 font-medium" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-5">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}