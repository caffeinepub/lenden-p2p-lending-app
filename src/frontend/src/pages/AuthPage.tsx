import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Shield, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "../store/appStore";
import type { UserRole } from "../types";

interface AuthPageProps {
  onNavigate: (page: string) => void;
}

export function AuthPage({ onNavigate }: AuthPageProps) {
  const { users, login, register } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!isLogin && !name.trim()) errs.name = "Name is required";
    if (!phone.trim() || !/^\d{10}$/.test(phone))
      errs.phone = "A 10-digit phone number is required";
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});

    if (isLogin) {
      const user = users.find((u) => u.phone === phone);
      if (!user) {
        setErrors({ phone: "User not found" });
        return;
      }
      login(user);
      toast.success(`Welcome back, ${user.name}!`);
      onNavigate("dashboard");
    } else {
      const existing = users.find((u) => u.phone === phone);
      if (existing) {
        setErrors({ phone: "This phone number is already registered" });
        return;
      }
      const user = register(
        { name: name.trim(), phone, role: "both" as UserRole },
        "",
      );
      login(user);
      toast.success(`Account created! Welcome, ${user.name}!`);
      onNavigate("dashboard");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-lg border-border">
          <CardHeader className="text-center pb-2">
            <div className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center mx-auto mb-3">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">
              {isLogin ? "Sign In" : "Create Account"}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {isLogin ? "Welcome back" : "Join LenDen Mokoko today"}
            </p>
          </CardHeader>
          <CardContent>
            {/* Free signup banner */}
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mb-4 p-3 rounded-lg border border-green-300 bg-green-50 dark:bg-green-900/20 dark:border-green-700 flex items-start gap-3"
                data-ocid="auth.panel"
              >
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Zap className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-green-700 dark:text-green-400">
                    🎉 Registration Bilkul FREE!
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-500 mt-0.5">
                    Koi entry fee nahi — sirf naam aur number daalo, account
                    ready!
                  </p>
                </div>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    data-ocid="auth.input"
                  />
                  {errors.name && (
                    <p
                      className="text-destructive text-xs mt-1"
                      data-ocid="auth.error_state"
                    >
                      {errors.name}
                    </p>
                  )}
                </div>
              )}

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  data-ocid="auth.input"
                />
                {errors.phone && (
                  <p
                    className="text-destructive text-xs mt-1"
                    data-ocid="auth.error_state"
                  >
                    {errors.phone}
                  </p>
                )}
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <p className="text-sm text-green-700 dark:text-green-400 font-medium">
                      ✅ Aap loan le bhi sakte hain aur de bhi sakte hain — dono
                      options available hain!
                    </p>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <p className="text-xs text-blue-700 dark:text-blue-400">
                      Pehli baar loan ya transaction karne par sirf ₹1 fee
                      lagegi
                    </p>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                data-ocid="auth.submit_button"
              >
                {isLogin ? "Sign In" : "Create Free Account →"}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrors({});
                }}
                className="text-sm text-primary hover:underline"
              >
                {isLogin
                  ? "New here? Create a free account"
                  : "Already have an account? Sign in"}
              </button>
            </div>

            <div className="mt-4 p-3 bg-secondary rounded-lg">
              <p className="text-xs text-muted-foreground font-semibold mb-2">
                🔑 Demo Login:
              </p>
              <div className="space-y-1">
                {[
                  { name: "Admin (Barkat)", phone: "0000000000" },
                  { name: "Ramesh Kumar (Lender)", phone: "9876543210" },
                  { name: "Suresh Sharma (Borrower)", phone: "9876543211" },
                  { name: "Priya Gupta (Both)", phone: "9876543212" },
                ].map((u) => (
                  <button
                    type="button"
                    key={u.phone}
                    onClick={() => {
                      setPhone(u.phone);
                      setIsLogin(true);
                    }}
                    className="text-xs text-primary hover:underline block"
                  >
                    {u.name} — {u.phone}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2 font-medium">
                Admin login: 0000000000
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  );
}
