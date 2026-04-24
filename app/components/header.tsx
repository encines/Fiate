"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="relative w-full bg-transparent text-white">
      <div className="flex items-center justify-between px-4 py-4">
        <Image
          src="/logo.png"
          alt="logo"
          width={100}
          height={100}
          className="h-20 w-auto"
        />
        <nav className="">
          <div className="hidden lg:flex gap-4 items-center">
            <Link href="/">Inicio</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contacto</Link>
            <Link
              href="/login"
              className="rounded bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-400"
            >
              Sign In
            </Link>
          </div>
        </nav>
        <button className="lg:hidden" onClick={toggleMenu}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="50"
            height="50"
            viewBox="0,0,256,256"
          >
            <g
              fill="#ff7400"
              fillRule="nonzero"
              stroke="none"
              strokeWidth="1"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              strokeMiterlimit="10"
              strokeDasharray=""
              strokeDashoffset="0"
              fontFamily="none"
              fontWeight="none"
              fontSize="none"
              style={{ mixBlendMode: "normal" }}
            >
              <g transform="scale(5.12,5.12)">
                <path d="M5,8c-0.72127,-0.0102 -1.39216,0.36875 -1.75578,0.99175c-0.36361,0.623 -0.36361,1.39351 0,2.01651c0.36361,0.623 1.0345,1.00195 1.75578,0.99175h40c0.72127,0.0102 1.39216,-0.36875 1.75578,-0.99175c0.36361,-0.623 0.36361,-1.39351 0,-2.01651c-0.36361,-0.623 -1.0345,-1.00195 -1.75578,-0.99175zM5,23c-0.72127,-0.0102 -1.39216,0.36875 -1.75578,0.99175c-0.36361,0.623 -0.36361,1.39351 0,2.01651c0.36361,0.623 1.0345,1.00195 1.75578,0.99175h40c0.72127,0.0102 1.39216,-0.36875 1.75578,-0.99175c0.36361,-0.623 0.36361,-1.39351 0,-2.01651c-0.36361,-0.623 -1.0345,-1.00195 -1.75578,-0.99175zM5,38c-0.72127,-0.0102 -1.39216,0.36875 -1.75578,0.99175c-0.36361,0.623 -0.36361,1.39351 0,2.01651c0.36361,0.623 1.0345,1.00195 1.75578,0.99175h40c0.72127,0.0102 1.39216,-0.36875 1.75578,-0.99175c0.36361,-0.623 0.36361,-1.39351 0,-2.01651c-0.36361,-0.623 -1.0345,-1.00195 -1.75578,-0.99175z"></path>
              </g>
            </g>
          </svg>
        </button>
      </div>

      {/* Menú móvil desplegable */}
      <nav
        className={`absolute top-full left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-700/50 transition-all duration-300 ease-in-out lg:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="flex flex-col gap-4 px-6 py-6">
          <Link
            href="/"
            className="text-white hover:text-orange-400 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Inicio
          </Link>
          <Link
            href="/about"
            className="text-white hover:text-orange-400 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-white hover:text-orange-400 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Contacto
          </Link>
          <Link
            href="/login"
            className="rounded bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-400 transition-colors text-center"
            onClick={() => setIsOpen(false)}
          >
            Sign In
          </Link>
        </div>
      </nav>
    </header>
  );
}
