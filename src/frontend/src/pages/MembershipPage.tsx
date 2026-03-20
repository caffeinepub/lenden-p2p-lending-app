import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  CheckCircle2,
  Crown,
  Shield,
  Star,
  TrendingDown,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "../store/appStore";
import {
  MEMBERSHIP_MONTHLY_PRICE,
  MEMBERSHIP_YEARLY_PRICE,
  formatCurrency,
} from "../types";

interface MembershipPageProps {
  onNavigate: (page: string) => void;
}

const BENEFITS = [
  {
    icon: TrendingDown,
    title: "Higher Loan Limit",
    subtitle: "उच्च ऋण सीमा",
    desc: "Up to ₹1,50,000 (vs ₹1,00,000 regular)",
  },
  {
    icon: Zap,
    title: "Priority Approval",
    subtitle: "प्राथमिकता अनुमोदन",
    desc: "Your loan requests get reviewed first",
  },
  {
    icon: TrendingDown,
    title: "Reduced Commission",
    subtitle: "कम कमीशन",
    desc: "Only 5% commission (vs 7% standard)",
  },
  {
    icon: Star,
    title: "Premium Badge",
    subtitle: "प्रीमियम बैज",
    desc: "Exclusive ⭐ Premium Member badge on your profile",
  },
  {
    icon: Shield,
    title: "Enhanced Trust",
    subtitle: "बेहतर विश्वास",
    desc: "Lenders prefer premium borrowers — get funded faster",
  },
];

