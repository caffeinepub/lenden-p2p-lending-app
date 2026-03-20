import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Copy,
  Download,
  IndianRupee,
  Rocket,
  Share2,
  ShieldCheck,
  Smartphone,
  Star,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const features = [
  { icon: Zap, text: "16 Minute mein Instant Loan", hi: "सिर्फ 16 मिनट में लोन" },
  { icon: IndianRupee, text: "₹1,000 se ₹50 Lakh tak", hi: "₹1,000 से ₹50 लाख" },
  {
    icon: ShieldCheck,
    text: "Legal Protection (Section 138)",
    hi: "कानूनी सुरक्षा",
  },
  { icon: Users, text: "P2P Trusted Community", hi: "विश्वसनीय समुदाय" },
  {
    icon: Star,
    text: "Premium Membership ₹9/week se",
    hi: "₹9/सप्ताह से प्रीमियम",
  },
  { icon: CheckCircle2, text: "Zero Hidden Fees", hi: "कोई छुपी फीस नहीं" },
];

const installSteps = [
  { step: "1", text: "Chrome mein app link open karein", icon: "🌐" },
  { step: "2", text: '3 dots menu → "Add to Home Screen"', icon: "⋮" },
  { step: "3", text: "App install ho gaya! 🎉", icon: "✅" },
];

export function AppAdvertisement() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: "LenDen Mokoko — Instant Loan in 16 Minutes!",
      text: "India ka trusted P2P lending app. ₹1,000 se ₹50 lakh tak loan, sirf 16 minute mein! Join karein — ",
      url: window.location.origin,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(`${shareData.text}${shareData.url}`);
      setCopied(true);
      toast.success("App link copied! Share karo apne dosto ke saath 🎉");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.30 0.10 25) 0%, oklch(0.40 0.15 42) 35%, oklch(0.32 0.12 140) 100%)",
          }}
        >
          {/* Decorative top bar */}
          <div
            className="h-2"
            style={{
              background:
                "linear-gradient(90deg, oklch(0.70 0.19 42) 0%, oklch(0.55 0.18 85) 50%, oklch(0.45 0.16 140) 100%)",
            }}
          />

          <div className="p-6 md:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, type: "spring" }}
                className="inline-flex items-center gap-2 mb-3 px-4 py-1.5 rounded-full"
                style={{
                  background: "rgba(255,255,255,0.15)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <span className="text-lg">🇮🇳</span>
                <span className="text-white font-bold text-sm">
                  India Ka Trusted Lending App
                </span>
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
                LenDen Mokoko 🍁
              </h2>
              <p className="text-white/70 text-base">
                पैसों की ज़रूरत है? हम हैं ना! — Need money? We've got you!
              </p>
            </div>

            {/* Features grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-8">
              {features.map((f, i) => (
                <motion.div
                  key={f.text}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="flex items-start gap-3 rounded-xl p-3"
                  style={{ background: "rgba(255,255,255,0.10)" }}
                >
                  <div
                    className="p-1.5 rounded-lg shrink-0"
                    style={{ background: "rgba(255,255,255,0.15)" }}
                  >
                    <f.icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold leading-tight">
                      {f.text}
                    </p>
                    <p className="text-white/60 text-xs">{f.hi}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* How to Install */}
            <div
              className="rounded-2xl p-5 mb-6"
              style={{ background: "rgba(255,255,255,0.08)" }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Smartphone className="w-5 h-5 text-white" />
                <h3 className="text-white font-bold">
                  Phone mein Install Karein 📲
                </h3>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                {installSteps.map((s) => (
                  <div key={s.step} className="flex items-center gap-3 flex-1">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                      style={{
                        background: "oklch(0.65 0.19 42)",
                        color: "white",
                      }}
                    >
                      {s.step}
                    </div>
                    <p className="text-white/80 text-sm">{s.text}</p>
                  </div>
                ))}
              </div>
              <p className="text-white/50 text-xs mt-3">
                💡 iOS: Safari → Share → Add to Home Screen
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="lg"
                className="font-bold px-8 rounded-full"
                style={{
                  background: "oklch(0.85 0.18 85)",
                  color: "oklch(0.20 0.06 42)",
                }}
                onClick={handleShare}
                data-ocid="app_ad.primary_button"
              >
                {copied ? (
                  <>
                    <Copy className="w-4 h-4 mr-2" /> Link Copied!
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 mr-2" /> Share App — दोस्तों को भेजें
                  </>
                )}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="font-bold px-8 rounded-full border-white/30 text-white hover:bg-white/10"
                onClick={() => {
                  const a = document.createElement("a");
                  a.href = window.location.origin;
                  a.click();
                }}
                data-ocid="app_ad.secondary_button"
              >
                <Rocket className="w-4 h-4 mr-2" /> Abhi Start Karein
              </Button>
            </div>

            <p className="text-center text-white/40 text-xs mt-5">
              🔒 Free to join · ₹1 entry fee · Instant loan in 16 minutes
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
