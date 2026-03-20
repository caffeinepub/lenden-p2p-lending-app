import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertTriangle,
  BarChart3,
  CreditCard,
  Crown,
  FileText,
  IndianRupee,
  Plus,
  Star,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { motion } from "motion/react";
import { useApp } from "../store/appStore";
import {
  PLATFORM_COMMISSION_RATE,
  PLATFORM_ENTRY_FEE,
  PLATFORM_EXIT_FEE,
  computeMonthlyInstallment,
  computeTotalDue,
  formatCurrency,
  getCreditScoreLabel,
} from "../types";

interface DashboardProps {
  onNavigate: (page: string) => void;
}

const LEGAL_STATUS_CONFIG = {
  normal: {
    label: "Normal",
    color:
      "bg-[oklch(0.94_0.05_158)] text-[oklch(0.38_0.09_158)] border-[oklch(0.80_0.06_158)]",
  },
  warning: {
    label: "Warning",
    color:
      "bg-[oklch(0.96_0.06_85)] text-[oklch(0.55_0.16_85)] border-[oklch(0.85_0.10_85)]",
  },
  legal_pending: {
    label: "Legal Pending",
    color:
      "bg-[oklch(0.96_0.06_50)] text-[oklch(0.55_0.16_50)] border-[oklch(0.85_0.10_50)]",
  },
  action_initiated: {
    label: "Action Initiated",
    color:
      "bg-[oklch(0.96_0.06_27)] text-[oklch(0.55_0.20_27)] border-[oklch(0.85_0.12_27)]",
  },
};

