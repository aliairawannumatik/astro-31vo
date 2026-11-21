import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { setSoundEnabled } from "@/hooks/useAudio";
import { setCurrentSfxId, setVolume } from "@/hooks/soundEffects";
import { readLocalStorage, writeLocalStorage } from "@/lib/localStorage";

interface SoundContextType {
  soundOn: boolean;
  toggleSound: () => void;
  sfxId: string;
  setSfxId: (id: string) => void;
  volume: number;
  setVolume: (v: number) => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider = ({ children }: { children: ReactNode }) => {
  const [soundOn, setSoundOn] = useState<boolean>(() => {
    const saved = readLocalStorage("numatik-sound");
    return saved === null ? true : saved === "true";
  });

  const [sfxId, setSfxIdState] = useState<string>(() => {
    return readLocalStorage("numatik-sfx") ?? "pop-klasik";
  });

  const [volumeState, setVolumeState] = useState<number>(() => {
    const saved = readLocalStorage("numatik-sfx-volume");
    return saved !== null ? Number(saved) : 80;
  });

  useEffect(() => {
    writeLocalStorage("numatik-sound", String(soundOn));
    setSoundEnabled(soundOn);
  }, [soundOn]);

  useEffect(() => {
    writeLocalStorage("numatik-sfx", sfxId);
    setCurrentSfxId(sfxId);
  }, [sfxId]);

  useEffect(() => {
    writeLocalStorage("numatik-sfx-volume", String(volumeState));
    setVolume(volumeState / 100);
  }, [volumeState]);

  const toggleSound = () => setSoundOn(prev => !prev);
  const setSfxId = (id: string) => setSfxIdState(id);
  const handleSetVolume = (v: number) => setVolumeState(Math.max(0, Math.min(100, v)));

  return (
    <SoundContext.Provider value={{ soundOn, toggleSound, sfxId, setSfxId, volume: volumeState, setVolume: handleSetVolume }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error("useSound must be used within SoundProvider");
  return ctx;
};
