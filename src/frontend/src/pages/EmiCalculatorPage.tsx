import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Calculator,
  IndianRupee,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";

interface EmiCalculatorPageProps {
  onNavigate: (page: string) => void;
  initialAmount?: number;
  initialRate?: number;
  initialMonths?: number;
}

function formatINR(n: number) {
  return n.toLocaleString("en-IN");
}

function calcEMI(principal: number, annualRate: number, months: number) {
  if (months <= 0 || principal <= 0) return 0;
  if (annualRate === 0) return principal / months;
  const r = annualRate / 12 / 100;
  return (principal * r * (1 + r) ** months) / ((1 + r) ** months - 1);
}

function buildSchedule(principal: number, annualRate: number, months: number) {
  const emi = calcEMI(principal, annualRate, months);
  const r = annualRate / 12 / 100;
  const rows: {
    month: number;
    emi: number;
    interest: number;
    principal: number;
    balance: number;
  }[] = [];
  let balance = principal;
  for (let m = 1; m <= months; m++) {
    const interest = annualRate === 0 ? 0 : balance * r;
    const principalPart = emi - interest;
    balance = Math.max(0, balance - principalPart);
    rows.push({
      month: m,
      emi,
      interest,
      principal: principalPart,
      balance,
    });
  }
  return rows;
}

const COMPARE_RATES = [3, 5, 8, 12];

