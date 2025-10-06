"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

export type ToastStatus = "success" | "error" | "info";

interface ToastMessage {
  id: number;
  message: string;
  status: ToastStatus;
}

type ToastContextValue = {
  publish: (message: string, status?: ToastStatus) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const publish = useCallback((message: string, status: ToastStatus = "info") => {
    setToasts((current) => {
      const toast = { id: Date.now(), message, status } satisfies ToastMessage;
      return [...current, toast].slice(-3);
    });

    setTimeout(() => {
      setToasts((current) => current.slice(1));
    }, 4000);
  }, []);

  const value = useMemo(() => ({ publish }), [publish]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
        <div className="flex w-full max-w-md flex-col gap-2">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`pointer-events-auto rounded-lg border px-4 py-3 text-sm shadow-lg transition ${
                toast.status === "error"
                  ? "border-red-500/40 bg-red-500/20 text-red-100"
                  : toast.status === "success"
                    ? "border-emerald-500/40 bg-emerald-500/20 text-emerald-100"
                    : "border-slate-700 bg-slate-800 text-slate-100"
              }`}
            >
              {toast.message}
            </div>
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
}
