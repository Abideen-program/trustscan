import Link from "next/link";
import { Shield } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full border-t border-white/5 bg-slate-950/40 py-8 mt-auto">
      <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col items-center md:items-start gap-1">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-violet-400/80" />
            <span className="font-outfit font-semibold text-sm text-slate-300">
              TrustScan
            </span>
          </div>
          <p className="text-xs text-slate-500 text-center md:text-left mt-1">
            AI scam detection support system. Respects user privacy. Original
            inputs are never stored.
          </p>
        </div>

        <div className="flex items-center gap-6 text-xs text-slate-400 font-medium">
          <Link href="/about" className="hover:text-white transition-colors">
            Privacy Policy
          </Link>
          <Link href="/about" className="hover:text-white transition-colors">
            Disclaimer
          </Link>
          <span className="text-slate-600">|</span>
          <span className="text-slate-500">© 2026 TrustScan</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
