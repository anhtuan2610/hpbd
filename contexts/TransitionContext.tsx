"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type TransitionContextType = {
  triggerTransition: () => void;
  isTransitioning: boolean;
  setIsTransitioning: (value: boolean) => void;
};

const TransitionContext = createContext<TransitionContextType | undefined>(
  undefined
);

export function TransitionProvider({ children }: { children: ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const triggerTransition = () => {
    // Chỉ trigger nếu chưa đang transition
    if (!isTransitioning) {
      setIsTransitioning(true);
    }
  };

  return (
    <TransitionContext.Provider value={{ triggerTransition, isTransitioning, setIsTransitioning }}>
      {children}
    </TransitionContext.Provider>
  );
}

export function useTransition() {
  const context = useContext(TransitionContext);
  if (context === undefined) {
    throw new Error("useTransition must be used within a TransitionProvider");
  }
  return context;
}

