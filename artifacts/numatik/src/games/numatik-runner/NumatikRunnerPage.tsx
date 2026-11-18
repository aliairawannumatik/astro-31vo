import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Volume2, VolumeX, Pause, Play, RotateCcw, Heart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { runnerTranslations } from "./translations";
import { mountRunnerGame, type RunnerGame, type RunnerHud, type RunnerQuestion } from "./engine/RunnerEngine";

type GameScreen = "menu" | "countdown" | "playing" | "paused" | "gameover";

const safeStorageGet = (key: string) => {
  try { return window.localStorage.getItem(key) ?? ""; } catch { return ""; }
};

const safeStorageSet = (key: string, value: string) => {
  try { window.localStorage.setItem(key, value); } catch { /* Storage can be unavailable in private mode. */ }
};

const NumatikRunnerPage = () => {
  const hostRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<RunnerGame | null>(null);
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = runnerTranslations[language];
  const [screen, setScreen] = useState<GameScreen>("menu");
  const [countdown, setCountdown] = useState(3);
  const [hud, setHud] = useState<RunnerHud>({ score: 0, distance: 0, lives: 3, combo: 1, correct: 0, wrong: 0 });
  const [question, setQuestion] = useState<RunnerQuestion | null>(null);
  const [toast, setToast] = useState("");
  const [gameError, setGameError] = useState("");
  const [muted, setMuted] = useState(() => safeStorageGet("numatik_runner_muted") === "1");
  const [best, setBest] = useState(() => Number.parseInt(safeStorageGet("numatik_runner_best") || "0", 10));
  const [newBest, setNewBest] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const playSound = (sound: string) => {
    try {
      const AudioContextClass = window.AudioContext
        ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const context = audioContextRef.current ?? new AudioContextClass();
      audioContextRef.current = context;
      if (context.state === "suspended") void context.resume();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const now = context.currentTime;
      const settings: Record<string, [number, number, OscillatorType]> = {
        jump: [420, 680, "sine"],
        slide: [180, 110, "triangle"],
        coin: [760, 1100, "square"],
        hit: [150, 70, "sawtooth"],
        correct: [520, 820, "sine"],
        incorrect: [220, 120, "sawtooth"],
        countdown: [330, 440, "square"],
      };
      const [from, to, type] = settings[sound] ?? [300, 300, "sine"];
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(from, now);
      oscillator.frequency.exponentialRampToValueAtTime(Math.max(30, to), now + 0.12);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.12, now + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(now);
      oscillator.stop(now + 0.17);
    } catch {
      // WebAudio is optional and may be blocked by browser policy.
    }
  };

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    try {
      const game = mountRunnerGame(host, {
        onHud: setHud,
        onQuestion: setQuestion,
        onAnswer: (correct, explanation) => {
          setToast(correct ? t.correct : `${t.wrong}${explanation ? ` — ${explanation}` : ""}`);
          window.setTimeout(() => setToast(""), 1500);
        },
        onCountdown: (value) => {
          setCountdown(value);
          setScreen(value > 0 ? "countdown" : "playing");
        },
        onGameOver: (score, correct, wrong) => {
          setFinalScore(score);
          setScreen("gameover");
          setNewBest(score > best);
          if (score > best) {
            setBest(score);
            safeStorageSet("numatik_runner_best", String(score));
          }
          setHud((current) => ({ ...current, score, correct, wrong }));
        },
        onToast: setToast,
        onSound: (sound) => playSound(sound),
      });
      gameRef.current = game;
      game.setMuted(muted);
      return () => {
        game.dispose();
        gameRef.current = null;
        if (audioContextRef.current) {
          void audioContextRef.current.close();
          audioContextRef.current = null;
        }
      };
    } catch (error) {
      setGameError(error instanceof Error ? error.message : String(error));
    }
  }, []);

  useEffect(() => {
    gameRef.current?.setMuted(muted);
    safeStorageSet("numatik_runner_muted", muted ? "1" : "0");
  }, [muted]);

  useEffect(() => {
    history.pushState({ numatikRunner: true }, "");
    const handlePop = () => {
      if (screen === "playing" || screen === "countdown") {
        gameRef.current?.setPaused(true);
        setScreen("paused");
        history.pushState({ numatikRunner: true }, "");
      }
    };
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, [screen]);

  useEffect(() => {
    const pauseForBackground = () => {
      if (screen === "playing" || screen === "countdown") {
        gameRef.current?.setPaused(true);
        setScreen("paused");
      }
    };
    const handleVisibility = () => {
      if (document.hidden) pauseForBackground();
    };
    document.addEventListener("visibilitychange", handleVisibility);

    const capacitorWindow = window as unknown as {
      Capacitor?: { plugins?: { App?: { addListener?: (event: string, cb: (state: { isActive: boolean }) => void) => unknown } } };
    };
    const app = capacitorWindow.Capacitor?.plugins?.App;
    const sub = app?.addListener?.("appStateChange", (state) => {
      if (!state.isActive) pauseForBackground();
    });
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      const removable = sub as { remove?: () => void } | undefined;
      removable?.remove?.();
    };
  }, [screen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (screen !== "playing") return;
      if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") gameRef.current?.moveLane(-1);
      if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") gameRef.current?.moveLane(1);
      if (event.key === "ArrowUp" || event.key.toLowerCase() === "w" || event.code === "Space") gameRef.current?.jump();
      if (event.key === "ArrowDown" || event.key.toLowerCase() === "s") gameRef.current?.slide();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [screen]);

  const beginCountdown = () => {
    setQuestion(null);
    setToast("");
    setNewBest(false);
    setScreen("countdown");
    setCountdown(3);
    gameRef.current?.reset();
  };

  const startGame = () => {
    setScreen("countdown");
    gameRef.current?.start();
  };

  const resume = () => {
    setScreen("countdown");
    gameRef.current?.resume();
  };

  const pointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest("button")) return;
    pointerStart.current = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const pointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!pointerStart.current || screen !== "playing") return;
    const dx = event.clientX - pointerStart.current.x;
    const dy = event.clientY - pointerStart.current.y;
    pointerStart.current = null;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 28) return;
    if (Math.abs(dx) > Math.abs(dy)) gameRef.current?.moveLane(dx > 0 ? 1 : -1);
    else if (dy < 0) gameRef.current?.jump();
    else gameRef.current?.slide();
  };

  const exitMenu = () => navigate("/ruang-untuk-guru/numatik-game");

  return (
    <main
      className="fixed inset-0 select-none overflow-hidden bg-sky-950 text-white"
      style={{ touchAction: "none", overscrollBehavior: "none" }}
      onPointerDown={pointerDown}
      onPointerUp={pointerUp}
      onContextMenu={(event) => event.preventDefault()}
    >
      <div ref={hostRef} className="absolute inset-0" />

      {gameError && (
        <div className="absolute inset-0 z-50 grid place-items-center bg-sky-950 p-6 text-center">
          <div className="max-w-md rounded-2xl border border-cyan-300/30 bg-slate-950 p-6">
            <h1 className="font-display text-xl font-black">{t.title}</h1>
            <p className="mt-3 text-sm text-slate-200">{t.webgl}</p>
            <p className="mt-2 text-xs text-slate-400 break-all">{gameError}</p>
          </div>
        </div>
      )}

      {screen === "menu" && !gameError && (
        <div className="absolute inset-0 z-30 grid place-items-center bg-slate-950/25 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-md rounded-3xl border border-cyan-200/30 bg-slate-950/85 p-6 text-center shadow-[0_24px_80px_rgba(8,145,178,.25)]">
            <div className="mx-auto mb-3 grid h-16 w-16 place-items-center rounded-full border-2 border-cyan-300 bg-gradient-to-br from-cyan-300 to-blue-700 text-3xl shadow-[0_0_30px_rgba(34,211,238,.55)]">🤖</div>
            <h1 className="font-display text-2xl font-black tracking-wide text-cyan-100">{t.title}</h1>
            <p className="mt-2 text-sm text-slate-300">{t.subtitle}</p>
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-xs uppercase tracking-widest text-slate-400">{t.best}</p>
              <p className="mt-1 font-display text-3xl font-black text-amber-300">{best}</p>
            </div>
            <button type="button" onClick={startGame} className="mt-5 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-600 font-display text-lg font-black text-slate-950 shadow-[0_6px_0_#164e63] active:translate-y-1 active:shadow-none">
              <Play className="h-5 w-5 fill-current" /> {t.play}
            </button>
            <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
              <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-left text-xs leading-relaxed text-slate-300">{t.controls}</div>
              <button type="button" onClick={() => setMuted((value) => !value)} aria-label={muted ? t.unmute : t.mute} className="grid h-12 w-12 place-items-center rounded-xl border border-white/10 bg-white/5">
                {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </button>
            </div>
            <p className="mt-3 text-[11px] text-slate-400">{t.desktop}</p>
            <button type="button" onClick={exitMenu} className="mt-4 inline-flex items-center gap-2 text-xs text-slate-400 hover:text-cyan-200">
              <ArrowLeft className="h-4 w-4" /> {t.backMenu}
            </button>
          </div>
        </div>
      )}

      {(screen === "playing" || screen === "countdown" || screen === "paused") && (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 p-3">
          <div className="mx-auto flex max-w-3xl items-start justify-between gap-2">
            <div className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-slate-950/65 px-3 py-2 backdrop-blur">
              {Array.from({ length: 3 }, (_, index) => (
                <Heart key={index} className={`h-5 w-5 ${index < hud.lives ? "fill-rose-400 text-rose-400" : "text-slate-600"}`} />
              ))}
            </div>
            <div className="min-w-0 flex-1 rounded-xl border border-cyan-200/20 bg-slate-950/70 px-3 py-2 text-center backdrop-blur">
              <p className="truncate text-xs font-bold sm:text-sm">{question?.text ?? "—"}</p>
              {question && (
                <div className="mt-1 flex justify-center gap-2 text-[10px] text-cyan-200">
                  {question.options.map((option, index) => <span key={index}>{index + 1}. {option}</span>)}
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-1 text-right">
              <div className="rounded-xl border border-white/20 bg-slate-950/65 px-2 py-1 text-[10px] backdrop-blur">
                <span className="block text-slate-400">{t.score}</span><b>{hud.score}</b>
              </div>
              <div className="rounded-xl border border-white/20 bg-slate-950/65 px-2 py-1 text-[10px] backdrop-blur">
                <span className="block text-slate-400">{t.distance}</span><b>{Math.floor(hud.distance)}m</b>
              </div>
            </div>
            <button type="button" onPointerDown={(event) => event.stopPropagation()} onClick={() => { gameRef.current?.setPaused(true); setScreen("paused"); }} className="pointer-events-auto grid h-11 w-11 place-items-center rounded-xl border border-white/20 bg-slate-950/70 backdrop-blur">
              <Pause className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {screen === "countdown" && (
        <div className="absolute inset-0 z-40 grid place-items-center">
          <div className="grid h-28 w-28 animate-pulse place-items-center rounded-full border-4 border-cyan-200 bg-slate-950/80 font-display text-6xl font-black text-cyan-200 shadow-[0_0_50px_rgba(34,211,238,.55)]">
            {countdown}
          </div>
        </div>
      )}

      {toast && (
        <div className="absolute left-1/2 top-28 z-40 -translate-x-1/2 whitespace-nowrap rounded-full border border-cyan-200/30 bg-slate-950/90 px-4 py-2 text-sm font-bold shadow-xl">
          {toast}
        </div>
      )}

      {screen === "paused" && (
        <div className="absolute inset-0 z-50 grid place-items-center bg-slate-950/70 p-4 backdrop-blur">
          <div className="w-full max-w-sm rounded-3xl border border-cyan-200/30 bg-slate-950 p-6 text-center">
            <h2 className="font-display text-2xl font-black text-cyan-100">{t.pause}</h2>
            <button type="button" onClick={resume} className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 font-display font-black text-slate-950"><Play className="h-5 w-5" /> {t.resume}</button>
            <button type="button" onClick={exitMenu} className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 font-display text-sm font-bold"><ArrowLeft className="h-5 w-5" /> {t.menu}</button>
          </div>
        </div>
      )}

      {screen === "gameover" && (
        <div className="absolute inset-0 z-50 grid place-items-center bg-slate-950/75 p-4 backdrop-blur">
          <div className="w-full max-w-sm rounded-3xl border border-amber-200/30 bg-slate-950 p-6 text-center">
            <p className="text-4xl">🏁</p>
            <h2 className="mt-2 font-display text-2xl font-black text-amber-200">{t.gameOver}</h2>
            {newBest && <p className="mt-1 text-sm font-bold text-cyan-300">{t.newBest}</p>}
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-white/10 bg-white/5 p-3"><span className="text-xs text-slate-400">{t.score}</span><b className="block text-2xl text-white">{finalScore}</b></div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3"><span className="text-xs text-slate-400">{t.correct}</span><b className="block text-2xl text-emerald-300">{hud.correct}</b></div>
              <div className="col-span-2 rounded-xl border border-white/10 bg-white/5 p-3"><span className="text-xs text-slate-400">{t.wrong}</span><b className="ml-2 text-lg text-rose-300">{hud.wrong}</b></div>
            </div>
            <button type="button" onClick={beginCountdown} className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 font-display font-black text-slate-950"><RotateCcw className="h-5 w-5" /> {t.again}</button>
            <button type="button" onClick={() => setScreen("menu")} className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 font-display text-sm font-bold"><ArrowLeft className="h-5 w-5" /> {t.backMenu}</button>
          </div>
        </div>
      )}
    </main>
  );
};

export default NumatikRunnerPage;
