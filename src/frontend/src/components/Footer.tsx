export function Footer() {
  const year = new Date().getFullYear();
  const utm = encodeURIComponent(window.location.hostname);
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${utm}`;

  return (
    <footer className="bg-[oklch(0.22_0_0)] text-[oklch(0.80_0_0)] mt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm text-[oklch(0.90_0_0)] font-semibold mb-1">
              LenDen Mokoko — Trusted P2P Lending Platform
            </p>
            <p className="text-xs">Secure. Simple. Legally Protected.</p>
          </div>
          <div className="flex gap-4 text-xs">
            <a href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="/contact" className="hover:text-white transition-colors">
              Contact Us
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
