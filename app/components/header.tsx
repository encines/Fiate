import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full h-16 bg-gray-800 text-white flex items-center justify-between px-4">
      <h1 className="text-xl font-bold">My App Header</h1>
      <nav>
        <ul className="flex items-center gap-4">
          <li>
            <a href="#" className="hover:underline">
              Home
            </a>
          </li>
          <li>
            <a href="#" className="hover:underline">
              About
            </a>
          </li>
          <li>
            <a href="#" className="hover:underline">
              Contact
            </a>
          </li>
          <li>
            <Link
              href="/login"
              className="rounded bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-600"
            >
              Sign In
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
