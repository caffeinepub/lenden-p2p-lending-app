import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Copy, IndianRupee, Shield } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "../store/appStore";
import { PLATFORM_ENTRY_FEE, type UserRole } from "../types";

const ADMIN_UPI = "barkat.6y@ptyes";
const QR_IMAGE = "/assets/uploads/IMG_20260321_020701-1.jpg";

interface AuthPageProps {
  onNavigate: (page: string) => void;
}

export function AuthPage({ onNavigate }: AuthPageProps) {
  const { users, login, register } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Payment gate state
  const [step, setStep] = useState<1 | 2>(1);
  const [pendingData, setPendingData] = useState<{
    name: string;
    phone: string;
    role: UserRole;
  } | null>(null);
  const [utr, setUtr] = useState("");
  const [payConfirmed, setPayConfirmed] = useState(false);
  const [copied, setCopied] = useState(false);

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
      // Save form data and move to payment step
      setPendingData({ name: name.trim(), phone, role: "both" });
      setStep(2);
    }
  };

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(ADMIN_UPI).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleConfirmPayment = () => {
    if (!pendingData) return;
    const user = register(
      {
        name: pendingData.name,
        phone: pendingData.phone,
        role: pendingData.role,
      },
      utr.trim(),
    );
    login(user);
    toast.success(
      `Registration successful! Entry fee \u20b9${PLATFORM_ENTRY_FEE} paid. UTR: ${utr.trim()}`,
    );
    onNavigate("dashboard");
  };

  const canConfirm = utr.trim().length >= 8 && payConfirmed;

  return (
    <main className="min-h-screen flex items-center justify-center py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
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
                        <p className="text-sm font-bold text-primary">
                          Entry Fee: \u20b9{PLATFORM_ENTRY_FEE}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          A one-time \u20b9{PLATFORM_ENTRY_FEE} platform entry
                          fee is charged on registration. You will pay via UPI
                          in the next step.
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
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <p className="text-sm text-green-700 dark:text-green-400 font-medium">
                          ✅ Aap loan le bhi sakte hain aur de bhi sakte hain --
                          dono options available hain!
                        </p>
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full"
                      data-ocid="auth.submit_button"
                    >
                      {isLogin ? "Sign In" : "Continue to Payment \u2192"}
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
                        ? "New here? Create an account"
                        : "Already have an account? Sign in"}
                    </button>
                  </div>

                  <div className="mt-4 p-3 bg-secondary rounded-lg">
                    <p className="text-xs text-muted-foreground font-semibold mb-2">
                      \ud83d\udd11 Demo Login:
                    </p>
                    <div className="space-y-1">
                      {[
                        { name: "Admin (Barkat)", phone: "0000000000" },
                        { name: "Ramesh Kumar (Lender)", phone: "9876543210" },
                        {
                          name: "Suresh Sharma (Borrower)",
                          phone: "9876543211",
                        },
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
                          {u.name} \u2014 {u.phone}
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
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <Card className="shadow-lg border-border">
                <CardHeader className="pb-2">
                  {/* Step indicator */}
                  <div
                    className="flex items-center gap-2 mb-4"
                    data-ocid="auth.panel"
                  >
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold">
                        \u2713
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Step 1: Details
                      </span>
                    </div>
                    <div className="flex-1 h-px bg-border" />
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                        2
                      </div>
                      <span className="text-xs font-semibold text-primary">
                        Step 2: Payment
                      </span>
                    </div>
                  </div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <IndianRupee className="w-5 h-5 text-primary" />
                    Pay Entry Fee \u2014 \u20b9{PLATFORM_ENTRY_FEE}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Complete UPI payment to finish registration
                  </p>
                </CardHeader>
                <CardContent className="space-y-5">
                  {/* QR Code */}
                  <div className="flex justify-center">
                    <img
                      src={QR_IMAGE}
                      alt="UPI QR Code"
                      className="rounded-xl border border-border"
                      style={{ maxHeight: 200, objectFit: "contain" }}
                    />
                  </div>

                  {/* UPI ID */}
                  <div className="flex items-center gap-2 p-3 bg-secondary rounded-lg">
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">UPI ID</p>
                      <p className="font-bold text-primary text-sm">
                        {ADMIN_UPI}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleCopyUPI}
                      data-ocid="auth.button"
                    >
                      {copied ? (
                        <Check className="w-3.5 h-3.5 text-green-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      {copied ? "Copied!" : "Copy"}
                    </Button>
                  </div>

                  {/* Instructions */}
                  <div className="p-3 bg-secondary/60 rounded-lg space-y-1">
                    <p className="text-xs font-semibold text-foreground">
                      Payment Steps:
                    </p>
                    <p className="text-xs text-muted-foreground">
                      1. Open Google Pay / PhonePe / Paytm
                    </p>
                    <p className="text-xs text-muted-foreground">
                      2. Scan QR or enter UPI ID
                    </p>
                    <p className="text-xs text-muted-foreground">
                      3. Pay exactly \u20b91
                    </p>
                    <p className="text-xs text-muted-foreground">
                      4. Enter UTR/Transaction ID below
                    </p>
                  </div>

                  {/* UTR Input */}
                  <div>
                    <Label htmlFor="utr">
                      UTR / Transaction Reference Number
                    </Label>
                    <Input
                      id="utr"
                      value={utr}
                      onChange={(e) => setUtr(e.target.value)}
                      placeholder="e.g. 412345678901"
                      data-ocid="auth.input"
                    />
                    {utr.length > 0 && utr.trim().length < 8 && (
                      <p
                        className="text-destructive text-xs mt-1"
                        data-ocid="auth.error_state"
                      >
                        UTR must be at least 8 characters
                      </p>
                    )}
                  </div>

                  {/* Confirmation checkbox */}
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="pay-confirm"
                      checked={payConfirmed}
                      onCheckedChange={(v) => setPayConfirmed(!!v)}
                      data-ocid="auth.checkbox"
                    />
                    <Label
                      htmlFor="pay-confirm"
                      className="text-sm leading-snug cursor-pointer"
                    >
                      I confirm I have paid \u20b9{PLATFORM_ENTRY_FEE} entry fee
                      via UPI
                    </Label>
                  </div>

                  {/* Action buttons */}
                  <div className="space-y-2">
                    <Button
                      type="button"
                      className="w-full"
                      disabled={!canConfirm}
                      onClick={handleConfirmPayment}
                      data-ocid="auth.confirm_button"
                    >
                      Confirm Payment &amp; Register
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full"
                      onClick={() => {
                        setStep(1);
                        setUtr("");
                        setPayConfirmed(false);
                      }}
                      data-ocid="auth.cancel_button"
                    >
                      \u2190 Back
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </main>
  );
}
