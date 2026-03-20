import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Download, Home, IndianRupee } from "lucide-react";
import { motion } from "motion/react";
import { formatCurrency } from "../types";

interface PaymentSuccessProps {
  amount: number;
  loanId: string;
  lenderName: string;
  isLoanClosed: boolean;
  onNavigate: (page: string) => void;
}

export function PaymentSuccess({
  amount,
  loanId,
  lenderName,
  isLoanClosed,
  onNavigate,
}: PaymentSuccessProps) {
  const receiptId = `RCP-${Date.now().toString().slice(-8)}`;
  const dateStr = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <main className="max-w-md mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="text-center"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
          className="w-24 h-24 rounded-full bg-[oklch(0.94_0.05_158)] flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="w-14 h-14 text-[oklch(0.45_0.12_158)]" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold mb-1"
        >
          Payment Successful!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-muted-foreground text-sm mb-6"
        >
          {isLoanClosed
            ? "Congratulations! Your loan is fully closed."
            : "Your repayment has been recorded successfully."}
        </motion.p>

        {/* Amount */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mb-6"
        >
          <div className="flex items-center justify-center gap-2">
            <IndianRupee className="w-8 h-8 text-primary" />
            <span className="text-4xl font-bold text-primary">
              {amount.toLocaleString("en-IN")}
            </span>
          </div>
        </motion.div>

        {/* Receipt Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-border text-left mb-4">
            <CardContent className="p-5 space-y-3">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Payment Receipt
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Receipt ID</span>
                  <span className="font-mono font-medium">{receiptId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date & Time</span>
                  <span className="font-medium">{dateStr}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Paid To</span>
                  <span className="font-medium">{lenderName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount Paid</span>
                  <span className="font-bold text-primary">
                    {formatCurrency(amount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method</span>
                  <span className="font-medium">UPI</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="text-[oklch(0.45_0.12_158)] font-semibold">
                    Confirmed
                  </span>
                </div>
                {isLoanClosed && (
                  <div className="pt-2 border-t border-border">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Loan Status</span>
                      <span className="text-[oklch(0.45_0.12_158)] font-bold">
                        Fully Closed ✓
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* UPI QR Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-primary/30 bg-primary/5 mb-6">
            <CardContent className="p-5 text-center">
              <p className="text-sm font-semibold text-primary mb-1">
                Admin UPI Payment
              </p>
              <p className="text-xs text-muted-foreground mb-3">
                Scan to pay platform fees directly to admin
              </p>
              <div className="flex justify-center mb-3">
                <img
                  src="/assets/uploads/IMG_20260321_020701-1.jpg"
                  alt="Admin UPI QR Code"
                  className="w-48 h-48 object-contain rounded-lg border border-border"
                />
              </div>
              <p className="text-xs font-mono text-muted-foreground">
                barkat.6y@ptyes
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col gap-3"
        >
          <Button
            onClick={() => onNavigate(`promissory-${loanId}`)}
            variant="outline"
            className="w-full"
            data-ocid="payment_success.view_note_button"
          >
            <Download className="w-4 h-4 mr-2" /> View Promissory Note
          </Button>
          <Button
            onClick={() => onNavigate("dashboard")}
            className="w-full"
            data-ocid="payment_success.home_button"
          >
            <Home className="w-4 h-4 mr-2" /> Back to Dashboard
          </Button>
        </motion.div>
      </motion.div>
    </main>
  );
}
