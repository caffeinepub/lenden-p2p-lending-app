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
      toast.error(
        "कृपया मान्य ब्याज दर दर्ज करें (0-36%) / Enter valid interest rate",
      );
      return;
    }

    const borrower = users.find((u) => u.id === req.borrowerId);
    const commission = computeCommission(req.amount);
    const netAmount = computeNetAmount(req.amount);

    const note = [
      `यह प्रॉमिसरी नोट दिनांक ${new Date().toLocaleDateString("hi-IN")} को बनाया गया है।`,
      `उधारकर्ता: ${borrower?.name ?? "Unknown"}`,
      `ऋणदाता: ${currentUser.name}`,
      "",
      "── ऋण विवरण / Loan Details ──",
      `मूल राशि / Principal: ₹${req.amount.toLocaleString("en-IN")}`,
      `ब्याज दर / Interest Rate: ${rate}% प्रति वर्ष`,
      `अवधि / Duration: ${req.durationMonths} महीने`,
      "",
      "── प्लेटफ़ॉर्म शुल्क / Platform Fees ──",
      `कमीशन (${(PLATFORM_COMMISSION_RATE * 100).toFixed(0)}%) / Commission: ₹${commission.toLocaleString("en-IN")}`,
      `उधारकर्ता को प्राप्त राशि / Net to Borrower: ₹${netAmount.toLocaleString("en-IN")}`,
      "निकास शुल्क (ऋण बंद होने पर) / Exit Fee (on closure): ₹1",
      "",
      "── कानूनी नोटिस / Legal Notice ──",
      "यह एक कानूनी रूप से बाध्यकारी दस्तावेज़ है। भुगतान न करने पर भारतीय परक्राम्य लिखत अधिनियम, 1881 की धारा 138 के तहत कानूनी कार्रवाई हो सकती है।",
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
    toast.success("ऋण अनुमोदित! / Loan approved successfully!");
  };

  const handleReject = (reqId: string) => {
    removeLoanRequest(reqId);
    toast.info("ऋण अनुरोध अस्वीकार / Loan request rejected");
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <button
        type="button"
        onClick={() => onNavigate("dashboard")}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
        data-ocid="approve.link"
      >
        <ArrowLeft className="w-4 h-4" /> वापस
      </button>

      <h1 className="text-2xl font-bold font-devanagari mb-2">
        ऋण अनुरोध अनुमोदन{" "}
        <span className="text-muted-foreground font-normal text-lg">
          / Approve Loan Requests
        </span>
      </h1>

      {/* Platform fee notice */}
      <div
        className="mb-6 p-3 rounded-lg border border-primary/20 bg-secondary flex gap-3"
        data-ocid="approve.panel"
      >
        <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <div className="text-xs text-muted-foreground space-y-0.5">
          <p className="font-semibold text-foreground">
            प्लेटफ़ॉर्म शुल्क / Platform Fees
          </p>
          <p>
            📌{" "}
            <strong>
              कमीशन {(PLATFORM_COMMISSION_RATE * 100).toFixed(0)}%
            </strong>{" "}
            — ऋण राशि पर प्रत्येक अनुमोदित ऋण पर लिया जाएगा।
          </p>
          <p>
            📌{" "}
            <strong>
              Commission {(PLATFORM_COMMISSION_RATE * 100).toFixed(0)}%
            </strong>{" "}
            — Charged on loan principal for each approved loan.
          </p>
          <p>
            📌 <strong>निकास शुल्क ₹1</strong> — ऋण बंद होने पर लिया जाएगा। /{" "}
            <strong>Exit Fee ₹1</strong> charged on loan closure.
          </p>
        </div>
      </div>

      {loanRequests.length === 0 ? (
        <Card className="border-dashed" data-ocid="approve.empty_state">
          <CardContent className="py-16 text-center">
            <p className="text-muted-foreground font-devanagari">
              कोई लंबित अनुरोध नहीं / No pending requests
            </p>
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
                        <p className="text-sm text-muted-foreground font-devanagari mt-1">
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
                        शुल्क विवरण / Fee Breakdown
                      </p>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground font-devanagari">
                          मूल ऋण राशि / Principal
                        </span>
                        <span className="font-semibold">
                          {formatCurrency(req.amount)}
                        </span>
                      </div>
                      <div className="flex justify-between text-[oklch(0.55_0.16_50)]">
                        <span className="font-devanagari">
                          प्लेटफ़ॉर्म कमीशन{" "}
                          {(PLATFORM_COMMISSION_RATE * 100).toFixed(0)}% /
                          Commission
                        </span>
                        <span className="font-bold">
                          − {formatCurrency(commission)}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-primary">
                        <span className="font-bold font-devanagari">
                          उधारकर्ता को मिलेगा / Net to Borrower
                        </span>
                        <span className="font-bold text-lg">
                          {formatCurrency(netAmount)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground pt-1">
                        ⚠️ उधारकर्ता पूरी ₹{req.amount.toLocaleString("en-IN")} +
                        ब्याज वापस करेगा। Borrower repays full{" "}
                        {formatCurrency(req.amount)} + interest.
                      </p>
                    </div>

                    {/* Interest Rate Input + Actions */}
                    <div className="flex items-end gap-3">
                      <div className="flex-1">
                        <Label className="text-xs font-devanagari">
                          आपकी ब्याज दर (%) / Your Interest Rate
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
                            अनुरोधित / Requested: {req.requestedInterestRate}%
                          </p>
                        )}
                      </div>
                      <Button
                        onClick={() => handleApprove(req.id)}
                        className="bg-[oklch(0.38_0.09_158)] hover:bg-[oklch(0.32_0.09_158)] text-white"
                        data-ocid={`approve.confirm_button.${idx + 1}`}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" /> अनुमोदन
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleReject(req.id)}
                        className="border-destructive text-destructive hover:bg-destructive/10"
                        data-ocid={`approve.delete_button.${idx + 1}`}
                      >
                        <XCircle className="w-4 h-4 mr-1" /> अस्वीकार
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
