"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { AdviceCard } from "@/components/AdviceCard";
import { useStore, Advice } from "@/store/useStore";

interface TrendingAdvice extends Advice {
  favoriteCount: number;
}

export default function TrendingPage() {
  const [trendingItems, setTrendingItems] = useState<TrendingAdvice[]>([]);
  const [loading, setLoading] = useState(true);
  const { favorites, addFavorite, removeFavorite, addToast } = useStore();

  const fetchTrending = useCallback(async (existingItems: TrendingAdvice[] = []) => {
    try {
      if (existingItems.length === 0) setLoading(true);
      
      const res = await fetch("https://api.adviceslip.com/advice/search/e");
      const data = await res.json();
      
      if (data.slips && data.slips.length > 0) {
        let finalItems: TrendingAdvice[] = [];

        if (existingItems.length > 0) {
          // Evolution logic
          // 1. Keep most items
          const itemsToKeep = [...existingItems];
          
          // 2. Identify indices to replace (2-3 items)
          const numToReplace = Math.floor(Math.random() * 2) + 2; // 2 or 3
          const indicesToReplace = new Set<number>();
          while(indicesToReplace.size < numToReplace) {
             const idx = Math.floor(Math.random() * itemsToKeep.length);
             // Try to keep featured (0,1,2) mostly stable, so lower chance to pick them
             if (idx < 3 && Math.random() > 0.2) continue; 
             indicesToReplace.add(idx);
          }

          // 3. Get new slips that aren't already in trending
          const existingIds = new Set(itemsToKeep.map(i => i.id));
          const availableNewSlips = data.slips.filter((s: any) => !existingIds.has(s.id));
          const shuffledNew = availableNewSlips.sort(() => 0.5 - Math.random());

          // 4. Update items
          indicesToReplace.forEach((idx, i) => {
            if (shuffledNew[i]) {
              itemsToKeep[idx] = {
                id: shuffledNew[i].id,
                advice: shuffledNew[i].advice,
                favoriteCount: Math.floor(Math.random() * (5000 - 100 + 1)) + 100
              };
            }
          });

          // 5. Slightly adjust likes for some cards (e.g. 4-6 cards)
          const numToAdjust = Math.floor(Math.random() * 3) + 4;
          for (let i = 0; i < numToAdjust; i++) {
            const idx = Math.floor(Math.random() * itemsToKeep.length);
            const adjustment = Math.floor(Math.random() * 101) - 50; // -50 to +50
            itemsToKeep[idx].favoriteCount = Math.max(100, itemsToKeep[idx].favoriteCount + adjustment);
          }

          // 6. Resort
          finalItems = itemsToKeep.sort((a, b) => b.favoriteCount - a.favoriteCount);
        } else {
          // Initial load
          const shuffled = [...data.slips].sort(() => 0.5 - Math.random());
          const selected = shuffled.slice(0, 12);
          finalItems = selected.map((slip: any) => ({
            id: slip.id,
            advice: slip.advice,
            favoriteCount: Math.floor(Math.random() * (5000 - 100 + 1)) + 100
          })).sort((a, b) => b.favoriteCount - a.favoriteCount);
        }
        
        setTrendingItems(finalItems);
        sessionStorage.setItem("adviceflow-trending", JSON.stringify(finalItems));
      }
    } catch (err) {
      console.error("Failed to fetch trending:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const stored = sessionStorage.getItem("adviceflow-trending");
    if (stored) {
      const parsed = JSON.parse(stored);
      setTrendingItems(parsed);
      setLoading(false);
      // Even if stored, we trigger a slight evolution update in the background
      // but we do it after a small delay to make it feel "real"
      const timer = setTimeout(() => {
        fetchTrending(parsed);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      fetchTrending();
    }
  }, [fetchTrending]);

  const featured = trendingItems.slice(0, 3);
  const remaining = trendingItems.slice(3);

  const FeaturedCard = ({ item }: { item: TrendingAdvice }) => {
    const isFavorite = favorites.some((f) => f.id === item.id);

    const toggleFavorite = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (isFavorite) {
        removeFavorite(item.id);
        addToast({
          message: "Advice removed from favorites",
          actionLabel: "Undo",
          onAction: () => addFavorite({ id: item.id, advice: item.advice })
        });
      } else {
        addFavorite({ id: item.id, advice: item.advice });
      }
    };

    const copyToClipboard = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      navigator.clipboard.writeText(item.advice);
      addToast({ message: "Copied to clipboard!" });
    };

    return (
      <Link 
        href={`/advice/${item.id}`}
        className="group relative bg-surface-container/70 backdrop-blur-md p-8 rounded-xl border border-outline-variant/15 hover:border-primary/40 transition-all duration-500 hover:-translate-y-2 cursor-pointer active:scale-[0.98] shadow-lg flex flex-col h-full"
      >
        <div className="flex justify-between items-start mb-6">
          <span className="text-xs font-mono text-primary/60 tracking-wider">SLIP #{item.id}</span>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-surface-container-highest rounded-full">
            <span className="material-symbols-outlined text-error text-sm font-icon material-icon" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
            <span className="text-xs font-bold text-on-surface">{item.favoriteCount.toLocaleString()}</span>
          </div>
        </div>
        
        <blockquote className="font-headline text-xl font-bold text-on-surface leading-relaxed mb-8 flex-1 italic">
          "{item.advice}"
        </blockquote>
        
        <div className="flex justify-between items-center pt-6 border-t border-outline-variant/10">
          <span className="text-xs font-medium text-on-surface-variant flex items-center gap-2">
            <span className="material-symbols-outlined material-icon text-sm text-secondary">verified</span> Top Advice
          </span>
          <div className="flex gap-2">
            <button onClick={copyToClipboard} className="p-2 hover:bg-surface-bright rounded-full transition-colors group/action text-on-surface-variant hover:text-on-surface" title="Copy">
              <span className="material-symbols-outlined material-icon text-[18px]">content_copy</span>
            </button>
            <button onClick={toggleFavorite} className="p-2 hover:bg-surface-bright rounded-full transition-colors group/action" title={isFavorite ? "Remove favorite" : "Add favorite"}>
              <span 
                className={`material-symbols-outlined material-icon text-[18px] transition-colors ${isFavorite ? "text-primary" : "text-on-surface-variant group-hover/action:text-primary"}`}
                style={isFavorite ? { fontVariationSettings: "'FILL' 1" } : { fontVariationSettings: "'FILL' 0" }}
              >
                favorite
              </span>
            </button>
          </div>
        </div>
        <div className="absolute -inset-px bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
      </Link>
    );
  };

  return (
    <main className="flex-grow pt-8 pb-24 relative overflow-hidden flex flex-col items-center">
      {/* Hero Section */}
      <section className="relative px-6 py-20 text-center w-full z-10 flex flex-col items-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-[400px] bg-primary/5 blur-[120px] pointer-events-none -z-10"></div>
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6 animate-pulse z-10">
          <span className="material-symbols-outlined material-icon text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>trending_up</span>
          <span className="text-xs font-bold tracking-widest uppercase">Popular Now</span>
        </div>
        <h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tight text-on-surface mb-6 z-10">
          Trending Wisdom
        </h1>
        <p className="font-body text-xl text-on-surface-variant max-w-2xl mx-auto z-10">
          The most loved advice from across the AdviceFlow community, curated by engagement and insight quality.
        </p>
      </section>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-20 opacity-50 w-full animate-pulse gap-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-7xl px-6 md:px-12">
            <div className="h-[300px] bg-surface-container/60 rounded-xl"></div>
            <div className="h-[300px] bg-surface-container/60 rounded-xl"></div>
            <div className="h-[300px] bg-surface-container/60 rounded-xl"></div>
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center">
          {/* Featured Top Cards - Responsive Grid for Stability */}
          <section className="w-full px-6 md:px-12 mb-20 max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featured.map(item => (
                <FeaturedCard key={item.id} item={item} />
              ))}
            </div>
          </section>

          {/* Trending Grid */}
          <section className="px-6 md:px-12 w-full max-w-7xl">
            <h2 className="font-headline text-3xl font-bold text-on-surface mb-10 flex items-center gap-3 w-full">
              Current Discoveries
              <span className="h-px flex-grow bg-outline-variant/20"></span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {remaining.map((item, index) => (
                <div key={item.id} className="relative group">
                  <AdviceCard advice={item} index={index + 3} />
                  <div className="absolute top-6 right-6 opacity-80 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 px-2.5 py-1 bg-surface-container-highest/80 backdrop-blur-md border border-outline-variant/20 rounded-full z-20 pointer-events-none">
                    <span className="material-symbols-outlined text-[10px] text-error" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                    <span className="text-[10px] font-bold text-on-surface">{item.favoriteCount.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