export function Dashboard({ onNavigate }: DashboardProps) {
  const {
    currentUser,
    loans,
    repayments,
    users,
    feeRecords,
    totalCommission,
    totalEntryFees,
    totalExitFees,
    totalAdminEarnings,
  } = useApp();
  if (!currentUser) return null;

  const isAdmin = currentUser.role === "admin";

  const myLoans = isAdmin
    ? loans
    : loans.filter(
        (l) => l.borrowerId === currentUser.id || l.lenderId === currentUser.id,
      );
  const activeLoans = myLoans.filter((l) => l.status === "active");
  const totalAmount = activeLoans.reduce((sum, l) => sum + l.amount, 0);
  const totalRemaining = activeLoans.reduce((sum, l) => {
    const due = computeTotalDue(l);
    const paid = repayments
      .filter((r) => r.loanId === l.id)
      .reduce((s, r) => s + r.amount, 0);
    return sum + Math.max(0, due - paid);
  }, 0);
  const avgInterest = activeLoans.length
    ? (
        activeLoans.reduce((sum, l) => sum + l.interestRate, 0) /
        activeLoans.length
      ).toFixed(1)
    : "0";

  const myRepayments = repayments.filter((r) =>
    myLoans.some((l) => l.id === r.loanId),
  );

  const getUserName = (id: string) =>
    users.find((u) => u.id === id)?.name ?? "Unknown";

  const recentFees = [...feeRecords]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  const creditScore = currentUser.creditScore ?? 600;
  const scoreInfo = getCreditScoreLabel(creditScore);

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold">Loan Dashboard</h1>
              {!isAdmin && currentUser.isPremium && (
                <Badge className="bg-[oklch(0.88_0.10_85)] text-[oklch(0.45_0.15_70)] border-0 flex items-center gap-1">
                  <Star className="w-3 h-3" /> Premium ⭐
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground mt-1">
              Welcome, {currentUser.name} {isAdmin ? "👑" : "👋"}
            </p>
          </div>
          {!isAdmin && !currentUser.isPremium && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onNavigate("membership")}
              className="border-[oklch(0.80_0.10_70)] text-[oklch(0.50_0.14_70)] hover:bg-[oklch(0.96_0.06_85)]"
              data-ocid="dashboard.secondary_button"
            >
              <Crown className="w-4 h-4 mr-1" /> Upgrade to Premium
            </Button>
          )}
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            icon: CreditCard,
            label: isAdmin ? "Total Loans" : "Active Loans",
            sub: isAdmin ? "All platform loans" : "Currently active",
            value: activeLoans.length.toString(),
            color: "text-primary",
          },
          {
            icon: IndianRupee,
            label: "Total Amount",
            sub: "Across all loans",
            value: formatCurrency(totalAmount),
            color: "text-primary",
          },
          {
            icon: TrendingUp,
            label: "Remaining",
            sub: "Still to be paid",
            value: formatCurrency(totalRemaining),
            color: "text-[oklch(0.55_0.16_50)]",
          },
          {
            icon: AlertTriangle,
            label: "Avg Interest",
            sub: "Average rate",
            value: `${avgInterest}%`,
            color: "text-[oklch(0.55_0.16_85)]",
          },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className="border-border hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{kpi.label}</p>
                    <p className="text-xs text-muted-foreground">{kpi.sub}</p>
                    <p className={`text-xl font-bold mt-2 ${kpi.color}`}>
                      {kpi.value}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                    <kpi.icon className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3 mb-8">
        {(currentUser.role === "borrower" || currentUser.role === "both") && (
          <Button
            onClick={() => onNavigate("new-loan")}
            data-ocid="dashboard.primary_button"
          >
            <Plus className="w-4 h-4 mr-2" /> Request a Loan
          </Button>
        )}
        {(currentUser.role === "lender" ||
          currentUser.role === "both" ||
          isAdmin) && (
          <Button
            variant="outline"
            onClick={() => onNavigate("loan-requests")}
            data-ocid="dashboard.secondary_button"
          >
            Approve Loans
          </Button>
        )}
        {!isAdmin && (
          <Button
            variant="outline"
            onClick={() => onNavigate("repayment")}
            data-ocid="dashboard.secondary_button"
          >
            Make a Payment
          </Button>
        )}
        <Button
          variant="outline"
          onClick={() => onNavigate("legal-docs")}
          data-ocid="dashboard.secondary_button"
        >
          <FileText className="w-4 h-4 mr-2" /> Legal Documents
        </Button>
        {!isAdmin && (
          <Button
            variant="outline"
            onClick={() => onNavigate("credit-score")}
            className="border-primary/40 text-primary hover:bg-primary/5"
            data-ocid="dashboard.secondary_button"
          >
            <BarChart3 className="w-4 h-4 mr-2" /> My Credit Score
          </Button>
        )}
        {!isAdmin && (
          <Button
            variant="outline"
            onClick={() => onNavigate("membership")}
            className="border-[oklch(0.80_0.10_70)] text-[oklch(0.50_0.14_70)] hover:bg-[oklch(0.96_0.06_85)]"
            data-ocid="dashboard.secondary_button"
          >
            <Crown className="w-4 h-4 mr-2" /> Premium Membership
          </Button>
        )}
        {isAdmin && (
          <Button
            variant="outline"
            onClick={() => onNavigate("admin-withdrawal")}
            className="border-primary/40 text-primary hover:bg-primary/5"
            data-ocid="dashboard.secondary_button"
          >
            <Wallet className="w-4 h-4 mr-2" /> Withdraw Earnings
          </Button>
        )}
      </div>

      {/* Active Loans */}
      <section className="mb-8">
        <h2 className="text-lg font-bold mb-4">
          {isAdmin ? "All Platform Loans" : "Active Loans"}
        </h2>
        {activeLoans.length === 0 ? (
          <Card className="border-dashed" data-ocid="loans.empty_state">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No active loans</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {activeLoans.map((loan, idx) => {
              const totalDue = computeTotalDue(loan);
              const monthlyEMI = computeMonthlyInstallment(loan);
              const paid = repayments
                .filter((r) => r.loanId === loan.id)
                .reduce((s, r) => s + r.amount, 0);
              const progressPct = Math.min(100, (paid / totalDue) * 100);
              const legalCfg = LEGAL_STATUS_CONFIG[loan.legalStatus];
              const isBorrower = loan.borrowerId === currentUser.id;
              const otherUser = isAdmin
                ? `${getUserName(loan.borrowerId)} ← ${getUserName(loan.lenderId)}`
                : getUserName(isBorrower ? loan.lenderId : loan.borrowerId);

              return (
                <motion.div
                  key={loan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  data-ocid={`loans.item.${idx + 1}`}
                >
                  <Card className="border-border hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            {isAdmin
                              ? "Borrower ← Lender"
                              : isBorrower
                                ? "Lender"
                                : "Borrower"}
                          </p>
                          <CardTitle className="text-base">
                            {otherUser}
                          </CardTitle>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full border font-medium ${legalCfg.color}`}
                        >
                          {legalCfg.label}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            Principal
                          </span>
                          <span className="font-bold text-primary">
                            {formatCurrency(loan.amount)}
                          </span>
                        </div>
                        {isBorrower && !isAdmin && (
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">
                              You received (after commission)
                            </span>
                            <span className="font-semibold text-[oklch(0.38_0.09_158)]">
                              {formatCurrency(loan.netAmountToBorrower)}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">
                            Commission (
                            {(PLATFORM_COMMISSION_RATE * 100).toFixed(0)}
                            %)
                          </span>
                          <span className="text-[oklch(0.55_0.16_50)] font-medium">
                            {formatCurrency(loan.commissionAmount)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            Interest
                          </span>
                          <span className="font-medium">
                            {loan.interestRate}% p.a.
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            Monthly EMI
                          </span>
                          <span className="font-medium">
                            {formatCurrency(monthlyEMI)}
                          </span>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>Payment Progress</span>
                            <span>{progressPct.toFixed(0)}%</span>
                          </div>
                          <Progress value={progressPct} className="h-2" />
                          <div className="flex justify-between text-xs mt-1">
                            <span className="text-[oklch(0.38_0.09_158)]">
                              {formatCurrency(paid)} paid
                            </span>
                            <span className="text-muted-foreground">
                              {formatCurrency(totalDue)} total
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2 pt-1">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 text-xs"
                            onClick={() => onNavigate(`promissory-${loan.id}`)}
                            data-ocid={`loans.edit_button.${idx + 1}`}
                          >
                            <FileText className="w-3 h-3 mr-1" /> View Note
                          </Button>
                          {(!isBorrower || isAdmin) && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 text-xs border-[oklch(0.85_0.12_27)] text-[oklch(0.55_0.20_27)] hover:bg-[oklch(0.96_0.06_27)]"
                              onClick={() => onNavigate(`legal-${loan.id}`)}
                              data-ocid={`loans.delete_button.${idx + 1}`}
                            >
                              <AlertTriangle className="w-3 h-3 mr-1" /> Legal
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* Transaction History — hidden for admin */}
      {!isAdmin && (
        <section className="mb-8">
          <h2 className="text-lg font-bold mb-4">Transaction History</h2>
          <Card className="border-border">
            <CardContent className="p-0">
              <Table data-ocid="transactions.table">
                <TableHeader>
                  <TableRow className="bg-secondary/50">
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myRepayments.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center text-muted-foreground py-8"
                        data-ocid="transactions.empty_state"
                      >
                        No transactions yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    myRepayments.map((r, idx) => (
                      <TableRow
                        key={r.id}
                        data-ocid={`transactions.row.${idx + 1}`}
                      >
                        <TableCell className="text-sm">{r.date}</TableCell>
                        <TableCell className="text-sm">{r.note}</TableCell>
                        <TableCell className="text-sm font-semibold text-primary">
                          {formatCurrency(r.amount)}
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-[oklch(0.94_0.05_158)] text-[oklch(0.38_0.09_158)] border-0">
                            Paid
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Admin Earnings Section — ONLY for admin */}
      {isAdmin && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Wallet className="w-5 h-5 text-primary" />
              Admin Earnings
            </h2>
            <Button
              onClick={() => onNavigate("admin-withdrawal")}
              size="sm"
              data-ocid="admin.primary_button"
            >
              Withdraw Earnings
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {[
              {
                label: "Total Earnings",
                sub: "All revenue",
                value: formatCurrency(totalAdminEarnings),
                highlight: true,
              },
              {
                label: `Commission (${(PLATFORM_COMMISSION_RATE * 100).toFixed(0)}%)`,
                sub: "Commissions",
                value: formatCurrency(totalCommission),
                highlight: false,
              },
              {
                label: `Entry Fees (\u20b9${PLATFORM_ENTRY_FEE})`,
                sub: "Entry Fees",
                value: formatCurrency(totalEntryFees),
                highlight: false,
              },
              {
                label: `Exit Fees (\u20b9${PLATFORM_EXIT_FEE})`,
                sub: "Exit Fees",
                value: formatCurrency(totalExitFees),
                highlight: false,
              },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.06 }}
              >
                <Card
                  className={`border ${
                    item.highlight
                      ? "border-primary/40 bg-primary/5"
                      : "border-border"
                  }`}
                >
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="text-xs text-muted-foreground">{item.sub}</p>
                    <p
                      className={`text-lg font-bold mt-1 ${
                        item.highlight ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {item.value}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Recent Fee Transactions</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table data-ocid="fees.table">
                <TableHeader>
                  <TableRow className="bg-secondary/50">
                    <TableHead className="text-xs">Date</TableHead>
                    <TableHead className="text-xs">Description</TableHead>
                    <TableHead className="text-xs">Type</TableHead>
                    <TableHead className="text-xs">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentFees.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center py-6 text-muted-foreground text-sm"
                        data-ocid="fees.empty_state"
                      >
                        No fee transactions yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    recentFees.map((fee, idx) => (
                      <TableRow key={fee.id} data-ocid={`fees.row.${idx + 1}`}>
                        <TableCell className="text-xs">{fee.date}</TableCell>
                        <TableCell className="text-xs">
                          {fee.description}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              fee.type === "commission"
                                ? "bg-[oklch(0.96_0.06_50)] text-[oklch(0.50_0.14_50)]"
                                : fee.type === "entry"
                                  ? "bg-[oklch(0.94_0.05_158)] text-[oklch(0.38_0.09_158)]"
                                  : fee.type === "membership"
                                    ? "bg-[oklch(0.96_0.06_85)] text-[oklch(0.50_0.14_70)]"
                                    : "bg-[oklch(0.96_0.06_85)] text-[oklch(0.55_0.14_85)]"
                            }`}
                          >
                            {fee.type === "commission"
                              ? "Commission"
                              : fee.type === "entry"
                                ? "Entry"
                                : fee.type === "membership"
                                  ? "Membership"
                                  : "Exit"}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs font-bold text-primary">
                          {formatCurrency(fee.amount)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Bottom Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Legal Documents */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Legal Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeLoans.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No documents available
              </p>
            ) : (
              <div className="space-y-2">
                {activeLoans.slice(0, 3).map((loan) => (
                  <button
                    type="button"
                    key={loan.id}
                    onClick={() => onNavigate(`promissory-${loan.id}`)}
                    className="w-full text-left p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors flex items-center gap-3"
                    data-ocid="documents.link"
                  >
                    <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">
                        Promissory Note — {formatCurrency(loan.amount)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Date: {loan.startDate} • Commission:{" "}
                        {formatCurrency(loan.commissionAmount)}
                      </p>
                    </div>
                  </button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2"
                  onClick={() => onNavigate("legal-docs")}
                  data-ocid="documents.link"
                >
                  View All Legal Documents
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Legal Action Status */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-primary" />
              Legal Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeLoans.length === 0 ? (
              <p className="text-sm text-muted-foreground">No active loans</p>
            ) : (
              <div className="space-y-2">
                {activeLoans.map((loan) => {
                  const cfg = LEGAL_STATUS_CONFIG[loan.legalStatus];
                  const isBorrower = loan.borrowerId === currentUser.id;
                  return (
                    <div
                      key={loan.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary"
                    >
                      <div>
                        <p className="text-sm font-medium">
                          {formatCurrency(loan.amount)} —{" "}
                          {isAdmin
                            ? getUserName(loan.borrowerId)
                            : getUserName(
                                isBorrower ? loan.lenderId : loan.borrowerId,
                              )}
                        </p>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full border font-medium ${cfg.color}`}
                        >
                          {cfg.label}
                        </span>
                      </div>
                      {(!isBorrower || isAdmin) && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs"
                          onClick={() => onNavigate(`legal-${loan.id}`)}
                          data-ocid="legal.edit_button"
                        >
                          Manage
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Credit Score Card */}
        {!isAdmin && (
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Credit Score / क्रेडिट स्कोर
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-xl"
                  style={{
                    background: scoreInfo.bgColor,
                    color: scoreInfo.color,
                  }}
                >
                  {creditScore}
                </div>
                <div>
                  <p
                    className="text-sm font-bold"
                    style={{ color: scoreInfo.color }}
                  >
                    {scoreInfo.label}
                  </p>
                  <p className="text-xs text-muted-foreground">out of 900</p>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{
                      background: scoreInfo.bgColor,
                      color: scoreInfo.color,
                    }}
                  >
                    {scoreInfo.label === "Excellent"
                      ? "उत्कृष्ट"
                      : scoreInfo.label === "Good"
                        ? "अच्छा"
                        : scoreInfo.label === "Fair"
                          ? "ठीक"
                          : "खराब"}
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full border-primary/40 text-primary hover:bg-primary/5"
                onClick={() => onNavigate("credit-score")}
                data-ocid="credit_score.link"
              >
                <BarChart3 className="w-4 h-4 mr-2" /> View Full Report
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
