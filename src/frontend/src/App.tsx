import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { AIAssistantPage } from "./pages/AIAssistantPage";
import { AdminWithdrawal } from "./pages/AdminWithdrawal";
import { AdvertisePage } from "./pages/AdvertisePage";
import { ApproveLoan } from "./pages/ApproveLoan";
import { AuthPage } from "./pages/AuthPage";
import { CreditScorePage } from "./pages/CreditScorePage";
import { Dashboard } from "./pages/Dashboard";
import { EmiCalculatorPage } from "./pages/EmiCalculatorPage";
import { LandingPage } from "./pages/LandingPage";
import { LegalDocuments } from "./pages/LegalDocuments";
import { LegalEscalation } from "./pages/LegalEscalation";
import { LoanHistoryPage } from "./pages/LoanHistoryPage";
import { LoanOffersPage } from "./pages/LoanOffersPage";
import { MakeRepayment } from "./pages/MakeRepayment";
import { MembershipPage } from "./pages/MembershipPage";
import { NewLoanRequest } from "./pages/NewLoanRequest";
import { PromissoryNote } from "./pages/PromissoryNote";
import { PromoPage } from "./pages/PromoPage";
import { ReferralPage } from "./pages/ReferralPage";
import { SupportPage } from "./pages/SupportPage";
import { TutorialPage } from "./pages/TutorialPage";
import { AppProvider, useApp } from "./store/appStore";

function AppContent() {
  const { currentUser } = useApp();
  const [page, setPage] = useState(currentUser ? "dashboard" : "landing");

  const navigate = (p: string) => {
    setPage(p);
    window.scrollTo(0, 0);
  };

  let loanId = "";
  if (page.startsWith("promissory-")) loanId = page.replace("promissory-", "");
  if (page.startsWith("legal-")) loanId = page.replace("legal-", "");

  const renderPage = () => {
    if (page === "support") return <SupportPage onNavigate={navigate} />;
    if (page === "advertise") return <AdvertisePage onNavigate={navigate} />;
    if (page === "tutorial") return <TutorialPage onNavigate={navigate} />;
    if (page === "promo") return <PromoPage onNavigate={navigate} />;

    if (!currentUser && page !== "landing" && page !== "auth") {
      return <LandingPage onNavigate={navigate} />;
    }
    switch (true) {
      case page === "landing":
        return <LandingPage onNavigate={navigate} />;
      case page === "auth":
        return <AuthPage onNavigate={navigate} />;
      case page === "dashboard":
        return <Dashboard onNavigate={navigate} />;
      case page === "new-loan":
        return <NewLoanRequest onNavigate={navigate} />;
      case page === "loan-requests":
        return <ApproveLoan onNavigate={navigate} />;
      case page === "active-loans":
        return <Dashboard onNavigate={navigate} />;
      case page === "repayment":
        return <MakeRepayment onNavigate={navigate} />;
      case page === "documents":
        return <Dashboard onNavigate={navigate} />;
      case page === "legal-docs":
        return <LegalDocuments onNavigate={navigate} />;
      case page === "admin-withdrawal":
        return <AdminWithdrawal onNavigate={navigate} />;
      case page === "membership":
        return <MembershipPage onNavigate={navigate} />;
      case page === "loan-offers":
        return <LoanOffersPage onNavigate={navigate} />;
      case page === "emi-calculator":
        return <EmiCalculatorPage onNavigate={navigate} />;
      case page === "credit-score":
        return <CreditScorePage onNavigate={navigate} />;
      case page === "ai-assistant":
        return <AIAssistantPage onNavigate={navigate} />;
      case page === "referral":
        return <ReferralPage onNavigate={navigate} />;
      case page === "loan-history":
        return <LoanHistoryPage onNavigate={navigate} />;
      case page.startsWith("promissory-"):
        return <PromissoryNote loanId={loanId} onNavigate={navigate} />;
      case page.startsWith("legal-"):
        return <LegalEscalation loanId={loanId} onNavigate={navigate} />;
      default:
        return <LandingPage onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar currentPage={page} onNavigate={navigate} />
      <div className="flex-1">{renderPage()}</div>
      <Footer onNavigate={navigate} />
      {currentUser && currentUser.role !== "admin" && (
        <>
          <button
            type="button"
            onClick={() => {
              const txt = encodeURIComponent(
                `LenDen Mokoko se loan lo - sirf 16 min mein! ₹1000 se ₹50 Lakh tak. Join karo: ${window.location.origin}`,
              );
              window.open(`https://wa.me/?text=${txt}`, "_blank");
            }}
            className="fixed bottom-6 right-24 z-50 w-14 h-14 rounded-full bg-green-600 hover:bg-green-500 text-white shadow-lg flex items-center justify-center text-2xl transition-transform hover:scale-110"
            title="Share on WhatsApp"
            data-ocid="whatsapp.open_modal_button"
          >
            💬
          </button>
          <button
            type="button"
            onClick={() => navigate("ai-assistant")}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-lg flex items-center justify-center text-2xl transition-transform hover:scale-110"
            title="AI Assistant"
            data-ocid="dashboard.secondary_button"
          >
            🤖
          </button>
        </>
      )}
      <Toaster richColors />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
