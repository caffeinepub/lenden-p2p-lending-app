import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, CheckCircle, IndianRupee, QrCode } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "../store/appStore";
import {
  type FeeRecord,
  PLATFORM_EXIT_FEE,
  type Repayment,
  computeMonthlyInstallment,
  computeTotalDue,
  formatCurrency,
} from "../types";
import { PaymentSuccess } from "./PaymentSuccess";

interface MakeRepaymentProps {
  onNavigate: (page: string) => void;
}

export function MakeRepayment({ onNavigate }: MakeRepaymentProps) {
  const {
    currentUser,
    loans,
    repayments,
    users,
    addRepayment,
    addFeeRecord,
    updateLoan,
  } = useApp();
  const [selectedLoanId, setSelectedLoanId] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showQR, setShowQR] = useState(false);
  const [successData, setSuccessData] = useState<{
    amount: number;
    loanId: string;
    lenderName: string;
    isLoanClosed: boolean;
  } | null>(null);

  const borrowerLoans = loans.filter(
    (l) => l.borrowerId === currentUser?.id && l.status === "active",
  );

  const selectedLoan = borrowerLoans.find((l) => l.id === selectedLoanId);
  const totalDue = selectedLoan ? computeTotalDue(selectedLoan) : 0;
  const alreadyPaid = selectedLoan
    ? repayments
        .filter((r) => r.loanId === selectedLoan.id)
        .reduce((s, r) => s + r.amount, 0)
    : 0;
  const remaining = Math.max(0, totalDue - alreadyPaid);
  const emi = selectedLoan ? computeMonthlyInstallment(selectedLoan) : 0;
  const lenderName = selectedLoan
    ? (users.find((u) => u.id === selectedLoan.lenderId)?.name ?? "")
    : "";

  const paymentAmt = Number.parseFloat(amount) || 0;
  const willComplete =
    selectedLoan && paymentAmt > 0 && alreadyPaid + paymentAmt >= totalDue;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!selectedLoanId) errs.loan = "Please select a loan";
    const amt = Number.parseFloat(amount);
    if (!amount || Number.isNaN(amt) || amt <= 0)
      errs.amount = "Amount is required";
    else if (amt > remaining)
      errs.amount = `Maximum remaining amount is ${formatCurrency(remaining)}`;
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    if (!currentUser || !selectedLoan) return;

    const r: Repayment = {
      id: `r${Date.now()}`,
      loanId: selectedLoanId,
      amount: paymentAmt,
      date: new Date().toISOString().split("T")[0],
      note: note.trim() || "Installment",
    };
    addRepayment(r);

    let loanClosed = false;
    if (willComplete) {
      const exitFee: FeeRecord = {
        id: `fee_exit_${Date.now()}`,
        type: "exit",
        amount: PLATFORM_EXIT_FEE,
        userId: currentUser.id,
        loanId: selectedLoanId,
        date: new Date().toISOString().split("T")[0],
        description: `Exit Fee — Loan closed: ${formatCurrency(selectedLoan.amount)}`,
      };
      addFeeRecord(exitFee);
      updateLoan({ ...selectedLoan, status: "completed" });
      loanClosed = true;
      toast.success(`Loan fully paid! Exit fee ₹${PLATFORM_EXIT_FEE} charged.`);
    } else {
      toast.success("Payment recorded successfully!");
    }

    // Show success screen
    setSuccessData({
      amount: paymentAmt,
      loanId: selectedLoanId,
      lenderName,
      isLoanClosed: loanClosed,
    });

    setAmount("");
    setNote("");
    setSelectedLoanId("");
    setErrors({});
  };

  // Show post-payment success screen
  if (successData) {
    return (
      <PaymentSuccess
        amount={successData.amount}
        loanId={successData.loanId}
        lenderName={successData.lenderName}
        isLoanClosed={successData.isLoanClosed}
        onNavigate={onNavigate}
      />
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <button
        type="button"
        onClick={() => onNavigate("dashboard")}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
        data-ocid="repayment.link"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* UPI Payment Info Card */}
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center">
                  <QrCode className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Pay via UPI</p>
                  <p className="text-xs text-muted-foreground">
                    barkat.6y@ptyes
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowQR(!showQR)}
                className="text-xs"
              >
                {showQR ? "Hide QR" : "Show QR"}
              </Button>
            </div>

            {showQR && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4 text-center"
              >
                <img
                  src="/assets/uploads/IMG_20260321_020701-1.jpg"
                  alt="UPI QR Code"
                  className="w-52 h-52 object-contain mx-auto rounded-lg border border-border"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Scan with Google Pay / PhonePe / Paytm
                </p>
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* Repayment Form */}
        <Card className="border-border shadow-md">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              Make a Repayment
            </CardTitle>
          </CardHeader>
          <CardContent>
            {borrowerLoans.length === 0 ? (
              <div
                className="py-12 text-center"
                data-ocid="repayment.empty_state"
              >
                <p className="text-muted-foreground">
                  You have no active loans.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label>Select Loan</Label>
                  <Select
                    value={selectedLoanId}
                    onValueChange={setSelectedLoanId}
                  >
                    <SelectTrigger data-ocid="repayment.select">
                      <SelectValue placeholder="Choose a loan..." />
                    </SelectTrigger>
                    <SelectContent>
                      {borrowerLoans.map((l) => (
                        <SelectItem key={l.id} value={l.id}>
                          {formatCurrency(l.amount)} —{" "}
                          {l.purpose.split("/")[0].trim()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.loan && (
                    <p
                      className="text-destructive text-xs mt-1"
                      data-ocid="repayment.error_state"
                    >
                      {errors.loan}
                    </p>
                  )}
                </div>

                {selectedLoan && (
                  <div className="p-4 bg-secondary rounded-lg space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Lender</span>
                      <span className="font-medium">{lenderName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Due</span>
                      <span className="font-medium">
                        {formatCurrency(totalDue)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Already Paid
                      </span>
                      <span className="text-[oklch(0.38_0.09_158)] font-medium">
                        {formatCurrency(alreadyPaid)}
                      </span>
                    </div>
                    <div className="flex justify-between font-bold border-t border-border pt-2">
                      <span>Remaining Balance</span>
                      <span className="text-primary">
                        {formatCurrency(remaining)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">
                        Suggested EMI
                      </span>
                      <span className="text-muted-foreground">
                        {formatCurrency(emi)}/month
                      </span>
                    </div>
                  </div>
                )}

                <div>
                  <Label>Payment Amount (₹)</Label>
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={emi > 0 ? emi.toFixed(0) : "Amount"}
                    min={1}
                    data-ocid="repayment.input"
                  />
                  {errors.amount && (
                    <p
                      className="text-destructive text-xs mt-1"
                      data-ocid="repayment.error_state"
                    >
                      {errors.amount}
                    </p>
                  )}
                </div>

                {willComplete && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-lg border border-primary/30 bg-secondary flex items-start gap-3"
                    data-ocid="repayment.panel"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <IndianRupee className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-primary">
                        🎉 Loan will be fully closed!
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Exit Fee: <strong>₹{PLATFORM_EXIT_FEE}</strong> will be
                        charged to the platform.
                      </p>
                    </div>
                  </motion.div>
                )}

                <div>
                  <Label>Note (Optional)</Label>
                  <Textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="e.g. Installment 3, December 2025..."
                    rows={2}
                    data-ocid="repayment.textarea"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  data-ocid="repayment.submit_button"
                >
                  {willComplete
                    ? `Close Loan + ₹${PLATFORM_EXIT_FEE} Exit Fee`
                    : "Record Payment"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </main>
  );
}
