import { Button } from "@/components/ui/button";
import { LogOut, Menu, Shield, X } from "lucide-react";
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
  ];

  const handleLogout = () => {
    logout();
    onNavigate("landing");
  };

  return (
    <header className="sticky top-0 z-50 bg-card shadow-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          type="button"
          onClick={() => onNavigate(currentUser ? "dashboard" : "landing")}
          className="flex items-center gap-2 font-bold text-xl text-primary"
          data-ocid="nav.link"
        >
          <Shield className="w-7 h-7" />
          <span>LenDen Mokoko</span>
          <span className="text-sm font-normal text-muted-foreground hidden sm:block">
            P2P Lending
          </span>
        </button>

        {/* Desktop Nav */}
        {currentUser && (
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                type="button"
                key={link.page}
                onClick={() => onNavigate(link.page)}
                data-ocid="nav.link"
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  currentPage === link.page
                    ? "bg-secondary text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>
        )}

        {/* Right Side */}
        <div className="flex items-center gap-2">
          {currentUser ? (
            <>
              <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-primary font-semibold">
                  {currentUser.name.charAt(0)}
                </div>
                <span className="hidden md:block">{currentUser.name}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-muted-foreground"
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
              data-ocid="nav.primary_button"
            >
              Sign In
            </Button>
          )}

          {/* Mobile Menu Toggle */}
          {currentUser && (
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
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && currentUser && (
        <div className="md:hidden border-t border-border bg-card px-4 py-2">
          {navLinks.map((link) => (
            <button
              type="button"
              key={link.page}
              onClick={() => {
                onNavigate(link.page);
                setMenuOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentPage === link.page
                  ? "bg-secondary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
