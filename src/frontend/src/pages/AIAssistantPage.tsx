import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Bot, Send, User } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface AIAssistantPageProps {
  onNavigate: (page: string) => void;
}

interface Message {
  id: string;
  role: "user" | "bot";
  text: string;
}

const FAQ_CHIPS = [
  "Loan kaise lein?",
  "Fees kya hain?",
  "Interest rate?",
  "Loan limit?",
  "Repayment kaise karein?",
  "Legal action?",
  "Premium membership?",
  "Admin kaun hai?",
];

function getBotResponse(query: string): string {
  const q = query.toLowerCase();
  if (
    q.includes("loan") &&
    (q.includes("kaise") ||
      q.includes("how") ||
      q.includes("lein") ||
      q.includes("le "))
  ) {
    return `📋 Loan kaise lein / How to take a loan:\n\n1. Register karo aur Rs.1 entry fee pay karo (UPI se)\n2. Dashboard pe jaao → "Request a Loan" click karo\n3. Amount (Rs.1,000 – Rs.50,00,000), purpose, duration bharo\n4. Request submit karo — 16 minutes mein approval milta hai! ⚡\n5. Loan approve hone ke baad net amount aapke account mein aa jaata hai\n\n✅ Sab users loan le bhi sakte hain aur de bhi sakte hain!`;
  }
  if (
    q.includes("fee") ||
    q.includes("charge") ||
    q.includes("paisa") ||
    (q.includes("kya") && q.includes("hai"))
  ) {
    return "💰 Fees / Charges:\n\n• Entry Fee: Rs.1 (registration pe ek baar)\n• Exit Fee: Rs.1 (loan band hone pe)\n• Commission: 7% of loan amount (har loan pe)\n• Premium Membership: Rs.9/week, Rs.99/month, Rs.499/year\n\nSaari fees admin ke UPI: barkat.6y@ptyes";
  }
  if (
    q.includes("interest") ||
    q.includes("byaj") ||
    q.includes("rate") ||
    q.includes("%")
  ) {
    return "📊 Interest Rate / Byaj Dar:\n\n• Default rate: 5% per annum (per saal)\n• Aap loan request karte waqt rate change kar sakte hain\n\nExample: Rs.10,000 ka loan 12 months ke liye 5% pe → Monthly EMI ≈ Rs.856";
  }
  if (
    q.includes("limit") ||
    q.includes("maximum") ||
    q.includes("minimum") ||
    q.includes("lakh") ||
    q.includes("amount")
  ) {
    return "💵 Loan Limit:\n\n• Minimum: Rs.1,000\n• Maximum: Rs.50,00,000 (50 Lakh)\n\n⚡ Instant Approval: Sirf 16 minutes mein loan approve ho jaata hai!";
  }
  if (
    q.includes("repay") ||
    q.includes("payment") ||
    q.includes("emi") ||
    q.includes("kisht")
  ) {
    return `🔄 Repayment / Loan Wapas Karna:\n\n1. Dashboard pe jaao → "Make a Payment" click karo\n2. Loan select karo\n3. Amount bharo (EMI ya part payment)\n4. UPI QR code scan karo: barkat.6y@ptyes\n5. UTR number enter karo — payment record ho jaayega\n\n📅 Monthly EMI miss mat karo!`;
  }
  if (q.includes("legal") || q.includes("action") || q.includes("default")) {
    return `⚖️ Legal Action:\n\nAgar borrower loan wapas nahi karta:\n\n1. Lender "Legal Documents" page pe jaata hai\n2. Loan select karo → "Initiate Legal Action"\n3. Section 138 NI Act ke under notice generate hoti hai\n4. Status: Normal → Warning → Legal Pending → Action Initiated\n\n⚠️ Cheque bounce ka case — court mein 2 saal jail ya fine`;
  }
  if (
    q.includes("premium") ||
    q.includes("membership") ||
    q.includes("member")
  ) {
    return "👑 Premium Membership:\n\n• Weekly: Rs.9/week\n• Monthly: Rs.99/month\n• Yearly: Rs.499/year (Save 58% vs Monthly!)\n\nBenefits: Higher loan priority, Premium badge, Better visibility\n\n💳 Payment: UPI barkat.6y@ptyes";
  }
  if (
    q.includes("admin") ||
    q.includes("owner") ||
    q.includes("contact") ||
    q.includes("barkat")
  ) {
    return "👤 Admin / Platform Owner:\n\n• Name: Barkat\n• Phone: 7814873372\n• WhatsApp: 7814873372\n• UPI ID: barkat.6y@ptyes\n\nSaari fees directly admin ke UPI mein jaati hain.";
  }
  if (
    q.includes("hello") ||
    q.includes("hi") ||
    q.includes("namaste") ||
    q.includes("hey")
  ) {
    return "🙏 Namaste! LenDen Mokoko Assistant mein aapka swagat hai!\n\nMain aapki help kar sakta hoon:\n• Loan lene/dene ke baare mein\n• Fees aur charges\n• Repayment process\n• Legal documents\n• Premium membership\n\nNeechey FAQ chips click karein ya apna sawal type karein!";
  }
  return `🤖 Main samjha nahi. Please in topics mein se choose karein:\n\n• "Loan kaise lein?"\n• "Fees kya hain?"\n• "Interest rate?"\n• "Loan limit?"\n• "Repayment kaise karein?"\n• "Legal action?"\n• "Premium membership?"\n• "Admin kaun hai?"`;
}

