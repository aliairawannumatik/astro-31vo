import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { readLocalStorage, writeLocalStorage } from "@/lib/localStorage";

interface AnimationContextValue {
  animationsOn: boolean;
  toggleAnimations: () => void;
}

const AnimationContext = createContext<AnimationContextValue | undefined>(undefined);
const STORAGE_KEY = "numatik-animations";

export const AnimationProvider = ({ children }: { children: ReactNode }) => {
  const [animationsOn, setAnimationsOn] = useState(() => {
    const saved = readLocalStorage(STORAGE_KEY);
    return saved === null
      ? !window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : saved !== "false";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("animations-off", !animationsOn);
    writeLocalStorage(STORAGE_KEY, String(animationsOn));
  }, [animationsOn]);

  const toggleAnimations = () => setAnimationsOn((current) => !current);

  return (
    <AnimationContext.Provider value={{ animationsOn, toggleAnimations }}>
      {children}
    </AnimationContext.Provider>
  );
};

export const useAnimations = () => {
  const context = useContext(AnimationContext);
  if (!context) throw new Error("useAnimations must be used within AnimationProvider");
  return context;
};