function AnimatedAmount({ value }: { value: number }) {
  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={value}
        initial={{ opacity: 0, y: -16, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.95 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="inline-block"
      >
        ₹{formatINR(Math.round(value))}
      </motion.span>
    </AnimatePresence>
  );
}

function DonutChart({
  principal,
  totalInterest,
  commission,
}: {
  principal: number;
  totalInterest: number;
  commission: number;
}) {
  const total = principal + totalInterest + commission;
  if (total <= 0) return null;

  const cx = 80;
  const cy = 80;
  const r = 62;
  const stroke = 20;
  const circumference = 2 * Math.PI * r;

  const principalPct = principal / total;
  const interestPct = totalInterest / total;
  const commissionPct = commission / total;

  const principalDash = circumference * principalPct;
  const interestDash = circumference * interestPct;
  const commissionDash = circumference * commissionPct;

  // gap
  const gap = 2;

  function arc(offset: number, dash: number, color: string, key: string) {
    return (
      <circle
        key={key}
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={`${Math.max(0, dash - gap)} ${circumference - Math.max(0, dash - gap)}`}
        strokeDashoffset={-offset}
        strokeLinecap="round"
        style={{
          transition: "stroke-dasharray 0.5s ease, stroke-dashoffset 0.5s ease",
        }}
      />
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <svg
        viewBox="0 0 160 160"
        className="w-44 h-44"
        role="img"
        aria-label="EMI breakdown donut chart"
      >
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-muted/30"
        />
        {arc(
          -(circumference * 0.25),
          principalDash,
          "oklch(0.55 0.17 158)",
          "p",
        )}
        {arc(
          -(circumference * 0.25) - principalDash,
          interestDash,
          "oklch(0.70 0.18 85)",
          "i",
        )}
        {arc(
          -(circumference * 0.25) - principalDash - interestDash,
          commissionDash,
          "oklch(0.58 0.22 27)",
          "c",
        )}
        <text
          x={cx}
          y={cy - 6}
          textAnchor="middle"
          fontSize="11"
          fill="currentColor"
          className="fill-muted-foreground font-medium"
          fontFamily="inherit"
        >
          Total
        </text>
        <text
          x={cx}
          y={cy + 12}
          textAnchor="middle"
          fontSize="12"
          fontWeight="700"
          fill="currentColor"
          className="fill-foreground"
          fontFamily="inherit"
        >
          ₹{formatINR(Math.round(total))}
        </text>
      </svg>
      <div className="flex flex-wrap justify-center gap-4 text-xs font-medium">
        <span className="flex items-center gap-1.5">
          <span
            className="w-3 h-3 rounded-full"
            style={{ background: "oklch(0.55 0.17 158)" }}
          />
          Principal
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="w-3 h-3 rounded-full"
            style={{ background: "oklch(0.70 0.18 85)" }}
          />
          Interest
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="w-3 h-3 rounded-full"
            style={{ background: "oklch(0.58 0.22 27)" }}
          />
          Commission
        </span>
      </div>
    </div>
  );
}

export function EmiCalculatorPage({
  onNavigate,
  initialAmount = 100000,
  initialRate = 5,
  initialMonths = 12,
}: EmiCalculatorPageProps) {
  const [amount, setAmount] = useState(initialAmount);
  const [rate, setRate] = useState(initialRate);
  const [months, setMonths] = useState(initialMonths);

  const emi = useMemo(
    () => calcEMI(amount, rate, months),
    [amount, rate, months],
  );
  const totalRepayable = emi * months;
  const totalInterest = totalRepayable - amount;
  const commission = Math.round(amount * 0.07);
  const netReceived = amount - commission;

  const schedule = useMemo(
    () => buildSchedule(amount, rate, months),
    [amount, rate, months],
  );

  return (
    <main className="max-w-3xl mx-auto px-4 py-8 pb-16">
      {/* Back */}
      <button
        type="button"
        onClick={() => onNavigate("dashboard")}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors text-sm"
        data-ocid="emi.link"
      >
        <ArrowLeft className="w-4 h-4" /> Dashboard par wapas jaayein
      </button>

      {/* Hero header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
            <Calculator className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-foreground leading-tight">
              EMI Calculator
            </h1>
            <p className="text-xs text-muted-foreground">
              Reducing Balance Method • घटते बैलेंस पद्धति
            </p>
          </div>
        </div>
      </motion.div>

      {/* Sliders */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
      >
        <Card className="mb-6 shadow-[0_4px_24px_0_oklch(0.45_0.15_25/0.08)] border-border">
          <CardContent className="p-5 space-y-6">
            {/* Amount */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label
                  htmlFor="emi-amount"
                  className="text-sm font-semibold text-foreground"
                >
                  Loan Amount{" "}
                  <span className="text-muted-foreground font-normal">
                    (ऋण राशि)
                  </span>
                </label>
                <div className="flex items-center gap-1 bg-primary/8 rounded-lg px-3 py-1">
                  <IndianRupee className="w-3.5 h-3.5 text-primary" />
                  <input
                    type="number"
                    value={amount}
                    min={1000}
                    max={5000000}
                    onChange={(e) =>
                      setAmount(
                        Math.min(
                          5000000,
                          Math.max(1000, Number(e.target.value) || 1000),
                        ),
                      )
                    }
                    className="w-24 text-right bg-transparent font-bold text-primary text-sm outline-none"
                    data-ocid="emi.input"
                  />
                </div>
              </div>
              <Slider
                value={[amount]}
                min={1000}
                max={5000000}
                step={1000}
                onValueChange={([v]) => setAmount(v)}
                className="w-full"
                data-ocid="emi.toggle"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1.5">
                <span>₹1,000</span>
                <span>₹50,00,000</span>
              </div>
            </div>

            {/* Interest Rate */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label
                  htmlFor="emi-rate"
                  className="text-sm font-semibold text-foreground"
                >
                  Interest Rate{" "}
                  <span className="text-muted-foreground font-normal">
                    (ब्याज दर)
                  </span>
                </label>
                <div className="flex items-center gap-1 bg-amber-500/8 rounded-lg px-3 py-1">
                  <input
                    type="number"
                    value={rate}
                    min={0}
                    max={36}
                    step={0.1}
                    onChange={(e) =>
                      setRate(
                        Math.min(36, Math.max(0, Number(e.target.value) || 0)),
                      )
                    }
                    className="w-12 text-right bg-transparent font-bold text-amber-600 text-sm outline-none"
                    data-ocid="emi.input"
                  />
                  <span className="text-sm font-bold text-amber-600">%</span>
                </div>
              </div>
              <Slider
                value={[rate]}
                min={0}
                max={36}
                step={0.1}
                onValueChange={([v]) => setRate(v)}
                className="w-full"
                data-ocid="emi.toggle"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1.5">
                <span>0%</span>
                <span>36%</span>
              </div>
            </div>

            {/* Duration */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label
                  htmlFor="emi-months"
                  className="text-sm font-semibold text-foreground"
                >
                  Loan Duration{" "}
                  <span className="text-muted-foreground font-normal">
                    (अवधि)
                  </span>
                </label>
                <div className="flex items-center gap-1 bg-secondary/60 rounded-lg px-3 py-1">
                  <input
                    type="number"
                    value={months}
                    min={1}
                    max={60}
                    onChange={(e) =>
                      setMonths(
                        Math.min(60, Math.max(1, Number(e.target.value) || 1)),
                      )
                    }
                    className="w-10 text-right bg-transparent font-bold text-foreground text-sm outline-none"
                    data-ocid="emi.input"
                  />
                  <span className="text-sm font-semibold text-muted-foreground">
                    months
                  </span>
                </div>
              </div>
              <Slider
                value={[months]}
                min={1}
                max={60}
                step={1}
                onValueChange={([v]) => setMonths(v)}
                className="w-full"
                data-ocid="emi.toggle"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1.5">
                <span>1 month</span>
                <span>60 months</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Animated EMI Hero */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="mb-6"
      >
        <div className="rounded-2xl bg-gradient-to-br from-primary/15 via-primary/8 to-secondary/30 border border-primary/20 shadow-[0_8px_32px_0_oklch(0.45_0.15_25/0.12)] p-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 pointer-events-none" />
          <p className="text-sm font-medium text-muted-foreground mb-1">
            Monthly EMI • मासिक किस्त
          </p>
          <div className="text-5xl font-black text-primary tracking-tight mb-1">
            <AnimatedAmount value={emi} />
          </div>
          <p className="text-xs text-muted-foreground">
            per month for {months} months
          </p>
        </div>
      </motion.div>

      {/* Tabs: Summary / Full Schedule */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.15 }}
      >
        <Tabs defaultValue="summary" data-ocid="emi.tab">
          <TabsList className="w-full mb-5">
            <TabsTrigger value="summary" className="flex-1" data-ocid="emi.tab">
              Summary
            </TabsTrigger>
            <TabsTrigger
              value="schedule"
              className="flex-1"
              data-ocid="emi.tab"
            >
              Full Schedule
            </TabsTrigger>
            <TabsTrigger value="compare" className="flex-1" data-ocid="emi.tab">
              Compare Rates
            </TabsTrigger>
          </TabsList>

          {/* Summary Tab */}
          <TabsContent value="summary" className="space-y-6">
            {/* Donut chart */}
            <Card className="border-border shadow-sm">
              <CardContent className="p-5 flex flex-col items-center">
                <DonutChart
                  principal={amount}
                  totalInterest={Math.max(0, totalInterest)}
                  commission={commission}
                />
              </CardContent>
            </Card>

            {/* Summary cards */}
            <div className="grid grid-cols-2 gap-3">
              <motion.div
                whileHover={{ y: -2 }}
                transition={{ duration: 0.15 }}
              >
                <Card className="border-primary/20 bg-primary/5 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <p className="text-xs text-primary font-medium mb-1">
                      Monthly EMI
                    </p>
                    <p className="text-xl font-black text-primary">
                      ₹{formatINR(Math.round(emi))}
                    </p>
                    <p className="text-xs text-muted-foreground">मासिक किस्त</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ y: -2 }}
                transition={{ duration: 0.15 }}
              >
                <Card className="border-amber-300/40 bg-amber-50/50 dark:bg-amber-950/20 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <p className="text-xs text-amber-700 dark:text-amber-400 font-medium mb-1">
                      Total Interest
                    </p>
                    <p className="text-xl font-black text-amber-700 dark:text-amber-400">
                      ₹{formatINR(Math.round(Math.max(0, totalInterest)))}
                    </p>
                    <p className="text-xs text-muted-foreground">कुल ब्याज</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ y: -2 }}
                transition={{ duration: 0.15 }}
              >
                <Card className="border-red-300/40 bg-red-50/50 dark:bg-red-950/20 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <p className="text-xs text-red-600 dark:text-red-400 font-medium mb-1">
                      Total Repayable
                    </p>
                    <p className="text-xl font-black text-red-600 dark:text-red-400">
                      ₹{formatINR(Math.round(Math.max(0, totalRepayable)))}
                    </p>
                    <p className="text-xs text-muted-foreground">कुल देय राशि</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ y: -2 }}
                transition={{ duration: 0.15 }}
              >
                <Card className="border-green-300/40 bg-green-50/50 dark:bg-green-950/20 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <p className="text-xs text-green-700 dark:text-green-400 font-medium mb-1">
                      Net Received
                    </p>
                    <p className="text-xl font-black text-green-700 dark:text-green-400">
                      ₹{formatINR(netReceived)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      शुद्ध प्राप्ति (7% कमीशन बाद)
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Key stats */}
            <Card className="border-border shadow-sm">
              <CardContent className="p-4 space-y-3">
                <h3 className="text-sm font-bold text-foreground mb-3">
                  Key Statistics • मुख्य आँकड़े
                </h3>
                {[
                  {
                    label: "Principal Amount",
                    value: `₹${formatINR(amount)}`,
                    color: "text-foreground",
                  },
                  {
                    label: "Annual Interest Rate",
                    value: `${rate}%`,
                    color: "text-amber-600",
                  },
                  {
                    label: "Loan Duration",
                    value: `${months} months`,
                    color: "text-foreground",
                  },
                  {
                    label: "Platform Commission (7%)",
                    value: `₹${formatINR(commission)}`,
                    color: "text-red-600",
                  },
                  {
                    label: "Interest as % of Principal",
                    value:
                      amount > 0
                        ? `${((totalInterest / amount) * 100).toFixed(1)}%`
                        : "0%",
                    color: "text-amber-600",
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="flex justify-between items-center py-1.5 border-b border-border last:border-0"
                  >
                    <span className="text-xs text-muted-foreground">
                      {stat.label}
                    </span>
                    <span className={`text-sm font-bold ${stat.color}`}>
                      {stat.value}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* CTA */}
            <Button
              className="w-full"
              onClick={() => onNavigate("new-loan")}
              data-ocid="emi.primary_button"
            >
              Loan ke liye Apply Karein →
            </Button>
          </TabsContent>

          {/* Full Schedule Tab */}
          <TabsContent value="schedule">
            <Card className="border-border shadow-sm" data-ocid="emi.table">
              <CardContent className="p-0 overflow-hidden">
                <div className="bg-muted/50 px-4 py-3 border-b border-border">
                  <h3 className="text-sm font-bold text-foreground">
                    Amortization Schedule • परिशोधन अनुसूची
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Reducing balance method — {months} months
                  </p>
                </div>
                <div className="overflow-x-auto max-h-[420px] overflow-y-auto">
                  <table className="w-full text-xs">
                    <thead className="sticky top-0 bg-background border-b border-border">
                      <tr>
                        <th className="text-left px-4 py-2.5 text-muted-foreground font-semibold">
                          Month
                        </th>
                        <th className="text-right px-4 py-2.5 text-muted-foreground font-semibold">
                          EMI
                        </th>
                        <th className="text-right px-4 py-2.5 text-muted-foreground font-semibold">
                          Principal
                        </th>
                        <th className="text-right px-4 py-2.5 text-muted-foreground font-semibold">
                          Interest
                        </th>
                        <th className="text-right px-4 py-2.5 text-muted-foreground font-semibold">
                          Balance
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {schedule.map((row, idx) => (
                        <tr
                          key={row.month}
                          data-ocid={`emi.row.${idx + 1}`}
                          className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                        >
                          <td className="px-4 py-2.5 font-semibold text-foreground">
                            {row.month}
                          </td>
                          <td className="text-right px-4 py-2.5 font-bold text-primary">
                            ₹{formatINR(Math.round(row.emi))}
                          </td>
                          <td className="text-right px-4 py-2.5 text-green-600 font-medium">
                            ₹{formatINR(Math.round(row.principal))}
                          </td>
                          <td className="text-right px-4 py-2.5 text-amber-600 font-medium">
                            ₹{formatINR(Math.round(row.interest))}
                          </td>
                          <td className="text-right px-4 py-2.5 text-muted-foreground">
                            ₹{formatINR(Math.round(row.balance))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Compare Rates Tab */}
          <TabsContent value="compare">
            <Card className="border-border shadow-sm">
              <CardContent className="p-4">
                <h3 className="text-sm font-bold text-foreground mb-1">
                  Rate Comparison • दर तुलना
                </h3>
                <p className="text-xs text-muted-foreground mb-4">
                  EMI for ₹{formatINR(amount)} over {months} months at different
                  rates
                </p>
                <div className="space-y-3">
                  {COMPARE_RATES.map((r) => {
                    const compareEmi = calcEMI(amount, r, months);
                    const isSelected = Math.abs(r - rate) < 0.1;
                    const isBetter = compareEmi < emi;
                    return (
                      <motion.div
                        key={r}
                        whileHover={{ x: 3 }}
                        transition={{ duration: 0.15 }}
                        className={`flex items-center justify-between rounded-xl border p-3.5 transition-all ${
                          isSelected
                            ? "border-primary/50 bg-primary/8 shadow-sm"
                            : "border-border bg-muted/20 hover:border-border/80"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-lg font-black ${
                              isSelected ? "text-primary" : "text-foreground"
                            }`}
                          >
                            {r}%
                          </span>
                          {isSelected && (
                            <span className="text-xs bg-primary/15 text-primary px-1.5 py-0.5 rounded-full font-medium">
                              Current
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {!isSelected &&
                            (isBetter ? (
                              <TrendingDown className="w-3.5 h-3.5 text-green-600" />
                            ) : (
                              <TrendingUp className="w-3.5 h-3.5 text-red-500" />
                            ))}
                          <span
                            className={`text-base font-black ${
                              isSelected
                                ? "text-primary"
                                : isBetter
                                  ? "text-green-600"
                                  : "text-red-600"
                            }`}
                          >
                            ₹{formatINR(Math.round(compareEmi))}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            /mo
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </main>
  );
}
