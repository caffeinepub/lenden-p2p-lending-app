import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, FileText, Printer } from "lucide-react";
import { motion } from "motion/react";
import { useRef } from "react";
import { useApp } from "../store/appStore";
import {
  PLATFORM_EXIT_FEE,
  commissionLabel,
  computeMonthlyInstallment,
  computeTotalDue,
  formatCurrency,
} from "../types";

interface PromissoryNoteProps {
  loanId: string;
  onNavigate: (page: string) => void;
}

export function PromissoryNote({ loanId, onNavigate }: PromissoryNoteProps) {
  const { loans, users } = useApp();
  const loan = loans.find((l) => l.id === loanId);
  const printRef = useRef<HTMLDivElement>(null);

  if (!loan) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-8">
        <p className="text-muted-foreground">Loan not found</p>
      </main>
    );
  }

  const borrower = users.find((u) => u.id === loan.borrowerId);
  const lender = users.find((u) => u.id === loan.lenderId);
  const totalDue = computeTotalDue(loan);
  const emi = computeMonthlyInstallment(loan);
  const interest = totalDue - loan.amount;

  const handlePrint = () => {
    if (printRef.current) {
      const content = printRef.current.innerHTML;
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(
          `<html><head><title>Promissory Note</title><style>body{font-family:sans-serif;padding:40px;max-width:700px;margin:auto} h1,h2{text-align:center} table{width:100%;border-collapse:collapse} td,th{border:1px solid #ccc;padding:8px} pre{white-space:pre-wrap;background:#f5f5f5;padding:16px;border-radius:8px} .fee-box{background:#fef3c7;border:1px solid #f59e0b;padding:12px;border-radius:8px;margin:12px 0}</style></head><body>${content}</body></html>`,
        );
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={() => onNavigate("dashboard")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          data-ocid="note.link"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <Button
          onClick={handlePrint}
          variant="outline"
          className="flex items-center gap-2"
          data-ocid="note.primary_button"
        >
          <Printer className="w-4 h-4" /> Print
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="border-border shadow-md" ref={printRef}>
          <CardHeader className="text-center border-b border-border">
            <div className="flex items-center justify-center gap-2 mb-2">
              <FileText className="w-6 h-6 text-primary" />
              <CardTitle className="text-xl">Promissory Note</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">
              Date: {loan.startDate}
            </p>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Parties */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-secondary rounded-lg">
                <p className="text-xs font-semibold text-primary mb-2">
                  BORROWER
                </p>
                <p className="font-bold">{borrower?.name}</p>
                <p className="text-sm text-muted-foreground">
                  {borrower?.phone}
                </p>
              </div>
              <div className="p-4 bg-secondary rounded-lg">
                <p className="text-xs font-semibold text-primary mb-2">
                  LENDER
                </p>
                <p className="font-bold">{lender?.name}</p>
                <p className="text-sm text-muted-foreground">{lender?.phone}</p>
              </div>
            </div>

            {/* Loan Details */}
            <div>
              <h3 className="text-sm font-bold mb-3 text-muted-foreground uppercase tracking-wide">
                Loan Details
              </h3>
              <table className="w-full border-collapse text-sm">
                <tbody>
                  {[
                    ["Loan Amount", formatCurrency(loan.amount)],
                    ["Interest Rate", `${loan.interestRate}% per annum`],
                    ["Duration", `${loan.durationMonths} months`],
                    ["Total Interest", formatCurrency(interest)],
                    ["Total Due", formatCurrency(totalDue)],
                    ["Monthly EMI", formatCurrency(emi)],
                    ["Purpose", loan.purpose],
                    ["Start Date", loan.startDate],
                  ].map(([label, value]) => (
                    <tr key={label} className="border border-border">
                      <td className="px-4 py-2 bg-secondary font-medium w-1/2 text-sm">
                        {label}
                      </td>
                      <td className="px-4 py-2 font-semibold text-primary text-sm">
                        {value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Separator />

            {/* Platform Fee Breakdown */}
            <div>
              <h3 className="text-sm font-bold mb-3 text-muted-foreground uppercase tracking-wide">
                Platform Fee Breakdown
              </h3>
              <div className="rounded-lg border border-primary/20 bg-primary/5 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-primary/10">
                      <th className="px-4 py-2 text-left font-semibold text-primary">
                        Fee Type
                      </th>
                      <th className="px-4 py-2 text-left font-semibold text-primary">
                        Detail
                      </th>
                      <th className="px-4 py-2 text-right font-semibold text-primary">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-primary/10">
                      <td className="px-4 py-3">Entry Fee</td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">
                        Charged once at registration
                      </td>
                      <td className="px-4 py-3 text-right font-bold">₹1</td>
                    </tr>
                    <tr className="border-t border-primary/10 bg-[oklch(0.96_0.06_50_/_0.4)]">
                      <td className="px-4 py-3">Commission (Flat Fee)</td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">
                        {commissionLabel(loan.amount)} of{" "}
                        {formatCurrency(loan.amount)} principal
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-[oklch(0.50_0.14_50)]">
                        {formatCurrency(loan.commissionAmount)}
                      </td>
                    </tr>
                    <tr className="border-t border-primary/10">
                      <td className="px-4 py-3">Exit Fee</td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">
                        Charged on loan closure / final repayment
                      </td>
                      <td className="px-4 py-3 text-right font-bold">
                        ₹{PLATFORM_EXIT_FEE}
                      </td>
                    </tr>
                    <tr className="border-t-2 border-primary/30 bg-primary/10">
                      <td className="px-4 py-3 font-bold" colSpan={2}>
                        Total Platform Fees
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-primary text-base">
                        {formatCurrency(
                          loan.commissionAmount + 1 + PLATFORM_EXIT_FEE,
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Net amount box */}
              <div className="mt-3 p-4 rounded-lg bg-[oklch(0.94_0.05_158)] border border-[oklch(0.80_0.06_158)]">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-[oklch(0.38_0.09_158)]">
                      Net Amount to Borrower
                    </p>
                    <p className="text-xs text-[oklch(0.45_0.07_158)] mt-0.5">
                      After deducting {commissionLabel(loan.amount)} commission
                      from {formatCurrency(loan.amount)}
                    </p>
                  </div>
                  <p className="text-2xl font-bold text-[oklch(0.38_0.09_158)]">
                    {formatCurrency(loan.netAmountToBorrower)}
                  </p>
                </div>
                <p className="text-xs text-[oklch(0.45_0.07_158)] mt-2">
                  ⚠️ Borrower must repay the full {formatCurrency(loan.amount)} +
                  interest ({formatCurrency(interest)}) ={" "}
                  {formatCurrency(totalDue)}.
                </p>
              </div>
            </div>

            <Separator />

            {/* Note text */}
            {loan.promissoryNote && (
              <div>
                <h3 className="text-sm font-bold mb-3 text-muted-foreground uppercase tracking-wide">
                  Note Text
                </h3>
                <pre className="whitespace-pre-wrap text-sm bg-secondary/50 p-4 rounded-lg border border-border leading-relaxed">
                  {loan.promissoryNote}
                </pre>
              </div>
            )}

            {/* Legal Clause */}
            <div className="p-4 bg-[oklch(0.96_0.06_27)] rounded-lg border border-[oklch(0.85_0.12_27)] text-sm">
              <p className="font-bold text-[oklch(0.45_0.18_27)] mb-2">
                ⚖️ Legal Notice
              </p>
              <p className="text-[oklch(0.45_0.18_27)] text-sm">
                This is a legally binding document. Non-payment may result in
                legal action under Section 138 of the Negotiable Instruments
                Act, 1881.
              </p>
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-2 gap-6 mt-4 pt-6 border-t border-border">
              <div className="text-center">
                <div className="h-12 border-b border-foreground/30 mb-2" />
                <p className="text-sm">Borrower Signature</p>
                <p className="text-xs text-muted-foreground">
                  {borrower?.name}
                </p>
              </div>
              <div className="text-center">
                <div className="h-12 border-b border-foreground/30 mb-2" />
                <p className="text-sm">Lender Signature</p>
                <p className="text-xs text-muted-foreground">{lender?.name}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  );
}
