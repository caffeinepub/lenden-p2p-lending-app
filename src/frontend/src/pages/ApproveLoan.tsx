import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Check,
  CheckCircle,
  Copy,
  IndianRupee,
  Info,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "../store/appStore";
import {
  type Loan,
  commissionLabel,
  computeCommission,
  computeNetAmount,
  formatCurrency,
} from "../types";

const ADMIN_UPI = "barkat.6y@ptyes";
const QR_IMAGE = "/assets/uploads/IMG_20260321_020701-1.jpg";
const TRANSACTION_FEE = 1;

interface ApproveLoanProps {
  onNavigate: (page: string) => void;
}

export function ApproveLoan({ onNavigate }: ApproveLoanProps) {
  const { currentUser, loanRequests, users, addLoan, removeLoanRequest } =
    useApp();
  const [rates, setRates] = useState<Record<string, string>>({});

  // Payment gate for lender before approving
  const [payStep, setPayStep] = useState<{ reqId: string } | null>(null);
  const [utr, setUtr] = useState("");
  const [payConfirmed, setPayConfirmed] = useState(false);
  const [copied, setCopied] = useState(false);

  const getUserName = (id: string) =>
    users.find((u) => u.id === id)?.name ?? "Unknown";

  const handleApproveClick = (reqId: string) => {
    const rateStr = rates[reqId];
    const req = loanRequests.find((r) => r.id === reqId);
    if (!req) return;
    const rate = Number.parseFloat(
      rateStr ?? req.requestedInterestRate.toString(),
    );
    if (Number.isNaN(rate) || rate < 0 || rate > 36) {
      toast.error("Please enter a valid interest rate (0-36%)");
      return;
    }
    setPayStep({ reqId });
    setUtr("");
    setPayConfirmed(false);
  };

  const handleConfirmAndApprove = () => {
    if (!payStep || !currentUser) return;
    const reqId = payStep.reqId;
    const req = loanRequests.find((r) => r.id === reqId);
    if (!req) return;

    const rateStr = rates[reqId] ?? req.requestedInterestRate.toString();
    const rate = Number.parseFloat(rateStr);
    const borrower = users.find((u) => u.id === req.borrowerId);
    const commission = computeCommission(req.amount);
    const netAmount = computeNetAmount(req.amount);

    const note = [
      `This Promissory Note is created on ${new Date().toLocaleDateString("en-IN")}.`,
      `Borrower: ${borrower?.name ?? "Unknown"}`,
      `Lender: ${currentUser.name}`,
      "",
      "── Loan Details ──",
      `Principal: ₹${req.amount.toLocaleString("en-IN")}`,
      `Interest Rate: ${rate}% per annum`,
      `Duration: ${req.durationMonths} months`,
      "",
      "── Platform Fees ──",
      `Commission (${commissionLabel(req.amount)}): ₹${commission.toLocaleString("en-IN")}`,
      `Net Amount to Borrower: ₹${netAmount.toLocaleString("en-IN")}`,
      "Exit Fee (on loan closure): ₹1",
      "",
      "── Legal Notice ──",
      "This is a legally binding document. Non-payment may result in legal action under Section 138 of the Negotiable Instruments Act, 1881.",
    ].join("\n");

    const loan: Loan = {
      id: `l${Date.now()}`,
      borrowerId: req.borrowerId,
      lenderId: currentUser.id,
      amount: req.amount,
      purpose: req.purpose,
      durationMonths: req.durationMonths,
      interestRate: rate,
      status: "active",
      startDate: new Date().toISOString().split("T")[0],
      legalStatus: "normal",
      promissoryNote: note,
      commissionAmount: commission,
      netAmountToBorrower: netAmount,
    };

    addLoan(loan);
    removeLoanRequest(reqId);
    setPayStep(null);
    toast.success(`Loan approved! UTR: ${utr.trim()}`);
  };

  const handleReject = (reqId: string) => {
    removeLoanRequest(reqId);
    toast.info("Loan request rejected");
  };

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(ADMIN_UPI).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const canConfirm = utr.trim().length >= 8 && payConfirmed;

  // --- Payment gate screen ---
  if (payStep) {
    return (
      <main className="max-w-md mx-auto px-4 py-8">
        <button
          type="button"
          onClick={() => setPayStep(null)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <Card className="border-border shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-primary" />
              Transaction Fee — ₹{TRANSACTION_FEE}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Loan approve karne se pehle sirf ₹1 fee pay karein
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700">
              <ShieldCheck className="w-7 h-7 text-green-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-bold text-green-700 dark:text-green-400">
                  Loan Approve Hoga! ✅
                </p>
                <p className="text-xs text-muted-foreground">
                  ₹1 pay karke loan turant approve karein
                </p>
              </div>
            </div>

            <div className="flex justify-center">
              <img
                src={QR_IMAGE}
                alt="UPI QR Code"
                className="rounded-xl border border-border"
                style={{ maxHeight: 200, objectFit: "contain" }}
              />
            </div>

            <div className="flex items-center gap-2 p-3 bg-secondary rounded-lg">
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">UPI ID</p>
                <p className="font-bold text-primary text-sm">{ADMIN_UPI}</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopyUPI}
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-green-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>

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

            <div>
              <Label htmlFor="approve-utr">
                UTR / Transaction Reference Number
              </Label>
              <Input
                id="approve-utr"
                value={utr}
                onChange={(e) => setUtr(e.target.value)}
                placeholder="e.g. 412345678901"
              />
              {utr.length > 0 && utr.trim().length < 8 && (
                <p className="text-destructive text-xs mt-1">
                  UTR must be at least 8 characters
                </p>
              )}
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                id="approve-pay-confirm"
                checked={payConfirmed}
                onCheckedChange={(v) => setPayConfirmed(!!v)}
              />
              <Label
                htmlFor="approve-pay-confirm"
                className="text-sm leading-snug cursor-pointer"
              >
                I confirm I have paid ₹{TRANSACTION_FEE} transaction fee via UPI
              </Label>
            </div>

            <div className="space-y-2">
              <Button
                type="button"
                className="w-full"
                disabled={!canConfirm}
                onClick={handleConfirmAndApprove}
              >
                Confirm & Approve Loan
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => setPayStep(null)}
              >
                ← Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  // --- Loan list screen ---
  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <button
        type="button"
        onClick={() => onNavigate("dashboard")}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
        data-ocid="approve.link"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <h1 className="text-2xl font-bold mb-2">Loan Requests</h1>
      <p className="text-muted-foreground text-sm mb-6">
        Review and approve loan requests. ₹1 transaction fee on each approval.
      </p>

      {loanRequests.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg">No pending loan requests</p>
        </div>
      ) : (
        <div className="space-y-4">
          {loanRequests.map((req) => (
            <motion.div
              key={req.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-border">
                <CardContent className="pt-5">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="space-y-1">
                      <p className="font-semibold text-foreground">
                        {getUserName(req.borrowerId)}
                      </p>
                      <p className="text-2xl font-black text-primary">
                        {formatCurrency(req.amount)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {req.purpose}
                      </p>
                      <div className="flex gap-3 text-xs text-muted-foreground mt-1">
                        <span>⏱ {req.durationMonths} months</span>
                        <span>📅 {req.createdAt}</span>
                        <span>📈 {req.requestedInterestRate}%</span>
                      </div>
                      {req.utr && (
                        <p className="text-xs text-muted-foreground">
                          UTR: {req.utr}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 min-w-[160px]">
                      <div>
                        <Label className="text-xs">
                          Your Interest Rate (%)
                        </Label>
                        <Input
                          type="number"
                          value={rates[req.id] ?? req.requestedInterestRate}
                          onChange={(e) =>
                            setRates((r) => ({
                              ...r,
                              [req.id]: e.target.value,
                            }))
                          }
                          min={0}
                          max={36}
                          step={0.5}
                          className="h-8 text-sm"
                          data-ocid="approve.input"
                        />
                      </div>
                      <Button
                        size="sm"
                        className="gap-1 bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleApproveClick(req.id)}
                        data-ocid="approve.approve_button"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1 text-destructive border-destructive/30"
                        onClick={() => handleReject(req.id)}
                        data-ocid="approve.reject_button"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </Button>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-2 rounded-lg bg-secondary">
                      <p className="text-xs text-muted-foreground">
                        Commission
                      </p>
                      <p className="font-bold text-sm text-destructive">
                        {formatCurrency(computeCommission(req.amount))}
                      </p>
                    </div>
                    <div className="p-2 rounded-lg bg-secondary">
                      <p className="text-xs text-muted-foreground">
                        Net to Borrower
                      </p>
                      <p className="font-bold text-sm text-green-600">
                        {formatCurrency(computeNetAmount(req.amount))}
                      </p>
                    </div>
                    <div className="p-2 rounded-lg bg-secondary">
                      <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                        <Info className="w-3 h-3" /> Platform Fee
                      </p>
                      <p className="font-bold text-sm">
                        {commissionLabel(req.amount)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </main>
  );
}
