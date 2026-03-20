import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

interface AdCarouselProps {
  onNavigate: (page: string) => void;
}

const ADS = [
  {
    emoji: "🔥",
    title: "Muthoot Finance Gold Loan",
    subtitle: "India's No.1 — Turant Apply Karein!",
    tag: "Trusted Since 1887",
    bg: "linear-gradient(135deg, oklch(0.38 0.18 27), oklch(0.45 0.15 35))",
    accent: "oklch(0.78 0.15 85)",
  },
  {
    emoji: "⚡",
    title: "Bajaj Finserv — ₹50L in 16 Min!",
    subtitle: "Pre-approved offers, Zero collateral needed",
    tag: "India's Leading NBFC",
    bg: "linear-gradient(135deg, oklch(0.25 0.10 255), oklch(0.35 0.15 260))",
    accent: "oklch(0.82 0.12 210)",
  },
  {
    emoji: "🏡",
    title: "Home Loan Starting 8.5%",
    subtitle: "30 Year Tenure | Tax Benefit | Quick Approval",
    tag: "Limited Time Offer!",
    bg: "linear-gradient(135deg, oklch(0.28 0.12 155), oklch(0.38 0.14 160))",
    accent: "oklch(0.82 0.12 140)",
  },
  {
    emoji: "💰",
    title: "Bajaj Markets — Best Deals!",
    subtitle: "100+ Lenders | Zero Processing Fee Selected Offers",
    tag: "Compare & Save!",
    bg: "linear-gradient(135deg, oklch(0.40 0.14 85), oklch(0.48 0.16 90))",
    accent: "white",
  },
];

export function AdCarousel({ onNavigate }: AdCarouselProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % ADS.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const ad = ADS[current];

  return (
    <div className="mb-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl overflow-hidden cursor-pointer relative"
          style={{ background: ad.bg }}
          onClick={() => onNavigate("loan-offers")}
          data-ocid="ad_carousel.primary_button"
        >
          <div className="px-5 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                className="text-3xl flex-shrink-0"
              >
                {ad.emoji}
              </motion.div>
              <div>
                <p className="font-black text-white text-sm leading-tight">
                  {ad.title}
                </p>
                <p className="text-white/80 text-xs mt-0.5">{ad.subtitle}</p>
              </div>
            </div>
            <div className="flex-shrink-0 text-right">
              <span
                className="text-xs font-bold px-3 py-1.5 rounded-full block"
                style={{ background: "oklch(1 0 0 / 0.2)", color: ad.accent }}
              >
                {ad.tag}
              </span>
              <p className="text-white/60 text-[10px] mt-1">Apply Now →</p>
            </div>
          </div>
          {/* Progress dots */}
          <div className="flex justify-center gap-1.5 pb-3">
            {ADS.map((ad, i) => (
              <button
                type="button"
                key={ad.title}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrent(i);
                }}
                className="rounded-full transition-all"
                style={{
                  width: i === current ? "20px" : "6px",
                  height: "6px",
                  background: i === current ? "white" : "oklch(1 0 0 / 0.4)",
                }}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
