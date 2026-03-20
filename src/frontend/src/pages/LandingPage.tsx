import { Button } from "@/components/ui/button";
import { CheckCircle, FileText, Shield, TrendingUp, Users } from "lucide-react";
import { motion } from "motion/react";

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const features = [
    {
      icon: Shield,
      title: "कानूनी सुरक्षा",
      sub: "Legal Protection",
      desc: "हर लेन-देन के साथ कानूनी प्रॉमिसरी नोट",
    },
    {
      icon: FileText,
      title: "डिजिटल दस्तावेज़",
      sub: "Digital Documents",
      desc: "सभी दस्तावेज़ सुरक्षित और डाउनलोड करने योग्य",
    },
    {
      icon: TrendingUp,
      title: "ब्याज के साथ रिटर्न",
      sub: "Earn Interest",
      desc: "अपने पैसे पर आकर्षक ब्याज दर कमाएं",
    },
    {
      icon: Users,
      title: "विश्वसनीय नेटवर्क",
      sub: "Trusted Network",
      desc: "केवल सत्यापित उपयोगकर्ताओं के साथ लेन-देन",
    },
  ];

  return (
    <main>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-50 to-secondary py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">
                Trusted P2P Lending App
              </p>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight mb-4 font-devanagari">
                दोस्तों को ऋण दें,
                <br />
                <span className="text-primary">विश्वास के साथ</span>
              </h1>
              <p className="text-muted-foreground text-lg mb-8 font-devanagari">
                बिना किसी झंझट के अपने नजदीकियों को पैसे दें और कानूनी सुरक्षा के साथ वापस
                पाएं। अधिकतम ₹1,00,000 तक का लेन-देन।
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="text-base px-8"
                  onClick={() => onNavigate("auth")}
                  data-ocid="hero.primary_button"
                >
                  ऋण दें (Give Loan)
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base px-8 border-primary text-primary hover:bg-secondary"
                  onClick={() => onNavigate("auth")}
                  data-ocid="hero.secondary_button"
                >
                  ऋण लें (Take Loan)
                </Button>
              </div>
              <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>100% कानूनी रूप से सुरक्षित लेन-देन</span>
              </div>
            </motion.div>

            {/* Right Image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/assets/generated/hero-handshake.dim_600x400.jpg"
                  alt="Trusted P2P Lending"
                  className="w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-card rounded-xl p-4 shadow-lg border border-border">
                <p className="text-xs text-muted-foreground font-devanagari">
                  अधिकतम ऋण राशि
                </p>
                <p className="text-2xl font-bold text-primary">₹1,00,000</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold font-devanagari mb-2">
              हमारी विशेषताएं
            </h2>
            <p className="text-muted-foreground">Why choose RinaDost?</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-xl p-6 border border-border hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold font-devanagari mb-1">{f.title}</h3>
                <p className="text-xs text-muted-foreground mb-2">{f.sub}</p>
                <p className="text-sm text-muted-foreground font-devanagari">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold font-devanagari mb-4">अभी शुरू करें</h2>
          <p className="text-lg opacity-90 mb-8">
            Join thousands of trusted lenders and borrowers
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => onNavigate("auth")}
            data-ocid="cta.primary_button"
          >
            निःशुल्क पंजीकरण करें — Register Free
          </Button>
        </div>
      </section>
    </main>
  );
}