export function AIAssistantPage({ onNavigate }: AIAssistantPageProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "bot",
      text: "🙏 Namaste! Main LenDen Mokoko ka AI Assistant hoon!\n\nMujhse poochhein:\n• Loan kaise lein ya dein\n• Fees aur charges\n• Interest rates\n• Repayment process\n• Legal action information\n• Premium membership details\n\nNeechey FAQ chips click karein ya apna sawal type karein! 😊",
    },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: `u-${Date.now()}`, role: "user", text };
    const botMsg: Message = {
      id: `b-${Date.now()}`,
      role: "bot",
      text: getBotResponse(text),
    };
    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate("dashboard")}
            data-ocid="ai_assistant.secondary_button"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-xl">
              🤖
            </div>
            <div>
              <h1 className="text-xl font-bold">AI Assistant</h1>
              <p className="text-xs text-muted-foreground">
                LenDen Mokoko Helper • Online
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {FAQ_CHIPS.map((chip) => (
            <button
              type="button"
              key={chip}
              onClick={() => sendMessage(chip)}
              className="text-xs px-3 py-1.5 rounded-full border border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors"
              data-ocid="ai_assistant.secondary_button"
            >
              {chip}
            </button>
          ))}
        </div>

        <Card className="mb-4 shadow-md">
          <CardHeader className="pb-2 border-b">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <Bot className="w-4 h-4 text-purple-600" /> Chat History
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[400px] p-4">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex gap-2 mb-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === "bot" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}
                    >
                      {msg.role === "bot" ? (
                        <span className="text-base">🤖</span>
                      ) : (
                        <User className="w-4 h-4" />
                      )}
                    </div>
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${msg.role === "bot" ? "bg-muted text-foreground rounded-tl-sm" : "bg-purple-600 text-white rounded-tr-sm"}`}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={bottomRef} />
            </ScrollArea>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Apna sawal type karein... / Type your question..."
            className="flex-1"
            data-ocid="ai_assistant.input"
          />
          <Button
            type="submit"
            disabled={!input.trim()}
            className="bg-purple-600 hover:bg-purple-700 text-white"
            data-ocid="ai_assistant.submit_button"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          ⚠️ Rule-based assistant. Real transactions ke liye: 7814873372
        </p>
      </motion.div>
    </main>
  );
}
