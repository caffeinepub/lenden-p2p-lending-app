import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Check, Copy, IndianRupee } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "../store/appStore";
import type { LoanRequest } from "../types";

const ADMIN_UPI = "barkat.6y@ptyes";
const QR_IMAGE = "/assets/uploads/IMG_20260321_020701-1.jpg";

interface NewLoanRequestProps {
  onNavigate: (page: string) => void;
}

export function NewLoanRequest({ onNavigate }: NewLoanRequestProps) {
  const { currentUser, addLoanRequest } = useApp();
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("");
  const [duration, setDuration] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Payment gate state
  const [step, setStep] = useState<1 | 2>(1);
  const [pendingReq, setPendingReq] = useState<LoanRequest | null>(null);
  const [utr, setUtr] = useState("");
  const [payConfirmed, setPayConfirmed] = useState(false);
  const [copied, setCopied] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    const amt = Number.parseFloat(amount);
    if (!amount || Number.isNaN(amt) || amt <= 0)
      errs.amount = "Amount is required";
    else if (amt > 100000)
      errs.amount = "Maximum loan amount is \u20b91,00,000";
    if (!purpose.trim()) errs.purpose = "Purpose is required";
    const dur = Number.parseInt(duration);
    if (!duration || Number.isNaN(dur) || dur < 1 || dur > 60)
      errs.duration = "Duration must be between 1 and 60 months";
    const ir = Number.parseFloat(interestRate);
    if (!interestRate || Number.isNaN(ir) || ir < 0 || ir > 36)
      errs.interestRate = "Interest rate must be between 0% and 36%";
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    if (!currentUser) return;

    const req: LoanRequest = {
      id: `req${Date.now()}`,
      borrowerId: currentUser.id,
      amount: Number.parseFloat(amount),
      purpose: purpose.trim(),
      durationMonths: Number.parseInt(duration),
      requestedInterestRate: Number.parseFloat(interestRate),
      createdAt: new Date().toISOString().split("T")[0],
    };
    setPendingReq(req);
    setStep(2);
  };

  const commission = pendingReq
    ? Math.round(pendingReq.amount * 0.05)
    : Math.round((Number.parseFloat(amount) || 0) * 0.05);

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(ADMIN_UPI).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleConfirmPayment = () => {
    if (!pendingReq) return;
    const reqWithUtr: LoanRequest = { ...pendingReq, utr: utr.trim() };
    addLoanRequest(reqWithUtr);
    toast.success(
      `Loan request submitted! Commission \u20b9${commission} paid. UTR: ${utr.trim()}`,
    );
    onNavigate("dashboard");
  };

  const canConfirm = utr.trim().length >= 8 && payConfirmed;

  const amt = Number.parseFloat(amount) || 0;
  const dur = Number.parseInt(duration) || 0;
  const ir = Number.parseFloat(interestRate) || 0;
  const totalDue = amt + (((amt * ir) / 100) * dur) / 12;
  const monthlyEMI = dur > 0 ? totalDue / dur : 0;

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <button
        type="button"
        onClick={() => onNavigate("dashboard")}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        data-ocid="newloan.link"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="border-border shadow-md">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <IndianRupee className="w-5 h-5 text-primary" />
                  New Loan Request
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Maximum loan amount: \u20b91,00,000
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <Label>Loan Amount (\u20b9)</Label>
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="e.g. 50000"
                      max={100000}
                      data-ocid="newloan.input"
                    />
                    {errors.amount && (
                      <p
                        className="text-destructive text-xs mt-1"
                        data-ocid="newloan.error_state"
                      >
                        {errors.amount}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label>Purpose of Loan</Label>
                    <Textarea
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      placeholder="e.g. Business expansion, medical expenses..."
                      rows={3}
                      data-ocid="newloan.textarea"
                    />
                    {errors.purpose && (
                      <p
                        className="text-destructive text-xs mt-1"
                        data-ocid="newloan.error_state"
                      >
                        {errors.purpose}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Duration (Months)</Label>
                      <Input
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        placeholder="e.g. 12"
                        min={1}
                        max={60}
                        data-ocid="newloan.input"
                      />
                      {errors.duration && (
                        <p
                          className="text-destructive text-xs mt-1"
                          data-ocid="newloan.error_state"
                        >
                          {errors.duration}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label>Expected Interest Rate (%)</Label>
                      <Input
                        type="number"
                        value={interestRate}
                        onChange={(e) => setInterestRate(e.target.value)}
                        placeholder="e.g. 10"
                        min={0}
                        max={36}
                        step={0.5}
                        data-ocid="newloan.input"
                      />
                      {errors.interestRate && (
                        <p
                          className="text-destructive text-xs mt-1"
                          data-ocid="newloan.error_state"
                        >
                          {errors.interestRate}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Preview Calculation */}
                  {amt > 0 && dur > 0 && (
                    <div className="p-4 bg-secondary rounded-lg space-y-2">
                      <p className="text-sm font-semibold">
                        Estimated Calculation
                      </p>
                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Total Due
                          </p>
                          <p className="font-bold text-primary">
                            \u20b9{totalDue.toFixed(0)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Monthly EMI
                          </p>
                          <p className="font-bold text-primary">
                            \u20b9{monthlyEMI.toFixed(0)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Total Interest
                          </p>
                          <p className="font-bold text-warning">
                            \u20b9{(totalDue - amt).toFixed(0)}
                          </p>
                        </div>
                      </div>
                      {amt > 0 && (
                        <div className="pt-2 border-t border-border">
                          <p className="text-xs text-center text-muted-foreground">
                            Platform commission (5%):{" "}
                            <span className="font-bold text-foreground">
                              \u20b9
                              {Math.round(amt * 0.05).toLocaleString("en-IN")}
                            </span>{" "}
                            \u2014 paid via UPI in next step
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    data-ocid="newloan.submit_button"
                  >
                    Continue to Payment \u2192
                  </Button>
                </form>
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
            <Card className="border-border shadow-md">
              <CardHeader className="pb-2">
                {/* Step indicator */}
                <div
                  className="flex items-center gap-2 mb-4"
                  data-ocid="newloan.panel"
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
                  Pay Platform Commission \u2014 \u20b9
                  {commission.toLocaleString("en-IN")}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  5% of \u20b9
                  {(pendingReq?.amount || 0).toLocaleString("en-IN")} loan
                  amount
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
                    data-ocid="newloan.button"
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
                    3. Pay exactly \u20b9{commission.toLocaleString("en-IN")}{" "}
                    commission
                  </p>
                  <p className="text-xs text-muted-foreground">
                    4. Enter UTR/Transaction ID below
                  </p>
                </div>

                {/* UTR Input */}
                <div>
                  <Label htmlFor="loan-utr">
                    UTR / Transaction Reference Number
                  </Label>
                  <Input
                    id="loan-utr"
                    value={utr}
                    onChange={(e) => setUtr(e.target.value)}
                    placeholder="e.g. 412345678901"
                    data-ocid="newloan.input"
                  />
                  {utr.length > 0 && utr.trim().length < 8 && (
                    <p
                      className="text-destructive text-xs mt-1"
                      data-ocid="newloan.error_state"
                    >
                      UTR must be at least 8 characters
                    </p>
                  )}
                </div>

                {/* Confirmation checkbox */}
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="loan-pay-confirm"
                    checked={payConfirmed}
                    onCheckedChange={(v) => setPayConfirmed(!!v)}
                    data-ocid="newloan.checkbox"
                  />
                  <Label
                    htmlFor="loan-pay-confirm"
                    className="text-sm leading-snug cursor-pointer"
                  >
                    I confirm I have paid \u20b9
                    {commission.toLocaleString("en-IN")} commission via UPI
                  </Label>
                </div>

                {/* Action buttons */}
                <div className="space-y-2">
                  <Button
                    type="button"
                    className="w-full"
                    disabled={!canConfirm}
                    onClick={handleConfirmPayment}
                    data-ocid="newloan.confirm_button"
                  >
                    Confirm Payment &amp; Submit Request
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
                    data-ocid="newloan.cancel_button"
                  >
                    \u2190 Back
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
