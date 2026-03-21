import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Check, Copy, Gift, Share2, Users } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useApp } from "../store/appStore";

interface ReferralPageProps {
  onNavigate: (page: string) => void;
}

function generateReferralCode(phone: string): string {
  return `LENDEN-${phone.slice(-4)}`;
}

export function ReferralPage({ onNavigate }: ReferralPageProps) {
  const { currentUser } = useApp();
  const [copied, setCopied] = useState(false);

  const referralCode = currentUser
    ? generateReferralCode(currentUser.phone)
    : "LENDEN-0000";
  const storageKey = currentUser
    ? `referrals_${currentUser.id}`
    : "referrals_guest";

  const [referralCount, setReferralCount] = useState(() => {
    return Number.parseInt(localStorage.getItem(storageKey) ?? "0", 10);
  });

  const appUrl = window.location.origin;
  const referralLink = `${appUrl}?ref=${referralCode}`;

  useEffect(() => {
    localStorage.setItem(storageKey, String(referralCount));
  }, [referralCount, storageKey]);

  if (!currentUser) return null;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success("Link copy ho gaya! / Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "LenDen Mokoko",
        text: `Mere saath LenDen Mokoko join karo! Code: ${referralCode}`,
        url: referralLink,
      });
    } else {
      await handleCopy();
    }
  };

  const totalBonus = referralCount * 10;

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate("dashboard")}
            data-ocid="referral.secondary_button"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <h1 className="text-2xl font-bold">Referral Program</h1>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl p-6 mb-6 text-white text-center bg-gradient-to-br from-green-600 to-emerald-700"
        >
          <div className="text-4xl mb-2">🎁</div>
          <h2 className="text-2xl font-bold mb-1">Refer karo, Paise Kamao!</h2>
          <p className="text-green-100 text-sm">
            Har successful referral pe Rs.10 bonus!
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-green-600">
                {referralCount}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Total Referrals
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-amber-600">
                Rs.{totalBonus}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Total Bonus
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Gift className="w-4 h-4 text-green-600" />
              Aapka Referral Code
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted rounded-xl p-4 text-center">
              <div className="text-2xl font-bold font-mono tracking-widest text-green-700">
                {referralCode}
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 text-xs bg-muted rounded-lg px-3 py-2 font-mono truncate text-muted-foreground">
                {referralLink}
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopy}
                className="flex-shrink-0"
                data-ocid="referral.secondary_button"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              onClick={handleShare}
              data-ocid="referral.primary_button"
            >
              <Share2 className="w-4 h-4 mr-2" /> Share Karo
            </Button>
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="w-4 h-4 text-blue-600" />
              Benefits / Fayde
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              {
                icon: "💰",
                title: "Rs.10 per Referral",
                desc: "Har successful referral pe Rs.10 bonus",
              },
              {
                icon: "⚡",
                title: "Instant Tracking",
                desc: "Real-time referral count tracking",
              },
              {
                icon: "🏆",
                title: "No Limit",
                desc: "Jitne chaaho utne refer karo!",
              },
              {
                icon: "💳",
                title: "UPI Payout",
                desc: "Bonus admin ke through aapke UPI pe",
              },
            ].map((b) => (
              <div key={b.title} className="flex items-start gap-3">
                <span className="text-2xl">{b.icon}</span>
                <div>
                  <div className="font-semibold text-sm">{b.title}</div>
                  <div className="text-xs text-muted-foreground">{b.desc}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="mb-4 border-dashed border-amber-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-sm">
                  Demo: Simulate Referral
                </div>
                <div className="text-xs text-muted-foreground">
                  Test ke liye referral count badhao
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="border-amber-300 text-amber-700"
                onClick={() => {
                  setReferralCount((prev) => prev + 1);
                  toast.success("Naya referral! +Rs.10 bonus! 🎉");
                }}
                data-ocid="referral.secondary_button"
              >
                +1 Referral
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              🏆 Top Referrers This Month
              <Badge variant="outline" className="text-xs">
                Coming Soon
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                "Ramesh K. — 12 referrals",
                "Priya G. — 8 referrals",
                "Suresh S. — 5 referrals",
              ].map((item, i) => (
                <div key={item} className="flex items-center gap-3 text-sm">
                  <span className="text-lg">{["🥇", "🥈", "🥉"][i]}</span>
                  <span>{item}</span>
                  <span className="ml-auto text-green-600 font-semibold">
                    +Rs.{[120, 80, 50][i]}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
          <p className="text-xs text-amber-800">
            Note: Bonus rewards admin ke through process hote hain. Contact:
            7814873372 (WhatsApp)
          </p>
        </div>
      </motion.div>
    </main>
  );
}
