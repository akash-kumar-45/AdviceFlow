"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useStore, Advice } from "@/store/useStore";
import { AdviceCard } from "@/components/AdviceCard";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState<Advice[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  const { searchHistory, addSearchHistory, clearSearchHistory } = useStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  const fetchResults = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }
    
    setLoading(true);
    setHasSearched(true);
    try {
      const res = await fetch(`https://api.adviceslip.com/advice/search/${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data.slips) {
        setResults(data.slips);
        addSearchHistory(searchQuery);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error("Error searching advice", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [addSearchHistory]);

  useEffect(() => {
    fetchResults(debouncedQuery);
  }, [debouncedQuery, fetchResults]);

  const handleHistoryClick = (q: string) => {
    setQuery(q);
    setDebouncedQuery(q); // Trigger immediate search
  };

  return (
    <>
      <main className="flex-grow flex flex-col items-center">
        {/* Search Section */}
        <section className="w-full max-w-4xl px-6 pt-12 pb-8">
          <div className="relative group">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
              <span className="material-symbols-outlined material-icon text-primary/60 group-focus-within:text-primary transition-colors">search</span>
            </div>
            <input 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant/10 rounded-full py-6 pl-16 pr-8 text-lg font-body focus:outline-none focus:ring-4 focus:ring-secondary/20 focus:border-secondary transition-all shadow-2xl backdrop-blur-xl text-on-surface" 
              placeholder="Search for life insights, coding tips, or daily wisdom..." 
              type="text"
            />
          </div>
          
          {/* Search History Chips */}
          {searchHistory.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-3 items-center">
              <span className="text-xs uppercase tracking-widest text-on-surface-variant font-semibold mr-2">Recent Searches</span>
              {searchHistory.map((historyQuery) => (
                <button 
                  key={historyQuery}
                  onClick={() => handleHistoryClick(historyQuery)}
                  className="bg-surface-container-high hover:bg-surface-bright text-on-surface-variant hover:text-on-surface px-5 py-2 rounded-full text-sm transition-colors border border-outline-variant/5"
                >
                  {historyQuery}
                </button>
              ))}
              <button onClick={clearSearchHistory} className="text-secondary text-xs font-bold hover:underline ml-2">Clear All</button>
            </div>
          )}
        </section>

        {/* Results Grid */}
        {hasSearched && !loading && results.length > 0 && (
          <section className="w-full max-w-7xl px-12 py-12">
            <div className="flex items-baseline justify-between mb-10">
              <h2 className="text-3xl font-headline font-bold tracking-tight text-on-surface">Search Results</h2>
              <span className="text-on-surface-variant text-sm">Showing {results.length} insights found</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {results.map((item, index) => (
                <AdviceCard key={item.id} advice={item} index={index} />
              ))}
            </div>
          </section>
        )}

        {/* Loading State */}
        {loading && (
          <section className="w-full max-w-7xl px-12 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col bg-surface-container-low/50 rounded-xl p-8 shadow-sm">
                  <div className="flex justify-between mb-6">
                    <div className="h-5 w-24 bg-surface-container-high animate-pulse rounded-full opacity-40"></div>
                  </div>
                  <div className="h-6 w-full bg-surface-container-high animate-pulse rounded-md mb-3 opacity-40"></div>
                  <div className="h-6 w-3/4 bg-surface-container-high animate-pulse rounded-md mb-8 opacity-40"></div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {hasSearched && !loading && results.length === 0 && (
          <section className="w-full max-w-2xl py-32 flex flex-col items-center text-center">
            <div className="relative w-64 h-64 mb-12">
              <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl"></div>
              <img alt="No results found" className="relative z-10 w-full h-full object-contain mix-blend-screen" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCR-7F-K7S2NvSe2Uzubu9now15q5ekACvQnyPMvCw0jIUouGD-LmEYzvRbrR0Edu8v9I0vtEb2kiDpg1DREzdqOh4qWtjm8i1OqIJIKWCupq4xHfJs3vaJ00BZqqpij_3Pbj2A4aurbk7f-Vi08QwmA1gK4XmppvEh3yQktnDEntdngWXbZ8UQQMqphOjF6JgIYSLJkMCUf3-gpjjjgQzmDSsfYaWkM9aJZLxDz02Gt2w9tB7u3quuhSpO1PkNa9-6Jv8tbAaH0Js"/>
            </div>
            <h3 className="text-4xl font-headline font-bold mb-4 text-on-surface">The void is silent.</h3>
            <p className="text-on-surface-variant text-lg max-w-md mx-auto leading-relaxed">
              We couldn't find any advice matching "{query}". Perhaps the universe has other wisdom for you today?
            </p>
            <Link href="/" className="mt-10 bg-primary-container text-on-primary-container px-10 py-4 rounded-full font-bold hover:scale-105 transition-transform shadow-[0_0_15px_rgba(var(--color-primary-val),0.2)]">
              Explore Trending Wisdom
            </Link>
          </section>
        )}
      </main>
    </>
  );
}
