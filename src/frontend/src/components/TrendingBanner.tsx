import { motion } from "motion/react";

interface TrendingBannerProps {
  onNavigate?: (page: string) => void;
}

const TICKER_ITEMS = [
  "🔥 Home Loan at 8.5% p.a. — Apply Now!",
  "⚡ Gold Loan in 16 Min — No Credit Check!",
  "🏆 Muthoot Finance — Trusted Since 1887",
  "💰 Bajaj Finserv — ₹50L Instant Approval",
  "🌟 Bajaj Markets — Zero Processing Fee on Select Offers",
  "📈 7% Commission Har Loan Par — Seedha Aapke Account Mein!",
  "🔥 1,247 Loans Disbursed Today — Join Now!",
  "⚡ ₹50 Lakh Tak Instant — Sirf 16 Minute Mein!",
  "🏡 Home Loan ₹5L – ₹5 Crore | 30 Year Tenure | Tax Benefit!",
  "🥇 Gold Loan ₹10,000 – ₹50L | Keep Your Gold Safe!",
];

const tickerText = TICKER_ITEMS.join("   •   ");

export function TrendingBanner({ onNavigate }: TrendingBannerProps) {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(90deg, oklch(0.50 0.18 42), oklch(0.55 0.20 45), oklch(0.50 0.18 42))",
      }}
    >
      <div className="flex items-center">
        {/* Left badge */}
        <div
          className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 font-black text-xs tracking-widest z-10 relative"
          style={{
            background: "oklch(0.38 0.18 27)",
            color: "white",
            minWidth: "fit-content",
          }}
        >
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.2, repeat: Number.POSITIVE_INFINITY }}
          >
            🔥
          </motion.span>
          <span>TRENDING</span>
        </div>

        {/* Scrolling ticker */}
        <div className="overflow-hidden flex-1 py-2.5">
          <motion.div
            className="flex whitespace-nowrap text-white text-xs font-semibold tracking-wide"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: 30,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            style={{ gap: "0" }}
          >
            <span className="pr-8">{tickerText}</span>
            <span className="pr-8">{tickerText}</span>
          </motion.div>
        </div>

        {/* Right CTA */}
        {onNavigate && (
          <button
            type="button"
            onClick={() => onNavigate("loan-offers")}
            className="flex-shrink-0 px-4 py-2.5 text-xs font-bold tracking-wider transition-all hover:opacity-90"
            style={{ background: "oklch(0.40 0.13 155)", color: "white" }}
            data-ocid="trending_banner.primary_button"
          >
            देखें →
          </button>
        )}
      </div>
    </div>
  );
}
