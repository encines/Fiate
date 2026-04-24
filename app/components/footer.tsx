export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white">
      <div className="mx-auto max-w-5xl px-4 py-8 lg:px-6 lg:py-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="text-center md:text-left">
            <span className="text-sm md:text-base">Copyright 2025. Fiate</span>
          </div>

          <nav className="text-center md:text-right">
            <ul className="flex flex-col gap-3 md:flex-row md:gap-6">
              <li>
                <a
                  href="/privacy-policy"
                  className="text-gray-300 hover:text-orange-400 transition-colors text-sm md:text-base"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms-of-service"
                  className="text-gray-300 hover:text-orange-400 transition-colors text-sm md:text-base"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="/contact-support"
                  className="text-gray-300 hover:text-orange-400 transition-colors text-sm md:text-base"
                >
                  Contact Support
                </a>
              </li>
              <li>
                <a
                  href="/api-documentation"
                  className="text-gray-300 hover:text-orange-400 transition-colors text-sm md:text-base"
                >
                  API Documentation
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
