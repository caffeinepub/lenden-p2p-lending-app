import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  BadgeIndianRupee,
  CalendarDays,
  Check,
  Copy,
  IndianRupee,
  Percent,
  TrendingUp,
} from "lucide-react";
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

function formatINR(n: number) {
  return n.toLocaleString("en-IN");
}

export function NewLoanRequest({ onNavigate }: NewLoanRequestProps) {
  const { currentUser, addLoanRequest } = useApp();
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("");
  const [duration, setDuration] = useState("");
  const [interestRate, setInterestRate] = useState("5");
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
    else if (amt < 1000 || amt > 5000000)
      errs.amount = "Amount must be between ₹1,000 and ₹50,00,000";
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

  const amt = Number.parseFloat(amount) || 0;
  const dur = Number.parseInt(duration) || 0;
  const ir = Number.parseFloat(interestRate) || 0;

  // Reducing balance EMI formula
  const r = ir / 12 / 100;
  const monthlyEMI =
    dur > 0 && amt > 0
      ? ir === 0
        ? amt / dur
        : (amt * r * (1 + r) ** dur) / ((1 + r) ** dur - 1)
      : 0;
  const totalDue = monthlyEMI * dur;
  const totalInterest = totalDue - amt;
  const commission = Math.round(amt * 0.07);
  const netReceived = amt - commission;

  // For pending req (step 2)
  const pendingCommission = pendingReq
    ? Math.round(pendingReq.amount * 0.07)
    : commission;

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
      `Loan request submitted! Commission ₹${pendingCommission} paid. UTR: ${utr.trim()}`,
    );
    onNavigate("dashboard");
  };

  const canConfirm = utr.trim().length >= 8 && payConfirmed;

  // Principal vs interest ratio for visual bar
  const principalPct = totalDue > 0 ? (amt / totalDue) * 100 : 100;
  const interestPct = 100 - principalPct;

  // Mini EMI schedule (first 5 months, reducing balance)
  const emiSchedule = (() => {
    if (dur <= 0 || amt <= 0) return [];
    const rows: {
      month: number;
      emi: number;
      interest: number;
      principal: number;
    }[] = [];
    let balance = amt;
    const monthR = ir === 0 ? 0 : ir / 12 / 100;
    for (let i = 0; i < Math.min(5, dur); i++) {
      const interest = balance * monthR;
      const principal = monthlyEMI - interest;
      balance = Math.max(0, balance - principal);
      rows.push({ month: i + 1, emi: monthlyEMI, interest, principal });
    }
    return rows;
  })();

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
                  Loan limit: ₹1,000 – ₹50,00,000 · Fast Approval ⚡ in 16 Min
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Loan Amount */}
                  <div className="space-y-2">
                    <Label>Loan Amount (₹)</Label>
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="e.g. 50000"
                      min={1000}
                      max={5000000}
                      data-ocid="newloan.input"
                    />
                    <Slider
                      min={1000}
                      max={500000}
                      step={1000}
                      value={[amt || 1000]}
                      onValueChange={([v]) => setAmount(String(v))}
                      className="mt-1"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>₹1,000</span>
                      <span>₹5,00,000</span>
                    </div>
                    {errors.amount && (
                      <p
                        className="text-destructive text-xs"
                        data-ocid="newloan.error_state"
                      >
                        {errors.amount}
                      </p>
                    )}
                  </div>

                  {/* Purpose */}
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

                  {/* Duration */}
                  <div className="space-y-2">
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
                    <Slider
                      min={1}
                      max={60}
                      step={1}
                      value={[dur || 1]}
                      onValueChange={([v]) => setDuration(String(v))}
                      className="mt-1"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>1 month</span>
                      <span>60 months</span>
                    </div>
                    {errors.duration && (
                      <p
                        className="text-destructive text-xs"
                        data-ocid="newloan.error_state"
                      >
                        {errors.duration}
                      </p>
                    )}
                  </div>

                  {/* Interest Rate */}
                  <div className="space-y-2">
                    <Label>Interest Rate (%) — Default 5%</Label>
                    <Input
                      type="number"
                      value={interestRate}
                      onChange={(e) => setInterestRate(e.target.value)}
                      placeholder="5"
                      min={0}
                      max={36}
                      step={0.5}
                      data-ocid="newloan.input"
                    />
                    <Slider
                      min={0}
                      max={36}
                      step={0.5}
                      value={[ir || 5]}
                      onValueChange={([v]) => setInterestRate(String(v))}
                      className="mt-1"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0%</span>
                      <span>36%</span>
                    </div>
                    {errors.interestRate && (
                      <p
                        className="text-destructive text-xs"
                        data-ocid="newloan.error_state"
                      >
                        {errors.interestRate}
                      </p>
                    )}
                  </div>

                  {/* ── EMI Calculator Card ── */}
                  {amt > 0 && dur > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      data-ocid="newloan.panel"
                    >
                      <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-secondary/40 to-secondary/10 overflow-hidden shadow-[0_4px_24px_0_oklch(0.45_0.15_25/0.10)]">
                        {/* Header */}
                        <div className="flex items-center gap-2 px-4 pt-4 pb-2 border-b border-primary/10">
                          <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center">
                            <TrendingUp className="w-4 h-4 text-primary" />
                          </div>
                          <span className="font-bold text-sm text-foreground">
                            EMI Breakdown
                          </span>
                          <span className="ml-auto text-xs bg-primary/10 text-primary font-medium px-2 py-0.5 rounded-full">
                            Flat Rate
                          </span>
                        </div>

                        {/* Monthly EMI — hero */}
                        <div className="px-4 py-3 flex items-end gap-2 bg-gradient-to-r from-primary/8 to-transparent">
                          <span className="text-4xl font-black text-primary tracking-tight">
                            ₹{formatINR(Math.round(monthlyEMI))}
                          </span>
                          <span className="text-sm text-muted-foreground mb-1.5 font-medium">
                            / month
                          </span>
                        </div>

                        {/* Visual split bar */}
                        <div className="px-4 pb-3">
                          <div className="h-2.5 rounded-full overflow-hidden flex">
                            <div
                              className="bg-green-500 transition-all duration-500"
                              style={{ width: `${principalPct}%` }}
                            />
                            <div
                              className="bg-amber-400 transition-all duration-500"
                              style={{ width: `${interestPct}%` }}
                            />
                          </div>
                          <div className="flex items-center gap-4 mt-1.5">
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
                              Principal
                            </span>
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                              Interest
                            </span>
                          </div>
                        </div>

                        {/* Breakdown rows */}
                        <div className="px-4 pb-4 space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-3">
                              <div className="flex items-center gap-1.5 mb-1">
                                <BadgeIndianRupee className="w-3.5 h-3.5 text-green-600" />
                                <span className="text-xs text-green-700 dark:text-green-400 font-medium">
                                  Principal
                                </span>
                              </div>
                              <p className="font-bold text-green-700 dark:text-green-400">
                                ₹{formatINR(amt)}
                              </p>
                            </div>

                            <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-3">
                              <div className="flex items-center gap-1.5 mb-1">
                                <Percent className="w-3.5 h-3.5 text-amber-600" />
                                <span className="text-xs text-amber-700 dark:text-amber-400 font-medium">
                                  Total Interest
                                </span>
                              </div>
                              <p className="font-bold text-amber-700 dark:text-amber-400">
                                ₹{formatINR(Math.round(totalInterest))}
                              </p>
                            </div>

                            <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3">
                              <div className="flex items-center gap-1.5 mb-1">
                                <IndianRupee className="w-3.5 h-3.5 text-red-600" />
                                <span className="text-xs text-red-700 dark:text-red-400 font-medium">
                                  Commission (7%)
                                </span>
                              </div>
                              <p className="font-bold text-red-700 dark:text-red-400">
                                ₹{formatINR(commission)}
                              </p>
                            </div>

                            <div className="rounded-lg bg-primary/10 border border-primary/20 p-3">
                              <div className="flex items-center gap-1.5 mb-1">
                                <CalendarDays className="w-3.5 h-3.5 text-primary" />
                                <span className="text-xs text-primary font-medium">
                                  Net You Receive
                                </span>
                              </div>
                              <p className="font-bold text-primary">
                                ₹{formatINR(netReceived)}
                              </p>
                            </div>
                          </div>

                          {/* Total repayable */}
                          <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 shadow-sm">
                            <span className="text-sm font-bold text-foreground">
                              💰 Total Repayable
                            </span>
                            <span className="text-base font-black text-primary">
                              ₹{formatINR(Math.round(totalDue))}
                            </span>
                          </div>

                          {/* Mini EMI schedule */}
                          {emiSchedule.length > 0 && (
                            <div className="rounded-lg border border-border overflow-hidden">
                              <div className="bg-muted/50 px-3 py-1.5">
                                <span className="text-xs font-semibold text-muted-foreground">
                                  EMI Schedule (First 5 Months)
                                </span>
                              </div>
                              <table className="w-full text-xs">
                                <thead>
                                  <tr className="border-b border-border">
                                    <th className="text-left px-3 py-1.5 text-muted-foreground font-medium">
                                      Month
                                    </th>
                                    <th className="text-right px-3 py-1.5 text-muted-foreground font-medium">
                                      EMI
                                    </th>
                                    <th className="text-right px-3 py-1.5 text-muted-foreground font-medium">
                                      Interest
                                    </th>
                                    <th className="text-right px-3 py-1.5 text-muted-foreground font-medium">
                                      Principal
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {emiSchedule.map((row) => (
                                    <tr
                                      key={row.month}
                                      className="border-b last:border-0 border-border"
                                    >
                                      <td className="px-3 py-1.5 font-medium">
                                        {row.month}
                                      </td>
                                      <td className="text-right px-3 py-1.5 font-bold text-primary">
                                        ₹{formatINR(Math.round(row.emi))}
                                      </td>
                                      <td className="text-right px-3 py-1.5 text-amber-600">
                                        ₹{formatINR(Math.round(row.interest))}
                                      </td>
                                      <td className="text-right px-3 py-1.5 text-green-600">
                                        ₹{formatINR(Math.round(row.principal))}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => onNavigate("emi-calculator")}
                            className="w-full text-xs text-primary font-semibold flex items-center justify-center gap-1.5 py-2 hover:underline transition-colors"
                            data-ocid="newloan.link"
                          >
                            View Full EMI Schedule &rarr;
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    data-ocid="newloan.submit_button"
                  >
                    Continue to Payment →
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
                      ✓
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
                  Pay Platform Commission — ₹
                  {pendingCommission.toLocaleString("en-IN")}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  7% of ₹{(pendingReq?.amount || 0).toLocaleString("en-IN")}{" "}
                  loan amount
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
                    3. Pay exactly ₹{pendingCommission.toLocaleString("en-IN")}{" "}
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
                    I confirm I have paid ₹
                    {pendingCommission.toLocaleString("en-IN")} commission via
                    UPI
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
                    Confirm Payment & Submit Request
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
                    ← Back
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
