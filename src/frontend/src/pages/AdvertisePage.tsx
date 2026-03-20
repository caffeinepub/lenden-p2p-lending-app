import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle2,
  IndianRupee,
  Megaphone,
  MessageCircle,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

interface AdvertisePageProps {
  onNavigate: (page: string) => void;
}

const benefits = [
  {
    icon: Users,
    text: "Lakhs of borrowers see your offer / लाखों उधारकर्ता आपका ऑफर देखेंगे",
  },
  {
    icon: TrendingUp,
    text: "Direct lead generation / सीधे लीड मिलेंगी",
  },
  {
    icon: IndianRupee,
    text: "7% commission model — platform earns with you / 7% कमीशन मॉडल",
  },
  {
    icon: CheckCircle2,
    text: "Trusted, legally compliant platform / विश्वसनीय और कानूनी प्लेटफॉर्म",
  },
  {
    icon: Zap,
    text: "Instant ad activation / तुरंत विज्ञापन चालू होगा",
  },
  {
    icon: Star,
    text: "Priority listing for premium advertisers / प्रीमियम विज्ञापनदाताओं को प्राथमिकता",
  },
];

export function AdvertisePage({ onNavigate }: AdvertisePageProps) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-green-600 to-orange-500 text-white py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
              <Megaphone className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold mb-2">
              Apna Loan Product Advertise Karein
            </h1>
            <p className="text-lg text-green-100">
              अपना लोन प्रोडक्ट यहाँ advertise करें
            </p>
            <p className="text-sm text-green-100 mt-2">
              Lakhs of verified borrowers — directly reach your audience!
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        {/* Pricing Cards */}
        <div>
          <h2 className="text-xl font-bold text-center mb-6 text-gray-800">
            Advertisement Plans / विज्ञापन प्लान
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Weekly */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card
                className="border-2 border-orange-300 hover:border-orange-400 transition-all hover:shadow-lg"
                data-ocid="advertise.card"
              >
                <CardHeader className="bg-orange-50 pb-3">
                  <CardTitle className="text-center">
                    <div className="text-3xl font-black text-orange-600">
                      ₹499
                    </div>
                    <div className="text-sm text-orange-500 font-medium">
                      per week / प्रति सप्ताह
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5">
                  <p className="text-center font-semibold text-gray-700 mb-4">
                    Weekly Ad Plan
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                      7-day ad placement
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                      Loan Offers page listing
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                      Direct borrower leads
                    </li>
                  </ul>
                  <Button
                    asChild
                    className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white"
                    data-ocid="advertise.primary_button"
                  >
                    <a
                      href="https://wa.me/917814873372?text=Hi%2C%20I%20want%20to%20advertise%20Weekly%20Plan%20%E2%82%B9499"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Book Now on WhatsApp
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Monthly */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card
                className="border-2 border-green-400 hover:border-green-500 transition-all hover:shadow-xl relative"
                data-ocid="advertise.card"
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-green-500 text-white px-3 py-1">
                    ⭐ Best Value
                  </Badge>
                </div>
                <CardHeader className="bg-green-50 pb-3">
                  <CardTitle className="text-center">
                    <div className="text-3xl font-black text-green-700">
                      ₹999
                    </div>
                    <div className="text-sm text-green-500 font-medium">
                      per month / प्रति माह
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5">
                  <p className="text-center font-semibold text-gray-700 mb-4">
                    Monthly Ad Plan
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                      30-day ad placement
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                      Priority top listing
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                      4x more reach vs weekly
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                      7% commission on each loan
                    </li>
                  </ul>
                  <Button
                    asChild
                    className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white"
                    data-ocid="advertise.primary_button"
                  >
                    <a
                      href="https://wa.me/917814873372?text=Hi%2C%20I%20want%20to%20advertise%20Monthly%20Plan%20%E2%82%B9999"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Book Now on WhatsApp
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Commission Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-amber-300 bg-amber-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <IndianRupee className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-amber-800 text-sm">
                    7% Commission Model / 7% कमीशन
                  </p>
                  <p className="text-xs text-amber-700 mt-1">
                    Jab bhi koi borrower aapke advertised loan offer ke through
                    loan leta hai, platform 7% commission earn karta hai. Yeh
                    aapke liye cost-effective advertising hai! / Every loan
                    taken through your ad earns the platform 7% commission —
                    making it highly cost-effective for you.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Benefits / फायदे
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {benefits.map((b) => (
              <div
                key={b.text}
                className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100 shadow-sm"
              >
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <b.icon className="w-4 h-4 text-green-600" />
                </div>
                <p className="text-sm text-gray-700">{b.text}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Payment Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-2 border-green-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                How to Start / कैसे शुरू करें
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ol className="space-y-3">
                {[
                  "Plan choose karein (Weekly ₹499 ya Monthly ₹999) / Choose your plan",
                  "Neeche diye QR code ko scan karein aur payment karein / Scan QR below and pay",
                  "Payment screenshot WhatsApp karein: 7814873372 / WhatsApp payment proof",
                  "Aapka ad 24 ghante mein live ho jayega / Your ad goes live within 24 hours",
                ].map((step, stepIdx) => (
                  <li key={step} className="flex items-start gap-3">
                    <div className="w-7 h-7 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {stepIdx + 1}
                    </div>
                    <p className="text-sm text-gray-700 pt-1">{step}</p>
                  </li>
                ))}
              </ol>

              {/* QR Code */}
              <div className="text-center py-4">
                <p className="text-sm font-semibold text-gray-600 mb-3">
                  Scan to Pay / स्कैन करके पेमेंट करें
                </p>
                <div className="inline-block p-2 border-2 border-green-400 rounded-xl bg-white shadow">
                  <img
                    src="/assets/uploads/IMG_20260321_020701-1.jpg"
                    alt="UPI QR Code"
                    className="w-48 h-48 object-contain"
                  />
                </div>
                <p className="text-sm font-bold text-green-700 mt-2">
                  UPI: barkat.6y@ptyes
                </p>
              </div>

              <Button
                asChild
                className="w-full bg-green-500 hover:bg-green-600 text-white"
                data-ocid="advertise.secondary_button"
              >
                <a
                  href="https://wa.me/917814873372?text=Hi%2C%20I%20want%20to%20advertise%20on%20LenDen%20Mokoko"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp: 7814873372
                </a>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Back button */}
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => onNavigate("loan-offers")}
            data-ocid="advertise.secondary_button"
          >
            ← Back to Loan Offers
          </Button>
        </div>
      </div>
    </main>
  );
}
