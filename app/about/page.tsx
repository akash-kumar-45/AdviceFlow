"use client";

import Link from "next/link";

export default function About() {
  return (
    <>
      <main className="relative overflow-hidden flex-1 flex flex-col items-center">
        {/* Background Ambient Elements */}
        <div className="absolute top-0 right-0 w-full h-full -z-10 pointer-events-none overflow-hidden">
          <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-tertiary/10 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[20%] right-[10%] w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full"></div>
        </div>

        <section className="w-full max-w-4xl px-8 md:px-12 pt-16 pb-32 flex flex-col gap-12">
          {/* Header */}
          <div className="max-w-2xl text-center mx-auto mb-12">
            <h1 className="font-headline text-5xl md:text-6xl font-extrabold tracking-tight text-on-surface mb-6">
              The Digital Obsidian.
            </h1>
            <p className="text-xl text-on-surface-variant leading-relaxed">
              AdviceFlow is built on the philosophy that wisdom should be an environment, not just a utility.
            </p>
          </div>

          <div className="bg-surface-container/60 backdrop-blur-md rounded-3xl p-10 md:p-16 border border-outline-variant/10 shadow-lg relative overflow-hidden">
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col gap-8">
              <div>
                <h2 className="text-2xl font-headline font-bold text-primary mb-4">Our Mission</h2>
                <p className="text-lg text-on-surface-variant leading-relaxed">
                  In an era of infinite noise, we believe in the power of pure signal. AdviceFlow exists to curate the web's most insightful wisdom and deliver it in an interface that fosters calm, focus, and reflection.
                </p>
              </div>

              <div className="w-full h-px bg-outline-variant/20"></div>

              <div>
                <h2 className="text-2xl font-headline font-bold text-secondary mb-4">The Design System</h2>
                <p className="text-lg text-on-surface-variant leading-relaxed">
                  Inspired by carved volcanic glass floating in a weightless void, our design breaks the traditional "template" look. We utilize intentional asymmetry, tonal layering, and generous breathing room to create an editorial experience that feels premium and authoritative.
                </p>
              </div>
              
              <div className="w-full h-px bg-outline-variant/20"></div>

              <div>
                <h2 className="text-2xl font-headline font-bold text-tertiary mb-4">Technology Stack</h2>
                <p className="text-lg text-on-surface-variant leading-relaxed">
                  Powered by Next.js App Router, React, Tailwind CSS v4, and Zustand. The advice dataset is generously provided by the <a href="https://api.adviceslip.com/" target="_blank" rel="noopener noreferrer" className="text-on-surface hover:underline">Advice Slip JSON API</a>.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
