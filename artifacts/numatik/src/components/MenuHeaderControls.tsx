import { useEffect, useId, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, Globe, Palette, Volume2, VolumeX } from "lucide-react";
import { useLanguage, type Language } from "@/contexts/LanguageContext";
import { useSound } from "@/contexts/SoundContext";
import { useTheme, type Theme } from "@/contexts/ThemeContext";
import { playPopSound } from "@/hooks/useAudio";

type Picker = "language" | "theme" | null;

const LANGUAGES: ReadonlyArray<{ id: Language; name: string }> = [
  { id: "id", name: "Indonesia" },
  { id: "en", name: "English" },
  { id: "ja", name: "日本語" },
];

const THEMES: readonly Theme[] = ["dark", "white", "sunset", "ocean", "light", "forest", "pastel"];

const MenuHeaderControls = () => {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();
  const { soundOn, toggleSound } = useSound();
  const { theme, setTheme } = useTheme();
  const [openPicker, setOpenPicker] = useState<Picker>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceId = useId();
  const languagePickerId = `${instanceId}-language-picker`;
  const themePickerId = `${instanceId}-theme-picker`;

  useEffect(() => {
    if (!openPicker) return;

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (event.target instanceof Node && !containerRef.current?.contains(event.target)) {
        setOpenPicker(null);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenPicker(null);
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [openPicker]);

  const togglePicker = (picker: Exclude<Picker, null>) => {
    playPopSound();
    setOpenPicker((current) => current === picker ? null : picker);
  };

  return (
    <div ref={containerRef} className="relative flex items-center gap-1.5">
      <div className="relative">
        <button
          type="button"
          aria-label={t("menu.languageButton")}
          aria-expanded={openPicker === "language"}
          aria-controls={languagePickerId}
          onClick={() => togglePicker("language")}
          className="menu-control-button menu-focusable"
        >
          <Globe aria-hidden="true" className="h-5 w-5" />
        </button>
        {openPicker === "language" && (
          <div
            id={languagePickerId}
            role="group"
            aria-label={t("menu.languageButton")}
            className="menu-popover absolute right-0 top-full z-50 mt-2 min-w-40 rounded-xl border p-1.5 shadow-xl"
          >
            {LANGUAGES.map((option) => (
              <button
                key={option.id}
                type="button"
                aria-pressed={language === option.id}
                onClick={() => {
                  playPopSound();
                  setLanguage(option.id);
                  setOpenPicker(null);
                }}
                className="menu-popover-option menu-focusable flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm"
              >
                <span>{option.name}</span>
                {language === option.id && <Check aria-hidden="true" className="h-4 w-4" />}
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        type="button"
        aria-label={t(soundOn ? "menu.soundOn" : "menu.soundOff")}
        aria-pressed={soundOn}
        onClick={() => {
          playPopSound();
          toggleSound();
        }}
        className="menu-control-button menu-focusable"
      >
        {soundOn
          ? <Volume2 aria-hidden="true" className="h-5 w-5" />
          : <VolumeX aria-hidden="true" className="h-5 w-5" />}
      </button>

      <div className="relative">
        <button
          type="button"
          aria-label={t("menu.themeButton")}
          aria-expanded={openPicker === "theme"}
          aria-controls={themePickerId}
          onClick={() => togglePicker("theme")}
          className="menu-control-button menu-focusable"
        >
          <Palette aria-hidden="true" className="h-5 w-5" />
        </button>
        {openPicker === "theme" && (
          <div
            id={themePickerId}
            role="group"
            aria-label={t("menu.themeButton")}
            className="menu-popover absolute right-0 top-full z-50 mt-2 min-w-44 rounded-xl border p-1.5 shadow-xl"
          >
            {THEMES.map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={theme === option}
                onClick={() => {
                  playPopSound();
                  setTheme(option);
                  setOpenPicker(null);
                }}
                className="menu-popover-option menu-focusable flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm"
              >
                <span>{t(`themeNames.${option}`)}</span>
                {theme === option && <Check aria-hidden="true" className="h-4 w-4" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuHeaderControls;
