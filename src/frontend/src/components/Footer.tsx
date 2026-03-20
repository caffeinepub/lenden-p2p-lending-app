interface FooterProps {
  onNavigate?: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const year = new Date().getFullYear();
  const utm = encodeURIComponent(window.location.hostname);
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${utm}`;

  const nav = (page: string) => {
    if (onNavigate) onNavigate(page);
  };

  return (
    <footer className="bg-[oklch(0.22_0_0)] text-[oklch(0.80_0_0)] mt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div>
            <p className="text-sm text-[oklch(0.90_0_0)] font-semibold mb-1">
              LenDen Mokoko — Trusted P2P Lending Platform
            </p>
            <p className="text-xs">Secure. Simple. Legally Protected.</p>
            <p className="text-xs mt-2">
              <a
                href="tel:7814873372"
                className="hover:text-white transition-colors"
              >
                📞 7814873372
              </a>
            </p>
          </div>
          <div className="flex flex-col gap-2 text-xs">
            <p className="text-[oklch(0.60_0_0)] uppercase tracking-wide text-xs font-semibold">
              Quick Links
            </p>
            <button
              type="button"
              onClick={() => nav("support")}
              className="hover:text-white transition-colors text-left"
              data-ocid="footer.link"
            >
              🎧 Support / सहायता
            </button>
            <button
              type="button"
              onClick={() => nav("advertise")}
              className="hover:text-white transition-colors text-left"
              data-ocid="footer.link"
            >
              📢 Advertise With Us
            </button>
            <button
              type="button"
              onClick={() => nav("loan-offers")}
              className="hover:text-white transition-colors text-left"
              data-ocid="footer.link"
            >
              💰 Loan Offers
            </button>
          </div>
          <div className="flex flex-col gap-2 text-xs">
            <p className="text-[oklch(0.60_0_0)] uppercase tracking-wide text-xs font-semibold">
              Legal
            </p>
            <a href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-[oklch(0.35_0_0)] text-xs text-center">
          © {year}. Built with ❤️ using{" "}
          <a
            href={caffeineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-white transition-colors"
          >
            caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
