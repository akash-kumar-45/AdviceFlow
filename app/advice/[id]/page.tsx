"use client";

import { useState, useEffect, useCallback, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore, Advice } from "@/store/useStore";

export default function AdviceDetail({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  
  const [advice, setAdvice] = useState<Advice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  const { addFavorite, favorites, removeFavorite, addToast } = useStore();

  const fetchAdvice = useCallback(async (slipId: string) => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`https://api.adviceslip.com/advice/${slipId}`);
      const data = await res.json();
      if (data.slip) {
        setAdvice(data.slip);
      } else {
        setError(true);
        setAdvice(null);
      }
    } catch (error) {
      console.error("Error fetching advice", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdvice(id);
  }, [id, fetchAdvice]);

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
      <main className="flex-grow flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
        {/* Ambient Light Accents */}
        <div className="absolute top-1/4 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 -right-24 w-96 h-96 bg-secondary/5 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="w-full max-w-4xl flex flex-col gap-12">
          {/* Navigation Action Row */}
          <div className="flex items-center justify-between w-full">
            <button onClick={() => router.back()} className="group flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors duration-300">
              <span className="material-symbols-outlined material-icon text-xl group-hover:-translate-x-1 transition-transform ease-out-quint">arrow_back</span>
              <span className="font-headline text-sm uppercase tracking-widest">Back</span>
            </button>
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container-high/50 border border-outline-variant/10">
              <span className={`w-2 h-2 rounded-full ${loading ? 'bg-secondary animate-pulse' : error ? 'bg-error' : 'bg-primary animate-pulse'}`}></span>
              <span className="text-xs font-bold font-headline uppercase tracking-tighter text-on-surface-variant">
                {loading ? 'Fetching...' : error ? 'Error' : `Active Slip #${advice?.id}`}
              </span>
            </div>
          </div>

          {loading ? (
            <div className="relative group min-h-[400px]">
              <div className="bg-surface-container/60 backdrop-blur-[24px] rounded-xl p-12 md:p-20 relative z-10 border border-outline-variant/10 shadow-2xl overflow-hidden flex flex-col items-center text-center">
                 <div className="animate-pulse flex flex-col items-center w-full min-h-[150px]">
                   <div className="h-10 bg-surface-container-high rounded w-3/4 mb-4"></div>
                   <div className="h-10 bg-surface-container-high rounded w-1/2"></div>
                 </div>
              </div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center p-12 bg-surface-container/60 backdrop-blur-[24px] rounded-xl border border-error/20">
              <span className="material-symbols-outlined material-icon text-error text-6xl mb-6">warning</span>
              <h2 className="font-headline text-2xl font-bold text-on-surface mb-2">Slip Not Found</h2>
              <p className="text-on-surface-variant mb-8 text-center max-w-md">The advice ID you are looking for has faded into the void. Try searching for a fresh perspective.</p>
              <Link href="/" className="px-8 py-3 rounded-full bg-surface-container-highest text-on-surface border border-outline-variant/20 hover:bg-surface-bright transition-colors">
                Return to Home
              </Link>
            </div>
          ) : (
            <>
              {/* Main Advice Canvas */}
              <div className="relative group">
                <div className="bg-surface-container/60 backdrop-blur-[24px] rounded-xl p-12 md:p-20 relative z-10 border border-outline-variant/10 shadow-2xl overflow-hidden flex flex-col items-center text-center">
                  <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-700"></div>
                  <span className="material-symbols-outlined material-icon text-primary/40 text-6xl mb-8">format_quote</span>
                  <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-on-surface leading-tight mb-12 max-w-2xl">
                    {advice?.advice}
                  </h1>
                  
                  {/* Action Tray */}
                  <div className="flex flex-wrap justify-center gap-4">
                    <button 
                      onClick={toggleFavorite}
                      className={`flex items-center gap-3 px-6 py-3 rounded-full font-bold hover:scale-[1.05] active:scale-[0.98] transition-all duration-300 ease-out-quint ${
                        isFavorite 
                          ? 'bg-primary-container text-on-primary-container shadow-[0_0_15px_rgba(var(--color-primary-val),0.2)]' 
                          : 'bg-transparent border border-outline-variant/20 text-on-surface hover:bg-surface-bright/50'
                      }`}
                    >
                      <span 
                        className="material-symbols-outlined material-icon"
                        style={isFavorite ? { fontVariationSettings: "'FILL' 1" } : { fontVariationSettings: "'FILL' 0" }}
                      >
                        favorite
                      </span>
                      <span className="text-sm font-headline uppercase tracking-tight">Favorite</span>
                    </button>
                    <button onClick={copyToClipboard} className="flex items-center gap-3 px-6 py-3 rounded-full bg-transparent border border-outline-variant/20 text-on-surface hover:bg-surface-bright/50 transition-all duration-300">
                      <span className="material-symbols-outlined material-icon">content_copy</span>
                      <span className="text-sm font-headline uppercase tracking-tight">Copy</span>
                    </button>
                  </div>
                </div>

                {/* Floating Pagination Handles */}
                <div className="absolute inset-y-0 -left-6 md:-left-12 flex items-center z-20">
                  <Link href={`/advice/${parseInt(id) - 1}`} className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-surface-bright flex items-center justify-center shadow-xl border border-outline-variant/30 text-primary hover:scale-110 active:scale-95 transition-all duration-300 group/btn">
                    <span className="material-symbols-outlined material-icon group-hover/btn:-translate-x-1 transition-transform">chevron_left</span>
                  </Link>
                </div>
                <div className="absolute inset-y-0 -right-6 md:-right-12 flex items-center z-20">
                  <Link href={`/advice/${parseInt(id) + 1}`} className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-surface-bright flex items-center justify-center shadow-xl border border-outline-variant/30 text-primary hover:scale-110 active:scale-95 transition-all duration-300 group/btn">
                    <span className="material-symbols-outlined material-icon group-hover/btn:translate-x-1 transition-transform">chevron_right</span>
                  </Link>
                </div>
              </div>

              {/* Secondary Context Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-surface-container/60 backdrop-blur-[24px] rounded-lg p-8 border border-outline-variant/5">
                  <h3 className="font-headline text-sm uppercase tracking-widest text-primary mb-4">The Philosophy</h3>
                  <p className="text-on-surface-variant leading-relaxed text-lg">
                    This advice emphasizes adaptability and the importance of looking at situations differently. In the Digital Obsidian, movement isn't always linear. When the primary path feels obstructed, embracing lateral thinking often unveils the most innovative flow.
                  </p>
                </div>
                <div className="bg-surface-container/60 backdrop-blur-[24px] rounded-lg p-8 border border-outline-variant/5 flex flex-col justify-center items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-secondary-container/30 flex items-center justify-center text-secondary mb-4">
                    <span className="material-symbols-outlined material-icon">trending_up</span>
                  </div>
                  <div className="text-2xl font-black text-on-surface">98%</div>
                  <div className="text-xs uppercase tracking-tighter text-on-surface-variant font-headline">Relevance Score</div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
