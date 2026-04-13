"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { useStore } from "@/store/useStore";

export default function Settings() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  
  const { 
    animationsEnabled, setAnimationsEnabled,
    clearFavorites, clearSearchHistory, resetPreferences, addToast, favorites, addFavorite 
  } = useStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <main className="relative overflow-hidden flex-1 flex flex-col items-center">
        {/* Background Ambient Elements */}
        <div className="absolute top-0 right-0 w-full h-full -z-10 pointer-events-none overflow-hidden">
          <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] bg-secondary/5 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[10%] left-[10%] w-[600px] h-[600px] bg-primary/5 blur-[150px] rounded-full"></div>
        </div>

        <section className="w-full max-w-4xl px-8 md:px-12 pt-16 pb-32 flex flex-col gap-12">
          {/* Header */}
          <div className="max-w-2xl">
            <h1 className="font-headline text-5xl font-extrabold tracking-tight text-on-surface mb-4">
              Preferences
            </h1>
            <p className="text-xl text-on-surface-variant leading-relaxed">
              Tailor the AdviceFlow environment to your mindset.
            </p>
          </div>

          <div className="flex flex-col gap-8">
            {/* Theme Settings */}
            <div className="bg-surface-container/60 backdrop-blur-md rounded-2xl p-8 md:p-10 border border-outline-variant/10 shadow-lg relative overflow-hidden group">
              <div className="mb-8 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined material-icon">palette</span>
                </div>
                <div>
                  <h2 className="text-2xl font-headline font-bold text-on-surface">Atmosphere</h2>
                  <p className="text-sm text-on-surface-variant">Control the visual weighting and depth of the interface.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                  onClick={() => setTheme("system")}
                  className={`flex flex-col items-center justify-center p-6 rounded-xl border transition-all duration-300 ${
                    theme === 'system' ? 'border-primary bg-primary/5 ring-1 ring-primary/20 scale-[1.02]' : 'border-outline-variant/20 hover:border-outline-variant/50 hover:bg-surface-bright'
                  }`}
                >
                  <span className={`material-symbols-outlined material-icon text-3xl mb-4 ${theme === 'system' ? 'text-primary' : 'text-on-surface-variant'}`}>desktop_windows</span>
                  <span className="font-headline font-bold text-on-surface">System Default</span>
                  <span className="text-xs text-on-surface-variant mt-2 text-center">Syncs with your OS</span>
                </button>
                <button 
                  onClick={() => setTheme("dark")}
                  className={`flex flex-col items-center justify-center p-6 rounded-xl border transition-all duration-300 ${
                    theme === 'dark' ? 'border-primary bg-primary/5 ring-1 ring-primary/20 scale-[1.02]' : 'border-outline-variant/20 hover:border-outline-variant/50 hover:bg-surface-bright'
                  }`}
                >
                  <span className={`material-symbols-outlined material-icon text-3xl mb-4 ${theme === 'dark' ? 'text-primary' : 'text-on-surface-variant'}`}>dark_mode</span>
                  <span className="font-headline font-bold text-on-surface">Digital Obsidian</span>
                  <span className="text-xs text-on-surface-variant mt-2 text-center">Deep, calm, focused</span>
                </button>
                <button 
                  onClick={() => setTheme("light")}
                  className={`flex flex-col items-center justify-center p-6 rounded-xl border transition-all duration-300 ${
                    theme === 'light' ? 'border-primary bg-primary/5 ring-1 ring-primary/20 scale-[1.02]' : 'border-outline-variant/20 hover:border-outline-variant/50 hover:bg-surface-bright'
                  }`}
                >
                  <span className={`material-symbols-outlined material-icon text-3xl mb-4 ${theme === 'light' ? 'text-primary' : 'text-on-surface-variant'}`}>light_mode</span>
                  <span className="font-headline font-bold text-on-surface">Radiant Light</span>
                  <span className="text-xs text-on-surface-variant mt-2 text-center">Bright, crisp, legible</span>
                </button>
              </div>
            </div>

            {/* General Settings */}
            <div className="bg-surface-container/60 backdrop-blur-md rounded-2xl p-8 md:p-10 border border-outline-variant/10 shadow-lg">
              <div className="mb-8 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined material-icon">tune</span>
                </div>
                <div>
                  <h2 className="text-2xl font-headline font-bold text-on-surface">Experience</h2>
                  <p className="text-sm text-on-surface-variant">Adjust how the application flows and responds.</p>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between p-6 rounded-xl bg-surface-container-low border border-outline-variant/5">
                  <div>
                    <h3 className="font-headline font-bold text-on-surface mb-1">Fluid Motion</h3>
                    <p className="text-sm text-on-surface-variant">Enable smooth transitions and micro-animations.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={animationsEnabled}
                      onChange={(e) => setAnimationsEnabled(e.target.checked)}
                    />
                    <div className="w-14 h-7 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-on-surface after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary transition-colors"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Data Management */}
            <div className="bg-surface-container/60 backdrop-blur-md rounded-2xl p-8 md:p-10 border border-outline-variant/10 shadow-lg">
              <div className="mb-8 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center text-error">
                  <span className="material-symbols-outlined material-icon">data_usage</span>
                </div>
                <div>
                  <h2 className="text-2xl font-headline font-bold text-on-surface">Data Control</h2>
                  <p className="text-sm text-on-surface-variant">Manage your stored information and history.</p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-xl bg-surface-container-low border border-outline-variant/5 gap-4">
                  <div>
                    <h3 className="font-headline font-bold text-on-surface mb-1">Clear Favorites</h3>
                    <p className="text-sm text-on-surface-variant">Remove all saved advice from your collection.</p>
                  </div>
                   <button 
                    onClick={() => {
                      const prevFavorites = [...favorites];
                      clearFavorites();
                      addToast({
                        message: "All favorites cleared",
                        actionLabel: "Undo",
                        onAction: () => {
                          prevFavorites.forEach(f => addFavorite(f));
                        }
                      });
                    }}
                    className="px-6 py-3 rounded-full text-sm font-bold text-error border border-error/20 hover:bg-error/10 transition-colors shrink-0"
                  >
                    Clear Favorites
                  </button>
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-xl bg-surface-container-low border border-outline-variant/5 gap-4">
                  <div>
                    <h3 className="font-headline font-bold text-on-surface mb-1">Clear Search History</h3>
                    <p className="text-sm text-on-surface-variant">Remove all recent search queries.</p>
                  </div>
                  <button 
                    onClick={() => {
                      clearSearchHistory();
                      addToast({ message: "Search history cleared" });
                    }}
                    className="px-6 py-3 rounded-full text-sm font-bold text-on-surface-variant border border-outline-variant/20 hover:bg-surface-container-high transition-colors shrink-0"
                  >
                    Clear History
                  </button>
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between p-6 mt-4 rounded-xl border border-error/30 bg-error/5 gap-4">
                  <div>
                    <h3 className="font-headline font-bold text-error mb-1">Factory Reset</h3>
                    <p className="text-sm text-error/80">Restore all settings to their default state.</p>
                  </div>
                  <button 
                    onClick={() => {
                      resetPreferences();
                      setTheme("system");
                      addToast({ message: "Settings reset to default" });
                    }}
                    className="px-6 py-3 rounded-full text-sm font-bold bg-error text-on-error hover:bg-error-container hover:text-on-error-container transition-colors shrink-0"
                  >
                    Reset Preferences
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
