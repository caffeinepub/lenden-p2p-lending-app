import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, ArrowLeft, Gavel, Shield } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "../store/appStore";
import { type LegalStatus, formatCurrency } from "../types";

interface LegalEscalationProps {
  loanId: string;
  onNavigate: (page: string) => void;
}

const LEGAL_STEPS: {
  status: LegalStatus;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bg: string;
}[] = [
  {
    status: "normal",
    label: "सामान्य",
    sublabel: "Normal",
    icon: Shield,
    color: "text-[oklch(0.38_0.09_158)]",
    bg: "bg-[oklch(0.94_0.05_158)]",
  },
  {
    status: "warning",
    label: "चेतावनी",
    sublabel: "Warning",
    icon: AlertTriangle,
    color: "text-[oklch(0.55_0.16_85)]",
    bg: "bg-[oklch(0.96_0.06_85)]",
  },
  {
    status: "legal_pending",
    label: "कानूनी लंबित",
    sublabel: "Legal Pending",
    icon: Gavel,
    color: "text-[oklch(0.55_0.16_50)]",
    bg: "bg-[oklch(0.96_0.06_50)]",
  },
  {
    status: "action_initiated",
    label: "कार्रवाई शुरू",
    sublabel: "Action Initiated",
    icon: Gavel,
    color: "text-[oklch(0.55_0.20_27)]",
    bg: "bg-[oklch(0.96_0.06_27)]",
  },
];

export function LegalEscalation({ loanId, onNavigate }: LegalEscalationProps) {
  const { loans, users, updateLoan } = useApp();
  const loan = loans.find((l) => l.id === loanId);
  const [confirming, setConfirming] = useState<LegalStatus | null>(null);

  if (!loan) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-8">
        <p className="text-muted-foreground font-devanagari">
          ऋण नहीं मिला / Loan not found
        </p>
      </main>
    );
  }

  const borrower = users.find((u) => u.id === loan.borrowerId);

  const handleUpdate = (status: LegalStatus) => {
    updateLoan({ ...loan, legalStatus: status });
    toast.success(`कानूनी स्थिति अपडेट / Legal status updated to ${status}`);
    setConfirming(null);
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <button
        type="button"
        onClick={() => onNavigate("dashboard")}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
        data-ocid="legal.link"
      >
        <ArrowLeft className="w-4 h-4" /> वापस
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="border-border shadow-md mb-6">
          <CardHeader>
            <CardTitle className="text-xl font-devanagari">
              कानूनी कार्रवाई / Legal Escalation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground font-devanagari">
                  उधारकर्ता
                </span>
                <span className="font-semibold">{borrower?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Loan Amount</span>
                <span className="font-bold text-primary">
                  {formatCurrency(loan.amount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration</span>
                <span>
                  {loan.durationMonths} months @ {loan.interestRate}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <h2 className="text-lg font-bold font-devanagari mb-4">
          स्थिति बदलें / Change Status
        </h2>
        <div className="space-y-3">
          {LEGAL_STEPS.map((step, idx) => {
            const isActive = loan.legalStatus === step.status;
            return (
              <motion.div
                key={step.status}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                data-ocid={`legal.item.${idx + 1}`}
              >
                <Card
                  className={`border-2 transition-all ${isActive ? "border-primary shadow-md" : "border-border"}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${step.bg}`}
                        >
                          <step.icon className={`w-5 h-5 ${step.color}`} />
                        </div>
                        <div>
                          <p
                            className={`font-semibold font-devanagari ${step.color}`}
                          >
                            {step.label}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {step.sublabel}
                          </p>
                        </div>
                      </div>
                      {isActive ? (
                        <span className="text-xs bg-secondary text-primary px-3 py-1 rounded-full font-medium">
                          वर्तमान / Current
                        </span>
                      ) : confirming === step.status ? (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="text-xs"
                            onClick={() => handleUpdate(step.status)}
                            data-ocid={`legal.confirm_button.${idx + 1}`}
                          >
                            पुष्टि करें
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs"
                            onClick={() => setConfirming(null)}
                            data-ocid={`legal.cancel_button.${idx + 1}`}
                          >
                            रद्द करें
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs"
                          onClick={() => setConfirming(step.status)}
                          data-ocid={`legal.edit_button.${idx + 1}`}
                        >
                          चुनें / Select
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </main>
  );
}