export function MembershipPage({ onNavigate }: MembershipPageProps) {
  const { currentUser, purchaseMembership } = useApp();
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">(
    "yearly",
  );
  const [utr, setUtr] = useState("");
  const [showQr, setShowQr] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  if (!currentUser) return null;

  const isAlreadyPremium =
    currentUser.isPremium && currentUser.membershipExpiry
      ? new Date(currentUser.membershipExpiry) > new Date()
      : false;

  const handleConfirmPayment = () => {
    if (!utr.trim()) {
      toast.error("Please enter UTR / Transaction ID");
      return;
    }
    setIsConfirming(true);
    setTimeout(() => {
      purchaseMembership(currentUser.id, selectedPlan, utr.trim());
      toast.success("🎉 Premium Membership activated! Welcome to premium!");
      setIsConfirming(false);
      onNavigate("dashboard");
    }, 1000);
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Button
          variant="ghost"
          onClick={() => onNavigate("dashboard")}
          className="mb-4 -ml-2"
          data-ocid="membership.link"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[oklch(0.96_0.06_85)] flex items-center justify-center">
            <Crown className="w-6 h-6 text-[oklch(0.60_0.16_70)]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Premium Membership</h1>
            <p className="text-muted-foreground text-sm">
              प्रीमियम सदस्यता — Unlock exclusive benefits
            </p>
          </div>
        </div>
      </motion.div>

      {/* Already Premium Banner */}
      {isAlreadyPremium && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 p-4 rounded-xl bg-[oklch(0.94_0.05_158)] border border-[oklch(0.80_0.06_158)] flex items-center gap-3"
        >
          <CheckCircle2 className="w-6 h-6 text-[oklch(0.45_0.12_158)] flex-shrink-0" />
          <div>
            <p className="font-semibold text-[oklch(0.35_0.10_158)]">
              You are a Premium Member! ⭐
            </p>
            <p className="text-sm text-[oklch(0.45_0.09_158)]">
              Active until: {currentUser.membershipExpiry}
            </p>
          </div>
          <Badge className="ml-auto bg-[oklch(0.45_0.12_158)] text-white border-0">
            Active
          </Badge>
        </motion.div>
      )}

      {/* Benefits */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <h2 className="text-lg font-bold mb-4">
          Premium Benefits / प्रीमियम लाभ
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {BENEFITS.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.06 }}
              className="flex items-start gap-3 p-3 rounded-xl bg-card border border-border"
            >
              <div className="w-9 h-9 rounded-lg bg-[oklch(0.96_0.06_85)] flex items-center justify-center flex-shrink-0">
                <b.icon className="w-4 h-4 text-[oklch(0.55_0.16_70)]" />
              </div>
              <div>
                <p className="text-sm font-semibold">{b.title}</p>
                <p className="text-xs text-muted-foreground">{b.subtitle}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{b.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Plan Selection */}
      {!isAlreadyPremium && (
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-lg font-bold mb-4">Choose Plan / प्लान चुनें</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Monthly Plan */}
            <button
              type="button"
              onClick={() => setSelectedPlan("monthly")}
              data-ocid="membership.toggle"
              className={`relative p-5 rounded-xl border-2 text-left transition-all ${
                selectedPlan === "monthly"
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card hover:border-primary/40"
              }`}
            >
              <p className="font-bold text-lg">
                {formatCurrency(MEMBERSHIP_MONTHLY_PRICE)}
              </p>
              <p className="text-sm text-muted-foreground">
                per month / प्रति माह
              </p>
              <p className="text-xs text-muted-foreground mt-2">Monthly Plan</p>
              {selectedPlan === "monthly" && (
                <CheckCircle2 className="absolute top-3 right-3 w-5 h-5 text-primary" />
              )}
            </button>

            {/* Yearly Plan */}
            <button
              type="button"
              onClick={() => setSelectedPlan("yearly")}
              data-ocid="membership.toggle"
              className={`relative p-5 rounded-xl border-2 text-left transition-all ${
                selectedPlan === "yearly"
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card hover:border-primary/40"
              }`}
            >
              <div className="absolute top-3 right-3">
                <span className="text-xs bg-[oklch(0.94_0.05_158)] text-[oklch(0.38_0.09_158)] px-2 py-0.5 rounded-full font-semibold">
                  Save 58%
                </span>
              </div>
              <p className="font-bold text-lg">
                {formatCurrency(MEMBERSHIP_YEARLY_PRICE)}
              </p>
              <p className="text-sm text-muted-foreground">
                per year / प्रति वर्ष
              </p>
              <p className="text-xs text-[oklch(0.45_0.12_158)] mt-2 font-medium">
                Best Value — Only{" "}
                {formatCurrency(Math.round(MEMBERSHIP_YEARLY_PRICE / 12))}/mo
              </p>
              {selectedPlan === "yearly" && (
                <CheckCircle2 className="absolute bottom-3 right-3 w-5 h-5 text-primary" />
              )}
            </button>
          </div>
        </motion.section>
      )}

      {/* Payment Section */}
      {!isAlreadyPremium && (
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base">
                Complete Payment / भुगतान करें
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="p-4 rounded-xl bg-secondary/60 space-y-2">
                <p className="text-sm font-semibold">
                  Step 1: Pay{" "}
                  {selectedPlan === "monthly"
                    ? formatCurrency(MEMBERSHIP_MONTHLY_PRICE)
                    : formatCurrency(MEMBERSHIP_YEARLY_PRICE)}{" "}
                  to Admin UPI
                </p>
                <p className="text-sm text-muted-foreground">
                  UPI ID:{" "}
                  <span className="font-mono font-semibold text-primary">
                    barkat.6y@ptyes
                  </span>
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowQr(!showQr)}
                  data-ocid="membership.secondary_button"
                >
                  {showQr ? "Hide QR" : "Show QR Code"}
                </Button>
                {showQr && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="pt-2"
                  >
                    <img
                      src="/assets/uploads/IMG_20260321_020701-1.jpg"
                      alt="Admin UPI QR Code"
                      className="w-48 h-48 object-contain rounded-lg border border-border mx-auto"
                    />
                    <p className="text-xs text-center text-muted-foreground mt-1">
                      Scan with Google Pay / PhonePe / Paytm
                    </p>
                  </motion.div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="utr-input">
                  Step 2: Enter UTR / Transaction ID
                </Label>
                <Input
                  id="utr-input"
                  placeholder="e.g. 123456789012"
                  value={utr}
                  onChange={(e) => setUtr(e.target.value)}
                  data-ocid="membership.input"
                />
                <p className="text-xs text-muted-foreground">
                  Find UTR in your UPI app payment history after paying
                </p>
              </div>

              <Button
                className="w-full"
                onClick={handleConfirmPayment}
                disabled={isConfirming}
                data-ocid="membership.submit_button"
              >
                {isConfirming ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Activating...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Crown className="w-4 h-4" />
                    Confirm Payment & Activate Premium
                  </span>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Membership activates after admin verifies payment. भुगतान सत्यापन
                के बाद सदस्यता सक्रिय होती है।
              </p>
            </CardContent>
          </Card>
        </motion.section>
      )}
    </main>
  );
}
