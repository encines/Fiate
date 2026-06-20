"use client";

import Header from "./header";
import Footer from "./footer";
import { legalContent, type LegalDoc } from "@/lib/legal-content";

export default function LegalDocumentPage({ doc }: { doc: LegalDoc }) {
  const content = legalContent[doc];

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-500">
      <Header />

      <article className="mx-auto max-w-3xl px-6 pt-40 pb-24 lg:pt-48">
        <header className="mb-16 space-y-4">
          <h1 className="text-4xl font-medium tracking-tight text-zinc-900 dark:text-white sm:text-6xl">
            {content.titleLine1} <br />
            <span className="text-orange-500 italic font-black">{content.titleAccent}</span>
          </h1>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-400">
            {content.updated}
          </p>
        </header>

        <div className="prose prose-zinc dark:prose-invert max-w-none space-y-12 text-zinc-600 dark:text-zinc-400 leading-relaxed">
          {content.blocks.map((block) => (
            <section key={block.heading ?? block.body.slice(0, 40)} className="space-y-4">
              {block.heading ? (
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white uppercase tracking-widest text-[11px]">
                  {block.heading}
                </h2>
              ) : null}
              <p>{block.body}</p>
            </section>
          ))}
        </div>
      </article>

      <Footer />
    </main>
  );
}
