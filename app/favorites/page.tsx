"use client";

import Link from "next/link";
import { useStore } from "@/store/useStore";
import { AdviceCard } from "@/components/AdviceCard";

export default function Favorites() {
  const { favorites, clearFavorites } = useStore();

  return (
    <>
      <main className="relative overflow-hidden flex-1 flex flex-col items-center">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-full h-full -z-10 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-tertiary/5 blur-[150px] rounded-full"></div>
          <div className="absolute bottom-[20%] left-[-10%] w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full"></div>
        </div>

        <section className="w-full max-w-7xl px-8 md:px-12 pt-16 pb-32">
          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="max-w-2xl">
              <h1 className="font-headline text-5xl md:text-6xl font-extrabold tracking-tight text-on-surface mb-4">
                Your Saved Wisdom.
              </h1>
              <p className="text-xl text-on-surface-variant leading-relaxed">
                A personal archive of the advice that shapes your perspective.
              </p>
            </div>
            {favorites.length > 0 && (
              <button 
                onClick={clearFavorites}
                className="group flex items-center gap-2 hover:bg-surface-container-high px-5 py-3 rounded-full transition-colors border border-transparent hover:border-outline-variant/20 self-start md:self-auto"
              >
                <span className="material-symbols-outlined material-icon text-on-surface-variant group-hover:text-error transition-colors text-xl">delete</span>
                <span className="text-sm font-headline uppercase tracking-widest text-on-surface-variant group-hover:text-error transition-colors">Clear All</span>
              </button>
            )}
          </div>

          <div className="flex items-baseline justify-between mb-8 pb-4 border-b border-outline-variant/10">
            <h2 className="text-sm font-headline uppercase tracking-widest text-on-surface-variant">Collection</h2>
            <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
              {favorites.length} Items
            </span>
          </div>

          {favorites.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 text-center max-w-md mx-auto relative group">
              <div className="absolute inset-0 bg-surface-container/30 backdrop-blur-md rounded-2xl -z-10 group-hover:bg-surface-container/50 transition-colors"></div>
              <span className="material-symbols-outlined material-icon text-7xl text-outline-variant/30 mb-6">bookmark_add</span>
              <h3 className="text-2xl font-headline font-bold text-on-surface mb-3">No wisdom saved yet</h3>
              <p className="text-on-surface-variant mb-8 leading-relaxed">Your collection is waiting to be built. Explore the archive or get a daily dose to start saving.</p>
              <Link href="/" className="px-8 py-3 rounded-full bg-primary-container text-on-primary-container font-headline text-sm uppercase tracking-widest font-bold hover:scale-105 transition-transform">
                Discover Advice
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {favorites.map((item, index) => (
                <AdviceCard key={item.id} advice={item} index={index} />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
