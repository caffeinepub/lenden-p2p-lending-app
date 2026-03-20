import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IndianRupee, Shield } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "../store/appStore";
import { PLATFORM_ENTRY_FEE, type UserRole } from "../types";

interface AuthPageProps {
  onNavigate: (page: string) => void;
}

export function AuthPage({ onNavigate }: AuthPageProps) {
  const { users, login, register } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<UserRole>("both");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!isLogin && !name.trim()) errs.name = "नाम आवश्यक है / Name is required";
    if (!phone.trim() || !/^\d{10}$/.test(phone))
      errs.phone = "10 अंकों का फोन नंबर / 10-digit phone required";
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
        setErrors({ phone: "उपयोगकर्ता नहीं मिला / User not found" });
        return;
      }
      login(user);
      toast.success(`स्वागत है ${user.name}!`);
      onNavigate("dashboard");
    } else {
      const existing = users.find((u) => u.phone === phone);
      if (existing) {
        setErrors({ phone: "फोन पहले से पंजीकृत / Phone already registered" });
        return;
      }
      const user = register({ name: name.trim(), phone, role });
      login(user);
      toast.success(
        `पंजीकरण सफल! प्रवेश शुल्क ₹${PLATFORM_ENTRY_FEE} लिया गया। / Registration successful! Entry fee ₹${PLATFORM_ENTRY_FEE} charged.`,
      );
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
            <CardTitle className="text-2xl font-devanagari">
              {isLogin ? "लॉग इन करें" : "पंजीकरण करें"}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {isLogin ? "Sign In" : "Register"}
            </p>
          </CardHeader>
          <CardContent>
            {/* Entry Fee notice on register tab */}
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mb-4 p-3 rounded-lg border border-primary/30 bg-secondary flex items-start gap-3"
                data-ocid="auth.panel"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <IndianRupee className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-primary font-devanagari">
                    प्रवेश शुल्क / Entry Fee: ₹{PLATFORM_ENTRY_FEE}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    पंजीकरण पर एकमुश्त ₹{PLATFORM_ENTRY_FEE} प्लेटफ़ॉर्म शुल्क लिया जाता
                    है।
                  </p>
                  <p className="text-xs text-muted-foreground">
                    A one-time ₹{PLATFORM_ENTRY_FEE} platform entry fee is
                    charged on registration.
                  </p>
                </div>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <Label htmlFor="name" className="font-devanagari">
                    पूरा नाम / Full Name
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="जैसे: रमेश कुमार"
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
                <Label htmlFor="phone" className="font-devanagari">
                  फोन नंबर / Phone Number
                </Label>
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
                <div>
                  <Label className="font-devanagari">भूमिका / Role</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {(["lender", "borrower", "both"] as UserRole[]).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        data-ocid="auth.radio"
                        className={`py-2 px-3 rounded-lg text-sm border transition-colors font-medium ${
                          role === r
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-card border-border text-muted-foreground hover:border-primary"
                        }`}
                      >
                        {r === "lender"
                          ? "ऋणदाता"
                          : r === "borrower"
                            ? "उधारकर्ता"
                            : "दोनों"}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                data-ocid="auth.submit_button"
              >
                {isLogin
                  ? "लॉग इन / Sign In"
                  : `पंजीकरण (₹${PLATFORM_ENTRY_FEE} शुल्क) / Register`}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrors({});
                }}
                className="text-sm text-primary hover:underline font-devanagari"
              >
                {isLogin ? "नया खाता बनाएं? Register" : "पहले से खाता है? Login"}
              </button>
            </div>

            {/* Demo login */}
            <div className="mt-4 p-3 bg-secondary rounded-lg">
              <p className="text-xs text-muted-foreground font-semibold mb-2">
                🔑 Demo Login:
              </p>
              <div className="space-y-1">
                {[
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
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  );
}
