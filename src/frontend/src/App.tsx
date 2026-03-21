import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
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
import { LoanOffersPage } from "./pages/LoanOffersPage";
import { MakeRepayment } from "./pages/MakeRepayment";
import { MembershipPage } from "./pages/MembershipPage";
import { NewLoanRequest } from "./pages/NewLoanRequest";
import { PromissoryNote } from "./pages/PromissoryNote";
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
    // Public pages accessible without login
    if (page === "support") return <SupportPage onNavigate={navigate} />;
    if (page === "advertise") return <AdvertisePage onNavigate={navigate} />;
    if (page === "tutorial") return <TutorialPage onNavigate={navigate} />;

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
