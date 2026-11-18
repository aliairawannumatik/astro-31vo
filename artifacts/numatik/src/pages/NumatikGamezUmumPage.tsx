import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Gamepad2, Layers, Zap, Rocket, Worm, Crosshair, Shield, Sparkles, Plane } from "lucide-react";
import Starfield from "@/components/Starfield";
import Snowfall from "@/components/Snowfall";
import PageNavigation from "@/components/PageNavigation";
import { playPopSound } from "@/hooks/useAudio";
import { useTheme } from "@/contexts/ThemeContext";

const NumatikGamezUmumPage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const isLight = theme === "light";

  const games = [
    {
      slug: "tetris",
      emoji: "🧩",
      path: "/numatik-gamez/umum/tetris",
      icon: <Layers className="w-8 h-8 text-accent shrink-0 group-hover:scale-110 transition-transform" />,
    },
    {
      slug: "lariMat",
      emoji: "🦕",
      path: "/numatik-gamez/umum/dino-run",
      icon: <Zap className="w-8 h-8 text-accent shrink-0 group-hover:scale-110 transition-transform" />,
    },
    {
      slug: "flappyRocket",
      emoji: "🚀",
      path: "/numatik-gamez/umum/flappy-rocket",
      icon: <Rocket className="w-8 h-8 text-accent shrink-0 group-hover:scale-110 transition-transform" />,
    },
    {
      slug: "snakeMat",
      emoji: "🐍",
      path: "/numatik-gamez/umum/snake-math",
      icon: <Worm className="w-8 h-8 text-accent shrink-0 group-hover:scale-110 transition-transform" />,
    },
    {
      slug: "galaksiTempur",
      emoji: "🌌",
      path: "/numatik-gamez/umum/asteroid-blaster",
      icon: <Crosshair className="w-8 h-8 text-accent shrink-0 group-hover:scale-110 transition-transform" />,
    },
    {
      slug: "tembakTank",
      emoji: "🪖",
      path: "/numatik-gamez/umum/tembak-tank",
      icon: <Shield className="w-8 h-8 text-accent shrink-0 group-hover:scale-110 transition-transform" />,
    },
    {
      slug: "keretaKoin",
      emoji: "🚆",
      path: "/numatik-gamez/umum/kereta-koin-math",
      icon: <Sparkles className="w-8 h-8 text-accent shrink-0 group-hover:scale-110 transition-transform" />,
    },
    {
      slug: "spaceImpact",
      emoji: "🛩️",
      path: "/numatik-gamez/umum/space-impact",
      icon: <Plane className="w-8 h-8 text-accent shrink-0 group-hover:scale-110 transition-transform" />,
    },
    {
      slug: "pacMath",
      emoji: "👾",
      path: "/numatik-gamez/umum/pacman-math",
      icon: <Gamepad2 className="w-8 h-8 text-accent shrink-0 group-hover:scale-110 transition-transform" />,
    },
    {
      slug: "zumMath",
      emoji: "🔮",
      path: "/numatik-gamez/umum/zuma-math",
      icon: <Sparkles className="w-8 h-8 text-accent shrink-0 group-hover:scale-110 transition-transform" />,
    },
  ];

  return (
    <div className={`relative min-h-screen flex flex-col items-center overflow-hidden ${isLight ? "gradient-snow" : "gradient-space"}`}>
      {isLight ? <Snowfall /> : <Starfield />}
      <PageNavigation prevPath="/numatik-gamez" />
      <div className="relative z-10 max-w-3xl w-full px-4 py-10">
        <Gamepad2 className="w-12 h-12 text-accent mx-auto mb-4" />
        <h1 className="font-display text-2xl md:text-3xl font-bold text-primary text-glow-cyan mb-2 text-center">
          {t('gameArena.umumTitle')}
        </h1>
        <p className="text-white/60 text-sm text-center mb-8 font-body">
          {t('gameArena.umumSubtitle')}
        </p>

        <div className="flex flex-col gap-4 animate-slide-up">
          {games.map((game, i) => (
            <button
              key={game.path}
              onClick={() => {
                playPopSound();
                navigate(game.path);
              }}
              className="group flex items-center gap-4 bg-card/80 backdrop-blur border border-border rounded-xl px-6 py-5
                hover:border-accent/60 transition-all duration-300
                cursor-pointer text-left animate-slide-up relative overflow-hidden"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              {game.icon}
              <div className="flex flex-col flex-1">
                <span className="font-display text-lg text-white">{game.emoji} {t(`gameArena.game_${game.slug}`)}</span>
                <span className="font-body text-xs text-white/50 mt-1">{t(`gameArena.game_${game.slug}Desc`)}</span>
              </div>
              <span className="bg-accent text-black text-xs font-bold px-2 py-0.5 rounded-full shrink-0">
                {t('gameArena.newBadge')}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => { playPopSound(); navigate("/numatik-gamez"); }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-body"
          >
            {t('gameArena.backToArena')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NumatikGamezUmumPage;
