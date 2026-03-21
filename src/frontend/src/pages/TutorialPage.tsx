import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Crown,
  ExternalLink,
  FileText,
  Gavel,
  ShieldCheck,
  Smartphone,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

interface TutorialPageProps {
  onNavigate: (page: string) => void;
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const STEPS = [
  {
    num: "01",
    icon: Smartphone,
    title: "Register / Login Karein",
    hindi: "रजिस्टर करें",
    color: "bg-orange-100 text-orange-600",
    accentBg: "oklch(0.65 0.19 42)",
    points: [
      "App kholo aur 'Sign In' button dabao",
      "Apna phone number aur naam daalo",
      "Ek strong password set karo",
      "Profile save hote hi aap ready hain!",
    ],
  },
  {
    num: "02",
    icon: CreditCard,
    title: "Entry Fee ₹1 Pay Karein",
    hindi: "एंट्री फीस दें",
    color: "bg-green-100 text-green-700",
    accentBg: "oklch(0.40 0.13 155)",
    points: [
      "Login ke baad ₹1 entry fee screen aayegi",
      "'Show QR' button dabao ya UPI ID copy karo",
      "Admin ka UPI: barkat.6y@ptyes par ₹1 bhejo",
      "Payment screenshot upload karo → access unlock!",
    ],
  },
  {
    num: "03",
    icon: FileText,
    title: "Loan Request Karein",
    hindi: "लोन माँगें",
    color: "bg-orange-100 text-orange-600",
    accentBg: "oklch(0.65 0.19 42)",
    points: [
      "Dashboard mein 'New Loan Request' dabao",
      "Loan amount ₹1,000 se ₹50,00,000 tak daalo",
      "5% interest rate — 16 minute mein approval!",
      "Loan request lenders ko dikh jaata hai",
    ],
  },
  {
    num: "04",
    icon: Users,
    title: "Loan Approve Karein",
    hindi: "लोन अप्रूव करें",
    color: "bg-green-100 text-green-700",
    accentBg: "oklch(0.40 0.13 155)",
    points: [
      "'Loan Requests' tab mein sabke requests dikhte hain",
      "Borrower ki details aur loan amount dekho",
      "Sab sahi lage to 'Approve' dabao",
      "Loan activate ho jaata hai automatically!",
    ],
  },
  {
    num: "05",
    icon: TrendingUp,
    title: "Repayment Karein",
    hindi: "वापसी करें",
    color: "bg-orange-100 text-orange-600",
    accentBg: "oklch(0.65 0.19 42)",
    points: [
      "'Repayment' tab mein apna active loan dekho",
      "Total due amount = Principal + 5% interest",
      "UPI se directly lender ko payment karo",
      "Repayment mark karo — loan close ho jaata hai",
    ],
  },
  {
    num: "06",
    icon: Crown,
    title: "Premium Membership",
    hindi: "प्रीमियम लो",
    color: "bg-green-100 text-green-700",
    accentBg: "oklch(0.40 0.13 155)",
    points: [
      "Weekly ₹9, Monthly ₹99, Yearly ₹499",
      "Higher loan limits + priority support",
      "'Membership' section mein jaao",
      "Admin UPI par payment karo → activate!",
    ],
  },
  {
    num: "07",
    icon: Star,
    title: "Credit Score Dekhein",
    hindi: "क्रेडिट स्कोर",
    color: "bg-orange-100 text-orange-600",
    accentBg: "oklch(0.65 0.19 42)",
    points: [
      "'Credit Score' tab mein jaao",
      "Score range: 300 (low) se 900 (excellent)",
      "Time par repayment karo = score badhta hai",
      "Accha score = zyada loan aur trust!",
    ],
  },
  {
    num: "08",
    icon: Gavel,
    title: "Legal Action (Default hone par)",
    hindi: "कानूनी कार्रवाई",
    color: "bg-red-100 text-red-700",
    accentBg: "oklch(0.50 0.18 25)",
    points: [
      "Agar borrower pay nahi karta, 'Legal Docs' jaao",
      "'Initiate Legal Action' dabao",
      "Section 138 NI Act ka notice generate hoga",
      "Legal status track hota rahega app mein",
    ],
  },
];

// Real YouTube video tutorials (Hindi) for each topic
const VIDEOS = [
  {
    title: "UPI Payment Kaise Karein",
    hindi: "UPI से पेमेंट करना सीखें",
    emoji: "📱",
    youtubeId: "xNopHBbkVhA",
    searchQuery: "UPI payment kaise kare hindi tutorial",
    miniSteps: [
      "Phone par Google Pay / PhonePe / Paytm kholo",
      "'Send Money' ya 'Pay' dabao",
      "UPI ID daalo: barkat.6y@ptyes",
      "Amount daalo aur confirm karo",
    ],
  },
  {
    title: "Personal Loan Kaise Lete Hain",
    hindi: "पर्सनल लोन कैसे लें",
    emoji: "💸",
    youtubeId: "7U4hFDkGPqo",
    searchQuery: "personal loan kaise le hindi 2024",
    miniSteps: [
      "Dashboard → 'New Loan Request' click karo",
      "Amount ₹1,000–₹50L daalo",
      "5% interest, 16 min approval",
      "Submit karo — lenders ko request jaati hai",
    ],
  },
  {
    title: "P2P Lending Kya Hai?",
    hindi: "P2P लेंडिंग समझें",
    emoji: "🤝",
    youtubeId: "riXpZMDWyV8",
    searchQuery: "P2P lending explained hindi peer to peer loan",
    miniSteps: [
      "P2P = log seedha logon ko loan dete hain",
      "Bank nahi — directly lender se borrower",
      "LenDen Mokoko platform ka kaam: trust + security",
      "Sab transactions track hote hain app mein",
    ],
  },
  {
    title: "Online Loan App Kaise Use Karein",
    hindi: "ऑनलाइन लोन ऐप गाइड",
    emoji: "✅",
    youtubeId: "TqMbVBaVAVs",
    searchQuery: "online loan app kaise use kare hindi guide",
    miniSteps: [
      "Register karein phone number se",
      "₹1 entry fee pay karein UPI se",
      "Loan maangein ya doosron ko dijiye",
      "Repayment time par karo — credit score badhega",
    ],
  },
];

const ANDROID_STEPS = [
  { icon: "🌐", text: "Chrome browser mein app ka link kholo" },
  { icon: "⋮", text: "Top right mein 3 dots (menu) dabao" },
  { icon: "➕", text: "'Add to Home Screen' select karo" },
  { icon: "✅", text: "'Add' dabao — app install ho gayi!" },
];

const IPHONE_STEPS = [
  { icon: "🌐", text: "Safari browser mein app ka link kholo" },
  { icon: "📤", text: "Bottom mein Share button dabao" },
  { icon: "➕", text: "'Add to Home Screen' select karo" },
  { icon: "✅", text: "'Add' dabao — app install ho gayi!" },
];

function VideoCard({ video, idx }: { video: (typeof VIDEOS)[0]; idx: number }) {
  const [playing, setPlaying] = useState(false);

  return (
    <motion.div
      variants={fadeUp}
      transition={{ delay: idx * 0.08 }}
      className="group relative rounded-2xl overflow-hidden border-2 border-border bg-card shadow hover:border-orange-400 transition-all"
      data-ocid={`tutorial.item.${idx + 1}`}
    >
      {/* Video embed or thumbnail */}
      <div className="relative h-48 bg-black">
        {playing ? (
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <>
            {/* YouTube thumbnail */}
            <img
              src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
              alt={video.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            {/* Dark overlay */}
            <div
              className="absolute inset-0"
              style={{ background: "oklch(0 0 0 / 0.35)" }}
            />
            {/* Play button */}
            <button
              type="button"
              onClick={() => setPlaying(true)}
              className="absolute inset-0 flex flex-col items-center justify-center gap-2 cursor-pointer"
              aria-label={`Play ${video.title}`}
            >
              <motion.div
                whileHover={{ scale: 1.12 }}
                className="w-16 h-16 rounded-full flex items-center justify-center shadow-xl"
                style={{
                  background: "oklch(0.65 0.19 42)",
                }}
              >
                <svg
                  className="w-7 h-7 text-white fill-white ml-1"
                  viewBox="0 0 24 24"
                >
                  <title>Play</title>
                  <polygon points="5,3 19,12 5,21" />
                </svg>
              </motion.div>
              <span
                className="text-white text-xs font-bold px-3 py-1 rounded-full"
                style={{ background: "oklch(0 0 0 / 0.5)" }}
              >
                ▶ YouTube Video Dekho
              </span>
            </button>
            {/* Live badge */}
            <span
              className="absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1"
              style={{ background: "oklch(0.40 0.13 155)", color: "white" }}
            >
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              Live Video
            </span>
          </>
        )}
      </div>

      {/* Info */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-bold text-foreground mb-0.5">{video.title}</h3>
          <p className="text-sm text-muted-foreground">{video.hindi}</p>
        </div>
        {/* Mini storyboard steps */}
        <div className="space-y-1.5">
          {video.miniSteps.map((step, si) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: step text content is stable
            <div key={si} className="flex items-start gap-2">
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5"
                style={{
                  background: "oklch(0.65 0.19 42)",
                  color: "white",
                }}
              >
                {si + 1}
              </span>
              <span className="text-xs text-foreground/80">{step}</span>
            </div>
          ))}
        </div>
        {/* YouTube link */}
        <a
          href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full rounded-lg px-3 py-2 text-xs font-bold transition-opacity hover:opacity-80"
          style={{
            background: "oklch(0.94 0.04 85)",
            color: "oklch(0.50 0.16 42)",
          }}
        >
          <ExternalLink className="w-3.5 h-3.5" />
          YouTube par Full Video Dekhein
        </a>
      </div>
    </motion.div>
  );
}

export function TutorialPage({ onNavigate }: TutorialPageProps) {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      {/* ── HERO ── */}
      <section
        className="relative py-16 px-4 text-center overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.18 0.04 42) 0%, oklch(0.22 0.07 45) 50%, oklch(0.16 0.06 155) 100%)",
        }}
      >
        <div
          className="absolute top-[-40px] right-[-40px] w-64 h-64 rounded-full opacity-10"
          style={{ background: "oklch(0.65 0.19 42)" }}
        />
        <div
          className="absolute bottom-[-30px] left-[-30px] w-48 h-48 rounded-full opacity-10"
          style={{ background: "oklch(0.40 0.13 155)" }}
        />

