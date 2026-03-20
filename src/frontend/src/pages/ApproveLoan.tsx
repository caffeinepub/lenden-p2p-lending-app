import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CheckCircle, Info, XCircle } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "../store/appStore";
import {
  type Loan,
  PLATFORM_COMMISSION_RATE,
  computeCommission,
  computeNetAmount,
  formatCurrency,
} from "../types";

interface ApproveLoanProps {
  onNavigate: (page: string) => void;
}

export function ApproveLoan({ onNavigate }: ApproveLoanProps) {
  const { currentUser, loanRequests, users, addLoan, removeLoanRequest } =
    useApp();
  const [rates, setRates] = useState<Record<string, string>>({});

  const getUserName = (id: string) =>
    users.find((u) => u.id === id)?.name ?? "Unknown";

  const handleApprove = (reqId: string) => {
    const req = loanRequests.find((r) => r.id === reqId);
    if (!req || !currentUser) return;

    const rateStr = rates[reqId] ?? req.requestedInterestRate.toString();
    const rate = Number.parseFloat(rateStr);
    if (Number.isNaN(rate) || rate < 0 || rate > 36) {
      toast.error("Please enter a valid interest rate (0-36%)");
      return;
    }

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
      `Commission (${(PLATFORM_COMMISSION_RATE * 100).toFixed(0)}%): ₹${commission.toLocaleString("en-IN")}`,
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
    toast.success("Loan approved successfully!");
  };

  const handleReject = (reqId: string) => {
    removeLoanRequest(reqId);
    toast.info("Loan request rejected");
  };

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

      <h1 className="text-2xl font-bold mb-2">Approve Loan Requests</h1>

      {/* Platform fee notice */}
      <div
        className="mb-6 p-3 rounded-lg border border-primary/20 bg-secondary flex gap-3"
        data-ocid="approve.panel"
      >
        <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <div className="text-xs text-muted-foreground space-y-0.5">
          <p className="font-semibold text-foreground">Platform Fees</p>
          <p>
            📌{" "}
            <strong>
              Commission {(PLATFORM_COMMISSION_RATE * 100).toFixed(0)}%
            </strong>{" "}
            — Charged on loan principal for each approved loan.
          </p>
          <p>
            📌 <strong>Exit Fee ₹1</strong> — Charged on loan closure.
          </p>
        </div>
      </div>

      {loanRequests.length === 0 ? (
        <Card className="border-dashed" data-ocid="approve.empty_state">
          <CardContent className="py-16 text-center">
            <p className="text-muted-foreground">No pending loan requests</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {loanRequests.map((req, idx) => {
            const commission = computeCommission(req.amount);
            const netAmount = computeNetAmount(req.amount);
            const rateVal = Number.parseFloat(
              rates[req.id] ?? req.requestedInterestRate.toString(),
            );

            return (
              <motion.div
                key={req.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                data-ocid={`approve.item.${idx + 1}`}
              >
                <Card className="border-border">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base">
                          {getUserName(req.borrowerId)}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {req.purpose}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-primary">
                          {formatCurrency(req.amount)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {req.durationMonths} months • {req.createdAt}
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Commission Breakdown */}
                    <div className="rounded-lg border border-border bg-secondary/60 p-3 space-y-2 text-sm">
                      <p className="font-semibold text-xs uppercase tracking-wide text-muted-foreground mb-1">
                        Fee Breakdown
                      </p>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Principal Amount
                        </span>
                        <span className="font-semibold">
                          {formatCurrency(req.amount)}
                        </span>
                      </div>
                      <div className="flex justify-between text-[oklch(0.55_0.16_50)]">
                        <span>
                          Platform Commission{" "}
                          {(PLATFORM_COMMISSION_RATE * 100).toFixed(0)}%
                        </span>
                        <span className="font-bold">
                          − {formatCurrency(commission)}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-primary">
                        <span className="font-bold">
                          Net Amount to Borrower
                        </span>
                        <span className="font-bold text-lg">
                          {formatCurrency(netAmount)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground pt-1">
                        ⚠️ Borrower repays full {formatCurrency(req.amount)} +
                        interest.
                      </p>
                    </div>

                    {/* Interest Rate Input + Actions */}
                    <div className="flex items-end gap-3">
                      <div className="flex-1">
                        <Label className="text-xs">
                          Your Interest Rate (%)
                        </Label>
                        <Input
                          type="number"
                          placeholder={req.requestedInterestRate.toString()}
                          value={rates[req.id] ?? ""}
                          onChange={(e) =>
                            setRates((prev) => ({
                              ...prev,
                              [req.id]: e.target.value,
                            }))
                          }
                          min={0}
                          max={36}
                          step={0.5}
                          data-ocid="approve.input"
                        />
                        {!Number.isNaN(rateVal) && rateVal >= 0 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Requested: {req.requestedInterestRate}%
                          </p>
                        )}
                      </div>
                      <Button
                        onClick={() => handleApprove(req.id)}
                        className="bg-[oklch(0.38_0.09_158)] hover:bg-[oklch(0.32_0.09_158)] text-white"
                        data-ocid={`approve.confirm_button.${idx + 1}`}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" /> Approve
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleReject(req.id)}
                        className="border-destructive text-destructive hover:bg-destructive/10"
                        data-ocid={`approve.delete_button.${idx + 1}`}
                      >
                        <XCircle className="w-4 h-4 mr-1" /> Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </main>
  );
}
