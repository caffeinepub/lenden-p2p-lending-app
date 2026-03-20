import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  ArrowLeft,
  CheckCircle2,
  Lightbulb,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useApp } from "../store/appStore";
import { formatCurrency, getCreditScoreLabel } from "../types";

interface CreditScorePageProps {
  onNavigate: (page: string) => void;
}

function ScoreGauge({ score }: { score: number }) {
  const [animatedScore, setAnimatedScore] = useState(300);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 200);
    return () => clearTimeout(timer);
  }, [score]);

  // Arc from 210deg to -30deg (240 degrees total)
  const MIN = 300;
  const MAX = 900;
  const RANGE = MAX - MIN;
  const pct = Math.min(1, Math.max(0, (animatedScore - MIN) / RANGE));

  const cx = 100;
  const cy = 95;
  const r = 72;
  const startAngle = 210;
  const totalArcDeg = 240;
  const endAngleDeg = startAngle - totalArcDeg;

  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const arcStart = {
    x: cx + r * Math.cos(toRad(startAngle)),
    y: cy - r * Math.sin(toRad(startAngle)),
  };
  const arcEnd = {
    x: cx + r * Math.cos(toRad(endAngleDeg)),
    y: cy - r * Math.sin(toRad(endAngleDeg)),
  };

  const progressAngle = startAngle - pct * totalArcDeg;
  const progressEnd = {
    x: cx + r * Math.cos(toRad(progressAngle)),
    y: cy - r * Math.sin(toRad(progressAngle)),
  };

  const info = getCreditScoreLabel(animatedScore);

  // Gradient stops for color arc
  const zones = [
    { offset: "0%", color: "oklch(0.55 0.20 27)" },
    { offset: "33%", color: "oklch(0.60 0.16 70)" },
    { offset: "66%", color: "oklch(0.60 0.14 120)" },
    { offset: "100%", color: "oklch(0.45 0.12 158)" },
  ];

  return (
    <svg
      viewBox="0 0 200 130"
      className="w-64 h-44 mx-auto"
      role="img"
      aria-label="Credit Score Gauge"
    >
      <defs>
        <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          {zones.map((z) => (
            <stop key={z.offset} offset={z.offset} stopColor={z.color} />
          ))}
        </linearGradient>
      </defs>
      {/* Track */}
      <path
        d={`M ${arcStart.x} ${arcStart.y} A ${r} ${r} 0 1 1 ${arcEnd.x} ${arcEnd.y}`}
        fill="none"
        stroke="oklch(0.92 0.015 240)"
        strokeWidth="10"
        strokeLinecap="round"
      />
      {/* Progress arc */}
      <path
        d={`M ${arcStart.x} ${arcStart.y} A ${r} ${r} 0 ${pct > 0.5 ? 1 : 0} 1 ${progressEnd.x} ${progressEnd.y}`}
        fill="none"
        stroke="url(#scoreGrad)"
        strokeWidth="10"
        strokeLinecap="round"
        style={{ transition: "d 1s ease-out" }}
      />
      {/* Center score */}
      <text
        x={cx}
        y={cy - 6}
        textAnchor="middle"
        fontSize="26"
        fontWeight="800"
        fill={info.color}
        fontFamily="Plus Jakarta Sans, sans-serif"
        style={{ transition: "fill 0.5s" }}
      >
        {animatedScore}
      </text>
      <text
        x={cx}
        y={cy + 14}
        textAnchor="middle"
        fontSize="10"
        fill="oklch(0.5 0.01 240)"
        fontFamily="Plus Jakarta Sans, sans-serif"
      >
        {info.label} /{" "}
        {info.label === "Excellent"
          ? "उत्कृष्ट"
          : info.label === "Good"
            ? "अच्छा"
            : info.label === "Fair"
              ? "ठीक"
              : "खराब"}
      </text>
      {/* Min/Max labels */}
      <text
        x="22"
        y="120"
        fontSize="8"
        fill="oklch(0.6 0.01 240)"
        fontFamily="Plus Jakarta Sans, sans-serif"
      >
        {MIN}
      </text>
      <text
        x="170"
        y="120"
        fontSize="8"
        fill="oklch(0.6 0.01 240)"
        fontFamily="Plus Jakarta Sans, sans-serif"
      >
        {MAX}
      </text>
    </svg>
  );
}

