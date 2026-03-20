import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, Scale, ShieldAlert } from "lucide-react";
import { motion } from "motion/react";
import { useApp } from "../store/appStore";
import { formatCurrency } from "../types";

interface LegalDocumentsProps {
  onNavigate: (page: string) => void;
}

const LEGAL_NOTICE_TEMPLATE = `LEGAL NOTICE UNDER SECTION 138 OF THE NEGOTIABLE INSTRUMENTS ACT, 1881

To,
[Borrower Name]
[Borrower Address]

Dear Sir/Madam,

I, [Lender Name], hereby give you notice under Section 138 of the Negotiable Instruments Act, 1881 (as amended), that the loan of ₹[Amount] advanced on [Date] has not been repaid as agreed.

Despite repeated requests and reminders, you have failed to repay the said loan along with interest at the agreed rate of [Interest Rate]% per annum.

You are hereby called upon to pay the outstanding amount of ₹[Outstanding Amount] within 15 days of receipt of this notice. Failure to do so will compel us to initiate appropriate legal proceedings against you, including but not limited to:
1. Filing a criminal complaint under Section 138 of the N.I. Act
2. Civil suit for recovery of dues
3. Reporting to CIBIL/credit bureaus affecting your credit score

Yours sincerely,
[Lender Name]
[Date]`;

export function LegalDocuments({ onNavigate }: LegalDocumentsProps) {
  const { currentUser, loans, users } = useApp();
  if (!currentUser) return null;

  const isAdmin = currentUser.role === "admin";
  const activeLoansList = loans.filter((l) => l.status === "active");
  const relevantLoans = isAdmin
    ? activeLoansList
    : activeLoansList.filter(
        (l) => l.borrowerId === currentUser.id || l.lenderId === currentUser.id,
      );

  const getUserName = (id: string) =>
    users.find((u) => u.id === id)?.name ?? "Unknown";

  const getLegalStatusLabel = (status: string) => {
    switch (status) {
      case "normal":
        return {
          label: "Normal",
          style: "bg-[oklch(0.94_0.05_158)] text-[oklch(0.38_0.09_158)]",
        };
      case "warning":
        return {
          label: "Warning",
          style: "bg-[oklch(0.96_0.06_85)] text-[oklch(0.55_0.16_85)]",
        };
      case "legal_pending":
        return {
          label: "Legal Pending",
          style: "bg-[oklch(0.96_0.06_50)] text-[oklch(0.55_0.16_50)]",
        };
      case "action_initiated":
        return {
          label: "Action Initiated",
          style: "bg-[oklch(0.96_0.06_27)] text-[oklch(0.55_0.20_27)]",
        };
      default:
        return { label: status, style: "bg-secondary text-foreground" };
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <button
        type="button"
        onClick={() => onNavigate("dashboard")}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
        data-ocid="legal.link"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Scale className="w-6 h-6 text-primary" />
          Legal Documents
        </h1>
        <p className="text-muted-foreground mt-1">
          View promissory notes, initiate legal action, and access legal notice
          templates
        </p>
      </motion.div>

      {/* Legal Notice Template */}
      <Card className="border-primary/30 bg-primary/5 mb-8">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-primary" />
            Legal Notice Template (Section 138 NI Act)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <pre
            className="text-xs text-foreground whitespace-pre-wrap font-mono bg-secondary/50 rounded-lg p-4 leading-relaxed max-h-48 overflow-y-auto"
            data-ocid="legal.editor"
          >
            {LEGAL_NOTICE_TEMPLATE}
          </pre>
          <p className="text-xs text-muted-foreground mt-3">
            ⚠️ Fill in the [bracketed] fields before sending. Consult a lawyer
            for official legal notices.
          </p>
        </CardContent>
      </Card>

      {/* Loan Legal Documents */}
      <h2 className="text-lg font-bold mb-4">Loan Documents</h2>
      {relevantLoans.length === 0 ? (
        <Card className="border-dashed" data-ocid="legal.empty_state">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No active loan documents found
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {relevantLoans.map((loan, idx) => {
            const { label, style } = getLegalStatusLabel(loan.legalStatus);
            const isLender = loan.lenderId === currentUser.id;

            return (
              <motion.div
                key={loan.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06 }}
                data-ocid={`legal.item.${idx + 1}`}
              >
                <Card className="border-border">
                  <CardHeader className="pb-3">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <CardTitle className="text-base">
                          {formatCurrency(loan.amount)} Loan
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          Borrower:{" "}
                          <strong>{getUserName(loan.borrowerId)}</strong> &bull;{" "}
                          Lender: <strong>{getUserName(loan.lenderId)}</strong>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Started: {loan.startDate} • Purpose: {loan.purpose}
                        </p>
                      </div>
                      <Badge className={`${style} border-0 text-xs`}>
                        {label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Promissory Note preview */}
                    {loan.promissoryNote && (
                      <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono bg-secondary/50 rounded-lg p-3 mb-4 leading-relaxed max-h-32 overflow-y-auto">
                        {loan.promissoryNote}
                      </pre>
                    )}
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onNavigate(`promissory-${loan.id}`)}
                        data-ocid={`legal.edit_button.${idx + 1}`}
                      >
                        <FileText className="w-3.5 h-3.5 mr-1.5" />
                        View Promissory Note
                      </Button>
                      {(isLender || isAdmin) && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-[oklch(0.85_0.12_27)] text-[oklch(0.55_0.20_27)] hover:bg-[oklch(0.96_0.06_27)]"
                          onClick={() => onNavigate(`legal-${loan.id}`)}
                          data-ocid={`legal.delete_button.${idx + 1}`}
                        >
                          <ShieldAlert className="w-3.5 h-3.5 mr-1.5" />
                          Initiate Legal Action
                        </Button>
                      )}
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