        <motion.div
          className="relative z-10 max-w-3xl mx-auto"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeUp}>
            <Button
              variant="ghost"
              size="sm"
              className="mb-6 text-white/60 hover:text-white"
              onClick={() => onNavigate("landing")}
              data-ocid="tutorial.link"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Button>
          </motion.div>

          <motion.div variants={fadeUp}>
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-5"
              style={{
                background: "oklch(0.65 0.19 42 / 0.3)",
                color: "oklch(0.88 0.12 85)",
              }}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Step-by-Step Guide + Video Tutorials
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            LenDen Mokoko
            <br />
            <span style={{ color: "oklch(0.78 0.15 85)" }}>
              Kaise Use Karein? 🍁
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-white/65 text-lg max-w-xl mx-auto mb-8"
          >
            Pehli baar use kar rahe hain? Koi baat nahi! Yeh complete guide
            aapko sab kuch sikhayega — registration se lekar legal action tak.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="flex flex-wrap justify-center gap-3"
          >
            {[
              { emoji: "📋", text: "8 Steps" },
              { emoji: "🎥", text: "4 Video Tutorials" },
              { emoji: "📲", text: "PWA Install Guide" },
            ].map((item) => (
              <span
                key={item.text}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold"
                style={{
                  background: "oklch(1 0 0 / 0.1)",
                  color: "oklch(0.90 0.05 80)",
                  border: "1px solid oklch(1 0 0 / 0.2)",
                }}
              >
                {item.emoji} {item.text}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── SHARE NOTE ── */}
      <div
        className="px-4 py-3 text-center text-sm font-semibold"
        style={{
          background: "oklch(0.95 0.04 85)",
          color: "oklch(0.40 0.12 45)",
        }}
      >
        💡 Ye guide sabke liye hai — share karein apne contacts ke saath! 📲
      </div>

      {/* ── QUICK START GUIDE ── */}
      <section
        className="py-10 px-4"
        style={{ background: "oklch(0.98 0.01 90)" }}
      >
        <div className="max-w-3xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-7"
          >
            <span
              className="inline-block text-xs font-black px-3 py-1 rounded-full mb-3"
              style={{
                background: "oklch(0.82 0.18 75)",
                color: "oklch(0.20 0.06 42)",
              }}
            >
              ⚡ QUICK START
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-foreground">
              📱 Quick Start Guide
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              3 simple steps mein shuru karein!
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                step: "1",
                emoji: "📋",
                title: "Register & Pay ₹1",
                desc: "App mein register karein, ₹1 entry fee UPI se bhejein — sab unlock!",
                color: "oklch(0.65 0.19 42)",
              },
              {
                step: "2",
                emoji: "💸",
                title: "Loan Apply Karein",
                desc: "₹1,000 se ₹50 Lakh tak loan maangein — sirf 16 minute mein approval!",
                color: "oklch(0.40 0.13 155)",
              },
              {
                step: "3",
                emoji: "✅",
                title: "Paisa Paayein & Wapas Karein",
                desc: "Loan milte hi UPI par instant! Sirf 5% interest ke saath wapas karein.",
                color: "oklch(0.55 0.18 265)",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative bg-card border-2 border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
                data-ocid={`tutorial.item.${i + 1}`}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-white text-lg mb-3"
                  style={{ background: item.color }}
                >
                  {item.step}
                </div>
                <div className="text-2xl mb-2">{item.emoji}</div>
                <h3 className="font-bold text-foreground text-sm mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STEPS ── */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p
              className="text-xs font-bold uppercase tracking-widest mb-2"
              style={{ color: "oklch(0.65 0.19 42)" }}
            >
              Complete Guide
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">
              8 Steps mein seekhein
            </h2>
          </motion.div>

          <div className="space-y-6">
            {STEPS.map((step, idx) => (
              <motion.div
                key={step.num}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: idx * 0.04 }}
                className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                data-ocid={`tutorial.item.${idx + 1}`}
              >
                <div className="flex flex-col sm:flex-row items-start">
                  <div
                    className="flex items-center justify-center w-full sm:w-24 sm:min-w-24 h-20 sm:h-auto sm:py-8 flex-shrink-0"
                    style={{ background: step.accentBg }}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <step.icon className="w-6 h-6 text-white" />
                      <span className="text-white/70 text-xs font-bold">
                        {step.num}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 p-5">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <h3 className="text-lg font-bold text-foreground">
                        {step.title}
                      </h3>
                      <Badge
                        variant="secondary"
                        className={`text-xs font-semibold ${step.color}`}
                      >
                        {step.hindi}
                      </Badge>
                    </div>
                    <ul className="space-y-1.5">
                      {step.points.map((point) => (
                        <li
                          key={point}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <CheckCircle2
                            className="w-4 h-4 mt-0.5 flex-shrink-0"
                            style={{ color: step.accentBg }}
                          />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VIDEO TUTORIALS ── */}
      <section
        className="py-16 px-4"
        style={{ background: "oklch(0.97 0.015 80)" }}
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p
              className="text-xs font-bold uppercase tracking-widest mb-2"
              style={{ color: "oklch(0.65 0.19 42)" }}
            >
              Video Tutorials
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">
              🎬 Tutorial Videos
            </h2>
            <p className="text-muted-foreground mt-2">
              Play button dabao — seedha YouTube video chalega!
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-5"
          >
            {VIDEOS.map((video, idx) => (
              <VideoCard key={video.title} video={video} idx={idx} />
            ))}
          </motion.div>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center text-sm text-muted-foreground mt-6"
          >
            📢 Koi sawaal ho to WhatsApp karein{" "}
            <a
              href="https://wa.me/917814873372"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline"
              style={{ color: "oklch(0.40 0.13 155)" }}
            >
              7814873372
            </a>
          </motion.p>
        </div>
      </section>

      {/* ── PWA INSTALL GUIDE ── */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p
              className="text-xs font-bold uppercase tracking-widest mb-2"
              style={{ color: "oklch(0.65 0.19 42)" }}
            >
              App Install Guide
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">
              📲 Phone par Install Karein
            </h2>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
              LenDen Mokoko ek web app hai — Play Store ya App Store ki zaroorat
              nahi! Seedha home screen par save karein.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Android */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-card border-2 border-border rounded-2xl overflow-hidden"
            >
              <div
                className="px-6 py-4 flex items-center gap-3"
                style={{ background: "oklch(0.65 0.19 42)" }}
              >
                <span className="text-2xl">🤖</span>
                <div>
                  <h3 className="font-bold text-white text-lg">Android</h3>
                  <p className="text-white/70 text-sm">Chrome Browser</p>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {ANDROID_STEPS.map((s, i) => (
                  <div
                    key={s.text}
                    className="flex items-start gap-4"
                    data-ocid={`tutorial.item.${i + 1}`}
                  >
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-lg font-bold"
                      style={{
                        background: "oklch(0.65 0.19 42 / 0.12)",
                        color: "oklch(0.65 0.19 42)",
                      }}
                    >
                      {i + 1}
                    </div>
                    <div className="pt-1.5">
                      <span className="text-sm text-foreground">{s.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* iPhone */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-card border-2 border-border rounded-2xl overflow-hidden"
            >
              <div
                className="px-6 py-4 flex items-center gap-3"
                style={{ background: "oklch(0.40 0.13 155)" }}
              >
                <span className="text-2xl">🍎</span>
                <div>
                  <h3 className="font-bold text-white text-lg">iPhone</h3>
                  <p className="text-white/70 text-sm">Safari Browser</p>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {IPHONE_STEPS.map((s, i) => (
                  <div
                    key={s.text}
                    className="flex items-start gap-4"
                    data-ocid={`tutorial.item.${i + 1}`}
                  >
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-lg font-bold"
                      style={{
                        background: "oklch(0.40 0.13 155 / 0.12)",
                        color: "oklch(0.40 0.13 155)",
                      }}
                    >
                      {i + 1}
                    </div>
                    <div className="pt-1.5">
                      <span className="text-sm text-foreground">{s.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Benefits */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-8 rounded-2xl p-6 border border-border"
            style={{ background: "oklch(0.97 0.015 80)" }}
          >
            <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
              <ShieldCheck
                className="w-5 h-5"
                style={{ color: "oklch(0.40 0.13 155)" }}
              />
              Home Screen par save karne ke fayde:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  emoji: "⚡",
                  title: "Instant Access",
                  sub: "Ek tap mein app khule",
                },
                {
                  emoji: "📴",
                  title: "No Browser Needed",
                  sub: "Bilkul app jaisi experience",
                },
                {
                  emoji: "🆓",
                  title: "Free Forever",
                  sub: "No Play Store, no download",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-3 p-3 bg-card rounded-xl border border-border"
                >
                  <span className="text-2xl">{item.emoji}</span>
                  <div>
                    <p className="font-semibold text-sm">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        className="py-16 px-4 text-center"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.22 0.07 45), oklch(0.16 0.06 155))",
        }}
      >
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-xl mx-auto"
        >
          <motion.h2
            variants={fadeUp}
            className="text-3xl md:text-4xl font-extrabold text-white mb-4"
          >
            Abhi Start Karein! 🚀
          </motion.h2>
          <motion.p variants={fadeUp} className="text-white/70 mb-8 text-lg">
            Sab samajh gaye? Toh abhi register karein — ₹1 entry fee ke saath
            sab kuch unlock!
          </motion.p>
          <motion.div
            variants={fadeUp}
            className="flex flex-wrap justify-center gap-4"
          >
            <Button
              size="lg"
              className="rounded-full font-bold px-8 shadow-lg"
              style={{ background: "oklch(0.65 0.19 42)", color: "white" }}
              onClick={() => onNavigate("auth")}
              data-ocid="tutorial.primary_button"
            >
              Register Karein <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full font-bold px-8 border-white/30 text-white hover:bg-white/10"
              onClick={() => onNavigate("support")}
              data-ocid="tutorial.secondary_button"
            >
              Help Chahiye?
            </Button>
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}
