import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, History } from "lucide-react";
import { motion } from "motion/react";
import { useApp } from "../store/appStore";
import { type LoanStatus, formatCurrency } from "../types";

interface LoanHistoryPageProps {
  onNavigate: (page: string) => void;
}

const STATUS_BADGE: Record<LoanStatus, { label: string; className: string }> = {
  pending: {
    label: "Pending",
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  active: {
    label: "Active",
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  completed: {
    label: "Completed",
    className: "bg-green-100 text-green-800 border-green-200",
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-100 text-red-800 border-red-200",
  },
};

export function LoanHistoryPage({ onNavigate }: LoanHistoryPageProps) {
  const { currentUser, loans, users } = useApp();
  if (!currentUser) return null;

  const historyLoans = loans.filter(
    (l) =>
      (l.borrowerId === currentUser.id || l.lenderId === currentUser.id) &&
      (l.status === "completed" || l.status === "rejected"),
  );

  const getUserName = (id: string) =>
    users.find((u) => u.id === id)?.name ?? "Unknown";

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate("dashboard")}
            data-ocid="loan_history.secondary_button"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <History className="w-6 h-6" /> Loan History
            </h1>
            <p className="text-sm text-muted-foreground">
              Purane loans ka record / Past loan records
            </p>
          </div>
        </div>

        {historyLoans.length === 0 ? (
          <Card className="border-dashed" data-ocid="loan_history.empty_state">
            <CardContent className="py-16 text-center">
              <div className="text-5xl mb-4">📭</div>
              <h3 className="text-lg font-semibold mb-2">
                Koi purana loan nahi hai abhi
              </h3>
              <p className="text-muted-foreground text-sm mb-6">
                Completed ya rejected loans yahan dikhenge.
              </p>
              <Button
                onClick={() => onNavigate("new-loan")}
                data-ocid="loan_history.primary_button"
              >
                Pehla Loan Request Karo
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-4">
              {historyLoans.length} loan(s) found
            </p>
            <div
              className="hidden md:block rounded-xl border overflow-hidden"
              data-ocid="loan_history.table"
            >
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Amount</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Your Role</TableHead>
                    <TableHead>Other Party</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historyLoans.map((loan, idx) => {
                    const isBorrower = loan.borrowerId === currentUser.id;
                    const otherPartyId = isBorrower
                      ? loan.lenderId
                      : loan.borrowerId;
                    const statusCfg = STATUS_BADGE[loan.status];
                    return (
                      <TableRow
                        key={loan.id}
                        data-ocid={`loan_history.row.${idx + 1}`}
                      >
                        <TableCell className="font-semibold">
                          {formatCurrency(loan.amount)}
                        </TableCell>
                        <TableCell className="max-w-[150px] truncate text-xs">
                          {loan.purpose}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              isBorrower
                                ? "border-orange-200 text-orange-700"
                                : "border-blue-200 text-blue-700"
                            }
                          >
                            {isBorrower ? "Borrower" : "Lender"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {getUserName(otherPartyId)}
                        </TableCell>
                        <TableCell>{loan.durationMonths}m</TableCell>
                        <TableCell>{loan.interestRate}%</TableCell>
                        <TableCell className="text-sm">
                          {loan.startDate}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={statusCfg.className}
                          >
                            {statusCfg.label}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            <div className="md:hidden space-y-3">
              {historyLoans.map((loan, idx) => {
                const isBorrower = loan.borrowerId === currentUser.id;
                const otherPartyId = isBorrower
                  ? loan.lenderId
                  : loan.borrowerId;
                const statusCfg = STATUS_BADGE[loan.status];
                return (
                  <motion.div
                    key={loan.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    data-ocid={`loan_history.item.${idx + 1}`}
                  >
                    <Card>
                      <CardContent className="p-4 space-y-2">
                        <div className="flex justify-between items-start">
                          <div className="font-bold text-lg">
                            {formatCurrency(loan.amount)}
                          </div>
                          <Badge
                            variant="outline"
                            className={statusCfg.className}
                          >
                            {statusCfg.label}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {loan.purpose}
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-muted-foreground">
                              Role:{" "}
                            </span>
                            <span
                              className={
                                isBorrower ? "text-orange-700" : "text-blue-700"
                              }
                            >
                              {isBorrower ? "Borrower" : "Lender"}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Party:{" "}
                            </span>
                            {getUserName(otherPartyId)}
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Duration:{" "}
                            </span>
                            {loan.durationMonths}m
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Rate:{" "}
                            </span>
                            {loan.interestRate}%
                          </div>
                          <div className="col-span-2">
                            <span className="text-muted-foreground">
                              Start:{" "}
                            </span>
                            {loan.startDate}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
      </motion.div>
    </main>
  );
}
