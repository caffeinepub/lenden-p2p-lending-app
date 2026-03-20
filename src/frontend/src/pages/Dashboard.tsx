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
  CreditCard,
  FileText,
  IndianRupee,
  Plus,
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
} from "../types";

interface DashboardProps {
  onNavigate: (page: string) => void;
}

const LEGAL_STATUS_CONFIG = {
  normal: {
    label: "सामान्य / Normal",
    color:
      "bg-[oklch(0.94_0.05_158)] text-[oklch(0.38_0.09_158)] border-[oklch(0.80_0.06_158)]",
  },
  warning: {
    label: "चेतावनी / Warning",
    color:
      "bg-[oklch(0.96_0.06_85)] text-[oklch(0.55_0.16_85)] border-[oklch(0.85_0.10_85)]",
  },
  legal_pending: {
    label: "कानूनी लंबित / Legal Pending",
    color:
      "bg-[oklch(0.96_0.06_50)] text-[oklch(0.55_0.16_50)] border-[oklch(0.85_0.10_50)]",
  },
  action_initiated: {
    label: "कार्रवाई शुरू / Action Initiated",
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

  const myLoans = loans.filter(
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

  // Recent fee records (last 5)
  const recentFees = [...feeRecords]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold font-devanagari">
          ऋण डैशबोर्ड{" "}
          <span className="text-muted-foreground font-normal text-lg">
            / Loan Dashboard
          </span>
        </h1>
        <p className="text-muted-foreground mt-1">
          नमस्ते, {currentUser.name} 👋
        </p>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            icon: CreditCard,
            label: "सक्रिय ऋण",
            sub: "Active Loans",
            value: activeLoans.length.toString(),
            color: "text-primary",
          },
          {
            icon: IndianRupee,
            label: "कुल राशि",
            sub: "Total Amount",
            value: formatCurrency(totalAmount),
            color: "text-primary",
          },
          {
            icon: TrendingUp,
            label: "शेष भुगतान",
            sub: "Remaining",
            value: formatCurrency(totalRemaining),
            color: "text-[oklch(0.55_0.16_50)]",
          },
          {
            icon: AlertTriangle,
            label: "औसत ब्याज",
            sub: "Avg Interest",
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
                    <p className="text-xs font-devanagari text-muted-foreground">
                      {kpi.label}
                    </p>
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
            <Plus className="w-4 h-4 mr-2" /> ऋण अनुरोध करें / Request Loan
          </Button>
        )}
        {(currentUser.role === "lender" || currentUser.role === "both") && (
          <Button
            variant="outline"
            onClick={() => onNavigate("loan-requests")}
            data-ocid="dashboard.secondary_button"
          >
            ऋण अनुमोदन / Approve Loans
          </Button>
        )}
        <Button
          variant="outline"
          onClick={() => onNavigate("repayment")}
          data-ocid="dashboard.secondary_button"
        >
          भुगतान करें / Make Payment
        </Button>
      </div>

      {/* Active Loans */}
      <section className="mb-8">
        <h2 className="text-lg font-bold font-devanagari mb-4">
          सक्रिय ऋण{" "}
          <span className="text-muted-foreground font-normal text-sm">
            / Active Loans
          </span>
        </h2>
        {activeLoans.length === 0 ? (
          <Card className="border-dashed" data-ocid="loans.empty_state">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground font-devanagari">
                कोई सक्रिय ऋण नहीं / No active loans
              </p>
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
              const otherUser = getUserName(
                isBorrower ? loan.lenderId : loan.borrowerId,
              );

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
                          <p className="text-xs text-muted-foreground font-devanagari">
                            {isBorrower ? "ऋणदाता" : "उधारकर्ता"}
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
                          <span className="text-sm text-muted-foreground font-devanagari">
                            मूल राशि
                          </span>
                          <span className="font-bold text-primary">
                            {formatCurrency(loan.amount)}
                          </span>
                        </div>
                        {/* Net amount to borrower */}
                        {isBorrower && (
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground font-devanagari">
                              आपको मिला (कमीशन के बाद)
                            </span>
                            <span className="font-semibold text-[oklch(0.38_0.09_158)]">
                              {formatCurrency(loan.netAmountToBorrower)}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground font-devanagari">
                            कमीशन ({(PLATFORM_COMMISSION_RATE * 100).toFixed(0)}
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
                          <span className="text-sm text-muted-foreground font-devanagari">
                            मासिक किस्त
                          </span>
                          <span className="font-medium">
                            {formatCurrency(monthlyEMI)}
                          </span>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>भुगतान प्रगति / Progress</span>
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
                            <FileText className="w-3 h-3 mr-1" /> नोट देखें
                          </Button>
                          {!isBorrower && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 text-xs border-[oklch(0.85_0.12_27)] text-[oklch(0.55_0.20_27)] hover:bg-[oklch(0.96_0.06_27)]"
                              onClick={() => onNavigate(`legal-${loan.id}`)}
                              data-ocid={`loans.delete_button.${idx + 1}`}
                            >
                              <AlertTriangle className="w-3 h-3 mr-1" /> कानूनी
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

      {/* Transaction History */}
      <section className="mb-8">
        <h2 className="text-lg font-bold font-devanagari mb-4">
          लेन-देन इतिहास{" "}
          <span className="text-muted-foreground font-normal text-sm">
            / Transaction History
          </span>
        </h2>
        <Card className="border-border">
          <CardContent className="p-0">
            <Table data-ocid="transactions.table">
              <TableHeader>
                <TableRow className="bg-secondary/50">
                  <TableHead className="font-devanagari">दिनांक</TableHead>
                  <TableHead className="font-devanagari">विवरण</TableHead>
                  <TableHead className="font-devanagari">राशि</TableHead>
                  <TableHead className="font-devanagari">स्थिति</TableHead>
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
                      कोई लेन-देन नहीं / No transactions yet
                    </TableCell>
                  </TableRow>
                ) : (
                  myRepayments.map((r, idx) => (
                    <TableRow
                      key={r.id}
                      data-ocid={`transactions.row.${idx + 1}`}
                    >
                      <TableCell className="text-sm">{r.date}</TableCell>
                      <TableCell className="text-sm font-devanagari">
                        {r.note}
                      </TableCell>
                      <TableCell className="text-sm font-semibold text-primary">
                        {formatCurrency(r.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-[oklch(0.94_0.05_158)] text-[oklch(0.38_0.09_158)] border-0">
                          भुगतान / Paid
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

      {/* ── Admin Earnings Section ─────────────────────────────────── */}
      <section className="mb-8">
        <h2 className="text-lg font-bold font-devanagari mb-4 flex items-center gap-2">
          <Wallet className="w-5 h-5 text-primary" />
          एडमिन आय{" "}
          <span className="text-muted-foreground font-normal text-sm">
            / Admin Earnings
          </span>
        </h2>

        {/* Summary KPI row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {[
            {
              label: "कुल आय",
              sub: "Total Earnings",
              value: formatCurrency(totalAdminEarnings),
              highlight: true,
            },
            {
              label: `कमीशन (${(PLATFORM_COMMISSION_RATE * 100).toFixed(0)}%)`,
              sub: "Commissions",
              value: formatCurrency(totalCommission),
              highlight: false,
            },
            {
              label: `प्रवेश शुल्क (₹${PLATFORM_ENTRY_FEE})`,
              sub: "Entry Fees",
              value: formatCurrency(totalEntryFees),
              highlight: false,
            },
            {
              label: `निकास शुल्क (₹${PLATFORM_EXIT_FEE})`,
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
                  <p className="text-xs font-devanagari text-muted-foreground">
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

        {/* Recent fee log */}
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-devanagari">
              हाल के शुल्क लेनदेन / Recent Fee Transactions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table data-ocid="fees.table">
              <TableHeader>
                <TableRow className="bg-secondary/50">
                  <TableHead className="text-xs">दिनांक / Date</TableHead>
                  <TableHead className="text-xs">विवरण / Description</TableHead>
                  <TableHead className="text-xs">प्रकार / Type</TableHead>
                  <TableHead className="text-xs">राशि / Amount</TableHead>
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
                      कोई शुल्क लेनदेन नहीं
                    </TableCell>
                  </TableRow>
                ) : (
                  recentFees.map((fee, idx) => (
                    <TableRow key={fee.id} data-ocid={`fees.row.${idx + 1}`}>
                      <TableCell className="text-xs">{fee.date}</TableCell>
                      <TableCell className="text-xs font-devanagari">
                        {fee.description}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            fee.type === "commission"
                              ? "bg-[oklch(0.96_0.06_50)] text-[oklch(0.50_0.14_50)]"
                              : fee.type === "entry"
                                ? "bg-[oklch(0.94_0.05_158)] text-[oklch(0.38_0.09_158)]"
                                : "bg-[oklch(0.96_0.06_85)] text-[oklch(0.55_0.14_85)]"
                          }`}
                        >
                          {fee.type === "commission"
                            ? "Commission"
                            : fee.type === "entry"
                              ? "Entry"
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

      {/* Bottom Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Legal Documents */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base font-devanagari flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              कानूनी दस्तावेज़ / Legal Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeLoans.length === 0 ? (
              <p className="text-sm text-muted-foreground font-devanagari">
                कोई दस्तावेज़ नहीं / No documents
              </p>
            ) : (
              <div className="space-y-2">
                {activeLoans.map((loan) => (
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
                      <p className="text-xs text-muted-foreground font-devanagari">
                        दिनांक: {loan.startDate} • Commission:{" "}
                        {formatCurrency(loan.commissionAmount)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Legal Action Status */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base font-devanagari flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-primary" />
              कानूनी कार्रवाई स्थिति / Legal Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeLoans.length === 0 ? (
              <p className="text-sm text-muted-foreground">No active loans</p>
            ) : (
              <div className="space-y-2">
                {activeLoans.map((loan) => {
                  const cfg = LEGAL_STATUS_CONFIG[loan.legalStatus];
                  const other = getUserName(
                    loan.borrowerId === currentUser.id
                      ? loan.lenderId
                      : loan.borrowerId,
                  );
                  return (
                    <div
                      key={loan.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                    >
                      <div>
                        <p className="text-sm font-medium">{other}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatCurrency(loan.amount)}
                        </p>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full border font-medium ${cfg.color}`}
                      >
                        {cfg.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
