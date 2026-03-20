import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Banknote,
  Briefcase,
  CheckCircle2,
  Clock,
  Crown,
  IndianRupee,
  Megaphone,
  Rocket,
  Shield,
  ShieldCheck,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";
import {
  Building2,
  Gem,
  Home,
  IndianRupee as RupeeIcon,
  Shield as ShieldIcon,
  ShoppingBag,
  TrendingUp as TrendUp,
  Zap as ZapIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { TrendingBanner } from "../components/TrendingBanner";

interface LoanOffersPageProps {
  onNavigate: (page: string) => void;
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
  hidden: {},
};

const offers = [
  {
    icon: Zap,
    title: "Instant Loan",
    titleHi: "तुरंत लोन",
    desc: "Apni zaroorat ka paisa turant paaein. Sirf 16 minute mein approval guaranteed!",
    descEn: "Instant approval in just 16 minutes. No hassle, no waiting.",
    amount: "₹1,000 – ₹50,00,000",
    badge: "⚡ 16 Min Approval",
    badgeColor: "bg-amber-100 text-amber-700 border-amber-300",
    interest: "0% Processing Fee",
    interestColor: "text-green-600",
    gradient: "from-amber-50 to-orange-50",
    border: "border-amber-200",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    highlight: true,
  },
  {
    icon: IndianRupee,
    title: "Low Interest Loan",
    titleHi: "कम ब्याज लोन",
    desc: "Sabse kam interest rate par loan. Aapki pocket ke liye best deal.",
    descEn: "Starting from just 1% per month. Affordable EMI, zero stress.",
    amount: "₹5,000 – ₹10,00,000",
    badge: "💰 Starting 1%/month",
    badgeColor: "bg-green-100 text-green-700 border-green-300",
    interest: "From 1% per month",
    interestColor: "text-green-600",
    gradient: "from-green-50 to-emerald-50",
    border: "border-green-200",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    highlight: false,
  },
  {
    icon: Crown,
    title: "Premium Member Loan",
    titleHi: "प्रीमियम लोन",
    desc: "Premium members ko milta hai priority approval aur special benefits.",
    descEn:
      "Faster processing, priority queue, and exclusive low rates for members.",
    amount: "₹10,000 – ₹50,00,000",
    badge: "👑 Priority Processing",
    badgeColor: "bg-purple-100 text-purple-700 border-purple-300",
    interest: "Exclusive member rates",
    interestColor: "text-purple-600",
    gradient: "from-purple-50 to-violet-50",
    border: "border-purple-200",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    highlight: false,
  },
  {
    icon: Briefcase,
    title: "Business Loan",
    titleHi: "बिज़नेस लोन",
    desc: "Apna business badhao! Flexible repayment aur high amount ka support.",
    descEn:
      "Up to ₹50 lakh for your business. Flexible repayment tailored to you.",
    amount: "₹50,000 – ₹50,00,000",
    badge: "🏢 Up to ₹50 Lakh",
    badgeColor: "bg-blue-100 text-blue-700 border-blue-300",
    interest: "Flexible repayment",
    interestColor: "text-blue-600",
    gradient: "from-blue-50 to-sky-50",
    border: "border-blue-200",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    highlight: false,
  },
];

const brandOffers = [
  {
    icon: Home,
    title: "Home Loan / गृह ऋण",
    partner: "Multiple Banks",
    amount: "₹5L – ₹5 Crore",
    rate: "Starting 8.5% p.a.",
    badge: "🏡 Low Rate",
    badgeColor: "bg-blue-100 text-blue-700 border-blue-200",
    features: ["30 year tenure", "Tax benefit u/s 80C", "Quick approval"],
    accent: "border-blue-300",
    gradient: "from-blue-50 to-sky-50",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    applied: 89,
    fastApproval: true,
  },
  {
    icon: Gem,
    title: "Gold Loan / सोने पर लोन",
    partner: "Instant Approval",
    amount: "₹10,000 – ₹50L",
    rate: "Starting 9% p.a.",
    badge: "🥇 Instant",
    badgeColor: "bg-yellow-100 text-yellow-700 border-yellow-200",
    features: ["Keep your gold safe", "30 min disbursal", "No credit check"],
    accent: "border-yellow-300",
    gradient: "from-yellow-50 to-amber-50",
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
    applied: 123,
    fastApproval: true,
  },
  {
    icon: Building2,
    title: "Muthoot Finance",
    partner: "India's No.1 Gold Loan",
    amount: "₹1,500 – ₹1 Crore",
    rate: "Starting 12% p.a.",
    badge: "⭐ Trusted Brand",
    badgeColor: "bg-red-100 text-red-700 border-red-200",
    features: ["4000+ branches", "Trusted since 1887", "Instant gold loan"],
    accent: "border-red-300",
    gradient: "from-red-50 to-rose-50",
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    applied: 47,
    fastApproval: true,
  },
  {
    icon: TrendUp,
    title: "Bajaj Finserv",
    partner: "India's Leading NBFC",
    amount: "₹1L – ₹50L",
    rate: "Starting 11% p.a.",
    badge: "🏆 Top Rated",
    badgeColor: "bg-indigo-100 text-indigo-700 border-indigo-200",
    features: ["Pre-approved offers", "Flexi loan", "No collateral"],
    accent: "border-indigo-300",
    gradient: "from-indigo-50 to-blue-50",
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600",
    applied: 201,
    fastApproval: true,
  },
  {
    icon: ShoppingBag,
    title: "Bajaj Markets",
    partner: "Compare & Apply Best Offers",
    amount: "₹5,000 – ₹50L",
    rate: "Best rates from 10.5%",
    badge: "💰 Best Deal",
    badgeColor: "bg-green-100 text-green-700 border-green-200",
    features: [
      "100+ lenders",
      "Instant comparison",
      "Zero processing fee on select",
    ],
    accent: "border-green-300",
    gradient: "from-green-50 to-emerald-50",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    applied: 167,
  },
  {
    icon: ZapIcon,
    title: "mPocket",
    partner: "Instant Cash for Students",
    amount: "₹1,000 – ₹30,000",
    rate: "1-3% per month",
    badge: "⚡ Fast Approval",
    badgeColor: "bg-purple-100 text-purple-700 border-purple-200",
    features: ["Instant approval", "No documents needed", "Student-friendly"],
    accent: "border-purple-300",
    gradient: "from-purple-50 to-indigo-50",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    applied: 312,
    fastApproval: true,
  },
  {
    icon: ShieldIcon,
    title: "MoneyView",
    partner: "Personal Loan in 24 Hours",
    amount: "₹10,000 – ₹5,00,000",
    rate: "From 1.33% per month",
    badge: "⚡ Fast Approval",
    badgeColor: "bg-blue-100 text-blue-700 border-blue-200",
    features: [
      "Quick disbursal in 24 hrs",
      "Minimal documents",
      "Free credit score check",
    ],
    accent: "border-blue-400",
    gradient: "from-blue-50 to-cyan-50",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    applied: 289,
    fastApproval: true,
  },
];

const trustPoints = [
  {
    icon: ShieldCheck,
    title: "100% Secure",
    titleHi: "पूरी तरह सुरक्षित",
    desc: "Your data and money protected with bank-grade security.",
  },
  {
    icon: Zap,
    title: "Instant Fast",
    titleHi: "तुरंत तेज़",
    desc: "Loan approved in just 16 minutes — India's fastest.",
  },
  {
    icon: Shield,
    title: "Legal Protection",
    titleHi: "कानूनी सुरक्षा",
    desc: "Section 138 NI Act protection for every transaction.",
  },
  {
    icon: Banknote,
    title: "UPI Payments",
    titleHi: "UPI भुगतान",
    desc: "Direct UPI integration — pay and receive instantly.",
  },
  {
    icon: Star,
    title: "Trusted P2P",
    titleHi: "विश्वसनीय P2P",
    desc: "India's most trusted peer-to-peer lending platform.",
  },
  {
    icon: Sparkles,
    title: "Zero Hidden Fees",
    titleHi: "कोई छुपी फीस नहीं",
    desc: "Transparent fee structure — no surprises, ever.",
  },
];

export function LoanOffersPage({ onNavigate }: LoanOffersPageProps) {
  return (
    <main className="min-h-screen bg-background">
      <TrendingBanner onNavigate={onNavigate} />
      {/* Hero Banner */}
      <section
        className="relative overflow-hidden py-16 px-4"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.35 0.13 25) 0%, oklch(0.45 0.18 42) 40%, oklch(0.38 0.14 140) 100%)",
        }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-10 bg-white" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full opacity-10 bg-white" />
        <div className="absolute top-8 left-1/4 w-8 h-8 rounded-full opacity-20 bg-white" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: "spring" }}
          >
            <Badge className="mb-4 bg-white/20 text-white border-white/30 text-sm px-4 py-1.5 backdrop-blur">
              🇮🇳 India Ka #1 P2P Lending App
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="text-4xl md:text-6xl font-extrabold text-white mb-3 leading-tight"
          >
            ⚡ सिर्फ 16 मिनट में{" "}
            <span style={{ color: "oklch(0.88 0.16 85)" }}>लोन!</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="text-xl text-white/85 mb-2"
          >
            Instant Loan in 16 Minutes — ₹1,000 to ₹50,00,000
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="text-white/65 mb-8 text-base"
          >
            No documents. No waiting. Apply karo, paise pao — turant!
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <Button
              size="lg"
              className="text-lg px-10 py-6 font-bold shadow-xl rounded-full"
              style={{
                background: "oklch(0.85 0.18 85)",
                color: "oklch(0.20 0.06 42)",
              }}
              onClick={() => onNavigate("new-loan")}
              data-ocid="loan_offers.primary_button"
            >
              <Rocket className="w-5 h-5 mr-2" /> Abhi Apply Karein
            </Button>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="mt-10 flex flex-wrap justify-center gap-6 text-white"
          >
            {[
              { num: "16 Min", label: "Instant Approval" },
              { num: "₹50L", label: "Max Loan" },
              { num: "0%", label: "Processing Fee" },
              { num: "100%", label: "Secure & Legal" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div
                  className="text-2xl font-extrabold"
                  style={{ color: "oklch(0.88 0.16 85)" }}
                >
                  {s.num}
                </div>
                <div className="text-xs text-white/70">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Loan Offer Cards */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.div variants={fadeUp} className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-2">
              हमारे लोन ऑफर्स 🎯
            </h2>
            <p className="text-muted-foreground text-base">
              Choose the best loan for your need
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <AnimatePresence>
              {offers.map((offer) => (
                <motion.div
                  key={offer.title}
                  variants={fadeUp}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                >
                  <Card
                    className={`relative overflow-hidden border-2 ${offer.border} bg-gradient-to-br ${offer.gradient} h-full`}
                  >
                    {offer.highlight && (
                      <div
                        className="absolute top-0 right-0 text-xs font-bold px-3 py-1 rounded-bl-lg"
                        style={{
                          background: "oklch(0.65 0.19 42)",
                          color: "white",
                        }}
                      >
                        🔥 Most Popular
                      </div>
                    )}
                    <CardHeader className="pb-2">
                      <div className="flex items-start gap-3">
                        <div
                          className={`p-2.5 rounded-xl ${offer.iconBg} shrink-0`}
                        >
                          <offer.icon
                            className={`w-6 h-6 ${offer.iconColor}`}
                          />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-extrabold text-foreground leading-tight">
                            {offer.title}
                          </CardTitle>
                          <p className="text-sm font-semibold text-muted-foreground">
                            {offer.titleHi}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Badge
                        className={`${offer.badgeColor} border text-xs font-semibold`}
                      >
                        {offer.badge}
                      </Badge>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {offer.desc}
                      </p>
                      <p className="text-xs text-muted-foreground/75">
                        {offer.descEn}
                      </p>

                      {/* Ad badge + commission notice */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs bg-gray-100 text-gray-600 border border-gray-200 px-2 py-0.5 rounded font-semibold">
                          AD
                        </span>
                        <span className="text-xs text-orange-600 font-medium">
                          7% platform commission per loan
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Loan Amount
                          </p>
                          <p className="font-bold text-foreground text-sm">
                            {offer.amount}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">
                            Interest
                          </p>
                          <p
                            className={`font-bold text-sm ${offer.interestColor}`}
                          >
                            {offer.interest}
                          </p>
                        </div>
                      </div>

                      <Button
                        className="w-full font-bold mt-1"
                        style={
                          offer.highlight
                            ? {
                                background: "oklch(0.55 0.18 42)",
                                color: "white",
                              }
                            : {}
                        }
                        variant={offer.highlight ? "default" : "outline"}
                        onClick={() => onNavigate("new-loan")}
                        data-ocid="loan_offers.secondary_button"
                      >
                        Apply Now → अभी अप्लाई करें
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </section>

      {/* Commission Notice Banner */}
      <section className="px-4 py-4 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl p-4 flex items-start gap-3"
          style={{
            background:
              "linear-gradient(90deg, oklch(0.20 0.06 42), oklch(0.28 0.10 45))",
          }}
        >
          <span className="text-2xl flex-shrink-0">💼</span>
          <div>
            <p className="font-black text-white text-sm">
              Platform Commission Notice
            </p>
            <p className="text-white/80 text-xs mt-0.5">
              Har is offer par click karke loan lene par{" "}
              <span className="font-bold text-yellow-300">7% commission</span>{" "}
              aapko (platform ko) milta hai. Aapke paise seedha aapke account
              mein! 💰
            </p>
          </div>
        </motion.div>
      </section>

      {/* Brand Offers Section */}
      <section className="max-w-6xl mx-auto px-4 pb-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.div variants={fadeUp} className="text-center mb-8 mt-4">
            <span className="inline-block bg-red-100 text-red-600 text-xs font-black px-3 py-1 rounded-full mb-3 tracking-wider">
              🔥 TRENDING OFFERS
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-foreground">
              Top Brand Loan Offers 🏆
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              Muthoot Finance, Bajaj Finserv, Home Loan & More!
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {brandOffers.map((offer) => (
              <motion.div
                key={offer.title}
                variants={fadeUp}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="relative"
              >
                <Card
                  className={`border-2 ${offer.accent} bg-gradient-to-br ${offer.gradient} h-full overflow-hidden`}
                >
                  {/* Limited badge */}
                  <div
                    className="absolute top-3 right-3 text-[10px] font-black px-2 py-0.5 rounded-full"
                    style={{
                      background: "oklch(0.50 0.18 42)",
                      color: "white",
                    }}
                  >
                    ⏰ Limited!
                  </div>
                  <CardHeader className="pb-2 pt-4">
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2.5 rounded-xl ${offer.iconBg} shrink-0`}
                      >
                        <offer.icon className={`w-5 h-5 ${offer.iconColor}`} />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-extrabold text-foreground leading-tight">
                          {offer.title}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {offer.partner}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2.5">
                    <Badge
                      className={`text-xs border ${offer.badgeColor}`}
                      variant="outline"
                    >
                      {offer.badge}
                    </Badge>
                    <div className="flex justify-between text-xs">
                      <div>
                        <p className="text-muted-foreground">Amount</p>
                        <p className="font-bold text-foreground text-sm">
                          {offer.amount}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-muted-foreground">Rate</p>
                        <p className="font-bold text-green-600 text-sm">
                          {offer.rate}
                        </p>
                      </div>
                    </div>
                    <ul className="space-y-1">
                      {offer.features.map((f) => (
                        <li
                          key={f}
                          className="flex items-center gap-1.5 text-xs text-foreground/80"
                        >
                          <CheckCircle2 className="w-3 h-3 text-green-500 flex-shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    {"fastApproval" in offer &&
                      (offer as { fastApproval?: boolean }).fastApproval && (
                        <div
                          className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 rounded-full"
                          style={{
                            background: "oklch(0.82 0.18 75)",
                            color: "oklch(0.20 0.06 42)",
                          }}
                        >
                          ⚡ Fast Approval
                        </div>
                      )}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-muted-foreground">
                        🔥 {offer.applied} applied today
                      </span>
                      <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{
                          duration: 1.5,
                          repeat: Number.POSITIVE_INFINITY,
                        }}
                      >
                        <Button
                          size="sm"
                          className="text-xs font-bold rounded-full px-4"
                          style={{
                            background: "oklch(0.50 0.18 42)",
                            color: "white",
                          }}
                          onClick={() => onNavigate("new-loan")}
                          data-ocid="brand_offers.primary_button"
                        >
                          Apply Now 🚀
                        </Button>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Instant Money Promise Section */}
      <section
        className="py-12 px-4"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.15 0.06 42), oklch(0.20 0.08 45), oklch(0.18 0.06 155))",
        }}
      >
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <motion.h2
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              className="text-3xl md:text-4xl font-extrabold text-white"
            >
              ⚡ Paisa Turant Milega!
            </motion.h2>
            <p className="text-white/70 mt-2">
              Instant Money Guaranteed / पैसा 16 मिनट में!
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
            {[
              {
                icon: ZapIcon,
                emoji: "⚡",
                title: "16 Min Mein Transfer",
                sub: "Seedha aapke account mein",
                color: "oklch(0.78 0.15 85)",
              },
              {
                icon: ShieldIcon,
                emoji: "🛡️",
                title: "100% Bharosa",
                sub: "Guaranteed / पूरी गारंटी",
                color: "oklch(0.72 0.14 155)",
              },
              {
                icon: RupeeIcon,
                emoji: "💰",
                title: "₹50 Lakh Tak Instant",
                sub: "No collateral for P2P loans",
                color: "oklch(0.80 0.12 210)",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                whileHover={{ y: -4 }}
                className="rounded-2xl p-5 text-center"
                style={{
                  background: "oklch(1 0 0 / 0.1)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid oklch(1 0 0 / 0.2)",
                }}
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.5,
                  }}
                  className="text-4xl mb-3"
                >
                  {item.emoji}
                </motion.div>
                <h3 className="font-extrabold text-white text-base">
                  {item.title}
                </h3>
                <p className="text-white/60 text-xs mt-1">{item.sub}</p>
              </motion.div>
            ))}
          </div>

          {/* Social proof */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { num: "1,247", label: "Loans disbursed today", icon: "📊" },
              { num: "₹2.3 Cr", label: "Disbursed this week", icon: "💸" },
              { num: "4.8★", label: "From 5,000+ users", icon: "⭐" },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="rounded-xl p-4 text-center"
                style={{
                  background: "oklch(1 0 0 / 0.08)",
                  border: "1px solid oklch(1 0 0 / 0.15)",
                }}
              >
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div
                  className="text-2xl font-extrabold"
                  style={{ color: "oklch(0.88 0.16 85)" }}
                >
                  {stat.num}
                </div>
                <div className="text-white/60 text-xs mt-0.5">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-8"
          >
            <motion.div
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            >
              <Button
                size="lg"
                className="text-base px-10 py-6 font-black rounded-full shadow-xl"
                style={{ background: "oklch(0.65 0.19 42)", color: "white" }}
                onClick={() => onNavigate("new-loan")}
                data-ocid="instant_money.primary_button"
              >
                🚀 Abhi Apply Karein — 16 Min Mein Paisa!
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section
        className="py-14 px-4"
        style={{ background: "oklch(0.97 0.01 100)" }}
      >
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-2">
                LenDen Mokoko क्यों चुनें? 🤔
              </h2>
              <p className="text-muted-foreground">Why Choose LenDen Mokoko?</p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {trustPoints.map((tp) => (
                <motion.div
                  key={tp.title}
                  variants={fadeUp}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-border text-center hover:shadow-md transition-shadow"
                >
                  <div
                    className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                    style={{ background: "oklch(0.94 0.06 42)" }}
                  >
                    <tp.icon
                      className="w-6 h-6"
                      style={{ color: "oklch(0.55 0.18 42)" }}
                    />
                  </div>
                  <h3 className="font-bold text-foreground text-sm">
                    {tp.title}
                  </h3>
                  <p className="text-xs text-primary font-semibold mb-1">
                    {tp.titleHi}
                  </p>
                  <p className="text-xs text-muted-foreground">{tp.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Advertise Banner */}
      <section className="py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl p-6 border-2 border-orange-300 bg-gradient-to-r from-orange-50 to-green-50 flex flex-col sm:flex-row items-center gap-4"
          >
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Megaphone className="w-6 h-6 text-orange-600" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-bold text-gray-800 text-base">
                Apna Loan Product Yahan Advertise Karein!
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Lakhon borrowers tak pahuncho — ₹499/week se shuru. 7%
                commission model.
              </p>
            </div>
            <Button
              onClick={() => onNavigate("advertise")}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold shrink-0"
              data-ocid="loan_offers.secondary_button"
            >
              Advertise Now →
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto rounded-3xl p-10 text-white"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.40 0.14 140) 0%, oklch(0.35 0.13 25) 100%)",
          }}
        >
          <h2 className="text-3xl font-extrabold mb-3">तैयार हैं? 🚀</h2>
          <p className="text-white/80 mb-6 text-base">
            Ab intezaar mat karo — 16 minute mein apna loan paao!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              size="lg"
              className="font-bold px-8 py-5 rounded-full"
              style={{
                background: "oklch(0.85 0.18 85)",
                color: "oklch(0.20 0.06 42)",
              }}
              onClick={() => onNavigate("new-loan")}
              data-ocid="loan_offers.submit_button"
            >
              <Zap className="w-4 h-4 mr-2" /> Loan Apply Karein
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="font-bold px-8 py-5 rounded-full border-white/40 text-white hover:bg-white/10"
              onClick={() => onNavigate("membership")}
              data-ocid="loan_offers.secondary_button"
            >
              <Crown className="w-4 h-4 mr-2" /> Premium Member Banein
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Trust Badges */}
      <div className="flex flex-wrap justify-center gap-4 py-8 px-4 border-t border-border">
        {[
          "✅ RBI Guidelines ke anusar",
          "🔒 SSL Secure",
          "⚖️ Section 138 NI Act",
          "🇮🇳 Made in India",
        ].map((badge) => (
          <span
            key={badge}
            className="text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full font-medium"
          >
            {badge}
          </span>
        ))}
      </div>
    </main>
  );
}
