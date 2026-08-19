import React, { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Coffee, Mail, Lock, Loader2, GraduationCap, ShieldCheck, Clock, Leaf } from "lucide-react";
import { safeReturnTo } from "@/lib/authReturnTo";
import { toast } from "@/components/ui/use-toast";

export default function Login() {
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const returnTo = safeReturnTo();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await base44.auth.loginViaEmailPassword(email, password);
      toast({ title: "Login successful", description: "Welcome back to UU Cafe!" });
      setTimeout(() => { window.location.href = returnTo; }, 700);
    } catch (err) {
      setError(err.message || "Invalid email or password");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Brand panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 30%, white 2px, transparent 2px), radial-gradient(circle at 70% 60%, white 2px, transparent 2px)", backgroundSize: "40px 40px" }} />
        <div className="relative z-10 flex flex-col justify-between p-12 text-primary-foreground">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center p-1">
              <img src="https://media.base44.com/images/public/6a6998218d51cd310a17b17e/50c25c4d6_header_logo2.png" alt="UU Cafe" className="w-full h-full object-contain" />
            </div>
            <div>
              <p className="text-xl font-bold">UU Cafe</p>
              <p className="text-xs text-primary-foreground/80">Uttara University</p>
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-bold leading-tight">Fresh food, fast<br />between classes.</h1>
            <p className="mt-4 text-primary-foreground/80 max-w-sm">
              Browse the daily menu, place your order, and skip the queue. Your campus café, reimagined.
            </p>
            <div className="mt-8 flex flex-wrap gap-5">
              {[
                { icon: Clock, label: "Skip the queue" },
                { icon: Leaf, label: "Freshly prepared" },
                { icon: GraduationCap, label: "Student-first" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-sm text-primary-foreground/90">
                  <Icon className="w-4 h-4" />
                  {label}
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-primary-foreground/60">© {new Date().getFullYear()} University Café. All rights reserved.</p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 bg-background">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <img src="https://media.base44.com/images/public/6a6998218d51cd310a17b17e/50c25c4d6_header_logo2.png" alt="UU Cafe" className="w-10 h-10 object-contain" />
            <p className="text-lg font-bold">UU Cafe</p>
          </div>

          <h2 className="text-2xl font-bold text-foreground">Welcome back</h2>
          <p className="text-sm text-muted-foreground mt-1">Sign in to your café account</p>

          {/* Role tabs */}
          <div className="mt-6 grid grid-cols-2 gap-2 p-1 rounded-xl bg-muted">
            <button
              type="button"
              onClick={() => setRole("student")}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${role === "student" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}
            >
              <GraduationCap className="w-4 h-4" />
              Student
            </button>
            <button
              type="button"
              onClick={() => setRole("admin")}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${role === "admin" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}
            >
              <ShieldCheck className="w-4 h-4" />
              Admin
            </button>
          </div>

          {error && (
            <div className="mt-5 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{role === "admin" ? "Admin Email" : "Student Email"}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  autoFocus
                  placeholder="you@uni.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-11"
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox id="remember" checked={remember} onCheckedChange={setRemember} />
              <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                Remember me
              </label>
            </div>

            <Button type="submit" className="w-full h-11 font-medium" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                `Sign in as ${role === "admin" ? "Admin" : "Student"}`
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            New student?{" "}
            <Link to="/register" className="text-primary font-medium hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}