export function CreditScorePage({ onNavigate }: CreditScorePageProps) {
  const {
    currentUser,
    loans,
    repayments,
    computeCreditScore,
    updateUserCreditScore,
  } = useApp();
  if (!currentUser) return null;

  const score = currentUser.creditScore ?? computeCreditScore(currentUser.id);
  const info = getCreditScoreLabel(score);

  const myLoans = loans.filter(
    (l) => l.borrowerId === currentUser.id || l.lenderId === currentUser.id,
  );
  const completedLoans = myLoans.filter((l) => l.status === "completed");
  const myRepayments = repayments.filter((r) =>
    myLoans.some((l) => l.id === r.loanId),
  );
  const legalIssues = myLoans.filter(
    (l) =>
      l.legalStatus === "legal_pending" || l.legalStatus === "action_initiated",
  );

  const handleRefresh = () => {
    updateUserCreditScore(currentUser.id);
  };

  const TIPS = [
    {
      icon: CheckCircle2,
      text: "Make all repayments on time",
      hindi: "समय पर भुगतान करें",
    },
    {
      icon: TrendingUp,
      text: "Complete your active loans",
      hindi: "सक्रिय ऋण पूरे करें",
    },
    {
      icon: AlertTriangle,
      text: "Avoid legal disputes",
      hindi: "कानूनी विवादों से बचें",
    },
    {
      icon: Lightbulb,
      text: "Build a consistent repayment history",
      hindi: "नियमित भुगतान इतिहास बनाएं",
    },
  ];

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Button
          variant="ghost"
          onClick={() => onNavigate("dashboard")}
          className="mb-4 -ml-2"
          data-ocid="credit_score.link"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Credit Score</h1>
            <p className="text-muted-foreground text-sm">
              क्रेडिट स्कोर — Your financial reputation
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            data-ocid="credit_score.secondary_button"
          >
            <RefreshCw className="w-4 h-4 mr-1" /> Refresh
          </Button>
        </div>
      </motion.div>

      {/* Gauge Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <Card className="border-border">
          <CardContent className="pt-6 pb-4">
            <ScoreGauge score={score} />
            <div className="mt-3 flex justify-center">
              <span
                className="text-sm font-semibold px-4 py-1.5 rounded-full"
                style={{ background: info.bgColor, color: info.color }}
              >
                {score} — {info.label}
              </span>
            </div>
            <p className="text-center text-xs text-muted-foreground mt-2">
              Score range: 300 (Poor) → 900 (Excellent)
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Score Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              Score Breakdown / स्कोर विश्लेषण
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 rounded-xl bg-[oklch(0.94_0.05_158)] border border-[oklch(0.85_0.06_158)]">
                <p className="text-2xl font-bold text-[oklch(0.38_0.09_158)]">
                  {completedLoans.length}
                </p>
                <p className="text-xs text-[oklch(0.45_0.09_158)] mt-1">
                  Completed Loans
                </p>
                <p className="text-xs text-[oklch(0.55_0.08_158)]">
                  +{completedLoans.length * 10} pts
                </p>
              </div>
              <div className="text-center p-3 rounded-xl bg-[oklch(0.95_0.05_193)] border border-[oklch(0.85_0.04_193)]">
                <p className="text-2xl font-bold text-primary">
                  {myRepayments.length}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Repayments Made
                </p>
                <p className="text-xs text-muted-foreground">
                  +{myRepayments.length * 5} pts
                </p>
              </div>
              <div className="text-center p-3 rounded-xl bg-[oklch(0.96_0.06_27)] border border-[oklch(0.85_0.10_27)]">
                <p className="text-2xl font-bold text-[oklch(0.55_0.20_27)]">
                  {legalIssues.length}
                </p>
                <p className="text-xs text-[oklch(0.55_0.15_27)] mt-1">
                  Legal Issues
                </p>
                <p className="text-xs text-[oklch(0.60_0.15_27)]">
                  -{legalIssues.length * 20} pts
                </p>
              </div>
            </div>
            <div className="mt-4 p-3 rounded-xl bg-secondary/60">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Base Score</span>
                <span className="font-semibold">600</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-muted-foreground">
                  Completed Loans Bonus
                </span>
                <span className="font-semibold text-[oklch(0.38_0.09_158)]">
                  +{completedLoans.length * 10}
                </span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-muted-foreground">Repayments Bonus</span>
                <span className="font-semibold text-[oklch(0.38_0.09_158)]">
                  +{myRepayments.length * 5}
                </span>
              </div>
              {legalIssues.length > 0 && (
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-muted-foreground">
                    Legal Issues Penalty
                  </span>
                  <span className="font-semibold text-[oklch(0.55_0.20_27)]">
                    -{legalIssues.length * 20}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm mt-2 pt-2 border-t border-border font-bold">
                <span>Final Score</span>
                <span style={{ color: info.color }}>{score}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Repayments */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6"
      >
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              Recent Repayments / हालिया भुगतान
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table data-ocid="credit_score.table">
              <TableHeader>
                <TableRow className="bg-secondary/50">
                  <TableHead className="text-xs">Date</TableHead>
                  <TableHead className="text-xs">Description</TableHead>
                  <TableHead className="text-xs">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myRepayments.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-center py-8 text-muted-foreground text-sm"
                      data-ocid="credit_score.empty_state"
                    >
                      No repayments yet — make your first payment to build
                      credit!
                    </TableCell>
                  </TableRow>
                ) : (
                  myRepayments.slice(0, 5).map((r, idx) => (
                    <TableRow
                      key={r.id}
                      data-ocid={`credit_score.row.${idx + 1}`}
                    >
                      <TableCell className="text-xs">{r.date}</TableCell>
                      <TableCell className="text-xs">{r.note}</TableCell>
                      <TableCell className="text-xs font-semibold text-primary">
                        {formatCurrency(r.amount)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-[oklch(0.60_0.16_70)]" />
              Tips to Improve / सुधार के सुझाव
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {TIPS.map((tip) => (
                <div key={tip.text} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[oklch(0.96_0.06_85)] flex items-center justify-center flex-shrink-0">
                    <tip.icon className="w-3.5 h-3.5 text-[oklch(0.55_0.16_70)]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{tip.text}</p>
                    <p className="text-xs text-muted-foreground">{tip.hindi}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  );
}
