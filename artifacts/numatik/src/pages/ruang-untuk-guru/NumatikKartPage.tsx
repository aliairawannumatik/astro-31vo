import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { mountKartGame } from "@/numatik-kart/main";

const NumatikKartPage = () => {
  const hostRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [gameError, setGameError] = useState<string | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    try {
      return mountKartGame(host);
    } catch (error) {
      setGameError(error instanceof Error ? error.message : String(error));
      return undefined;
    }
  }, []);

  return (
    <main className="fixed inset-0 overflow-hidden bg-sky-200">
      <div ref={hostRef} className="absolute inset-0" />
      {gameError && (
        <div className="absolute inset-0 z-20 grid place-items-center bg-sky-100/95 p-6 text-center font-body text-slate-800">
          <div className="max-w-md rounded-2xl border border-sky-300 bg-white p-6 shadow-xl">
            <h1 className="font-display text-lg font-black">NUMATIK KART 3D</h1>
            <p className="mt-3 text-sm">Game 3D tidak dapat dimulai di perangkat ini.</p>
            <p className="mt-2 break-words text-xs text-slate-500">{gameError}</p>
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={() => navigate("/ruang-untuk-guru/numatik-game")}
        className="absolute left-4 top-4 z-30 inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/80 bg-white/85 px-4 font-display text-[10px] font-black tracking-wider text-slate-700 shadow-lg backdrop-blur transition hover:bg-white"
      >
        <ArrowLeft className="h-4 w-4" />
        NUMATIK GAME
      </button>
    </main>
  );
};

export default NumatikKartPage;
