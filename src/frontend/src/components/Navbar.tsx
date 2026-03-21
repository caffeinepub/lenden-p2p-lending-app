import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Calculator,
  CheckCircle2,
  LogOut,
  Megaphone,
  Menu,
  Phone,
  X,
} from "lucide-react";
import { useState } from "react";
import { useApp } from "../store/appStore";

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const { currentUser, logout } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: "Dashboard", page: "dashboard" },
    { label: "Active Loans", page: "active-loans" },
    { label: "Loan Requests", page: "loan-requests" },
    { label: "Repayment", page: "repayment" },
    { label: "Documents", page: "documents" },
    { label: "Loan Offers 🎯", page: "loan-offers" },
    { label: "EMI Calculator", page: "emi-calculator" },
  ];

  const publicLinks = [
    { label: "Guide", page: "tutorial", icon: BookOpen },
    { label: "Support", page: "support", icon: Phone },
    { label: "Advertise", page: "advertise", icon: Megaphone },
  ];

  const handleLogout = () => {
    logout();
    onNavigate("landing");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border shadow-[0_2px_16px_0_oklch(0_0_0/0.08)] bg-gradient-to-r from-card via-card to-secondary/30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          type="button"
          onClick={() => onNavigate(currentUser ? "dashboard" : "landing")}
          className="flex items-center gap-2 font-bold text-xl text-primary"
          data-ocid="nav.link"
        >
          <img
            src="/assets/uploads/9eda8bfb2a14fe620ceb9f611029168c-1.jpg"
            alt="HOJS"
            className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/20"
          />
          <span className="bg-gradient-to-r from-primary to-[oklch(0.55_0.20_25)] bg-clip-text text-transparent">
            LenDen Mokoko 🍁
          </span>
          <span className="text-sm font-normal text-muted-foreground hidden sm:block">
            P2P Lending
          </span>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {currentUser &&
            navLinks.map((link) => (
              <button
                type="button"
                key={link.page}
                onClick={() => onNavigate(link.page)}
                data-ocid="nav.link"
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                  currentPage === link.page
                    ? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </button>
            ))}
          {publicLinks.map((link) => (
            <button
              type="button"
              key={link.page}
              onClick={() => onNavigate(link.page)}
              data-ocid="nav.link"
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                currentPage === link.page
                  ? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <link.icon className="w-3.5 h-3.5" />
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          {currentUser ? (
            <>
              <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                {/* Avatar with verified badge */}
                <div className="relative">
                  <img
                    src="/assets/uploads/618c28246b20dafbfa0fa7a0289d1fe4-1-2.jpg"
                    alt="Profile"
                    className="w-9 h-9 rounded-full object-cover border-2 border-primary/30 shadow-sm"
                  />
                  {/* Red verified badge */}
                  <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 border-2 border-card flex items-center justify-center">
                    <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                  </span>
                </div>
                <span className="hidden md:block font-medium text-foreground">
                  {currentUser.name}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                data-ocid="nav.link"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:block ml-1">Logout</span>
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              onClick={() => onNavigate("auth")}
              className="shadow-sm"
              data-ocid="nav.primary_button"
            >
              Sign In
            </Button>
          )}

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-card/95 backdrop-blur-sm px-4 py-2 shadow-lg">
          {currentUser &&
            navLinks.map((link) => (
              <button
                type="button"
                key={link.page}
                onClick={() => {
                  onNavigate(link.page);
                  setMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === link.page
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </button>
            ))}
          {publicLinks.map((link) => (
            <button
              type="button"
              key={link.page}
              onClick={() => {
                onNavigate(link.page);
                setMenuOpen(false);
              }}
              className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentPage === link.page
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <link.icon className="w-3.5 h-3.5" />
              {link.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
