"use client";

import Link from "next/link";
import { useStore, Advice } from "@/store/useStore";

interface AdviceCardProps {
  advice: Advice;
  index: number;
}

export function AdviceCard({ advice, index }: AdviceCardProps) {
  const { favorites, addFavorite, removeFavorite, addToast } = useStore();
  const isFavorite = favorites.some((f) => f.id === advice.id);

  const colorToken = index % 3 === 0 ? "primary" : index % 3 === 1 ? "secondary" : "tertiary";

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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

  const copyToClipboard = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(advice.advice);
    addToast({ message: "Copied to clipboard!" });
  };

  return (
    <Link
      href={`/advice/${advice.id}`}
      className="group relative flex flex-col bg-surface-container/50 backdrop-blur-md rounded-2xl p-8 hover:bg-surface-container-high transition-all duration-500 ease-out-quint border border-outline-variant/5 hover:border-outline-variant/20 shadow-lg min-h-[320px]"
    >
      <div
        className={`absolute top-0 left-0 w-2 h-full ${
          colorToken === "primary" ? "bg-primary" : colorToken === "secondary" ? "bg-secondary" : "bg-tertiary"
        } opacity-0 group-hover:opacity-100 transition-opacity rounded-l-2xl`}
      ></div>
      <span
        className={`material-symbols-outlined material-icon ${
          colorToken === "primary" ? "text-primary" : colorToken === "secondary" ? "text-secondary" : "text-tertiary"
        } text-4xl mb-6 opacity-80`}
      >
        format_quote
      </span>

      <h3 className="text-xl md:text-2xl font-headline font-medium leading-snug text-on-surface mb-8">
        {advice.advice}
      </h3>

      <div className="mt-auto flex items-center justify-between pt-6 border-t border-outline-variant/10">
        <div className="text-[10px] font-headline uppercase tracking-widest text-on-surface-variant">
          Slip #{advice.id}
        </div>
        <div className="flex gap-2">
          <button
            onClick={copyToClipboard}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-bright text-on-surface-variant hover:text-on-surface transition-colors"
            title="Copy"
          >
            <span className="material-symbols-outlined material-icon text-[18px]">content_copy</span>
          </button>
          
          <button
            onClick={toggleFavorite}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              isFavorite
                ? "bg-primary/20 text-primary"
                : "hover:bg-surface-bright text-on-surface-variant hover:text-primary"
            }`}
            title={isFavorite ? "Remove favorite" : "Add favorite"}
          >
            <span 
              className="material-symbols-outlined material-icon text-[18px]"
              style={isFavorite ? { fontVariationSettings: "'FILL' 1" } : { fontVariationSettings: "'FILL' 0" }}
            >
              favorite
            </span>
          </button>
        </div>
      </div>
    </Link>
  );
}
