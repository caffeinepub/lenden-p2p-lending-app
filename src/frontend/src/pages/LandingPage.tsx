import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Crown,
  FileText,
  Lock,
  Shield,
  Smartphone,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { type Variants, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { AppAdvertisement } from "../components/AppAdvertisement";
import { TrendingBanner } from "../components/TrendingBanner";

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

function AnimatedCounter({
  target,
  suffix = "",
  prefix = "",
}: { target: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const duration = 1800;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {prefix}
      {count.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export function LandingPage({ onNavigate }: LandingPageProps) {
  const features = [
    {
      icon: Shield,
      title: "Legal Protection",
      hindi: "कानूनी सुरक्षा",
      desc: "Section 138 NI Act backed — borrowers can't escape repayment.",
      color: "bg-saffron-50 text-saffron-600",
    },
    {
      icon: FileText,
      title: "Promissory Note",
      hindi: "वचन पत्र",
      desc: "Auto-generated digital promissory notes for every loan.",
      color: "bg-indiagreen-50 text-indiagreen-600",
    },
    {
      icon: Smartphone,
      title: "UPI Direct Payment",
      hindi: "UPI भुगतान",
      desc: "Pay directly via UPI — no middlemen, instant transfers.",
      color: "bg-saffron-50 text-saffron-600",
    },
    {
      icon: TrendingUp,
      title: "Credit Score",
      hindi: "क्रेडिट स्कोर",
      desc: "Track your credit score (300–900) and build your reputation.",
      color: "bg-indiagreen-50 text-indiagreen-600",
    },
    {
      icon: Crown,
      title: "Premium Membership",
      hindi: "प्रीमियम सदस्यता",
      desc: "Starting ₹9/week — unlock higher limits and priority support.",
      color: "bg-saffron-50 text-saffron-600",
    },
    {
      icon: BarChart3,
      title: "Admin Dashboard",
      hindi: "एडमिन डैशबोर्ड",
      desc: "Full earnings visibility — commissions, fees, and withdrawals.",
      color: "bg-indiagreen-50 text-indiagreen-600",
    },
  ];

  const steps = [
    {
      num: "01",
      title: "Register & Pay ₹1",
      hindi: "रजिस्टर करें",
      desc: "Sign up with your phone number and pay the ₹1 entry fee via UPI to unlock all features.",
      icon: Smartphone,
    },
    {
      num: "02",
      title: "Post or Accept Loan",
      hindi: "लोन लें या दें",
      desc: "Post a loan request or browse and approve loans from trusted borrowers in your network.",
      icon: Users,
    },
    {
      num: "03",
      title: "Track & Stay Legal",
      hindi: "ट्रैक करें",
      desc: "Monitor repayments, get EMI reminders, and trigger legal notices if anyone defaults.",
      icon: Lock,
    },
  ];

  const trustPoints = [
    "Section 138 NI Act legal enforcement for defaults",
    "Auto-generated legally-valid promissory notes",
    "UPI-based transparent payment trail",
    "Credit score impact for non-repayment",
    "Admin-supervised loan approval workflow",
  ];

  const membershipPlans = [
    {
      name: "Weekly",
      hindi: "साप्ताहिक",
      price: "₹9",
      period: "per week",
      badge: "Most Popular",
      badgeColor: "bg-saffron-600 text-white",
      highlight: true,
      perks: [
        "All basic features",
        "UPI payment",
        "Loan tracking",
        "Legal docs",
      ],
    },
    {
      name: "Monthly",
      hindi: "मासिक",
      price: "₹99",
      period: "per month",
      badge: null,
      badgeColor: "",
      highlight: false,
      perks: [
        "All basic features",
        "Priority support",
        "Extended history",
        "Credit reports",
      ],
    },
    {
      name: "Yearly",
      hindi: "वार्षिक",
      price: "₹499",
      period: "per year",
      badge: "Save 58%",
      badgeColor: "bg-indiagreen-600 text-white",
      highlight: false,
      perks: [
        "All premium features",
        "Unlimited loans",
        "AI assistant",
        "VIP support",
      ],
    },
  ];

  return (
    <main className="overflow-x-hidden">
      <TrendingBanner onNavigate={onNavigate} />

      {/* ── BRANDS WE WORK WITH ── */}
      <section
        className="py-4 px-4 border-b border-border"
        style={{ background: "oklch(0.98 0.01 42)" }}
      >
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
            🤝 Brands We Work With
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              {
                name: "Muthoot Finance",
                color: "bg-red-100 text-red-700 border-red-200",
                emoji: "🏦",
              },
              {
                name: "Bajaj Finserv",
                color: "bg-indigo-100 text-indigo-700 border-indigo-200",
                emoji: "⚡",
              },
              {
                name: "Bajaj Markets",
                color: "bg-green-100 text-green-700 border-green-200",
                emoji: "💰",
              },
              {
                name: "Home Loan",
                color: "bg-blue-100 text-blue-700 border-blue-200",
                emoji: "🏡",
              },
              {
                name: "Gold Loan",
                color: "bg-yellow-100 text-yellow-700 border-yellow-200",
                emoji: "🥇",
              },
            ].map((b) => (
              <span
                key={b.name}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${b.color}`}
              >
                {b.emoji} {b.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── INSTANT TRUST STRIP ── */}
      <section
        className="py-6 px-4"
        style={{
          background:
            "linear-gradient(90deg, oklch(0.22 0.06 42), oklch(0.30 0.10 45))",
        }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            {[
              { emoji: "🇮🇳", text: "India ka #1 Trusted P2P Lending App" },
              { emoji: "⚡", text: "16 minute mein paise milte hain" },
              { emoji: "💰", text: "₹50 Lakh tak instant approval" },
              { emoji: "😊", text: "5,000+ happy borrowers" },
            ].map((item) => (
              <div key={item.text} className="flex flex-col items-center gap-1">
                <span className="text-2xl">{item.emoji}</span>
                <p className="text-white/85 text-xs font-semibold leading-tight">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Gradient base */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.18 0.04 42) 0%, oklch(0.22 0.06 45) 40%, oklch(0.15 0.06 155) 100%)",
          }}
        />
        {/* Hero image overlay */}
        <div className="absolute inset-0 z-[1] opacity-30">
          <img
            src="/assets/generated/promo-hero.dim_800x500.jpg"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        {/* Decorative circles */}
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY }}
          className="absolute top-20 right-[-80px] w-72 h-72 rounded-full z-[2]"
          style={{ background: "oklch(0.65 0.19 42 / 0.3)" }}
        />
        <motion.div
          animate={{ scale: [1, 1.12, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            delay: 1,
          }}
          className="absolute bottom-10 left-[-60px] w-56 h-56 rounded-full z-[2]"
          style={{ background: "oklch(0.40 0.11 155 / 0.4)" }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-24 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <motion.div variants={stagger} initial="hidden" animate="visible">
              <motion.div variants={fadeUp}>
                <span
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6"
                  style={{
                    background: "oklch(0.65 0.19 42 / 0.25)",
                    color: "oklch(0.88 0.12 85)",
                  }}
                >
                  <Zap className="w-4 h-4" />
                  India's Most Trusted P2P Lending App
                </span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="font-display text-5xl md:text-6xl font-extrabold leading-[1.1] mb-4 text-white"
              >
                भरोसेमंद उधारी,
                <br />
                <span style={{ color: "oklch(0.78 0.15 85)" }}>आसान वापसी</span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="text-lg text-white/70 mb-8 max-w-lg"
              >
                Peer-to-peer lending with full legal protection, digital
                promissory notes, and direct UPI payments. Loan range ₹1,000 to
                ₹50 Lakhs. Maximum per loan.
              </motion.p>

              <motion.div
                variants={fadeUp}
                className="flex flex-wrap gap-4 mb-10"
              >
                <Button
                  size="lg"
                  className="text-base px-8 font-bold rounded-full shadow-glow"
                  style={{
                    background: "oklch(0.65 0.19 42)",
                    color: "white",
                  }}
                  onClick={() => onNavigate("auth")}
                  data-ocid="hero.primary_button"
                >
                  Loan Lo <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base px-8 font-bold rounded-full border-2"
                  style={{
                    borderColor: "oklch(0.65 0.19 42)",
                    color: "oklch(0.88 0.12 85)",
                    background: "transparent",
                  }}
                  onClick={() => onNavigate("auth")}
                  data-ocid="hero.secondary_button"
                >
                  Loan Do
                </Button>
              </motion.div>

              {/* Floating stat cards */}
              <motion.div variants={fadeUp} className="grid grid-cols-3 gap-3">
                {[
                  { label: "Max Loan", value: "₹50 Lakhs", icon: "💰" },
                  { label: "Commission", value: "7% Only", icon: "📊" },
                  { label: "Protection", value: "100% Legal", icon: "⚖️" },
                ].map((stat) => (
                  <motion.div
                    key={stat.label}
                    whileHover={{ y: -4, scale: 1.03 }}
                    className="rounded-2xl p-3 text-center"
                    style={{
                      background: "oklch(1 0 0 / 0.1)",
                      backdropFilter: "blur(12px)",
                      border: "1px solid oklch(1 0 0 / 0.2)",
                    }}
                  >
                    <div className="text-2xl mb-1">{stat.icon}</div>
                    <div className="text-white font-bold text-xs">
                      {stat.value}
                    </div>
                    <div className="text-white/60 text-[10px]">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right — animated badge + decorative card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden lg:flex flex-col items-center justify-center gap-6"
            >
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className="rounded-3xl overflow-hidden shadow-2xl w-full max-w-sm"
                style={{ border: "2px solid oklch(0.65 0.19 42 / 0.5)" }}
              >
                <img
                  src="/assets/generated/promo-hero.dim_800x500.jpg"
                  alt="LenDen Mokoko"
                  className="w-full h-64 object-cover"
                />
                <div
                  className="p-5"
                  style={{ background: "oklch(0.18 0.04 42)" }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white font-bold font-display text-lg">
                      LenDen Mokoko 🍁
                    </span>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          className="w-3 h-3 fill-current"
                          style={{ color: "oklch(0.78 0.15 85)" }}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-white/60 text-sm">
                    India's trusted P2P lending platform
                  </p>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
                className="px-6 py-3 rounded-full font-bold text-sm"
                style={{ background: "oklch(0.65 0.19 42)", color: "white" }}
              >
                ✨ ₹1 से शुरू करें — Entry Fee Only ₹1!
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg
            aria-hidden="true"
            viewBox="0 0 1440 80"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            className="w-full h-16"
          >
            <path
              d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z"
              fill="oklch(0.98 0.008 80)"
            />
          </svg>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 bg-background">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-2">
              Simple Process
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-extrabold text-foreground">
              3 Steps मेंशुरू करें
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div
              className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5"
              style={{
                background:
                  "linear-gradient(90deg, oklch(0.65 0.19 42), oklch(0.35 0.1 155))",
              }}
            />

            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative flex flex-col items-center text-center"
              >
                <div
                  className="w-24 h-24 rounded-2xl flex flex-col items-center justify-center mb-5 shadow-lg relative z-10"
                  style={{
                    background:
                      i % 2 === 0
                        ? "oklch(0.65 0.19 42)"
                        : "oklch(0.35 0.10 155)",
                  }}
                >
                  <step.icon className="w-8 h-8 text-white mb-1" />
                  <span className="text-white/70 text-xs font-bold">
                    {step.num}
                  </span>
                </div>
                <h3 className="font-display text-xl font-bold mb-1">
                  {step.title}
                </h3>
                <p className="text-xs font-semibold text-primary mb-2">
                  {step.hindi}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BAND ── */}
      <section
        className="py-14"
        style={{
          background:
            "linear-gradient(90deg, oklch(0.22 0.06 42), oklch(0.18 0.06 155))",
        }}
      >
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              {
                label: "Max Loan",
                prefix: "₹",
                value: 5000000,
                suffix: "",
                display: "₹50 Lakhs",
              },
              {
                label: "Commission",
                prefix: "",
                value: 7,
                suffix: "%",
                display: null,
              },
              {
                label: "Entry Fee",
                prefix: "₹",
                value: 1,
                suffix: "",
                display: null,
              },
              {
                label: "Legal Protection",
                prefix: "",
                value: 100,
                suffix: "%",
                display: null,
              },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="font-display text-4xl font-extrabold text-white mb-1">
                  {stat.display ?? (
                    <AnimatedCounter
                      target={stat.value}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                    />
                  )}
                </div>
                <div className="text-white/60 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section className="py-20 bg-background">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-2">
              Features
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-extrabold">
              सब कुछ एक जगह
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              Everything you need for safe, legal, transparent peer-to-peer
              lending in India.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {features.map((f) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                whileHover={{
                  y: -6,
                  boxShadow: "0 16px 40px oklch(0.65 0.19 42 / 0.15)",
                }}
                className="bg-card rounded-2xl p-6 border border-border transition-all cursor-default"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${f.color}`}
                >
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-lg mb-0.5">
                  {f.title}
                </h3>
                <p className="text-xs text-primary font-semibold mb-2">
                  {f.hindi}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── TRUST SECTION ── */}
      <section className="py-20" style={{ background: "oklch(0.97 0.02 155)" }}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/assets/generated/promo-trust.dim_400x300.jpg"
                  alt="Legal Protection"
                  className="w-full object-cover"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <p
                className="text-sm font-semibold uppercase tracking-widest mb-3"
                style={{ color: "oklch(0.35 0.10 155)" }}
              >
                Legal Safety
              </p>
              <h2 className="font-display text-4xl font-extrabold mb-4 text-foreground">
                Legally Protected.
                <br />
                <span style={{ color: "oklch(0.35 0.10 155)" }}>Always.</span>
              </h2>
              <p className="text-muted-foreground mb-6">
                LenDen Mokoko is built on a foundation of legal compliance.
                Every transaction is protected by Indian law.
              </p>
              <ul className="space-y-3">
                {trustPoints.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <CheckCircle2
                      className="w-5 h-5 mt-0.5 flex-shrink-0"
                      style={{ color: "oklch(0.35 0.10 155)" }}
                    />
                    <span className="text-sm text-foreground">{point}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── COMMUNITY SECTION ── */}
      <section className="py-20 bg-background">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
                Community
              </p>
              <h2 className="font-display text-4xl font-extrabold mb-4 text-foreground">
                अपनों के साथ,
                <br />
                <span className="text-primary">अपनों के लिए</span>
              </h2>
              <p className="text-muted-foreground mb-6">
                LenDen Mokoko connects you with trusted people in your network —
                family, friends, and community members — for fair and
                transparent lending.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    icon: "🤝",
                    label: "Trusted Network",
                    sub: "Lend to people you know",
                  },
                  {
                    icon: "📱",
                    label: "Mobile First",
                    sub: "Works on any smartphone",
                  },
                  {
                    icon: "🔔",
                    label: "EMI Reminders",
                    sub: "Never miss a payment",
                  },
                  {
                    icon: "📜",
                    label: "Full History",
                    sub: "Track all transactions",
                  },
                ].map((item) => (
                  <div key={item.label} className="bg-muted rounded-xl p-4">
                    <div className="text-2xl mb-1">{item.icon}</div>
                    <div className="font-bold text-sm">{item.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {item.sub}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/assets/generated/promo-family.dim_400x300.jpg"
                  alt="Community"
                  className="w-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section
        className="py-20"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.97 0.03 42), oklch(0.97 0.02 155))",
        }}
      >
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-2">
              Membership
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-extrabold text-foreground">
              प्रीमियम सदस्यता
            </h2>
            <p className="text-muted-foreground mt-3">
              Starting at just ₹9/week. All payments go directly to admin's UPI.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {membershipPlans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                whileHover={{ y: -6 }}
                className={`relative rounded-2xl p-6 border-2 transition-all ${
                  plan.highlight
                    ? "border-saffron-600 shadow-glow"
                    : "border-border bg-card"
                }`}
                style={
                  plan.highlight
                    ? { background: "oklch(0.65 0.19 42)", color: "white" }
                    : {}
                }
              >
                {plan.badge && (
                  <span
                    className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold ${plan.badgeColor}`}
                  >
                    {plan.badge}
                  </span>
                )}
                <div className="text-center mb-6">
                  <p
                    className={`text-sm font-semibold mb-1 ${plan.highlight ? "text-white/80" : "text-muted-foreground"}`}
                  >
                    {plan.hindi}
                  </p>
                  <h3
                    className={`font-display text-2xl font-bold mb-2 ${plan.highlight ? "text-white" : "text-foreground"}`}
                  >
                    {plan.name}
                  </h3>
                  <div
                    className={`font-display text-5xl font-extrabold ${plan.highlight ? "text-white" : "text-foreground"}`}
                  >
                    {plan.price}
                  </div>
                  <p
                    className={`text-sm mt-1 ${plan.highlight ? "text-white/70" : "text-muted-foreground"}`}
                  >
                    {plan.period}
                  </p>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.perks.map((perk) => (
                    <li key={perk} className="flex items-center gap-2 text-sm">
                      <CheckCircle2
                        className={`w-4 h-4 flex-shrink-0 ${plan.highlight ? "text-white" : "text-primary"}`}
                      />
                      <span
                        className={
                          plan.highlight ? "text-white/90" : "text-foreground"
                        }
                      >
                        {perk}
                      </span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full rounded-full font-bold ${
                    plan.highlight
                      ? "bg-white text-saffron-600 hover:bg-saffron-50"
                      : ""
                  }`}
                  variant={plan.highlight ? "secondary" : "default"}
                  style={
                    !plan.highlight
                      ? { background: "oklch(0.65 0.19 42)", color: "white" }
                      : {}
                  }
                  onClick={() => onNavigate("membership")}
                  data-ocid={`pricing.${plan.name.toLowerCase()}.button`}
                >
                  Get Started <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section
        className="py-20 text-center relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.22 0.06 42), oklch(0.18 0.06 155))",
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute top-[-60px] right-[-60px] w-48 h-48 rounded-full opacity-20"
          style={{ border: "2px solid oklch(0.78 0.15 85)" }}
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{
            duration: 18,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute bottom-[-40px] left-[-40px] w-32 h-32 rounded-full opacity-15"
          style={{ border: "2px solid oklch(0.65 0.19 42)" }}
        />

        <div className="relative z-10 max-w-2xl mx-auto px-4">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.p variants={fadeUp} className="text-4xl mb-3">
              🍁
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="font-display text-4xl md:text-5xl font-extrabold text-white mb-4"
            >
              Abhi Join Karein!
            </motion.h2>
            <motion.p variants={fadeUp} className="text-white/70 text-lg mb-8">
              Free Registration — Sirf ₹1 entry fee ke saath sab kuch unlock
              karein
            </motion.p>
            <motion.div variants={fadeUp}>
              <Button
                size="lg"
                className="text-base px-12 py-6 rounded-full font-bold shadow-glow"
                style={{ background: "oklch(0.65 0.19 42)", color: "white" }}
                onClick={() => onNavigate("auth")}
                data-ocid="cta.primary_button"
              >
                Register Karein — Free! <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <AppAdvertisement />

      {/* ── FOOTER ── */}
      <footer className="py-8 text-center border-t border-border">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} LenDen Mokoko 🍁 — Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-2"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </main>
  );
}
