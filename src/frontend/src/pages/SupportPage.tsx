import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  HeadphonesIcon,
  IndianRupee,
  MessageCircle,
  Phone,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

interface SupportPageProps {
  onNavigate: (page: string) => void;
}

const faqs = [
  {
    q: "Loan ke liye kaise apply karein? / How to apply for a loan?",
    a: "Pehle ₹1 entry fee UPI se pay karein (QR scan karke). Phir 'New Loan Request' par jaayein aur apni details bharen. 16 minute mein approval milta hai. / First pay ₹1 entry fee via UPI QR, then go to 'New Loan Request' and fill your details. Approval in 16 minutes.",
  },
  {
    q: "Payment kaise karein? / How to make payment?",
    a: "App mein 'Pay' button dabane par UPI QR code dikhega. Google Pay / PhonePe se QR scan karke seedha admin ke account mein pay karein. App sirf record rakhta hai. / Tap 'Pay' to see UPI QR. Scan with Google Pay/PhonePe to pay directly to admin. App only keeps records.",
  },
  {
    q: "Loan limit kitni hai? / What is the loan limit?",
    a: "Aap ₹1,000 se lekar ₹50,00,000 (50 lakh) tak ka loan le sakte hain. Instant approval guaranteed in just 16 minutes. / Loans from ₹1,000 to ₹50,00,000 (50 lakhs). Instant approval guaranteed in 16 minutes.",
  },
  {
    q: "Agar koi loan wapas na kare to kya hoga? / What happens if someone doesn't repay?",
    a: "App mein Legal Action feature hai. Section 138 NI Act ke under legal notice bheja ja sakta hai. Dashboard mein 'Legal Documents' section se process start kar sakte hain. / The app has a Legal Action feature. A notice under Section 138 NI Act can be sent via the 'Legal Documents' section in the dashboard.",
  },
  {
    q: "Premium Membership ke kya fayde hain? / What are the benefits of Premium Membership?",
    a: "Premium members ko milta hai priority loan approval, higher loan limits, exclusive interest rates, aur dedicated support. Plans start at ₹9/week. / Premium members get priority approval, higher limits, exclusive rates, and dedicated support. Plans start at ₹9/week.",
  },
];

export function SupportPage({ onNavigate }: SupportPageProps) {
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-orange-500 to-green-600 text-white py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
              <HeadphonesIcon className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Support &amp; Contact</h1>
            <p className="text-lg text-orange-100">सहायता और संपर्क</p>
            <p className="text-sm text-orange-100 mt-2">
              Koi bhi samasya ho — hum yahan hain!
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Phone Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-2 border-orange-300 bg-orange-50 shadow-lg">
            <CardContent className="p-6 text-center">
              <Badge className="bg-orange-500 text-white mb-3">
                📞 Direct Support
              </Badge>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Phone className="w-6 h-6 text-orange-600" />
                <a
                  href="tel:7814873372"
                  className="text-4xl font-black text-orange-700 hover:text-orange-900 tracking-widest transition-colors"
                  data-ocid="support.primary_button"
                >
                  7814873372
                </a>
              </div>
              <p className="text-sm text-orange-600 mb-4">
                Click karein — direct call ho jayegi!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  asChild
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                  data-ocid="support.primary_button"
                >
                  <a href="tel:7814873372">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Now / अभी कॉल करें
                  </a>
                </Button>
                <Button
                  asChild
                  className="bg-green-500 hover:bg-green-600 text-white"
                  data-ocid="support.secondary_button"
                >
                  <a
                    href="https://wa.me/917814873372"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <IndianRupee className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-800">
                    UPI Payment
                  </span>
                </div>
                <p className="text-sm text-green-700 font-mono font-bold">
                  barkat.6y@ptyes
                </p>
                <p className="text-xs text-green-600 mt-1">
                  Entry fee, commission, membership
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-blue-800">
                    Support Hours
                  </span>
                </div>
                <p className="text-sm text-blue-700 font-semibold">Mon – Sat</p>
                <p className="text-xs text-blue-600">9:00 AM – 8:00 PM</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Frequently Asked Questions / अक्सर पूछे जाने वाले सवाल
          </h2>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <Card
                key={faq.q}
                className="border border-gray-200 hover:border-orange-300 transition-colors cursor-pointer"
                onClick={() => setOpenFaq(openFaq === faq.q ? null : faq.q)}
                data-ocid="support.item.1"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-gray-800 flex-1">
                      {faq.q}
                    </p>
                    {openFaq === faq.q ? (
                      <ChevronUp className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    )}
                  </div>
                  {openFaq === faq.q && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="text-sm text-gray-600 mt-3 pt-3 border-t border-gray-100"
                    >
                      {faq.a}
                    </motion.p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Back button */}
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => onNavigate("landing")}
            data-ocid="support.secondary_button"
          >
            ← Back to Home
          </Button>
        </div>
      </div>
    </main>
  );
}
