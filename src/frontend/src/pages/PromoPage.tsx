import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Download, Share2 } from "lucide-react";
import { motion } from "motion/react";

interface PromoPageProps {
  onNavigate: (page: string) => void;
}

const adImages = [
  {
    id: "ad1",
    src: "/assets/generated/ad-post-1.dim_1080x1080.jpg",
    title: "Paise Ki Zaroorat?",
    titleHindi: "पैसे की ज़रूरत?",
    dimensions: "1080 × 1080 px",
    tag: "Square Ad",
    tagColor: "bg-orange-500",
    platform: "Facebook, WhatsApp",
    delay: 0.2,
  },
  {
    id: "ad2",
    src: "/assets/generated/ad-post-2.dim_1080x1080.jpg",
    title: "Loan Do Paise Kamao",
    titleHindi: "लोन दो पैसे कमाओ!",
    dimensions: "1080 × 1080 px",
    tag: "Investor Ad",
    tagColor: "bg-green-600",
    platform: "Facebook, Instagram",
    delay: 0.3,
  },
  {
    id: "adstory",
    src: "/assets/generated/ad-story.dim_1080x1920.jpg",
    title: "WhatsApp Status Ad",
    titleHindi: "व्हाट्सएप स्टेटस",
    dimensions: "1080 × 1920 px",
    tag: "Story Ad",
    tagColor: "bg-purple-600",
    platform: "WhatsApp Status, Instagram Story",
    delay: 0.4,
  },
];

const promoImages = [
  {
    id: "square",
    src: "/assets/generated/promo-square.dim_1080x1080.jpg",
    title: "Facebook / WhatsApp Post",
    titleHindi: "फेसबुक / व्हाट्सएप पोस्ट",
    dimensions: "1080 × 1080 px",
    tag: "Square Post",
    tagColor: "bg-orange-500",
    platform: "Facebook, WhatsApp",
    delay: 0.55,
  },
  {
    id: "banner",
    src: "/assets/generated/promo-banner.dim_1920x1080.jpg",
    title: "WhatsApp Status Banner",
    titleHindi: "व्हाट्सएप स्टेटस बैनर",
    dimensions: "1920 × 1080 px",
    tag: "Landscape",
    tagColor: "bg-green-600",
    platform: "WhatsApp Status",
    delay: 0.65,
  },
  {
    id: "story",
    src: "/assets/generated/promo-story.dim_1080x1920.jpg",
    title: "Instagram / Facebook Story",
    titleHindi: "इंस्टाग्राम / फेसबुक स्टोरी",
    dimensions: "1080 × 1920 px",
    tag: "Vertical Story",
    tagColor: "bg-purple-600",
    platform: "Instagram, Facebook",
    delay: 0.75,
  },
];

const shareTips = [
  {
    icon: "📘",
    platform: "Facebook",
    tip: "Square post aur story dono use karein. 'Promote Post' se reach badhayen.",
  },
  {
    icon: "💬",
    platform: "WhatsApp",
    tip: "Status mein landscape banner lagayen. Groups mein square post forward karein.",
  },
  {
    icon: "📸",
    platform: "Instagram",
    tip: "Vertical story bilkul perfect hai. Feed post ke liye square use karein.",
  },
];

