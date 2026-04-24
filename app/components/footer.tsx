export default function Footer() {
  return (
    <div className="flex justify-between bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-16 ">
      <span className="text-white mx-10">Copyright 2025. Fiate</span>
      <nav className="flex ">
        <ul className="flex text-gray-300">
          <li className="mx-10 text-gray-300">
            <a href="/privacy-policy" className="hover:text-orange-400">
              Privacy Policy
            </a>
          </li>
          <li className="mx-10 text-gray-300">
            <a href="/terms-of-service" className="hover:text-orange-400">
              Terms of Service
            </a>
          </li>
          <li className="mx-10 text-gray-300">
            <a href="/contact-support" className="hover:text-orange-400">
              Contact Support
            </a>
          </li>
          <li className="mx-10 text-gray-300">
            <a href="/api-documentation" className="hover:text-orange-400">
              API Documentation
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}
