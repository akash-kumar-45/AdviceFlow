"use client";

import { useEffect } from "react";
import { useStore } from "@/store/useStore";

function ToastItem({ toast }: { toast: any }) {
  const { removeToast } = useStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, removeToast]);

  return (
    <div className="flex animate-in slide-in-from-bottom-5 fade-in duration-300 ease-out flex-col bg-surface-container-highest border border-outline-variant/20 rounded-xl shadow-2xl p-4 min-w-[300px]">
      <div className="flex items-center justify-between pointer-events-auto gap-4">
        <span className="text-sm font-medium text-on-surface">{toast.message}</span>
        
        <div className="flex gap-2">
          {toast.actionLabel && toast.onAction && (
            <button 
              onClick={() => {
                toast.onAction();
                removeToast(toast.id);
              }}
              className="text-primary hover:bg-primary/10 text-xs uppercase tracking-widest font-bold px-3 py-1.5 rounded-full transition-colors"
            >
              {toast.actionLabel}
            </button>
          )}
          <button 
            onClick={() => removeToast(toast.id)} 
            className="text-on-surface-variant hover:text-on-surface hover:bg-surface-bright rounded-full p-1 flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export function ToastProvider() {
  const { toasts } = useStore();

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:right-6 flex flex-col gap-3 z-[100] pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}
