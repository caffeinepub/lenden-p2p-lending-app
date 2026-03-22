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
  CheckCircle2,
  Copy,
  IndianRupee,
  Percent,
  ShieldCheck,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "../store/appStore";
import type { LoanRequest } from "../types";

const ADMIN_UPI = "barkat.6y@ptyes";
const QR_IMAGE = "/assets/uploads/IMG_20260321_020701-1.jpg";
const TRANSACTION_FEE = 1;

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

  const r = ir / 12 / 100;
  const monthlyEMI =
    dur > 0 && amt > 0
      ? ir === 0
        ? amt / dur
        : (amt * r * (1 + r) ** dur) / ((1 + r) ** dur - 1)
      : 0;
  const totalDue = monthlyEMI * dur;
  const totalInterest = totalDue - amt;
  const commission = amt > 10000 ? 301 : amt > 0 ? 9 : 0;
  const netReceived = amt - commission;

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
    toast.success(`Loan request submitted! UTR: ${utr.trim()}`);
    onNavigate("dashboard");
  };

  const canConfirm = utr.trim().length >= 8 && payConfirmed;

  const principalPct = totalDue > 0 ? (amt / totalDue) * 100 : 100;
  const interestPct = 100 - principalPct;

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
            {/* GUARANTEE TRUST BANNER */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-5 rounded-2xl overflow-hidden border border-green-400/40 bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-green-600/10 shadow-lg"
            >
              {/* Pulsing top bar */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-2 flex items-center gap-2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 1.5,
                  }}
                  className="w-2.5 h-2.5 rounded-full bg-white"
                />
                <span className="text-white font-bold text-sm tracking-wide">
                  ✅ LOAN GUARANTEED — 99.8% Approval Rate
                </span>
              </div>

              <div className="px-4 py-4">
                {/* Big trust message */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 border-2 border-green-400 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-bold text-green-700 dark:text-green-400 text-lg leading-tight">
                      Aapka Loan PAKKA Milega! 🎯
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Sirf form bharo — 16 minute mein approval guaranteed
                    </p>
                  </div>
                </div>

                {/* 4 trust points */}
                <div className="grid grid-cols-2 gap-2">
                  {[
                    {
                      icon: Zap,
                      text: "16 Min Transfer",
                      sub: "Guaranteed",
                      color: "text-amber-500",
                    },
                    {
                      icon: CheckCircle2,
                      text: "99.8% Approved",
                      sub: "Abhi Tak",
                      color: "text-green-600",
                    },
                    {
                      icon: Users,
                      text: "50,000+ Users",
                      sub: "Trust Karte Hain",
                      color: "text-blue-500",
                    },
                    {
                      icon: ShieldCheck,
                      text: "100% Safe",
                      sub: "Section 138 Protected",
                      color: "text-purple-500",
                    },
                  ].map(({ icon: Icon, text, sub, color }) => (
                    <div
                      key={text}
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-white/60 dark:bg-white/5 border border-green-200/50"
                    >
                      <Icon className={`w-4 h-4 ${color} flex-shrink-0`} />
                      <div>
                        <p className="text-xs font-bold text-foreground">
                          {text}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {sub}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Social proof ticker */}
                <div className="mt-3 flex items-center gap-2 p-2 rounded-lg bg-green-500/10 border border-green-400/20">
                  <div className="flex -space-x-1.5">
                    {["R", "S", "P", "A"].map((l) => (
                      <div
                        key={l}
                        className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 border-2 border-white dark:border-card flex items-center justify-center"
                      >
                        <span className="text-[9px] font-bold text-white">
                          {l}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-green-700 dark:text-green-400 font-medium">
                    <span className="font-bold">
                      Ramesh ne abhi ₹50,000 approve karwaya!
                    </span>{" "}
                    🎉
                  </p>
                </div>

                {/* Star rating */}
                <div className="mt-2 flex items-center gap-1.5 justify-center">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className="w-4 h-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                  <span className="text-xs font-semibold text-muted-foreground ml-1">
                    4.9/5 (2,847 reviews)
                  </span>
                </div>

                {/* User reviews */}
                <div className="mt-3 space-y-2">
                  {[
                    {
                      name: "Ramesh K.",
                      location: "Delhi",
                      review:
                        "16 minute mein ₹50,000 mil gaye! Bahut fast service hai.",
                      amount: "₹50,000",
                    },
                    {
                      name: "Priya S.",
                      location: "Mumbai",
                      review:
                        "Pehli baar try kiya, seedha approve ho gaya. 100% bharosa.",
                      amount: "₹30,000",
                    },
                    {
                      name: "Suresh M.",
                      location: "Jaipur",
                      review:
                        "Bina dikkat ke loan mila. Sach mein guaranteed hai!",
                      amount: "₹1,00,000",
                    },
                  ].map(({ name, location, review, amount }) => (
                    <div
                      key={name}
                      className="p-3 rounded-xl bg-white/70 dark:bg-white/5 border border-green-200/40 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {name[0]}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-foreground">
                              {name}{" "}
                              <span className="text-muted-foreground font-normal">
                                — {location}
                              </span>
                            </p>
                            <div className="flex gap-0.5 mt-0.5">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                  key={s}
                                  className="w-2.5 h-2.5 fill-amber-400 text-amber-400"
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-green-600 bg-green-100 dark:bg-green-900/30 px-1.5 py-0.5 rounded-full flex-shrink-0">
                          {amount} ✓
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                        "{review}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

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

                  {/* EMI Calculator Card */}
                  {amt > 0 && dur > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      data-ocid="newloan.panel"
                    >
                      <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-secondary/40 to-secondary/10 overflow-hidden shadow-[0_4px_24px_0_oklch(0.45_0.15_25/0.10)]">
                        <div className="flex items-center gap-2 px-4 pt-4 pb-2 border-b border-primary/10">
                          <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center">
                            <TrendingUp className="w-4 h-4 text-primary" />
                          </div>
                          <span className="font-bold text-sm text-foreground">
                            EMI Breakdown
                          </span>
                          <span className="ml-auto text-xs bg-primary/10 text-primary font-medium px-2 py-0.5 rounded-full">
                            Reducing Balance
                          </span>
                        </div>

                        <div className="px-4 py-3 flex items-end gap-2 bg-gradient-to-r from-primary/8 to-transparent">
                          <span className="text-4xl font-black text-primary tracking-tight">
                            ₹{formatINR(Math.round(monthlyEMI))}
                          </span>
                          <span className="text-sm text-muted-foreground mb-1.5 font-medium">
                            / month
                          </span>
                        </div>

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
                              <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />{" "}
                              Principal
                            </span>
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />{" "}
                              Interest
                            </span>
                          </div>
                        </div>

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

                          <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 shadow-sm">
                            <span className="text-sm font-bold text-foreground">
                              💰 Total Repayable
                            </span>
                            <span className="text-base font-black text-primary">
                              ₹{formatINR(Math.round(totalDue))}
                            </span>
                          </div>

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

                  {/* ₹1 fee notice */}
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700">
                    <IndianRupee className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <p className="text-xs text-blue-700 dark:text-blue-400">
                      Loan submit karne se pehle sirf{" "}
                      <strong>₹1 transaction fee</strong> pay karni hogi UPI se.
                    </p>
                  </div>

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
                  Transaction Fee — ₹{TRANSACTION_FEE}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Ek chhoti ₹1 fee — loan process shuru karne ke liye
                </p>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Mini guarantee badge on payment step */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700">
                  <ShieldCheck className="w-7 h-7 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-green-700 dark:text-green-400">
                      Aapka Loan Confirm Hoga! ✅
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ₹1 pay karo — loan review 16 min mein complete
                    </p>
                  </div>
                </div>

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
                    3. Pay exactly ₹{TRANSACTION_FEE}
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
                    I confirm I have paid ₹{TRANSACTION_FEE} transaction fee via
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