function ImageCard({
  img,
}: {
  img: (typeof adImages)[0];
}) {
  const handleDownload = (src: string, title: string) => {
    const a = document.createElement("a");
    a.href = src;
    a.download = `LenDen-Mokoko-${title.replace(/\s+/g, "-")}.jpg`;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.click();
  };

  const handleShare = (src: string, title: string) => {
    const fullUrl = `${window.location.origin}${src}`;
    if (navigator.share) {
      navigator.share({ title: `LenDen Mokoko - ${title}`, url: fullUrl });
    } else {
      window.open(
        `https://wa.me/?text=${encodeURIComponent(`LenDen Mokoko: ${fullUrl}`)}`,
        "_blank",
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: img.delay }}
    >
      <Card className="border-2 border-orange-200 hover:border-orange-400 transition-all hover:shadow-xl overflow-hidden group h-full flex flex-col">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <Badge className={`${img.tagColor} text-white text-xs`}>
              {img.tag}
            </Badge>
            <span className="text-xs text-gray-400 font-mono">
              {img.dimensions}
            </span>
          </div>
          <CardTitle className="text-base font-bold text-gray-800 mt-1">
            {img.title}
          </CardTitle>
          <p className="text-xs text-gray-500">{img.titleHindi}</p>
        </CardHeader>

        <CardContent className="px-3 pb-3 flex-1">
          <div
            className="relative bg-gray-100 rounded-lg overflow-hidden border border-gray-200 group-hover:border-orange-300 transition-colors"
            style={{ height: "220px" }}
          >
            <img
              src={img.src}
              alt={img.title}
              className="w-full h-full object-contain transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full px-3 py-1 text-xs font-semibold text-gray-800 flex items-center gap-1">
                <Download className="w-3 h-3" />
                Download
              </div>
            </div>
          </div>
          <p className="text-xs text-center text-gray-500 mt-2">
            📱 Platform:{" "}
            <span className="font-semibold text-green-700">{img.platform}</span>
          </p>
        </CardContent>

        <CardFooter className="flex gap-2 px-3 pb-4">
          <Button
            asChild
            className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold shadow"
            data-ocid={`promo.${img.id}.primary_button`}
          >
            <a
              href={img.src}
              download={`LenDen-Mokoko-${img.title.replace(/\s+/g, "-")}.jpg`}
              onClick={() => handleDownload(img.src, img.title)}
            >
              <Download className="w-4 h-4 mr-1" />
              Download / डाउनलोड
            </a>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="border-green-400 text-green-600 hover:bg-green-50"
            onClick={() => handleShare(img.src, img.title)}
            data-ocid={`promo.${img.id}.secondary_button`}
            title="Share"
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

export function PromoPage({ onNavigate }: PromoPageProps) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-orange-500 via-orange-400 to-green-600 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4 text-3xl">
              📢
            </div>
            <h1 className="text-3xl font-black mb-1">
              Advertisement &amp; Promo
            </h1>
            <p className="text-xl font-semibold text-orange-100 mb-3">
              विज्ञापन और प्रचार सामग्री
            </p>
            <p className="text-sm text-orange-100 max-w-md mx-auto">
              In images ko download karke Facebook, WhatsApp, Instagram par
              share karein — customers badhao!
            </p>
            <Badge className="mt-3 bg-white/20 text-white border-white/30">
              🍁 LenDen Mokoko × HOJS
            </Badge>
          </motion.div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* How to use tip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-gradient-to-r from-orange-100 to-green-100 border border-orange-200 rounded-xl p-4 mb-8 text-center"
        >
          <p className="text-sm font-semibold text-orange-800">
            👇 Neeche kisi bhi image ka <strong>"Download"</strong> button
            dabayen → image save ho jayegi → <strong>Mobile:</strong> press
            &amp; hold → Save Image | <strong>Desktop:</strong> right-click →
            Save
          </p>
        </motion.div>

        {/* ── Advertisement Posts Section ── */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.18 }}
          className="flex items-center gap-3 mb-5"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-white text-xl shadow">
            📣
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-800">
              Advertisement Posts
            </h2>
            <p className="text-xs text-gray-500">
              Naye customers attract karne ke liye share karein
            </p>
          </div>
          <Badge className="ml-auto bg-red-500 text-white animate-pulse">
            🔥 New
          </Badge>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {adImages.map((img) => (
            <ImageCard key={img.id} img={img} />
          ))}
        </div>

        {/* Divider */}
        <div className="relative flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent" />
          <span className="text-xs font-semibold text-orange-500 px-2 whitespace-nowrap">
            ──── PROMOTIONAL POSTS ────
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent" />
        </div>

        {/* ── Promotional Posts Section ── */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-3 mb-5"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-700 text-white text-xl shadow">
            🎯
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-800">
              Promotional Posts
            </h2>
            <p className="text-xs text-gray-500">
              App ki awareness badhaane ke liye
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {promoImages.map((img) => (
            <ImageCard key={img.id} img={img} />
          ))}
        </div>

        {/* Share Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85 }}
          className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          <div className="col-span-full mb-1">
            <h3 className="text-base font-bold text-gray-700">
              💡 Platform Tips
            </h3>
          </div>
          {shareTips.map((tip) => (
            <div
              key={tip.platform}
              className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
            >
              <div className="text-2xl mb-2">{tip.icon}</div>
              <p className="font-bold text-gray-800 text-sm mb-1">
                {tip.platform}
              </p>
              <p className="text-xs text-gray-500">{tip.tip}</p>
            </div>
          ))}
        </motion.div>

        {/* Back */}
        <div className="text-center mt-8">
          <Button
            variant="outline"
            onClick={() => onNavigate("dashboard")}
            className="border-orange-300 text-orange-600 hover:bg-orange-50"
            data-ocid="promo.secondary_button"
          >
            ← Dashboard par Wapas Jayen
          </Button>
        </div>
      </div>
    </main>
  );
}
