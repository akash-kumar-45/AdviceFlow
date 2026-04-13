"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useStore, Advice } from "@/store/useStore";

export default function Home() {
  const [advice, setAdvice] = useState<Advice | null>(null);
  const [loading, setLoading] = useState(true);
  const { addFavorite, favorites, removeFavorite, addToast } = useStore();

  const fetchAdvice = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("https://api.adviceslip.com/advice?t=" + new Date().getTime());
      const data = await res.json();
      setAdvice(data.slip);
    } catch (error) {
      console.error("Error fetching advice", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdvice();
  }, [fetchAdvice]);

  const copyToClipboard = () => {
    if (advice) {
      navigator.clipboard.writeText(advice.advice);
      addToast({ message: "Copied to clipboard!" });
    }
  };

  const isFavorite = advice && favorites.some(f => f.id === advice.id);

  const toggleFavorite = () => {
    if (!advice) return;
    if (isFavorite) {
      removeFavorite(advice.id);
      addToast({
        message: "Advice removed from favorites",
        actionLabel: "Undo",
        onAction: () => addFavorite(advice)
      });
    } else {
      addFavorite(advice);
    }
  };

  return (
    <>
      <main className="relative overflow-hidden flex-1 flex flex-col">
        {/* Background Ambient Elements */}
        <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none">
          <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-primary/10 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-secondary/10 blur-[150px] rounded-full"></div>
        </div>

        <div className="max-w-screen-2xl mx-auto px-12 pt-20 pb-32 grid lg:grid-cols-12 gap-16 items-start w-full">
          {/* Left Content Area (Hero & Main Card) */}
          <section className="lg:col-span-8 flex flex-col gap-16 w-full z-10">
            <div className="max-w-3xl">
              <h1 className="font-headline text-6xl font-extrabold tracking-tight text-on-surface leading-[1.1] mb-6">
                Your Daily Dose of <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-tertiary to-secondary">Clarity</span>.
              </h1>
              <p className="text-xl text-on-surface-variant font-body leading-relaxed">
                Curating the web's most insightful wisdom to help you navigate life's complexities with perspective and calm.
              </p>
            </div>

            {/* Main Premium Advice Card */}
            <div className="group relative">
              <div className="bg-surface-container/70 backdrop-blur-[24px] rounded-xl p-12 relative overflow-hidden shadow-2xl border border-outline-variant/15 hover:bg-surface-bright transition-colors duration-500 ease-out-quint">
                <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-primary/10 to-transparent pointer-events-none"></div>
                <div className="relative z-10 flex flex-col gap-10">
                  <div className="flex flex-col gap-4 min-h-[140px] justify-center">
                    <div className="flex gap-2">
                      <span className="material-symbols-outlined text-primary text-4xl material-icon">format_quote</span>
                    </div>
                    {loading ? (
                      <div className="animate-pulse flex flex-col gap-3">
                        <div className="h-8 bg-surface-container-high rounded w-3/4"></div>
                        <div className="h-8 bg-surface-container-high rounded w-1/2"></div>
                      </div>
                    ) : (
                      <h2 className="text-3xl md:text-4xl font-headline font-bold leading-snug text-on-surface transition-opacity duration-500">
                        {advice?.advice}
                      </h2>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-6 pt-8 border-t border-outline-variant/15">
                    <button 
                      onClick={fetchAdvice}
                      disabled={loading}
                      className="bg-primary-container text-on-primary font-bold px-8 py-4 rounded-full flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(var(--color-primary-val),0.2)] disabled:opacity-70 disabled:hover:scale-100"
                    >
                      <span className={`material-symbols-outlined material-icon ${loading ? 'animate-spin' : ''}`}>
                        {loading ? 'refresh' : 'auto_awesome'}
                      </span>
                      Get New Advice
                    </button>
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={copyToClipboard}
                        className="w-14 h-14 rounded-full border border-outline-variant/20 flex items-center justify-center hover:bg-surface-container-high transition-colors group/btn"
                        title="Copy"
                      >
                        <span className="material-symbols-outlined text-on-surface-variant group-hover/btn:text-on-surface material-icon">content_copy</span>
                      </button>
                      <button 
                        onClick={toggleFavorite}
                        className={`w-14 h-14 rounded-full border border-outline-variant/20 flex items-center justify-center transition-colors group/btn ${isFavorite ? 'bg-primary/10 border-primary/30 text-primary' : 'hover:bg-surface-container-high'}`}
                        title="Favorite"
                      >
                        <span 
                          className="material-symbols-outlined material-icon"
                          style={isFavorite ? { fontVariationSettings: "'FILL' 1" } : { fontVariationSettings: "'FILL' 0" }}
                        >
                          favorite
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Bento Section */}
            <div className="grid md:grid-cols-2 gap-8">
              <Link href="/search" className="group bg-surface-container-low rounded-lg p-8 flex items-center justify-between hover:bg-surface-container-high transition-all duration-300">
                <div>
                  <h3 className="font-headline text-xl font-bold mb-2 text-on-surface">Explore the Archive</h3>
                  <p className="text-on-surface-variant text-sm">Search through thousands of curated insights.</p>
                </div>
                <span className="material-symbols-outlined text-secondary text-3xl group-hover:translate-x-2 transition-transform material-icon">arrow_forward</span>
              </Link>
              <Link href="/favorites" className="group bg-surface-container-low rounded-lg p-8 flex items-center justify-between hover:bg-surface-container-high transition-all duration-300">
                <div>
                  <h3 className="font-headline text-xl font-bold mb-2 text-on-surface">Your Saved Wisdom</h3>
                  <p className="text-on-surface-variant text-sm">Return to the advice that resonates most.</p>
                </div>
                <span className="material-symbols-outlined text-tertiary text-3xl group-hover:translate-x-2 transition-transform material-icon">arrow_forward</span>
              </Link>
            </div>
          </section>

          {/* Right Side (Daily Wisdom Widget) */}
          <aside className="lg:col-span-4 flex flex-col gap-8 sticky top-32 z-10 w-full">
            <div className="bg-surface-container-low rounded-lg p-8 border border-outline-variant/10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary material-icon">lightbulb</span>
                </div>
                <div>
                  <h4 className="font-headline font-bold text-lg text-on-surface">Daily Wisdom</h4>
                  <p className="text-xs text-on-surface-variant font-medium">The Digital Obsidian Insights</p>
                </div>
              </div>
              <div className="space-y-6">
                {/* Simulated content from original design */}
                <div className="p-4 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer group">
                  <span className="text-[10px] uppercase tracking-widest text-secondary font-bold mb-2 block">Mindset</span>
                  <p className="text-sm font-medium leading-relaxed mb-3 text-on-surface group-hover:text-primary transition-colors">How to maintain focus in a world of infinite noise.</p>
                  <div className="flex items-center gap-2 text-[10px] text-on-surface-variant">
                    <span className="material-symbols-outlined text-xs material-icon">trending_up</span> 1.2k readers
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer group">
                  <span className="text-[10px] uppercase tracking-widest text-primary font-bold mb-2 block">Productivity</span>
                  <p className="text-sm font-medium leading-relaxed mb-3 text-on-surface group-hover:text-secondary transition-colors">The art of saying 'no' to good things to say 'yes' to great things.</p>
                  <div className="flex items-center gap-2 text-[10px] text-on-surface-variant">
                    <span className="material-symbols-outlined text-xs material-icon">schedule</span> 5 min read
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer group">
                  <span className="text-[10px] uppercase tracking-widest text-tertiary font-bold mb-2 block">Philosophy</span>
                  <p className="text-sm font-medium leading-relaxed mb-3 text-on-surface group-hover:text-tertiary transition-colors">Stoicism for the digital age: Navigating modern stress.</p>
                  <div className="flex items-center gap-2 text-[10px] text-on-surface-variant">
                    <span className="material-symbols-outlined text-xs material-icon">bookmark</span> Featured
                  </div>
                </div>
              </div>
              <button className="w-full mt-8 py-4 text-sm font-bold text-on-surface-variant hover:text-on-surface border border-outline-variant/20 rounded-full transition-all hover:bg-surface-container">
                View All Insights
              </button>
            </div>
            
            <div className="relative h-48 rounded-lg overflow-hidden group">
              <img alt="Scenic mountain landscape" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCW-ejxrNo-tmbEnZ98Xz73iXM5s4hMV21tyTTwE0mkf_Xib30gHQwamjoKq0qajB_bNpi2y-ViVXMJu-cDbKpNtPJL5IzHOxFfBgS3scHIA9uhgdo9cTfq_4Wm00NWuoMPHaOXvkceS9z5ZYKngFVR6xX4ybRoy6EILlvx079UASjkuVlU2INqJiunnLSPJRoy6FZrFaLOhsaKOHHvHcOtGr37nBjFR7czH8Dy_siDxGtayRARoFBttvTl4GRBblHI0Sah3bQPOn0" />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-lowest to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-xs font-bold text-secondary uppercase tracking-widest mb-1">Weekly Digest</p>
                <p className="font-headline font-bold text-on-secondary-container">The Silent Power of Stillness</p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
