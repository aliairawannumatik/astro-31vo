import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bike,
  CarFront,
  Check,
  CircleHelp,
  Clock3,
  Coins,
  Compass,
  Gem,
  Map as MapIcon,
  Pause,
  Plane,
  Play,
  RotateCcw,
  Settings,
  Ship,
  Sparkles,
  Trophy,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { getNextQuestion, type Question } from "../shared/questions/bank";
import { VEHICLE_OFFERS, WANTED_FINE, type VehicleKind } from "./economy";
import { TREASURES } from "./quests/treasures";
import {
  mountMetropolisGame,
  type MetropolisGame,
  type MetropolisHud,
  type MetropolisQuality,
} from "./engine/MetropolisEngine";
import "./NumatikMetropolis.css";

type Screen = "menu" | "playing" | "paused" | "settings" | "credits" | "help" | "win" | "caught";
type Feedback = "correct" | "wrong" | null;
type WrongAnswer = { text: string; selected: string; answer: string; explanation: string };
type SaveData = {
  x: number;
  z: number;
  coins: number;
  collected: number[];
  owned: VehicleKind[];
  vehicle: VehicleKind;
  wrongAnswers: WrongAnswer[];
  elapsed: number;
  sound: boolean;
  quality: MetropolisQuality;
  sensitivity: number;
  hour: number;
  rain: boolean;
};

const SAVE_KEY = "numatik_metropolis_save_v1";
const EMPTY_HUD: MetropolisHud = {
  x: 8,
  z: 12,
  speed: 0,
  altitude: 0,
  stars: 0,
  nearTreasure: null,
  vehicle: "car",
  timeOfDay: 9.5,
};
const DEFAULT_SAVE: SaveData = {
  x: 8,
  z: 12,
  coins: 120,
  collected: [],
  owned: ["car"],
  vehicle: "car",
  wrongAnswers: [],
  elapsed: 0,
  sound: true,
  quality: "auto",
  sensitivity: 1,
  hour: 9.5,
  rain: false,
};
const QUALITY_OPTIONS: MetropolisQuality[] = ["auto", "low", "medium", "high", "ultra"];
const KNOWN_VEHICLES: VehicleKind[] = ["car", "motorcycle", "boat", "plane", "helicopter"];

const readSave = (): SaveData => {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return DEFAULT_SAVE;
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object") return DEFAULT_SAVE;
    const data = value as Partial<SaveData>;
    return {
      ...DEFAULT_SAVE,
      x: typeof data.x === "number" ? data.x : DEFAULT_SAVE.x,
      z: typeof data.z === "number" ? data.z : DEFAULT_SAVE.z,
      coins: typeof data.coins === "number" ? Math.max(0, data.coins) : DEFAULT_SAVE.coins,
      collected: Array.isArray(data.collected) ? data.collected.filter((id): id is number => Number.isInteger(id) && TREASURES.some((item) => item.id === id)) : [],
      owned: Array.isArray(data.owned) ? data.owned.filter((item): item is VehicleKind => KNOWN_VEHICLES.includes(item as VehicleKind)) : ["car"],
      vehicle: KNOWN_VEHICLES.includes(data.vehicle as VehicleKind) ? data.vehicle as VehicleKind : "car",
      wrongAnswers: Array.isArray(data.wrongAnswers) ? data.wrongAnswers.filter((item): item is WrongAnswer =>
        Boolean(item && typeof item.text === "string" && typeof item.answer === "string" && typeof item.selected === "string" && typeof item.explanation === "string"),
      ) : [],
      elapsed: typeof data.elapsed === "number" ? Math.max(0, data.elapsed) : 0,
      sound: typeof data.sound === "boolean" ? data.sound : true,
      quality: QUALITY_OPTIONS.includes(data.quality as MetropolisQuality) ? data.quality as MetropolisQuality : "auto",
      sensitivity: typeof data.sensitivity === "number" ? Math.min(2, Math.max(0.35, data.sensitivity)) : 1,
      hour: typeof data.hour === "number" ? data.hour : 9.5,
      rain: typeof data.rain === "boolean" ? data.rain : false,
    };
  } catch {
    return DEFAULT_SAVE;
  }
};

const saveData = (data: SaveData) => {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch {
    // Saving is optional on devices with disabled or full browser storage.
  }
};

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  return `${String(minutes).padStart(2, "0")}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
};

const translations = {
  id: {
    subtitle: "JELAJAHI • KENDARAI • TEMUKAN",
    menuTag: "RUANG UNTUK GURU · NUMATIK GAME",
    menuDescription: "Jelajahi jalan kota, temukan lima peti, dan jawab soal matematika.",
    station: "POLISI",
    port: "PELABUHAN",
    gas: "GAS",
    brake: "REM",
    action: "AKSI",
    jump: "LOMPAT",
    ascend: "NAIK",
    honk: "KLAKSON",
    drift: "REM TANGAN",
    heat: "Peti harta di dekatmu!",
    freshSave: "Mulai baru akan mengatur ulang peti dan koin.",
    newGame: "Mulai petualangan",
    continue: "Lanjutkan",
    settings: "Pengaturan",
    controls: "Cara bermain",
    credits: "Kredit",
    content: "Petualangan ramah keluarga. Tanpa senjata atau kekerasan. Pejalan kaki selalu aman dan menjauh dari kendaraan. Tabrakan hanya membuat kendaraan penyok dan mengeluarkan asap ringan.",
    city: "Kota fiktif yang luas",
    treasures: "5 peti matematika",
    vehicles: "5 jenis kendaraan",
    objectives: "MISI KOTA",
    clue: "PETUNJUK",
    found: "PETI DITEMUKAN",
    speed: "KECEPATAN",
    altitude: "KETINGGIAN",
    coins: "KOIN",
    pause: "Jeda",
    openChest: "Buka peti",
    question: "Pecahkan soal untuk membuka peti",
    correct: "Tepat! Peti terbuka. Koin ditambahkan.",
    wrong: "Belum tepat. Peti terkunci sebentar; siapkan soal baru.",
    retry: "Coba lagi setelah jeda singkat.",
    map: "Peta kota",
    missions: "Daftar misi",
    resume: "Lanjut menjelajah",
    caught: "Dihentikan dengan aman",
    caughtText: "Petugas membantu mengakhiri kejar-kejaran. Kamu kembali ke kantor kota; progres peti tetap tersimpan.",
    fine: "Denda",
    return: "Kembali ke kota",
    victory: "Semua peti terbuka!",
    victoryText: "Kamu telah menjelajahi Numatik Metropolis dan menyelesaikan seluruh tantangan matematika.",
    wrongList: "Soal yang perlu dipelajari lagi",
    noWrong: "Semua jawabanmu benar!",
    playOn: "Lanjut bermain bebas",
    quality: "Kualitas grafis",
    sound: "Suara",
    sensitivity: "Sensitivitas kemudi",
    weather: "Cuaca",
    clear: "Cerah",
    rain: "Hujan",
    time: "Waktu kota",
    hour: "jam",
    ultraWarning: "Ultra memakai resolusi penuh dan dapat membuat ponsel panas serta lebih boros baterai.",
    autoHint: "Otomatis menyesuaikan resolusi dan jarak pandang.",
    buyRide: "Garasi kota",
    owned: "Dimiliki",
    buy: "Beli",
    notEnough: "Koin belum cukup.",
    controlsText: "WASD / tombol panah untuk bergerak dan mengemudi • E masuk/keluar kendaraan atau membuka peti • Spasi melompat/naik • Shift turun • H klakson • Escape jeda • Gamepad didukung.",
    mobileText: "Ponsel: joystick kiri untuk bergerak dan kemudi, tombol GAS/REM di kanan, geser area kosong untuk kamera. Tekan AKSI untuk masuk kendaraan atau membuka peti.",
    desktop: "DESKTOP",
    mobile: "SENTUH",
    creditsText: "Numatik Metropolis adalah kota fiktif prosedural untuk belajar matematika sambil bereksplorasi. Bangunan dan landmark dibuat dengan geometri orisinal.",
    osm: "Jika data OpenStreetMap dibuat melalui scripts/build-city.mjs, peta dan data yang diturunkan tersedia di bawah lisensi ODbL 1.0.",
    back: "Kembali",
    loading: "Menyiapkan kota…",
    loadingFallback: "WebGL 2 tidak tersedia. Coba perbarui browser atau gunakan perangkat lain.",
    free: "Jelajah bebas",
    new: "Baru",
    close: "Tutup",
    gameOver: "Petualangan disimpan otomatis",
    parked: "Kendaraan",
    wanted: "LEVEL PENCARIAN",
    radar: "RADAR",
  },
  en: {
    subtitle: "EXPLORE • DRIVE • DISCOVER",
    menuTag: "TEACHER'S ROOM · NUMATIK GAME",
    menuDescription: "Explore city roads, find five chests, and solve math questions.",
    station: "STATION",
    port: "HARBOR",
    gas: "GAS",
    brake: "BRAKE",
    action: "ACTION",
    jump: "JUMP",
    ascend: "RISE",
    honk: "HORN",
    drift: "HANDBRAKE",
    heat: "Treasure chest nearby!",
    freshSave: "Starting a new adventure resets chests and coins.",
    newGame: "Start adventure",
    continue: "Continue",
    settings: "Settings",
    controls: "How to play",
    credits: "Credits",
    content: "Family-friendly adventure. No weapons or violence. Pedestrians always stay safe and move away from vehicles. Collisions only dent vehicles and create light smoke.",
    city: "A broad fictional city",
    treasures: "5 math treasure chests",
    vehicles: "5 vehicle types",
    objectives: "CITY MISSIONS",
    clue: "CLUE",
    found: "CHESTS FOUND",
    speed: "SPEED",
    altitude: "ALTITUDE",
    coins: "COINS",
    pause: "Pause",
    openChest: "Open chest",
    question: "Solve the question to open the chest",
    correct: "Correct! Chest opened. Coins added.",
    wrong: "Not quite. The chest rests briefly; a new question is ready.",
    retry: "Try again after a short pause.",
    map: "City map",
    missions: "Mission list",
    resume: "Resume exploring",
    caught: "Safely stopped",
    caughtText: "City officers helped end the chase. You are back at the city station; chest progress is saved.",
    fine: "Fine",
    return: "Return to the city",
    victory: "Every chest is open!",
    victoryText: "You explored Numatik Metropolis and completed all five math challenges.",
    wrongList: "Questions to review",
    noWrong: "Every answer was correct!",
    playOn: "Keep exploring freely",
    quality: "Graphics quality",
    sound: "Sound",
    sensitivity: "Steering sensitivity",
    weather: "Weather",
    clear: "Clear",
    rain: "Rain",
    time: "City time",
    hour: "hour",
    ultraWarning: "Ultra uses full native resolution and may heat phones and drain the battery faster.",
    autoHint: "Automatically adjusts render resolution and view distance.",
    buyRide: "City garage",
    owned: "Owned",
    buy: "Buy",
    notEnough: "Not enough coins.",
    controlsText: "WASD / arrow keys move and steer • E enter/exit or open a chest • Space jump/climb • Shift descend • H honk • Escape pause • Gamepads supported.",
    mobileText: "Phone: left joystick to move and steer, GAS/BRAKE buttons on the right, drag an open area to move the camera. Tap ACTION to enter a vehicle or open a chest.",
    desktop: "DESKTOP",
    mobile: "TOUCH",
    creditsText: "Numatik Metropolis is a fictional procedural city for exploring and practicing mathematics. Buildings and landmarks use original geometry.",
    osm: "If OpenStreetMap data is generated with scripts/build-city.mjs, the map and derived data are available under the ODbL 1.0 license.",
    back: "Back",
    loading: "Preparing the city…",
    loadingFallback: "WebGL 2 is unavailable. Try an up-to-date browser or another device.",
    free: "Free roam",
    new: "New",
    close: "Close",
    gameOver: "Adventure auto-saved",
    parked: "Vehicle",
    wanted: "PURSUIT LEVEL",
    radar: "RADAR",
  },
  ja: {
    subtitle: "探索 • ドライブ • 発見",
    menuTag: "先生の部屋 · NUMATIK GAME",
    menuDescription: "街を走り、5つの宝箱を見つけ、数学の問題を解こう。",
    station: "警察署",
    port: "港",
    gas: "アクセル",
    brake: "ブレーキ",
    action: "アクション",
    jump: "ジャンプ",
    ascend: "上昇",
    honk: "クラクション",
    drift: "サイドブレーキ",
    heat: "近くに宝箱があるよ！",
    freshSave: "新しい冒険を始めると、宝箱とコインがリセットされます。",
    newGame: "冒険を始める",
    continue: "続ける",
    settings: "設定",
    controls: "遊び方",
    credits: "クレジット",
    content: "家族で楽しめる冒険です。武器や暴力はありません。歩行者は常に安全で、車両から離れます。衝突では車両がへこみ、薄い煙が出るだけです。",
    city: "広大な架空の街",
    treasures: "数学の宝箱 5 個",
    vehicles: "5 種類の乗り物",
    objectives: "街のミッション",
    clue: "ヒント",
    found: "発見した宝箱",
    speed: "速度",
    altitude: "高度",
    coins: "コイン",
    pause: "一時停止",
    openChest: "宝箱を開ける",
    question: "問題を解いて宝箱を開けよう",
    correct: "正解！宝箱が開き、コインを獲得しました。",
    wrong: "おしい！少し待つと新しい問題に挑戦できます。",
    retry: "少し待ってからもう一度試そう。",
    map: "街の地図",
    missions: "ミッション一覧",
    resume: "探索を続ける",
    caught: "安全に停止しました",
    caughtText: "街の係員が追跡を安全に終了しました。街の署に戻りました。宝箱の進行状況は保存されています。",
    fine: "罰金",
    return: "街に戻る",
    victory: "すべての宝箱を発見！",
    victoryText: "Numatik Metropolis を探索し、5つの数学チャレンジを達成しました。",
    wrongList: "復習する問題",
    noWrong: "すべて正解です！",
    playOn: "自由に探索を続ける",
    quality: "グラフィック品質",
    sound: "サウンド",
    sensitivity: "ハンドル感度",
    weather: "天気",
    clear: "晴れ",
    rain: "雨",
    time: "街の時刻",
    hour: "時",
    ultraWarning: "ウルトラは最大解像度を使うため、端末が熱くなり、電池の消費が増えることがあります。",
    autoHint: "解像度と表示距離を自動調整します。",
    buyRide: "街のガレージ",
    owned: "所有済み",
    buy: "購入",
    notEnough: "コインが足りません。",
    controlsText: "WASD / 矢印キーで移動・運転 • E で乗降または宝箱を開く • Space ジャンプ/上昇 • Shift 下降 • H クラクション • Escape 一時停止 • ゲームパッド対応。",
    mobileText: "スマートフォン: 左のジョイスティックで移動・運転、右のアクセル/ブレーキで操作。空いた場所をドラッグしてカメラを動かし、アクションで乗降や宝箱を開きます。",
    desktop: "デスクトップ",
    mobile: "タッチ",
    creditsText: "Numatik Metropolis は数学を学びながら探索するための架空の自動生成都市です。建物やランドマークは独自の形状で作られています。",
    osm: "scripts/build-city.mjs で OpenStreetMap データを生成した場合、地図と派生データは ODbL 1.0 ライセンスで提供されます。",
    back: "戻る",
    loading: "街を準備中…",
    loadingFallback: "WebGL 2 を利用できません。ブラウザを更新するか、別の端末をお試しください。",
    free: "自由探索",
    new: "新規",
    close: "閉じる",
    gameOver: "冒険を自動保存しました",
    parked: "乗り物",
    wanted: "追跡レベル",
    radar: "レーダー",
  },
} as const;

const VEHICLE_ICONS = {
  car: CarFront,
  motorcycle: Bike,
  boat: Ship,
  plane: Plane,
  helicopter: Plane,
};

const MetropolisMap = ({
  hud,
  collected,
  revealed,
  stationLabel,
  portLabel,
  mapLabel,
  large = false,
}: {
  hud: MetropolisHud;
  collected: number[];
  revealed: number[];
  stationLabel: string;
  portLabel: string;
  mapLabel: string;
  large?: boolean;
}) => {
  const toMap = (value: number) => 50 + (value / 720) * 46;
  return (
    <svg viewBox="0 0 100 100" className={large ? "metro-map metro-map--large" : "metro-map"} role="img" aria-label={mapLabel}>
      <rect x="1" y="1" width="98" height="98" rx="8" fill="#b9c9ad" />
      {[-80, -40, 0, 40, 80].map((line) => {
        const n = 50 + (line / 128) * 22;
        return <g key={line}>
          <path d={`M ${n} 2 V 98`} stroke="#687576" strokeWidth="2.4" />
          <path d={`M 2 ${n} H 98`} stroke="#687576" strokeWidth="2.4" />
          <path d={`M ${n} 2 V 98`} stroke="#eee5cd" strokeWidth=".35" />
          <path d={`M 2 ${n} H 98`} stroke="#eee5cd" strokeWidth=".35" />
        </g>;
      })}
      <path d="M 0 65 C 22 58 26 74 48 63 S 72 54 100 62" fill="none" stroke="#54a7b0" strokeWidth="4.8" />
      <path d="M 0 65 C 22 58 26 74 48 63 S 72 54 100 62" fill="none" stroke="#bce2da" strokeWidth=".5" strokeDasharray="2 2" />
      <rect x="71" y="19" width="14" height="9" rx="1" fill="#d0d5cf" stroke="#fff" strokeWidth=".6" />
      <path d="M 78 21 V 26 M 75.5 23.5 H 80.5" stroke="#f0ebdc" strokeWidth=".6" />
      <path d="M 15 79 H 32" stroke="#e9e9df" strokeWidth="2" strokeDasharray="2 1" />
      <circle cx="18" cy="21" r="2" fill="#8d688c" stroke="#fff" strokeWidth=".8" />
      <text x="20.5" y="21.8" fontSize="3.1" fill="#273340">{stationLabel}</text>
      {TREASURES.filter((treasure) => revealed.includes(treasure.id)).map((treasure) => (
        <g key={treasure.id} opacity={collected.includes(treasure.id) ? 0.35 : 1}>
          <circle cx={toMap(treasure.x)} cy={toMap(treasure.z)} r={collected.includes(treasure.id) ? 1.5 : 2.2} fill={collected.includes(treasure.id) ? "#718278" : "#ffd05e"} stroke="#fff" strokeWidth=".7" />
        </g>
      ))}
      <path d={`M ${toMap(hud.x)} ${toMap(hud.z) - 2.6} L ${toMap(hud.x) - 2.2} ${toMap(hud.z) + 2} L ${toMap(hud.x) + 2.2} ${toMap(hud.z) + 2} Z`} fill="#e75e51" stroke="#fff" strokeWidth=".75" />
      <circle cx="79" cy="74" r="1.7" fill="#e87959" stroke="#fff" strokeWidth=".5" />
      <text x="82" y="75" fontSize="3" fill="#273340">{portLabel}</text>
    </svg>
  );
};

const NumatikMetropolisPage = () => {
  const hostRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<MetropolisGame | null>(null);
  const saveRef = useRef(readSave());
  const screenRef = useRef<Screen>("menu");
  const returnScreen = useRef<Screen>("menu");
  const currentHud = useRef<MetropolisHud>(EMPTY_HUD);
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { isDark } = useTheme();
  const t = translations[language];
  const translationRef = useRef(t);
  translationRef.current = t;
  const mapLabels = { stationLabel: t.station, portLabel: t.port, mapLabel: t.map };
  const [save, setSave] = useState<SaveData>(saveRef.current);
  const [hud, setHud] = useState<MetropolisHud>({ ...EMPTY_HUD, x: save.x, z: save.z, vehicle: save.vehicle, timeOfDay: save.hour });
  const [screen, setScreen] = useState<Screen>("menu");
  screenRef.current = screen;
  const [loading, setLoading] = useState(0);
  const [gameError, setGameError] = useState("");
  const [question, setQuestion] = useState<Question | null>(null);
  const [answerFeedback, setAnswerFeedback] = useState<Feedback>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [revealed, setRevealed] = useState<number[]>(save.collected.length ? [...save.collected, Math.min(4, Math.max(...save.collected) + 1)] : [0]);
  const [toast, setToast] = useState("");
  const [shopOpen, setShopOpen] = useState(false);
  const [largeMap, setLargeMap] = useState(false);
  const [newGamePrompt, setNewGamePrompt] = useState(false);
  const [wrongAnswers, setWrongAnswers] = useState(save.wrongAnswers);
  const touchState = useRef({ pointer: -1, x: 0, y: 0, mode: "" });
  const cameraPointer = useRef({ pointer: -1, x: 0, y: 0 });
  const questionIdRef = useRef<number | null>(null);
  const feedbackTimeout = useRef<number | null>(null);
  const retryBlockedUntil = useRef(0);
  const timerRef = useRef<number | null>(null);
  const joystickControls = useRef({ accelerate: 0, brake: 0, steer: 0 });
  const buttonControls = useRef({ accelerate: 0, brake: 0, handbrake: 0 });
  const [joystick, setJoystick] = useState({ x: 0, y: 0 });

  const syncTouchControls = useCallback(() => {
    gameRef.current?.setControls({
      accelerate: Math.max(joystickControls.current.accelerate, buttonControls.current.accelerate),
      brake: Math.max(joystickControls.current.brake, buttonControls.current.brake),
      steer: joystickControls.current.steer,
      handbrake: buttonControls.current.handbrake,
    });
  }, []);

  const updateSave = useCallback((updater: (previous: SaveData) => SaveData) => {
    setSave((previous) => {
      const next = updater(previous);
      saveRef.current = next;
      return next;
    });
  }, []);

  useEffect(() => {
    let active = true;
    const host = hostRef.current;
    if (!host) return undefined;
    void mountMetropolisGame(host, {
      onLoading: setLoading,
      onHud: (next) => {
        currentHud.current = next;
        setHud(next);
        updateSave((previous) => ({ ...previous, x: next.x, z: next.z, vehicle: next.vehicle ?? previous.vehicle, hour: next.timeOfDay }));
      },
      onNearbyTreasure: (id) => {
        setToast(id === null ? "" : translationRef.current.heat);
      },
      onOpenTreasure: (id) => {
        if (Date.now() < retryBlockedUntil.current) {
          gameRef.current?.setPaused(false);
          setToast(translationRef.current.retry);
          return;
        }
        questionIdRef.current = id;
        setQuestion(getNextQuestion());
        setSelectedAnswer(null);
        setAnswerFeedback(null);
        setToast("");
        setScreen("playing");
      },
      onCaught: (stars) => {
        const fine = WANTED_FINE[Math.min(stars, WANTED_FINE.length - 1)] ?? WANTED_FINE[1]!;
        updateSave((previous) => ({ ...previous, coins: Math.max(0, previous.coins - fine) }));
        setScreen("caught");
      },
      onNotice: setToast,
    }).then((game) => {
      if (!active) {
        game.dispose();
        return;
      }
      gameRef.current = game;
      game.setQuality(saveRef.current.quality);
      game.setSensitivity(saveRef.current.sensitivity);
      game.setWeather(saveRef.current.rain ? "rain" : "clear");
      game.setTimeOfDay(saveRef.current.hour);
      game.setPosition(saveRef.current.x, saveRef.current.z);
      game.setVehicle(saveRef.current.vehicle);
      if (saveRef.current.collected.length) {
        saveRef.current.collected.forEach((id) => game.setCollected(id));
        game.setPaused(true);
      }
    }).catch((error: unknown) => {
      if (active) setGameError(error instanceof Error ? error.message : String(error));
    });
    const pauseForBackground = () => {
      if (screenRef.current !== "playing" || questionIdRef.current !== null) return;
      gameRef.current?.setPaused(true);
      setScreen("paused");
    };
    const handleVisibility = () => {
      if (document.hidden) pauseForBackground();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    const capacitorWindow = window as unknown as {
      Capacitor?: {
        plugins?: {
          App?: {
            addListener?: (name: string, callback: (state: { isActive?: boolean }) => unknown) => unknown;
          };
        };
      };
    };
    const app = capacitorWindow.Capacitor?.plugins?.App;
    const subscriptions = [
      app?.addListener?.("appStateChange", (state) => {
        if (state.isActive === false) pauseForBackground();
      }),
      app?.addListener?.("backButton", () => pauseForBackground()),
    ].filter((subscription) => subscription !== undefined);
    return () => {
      active = false;
      document.removeEventListener("visibilitychange", handleVisibility);
      subscriptions.forEach((subscription) => {
        void Promise.resolve(subscription).then((listener) => {
          (listener as { remove?: () => void } | undefined)?.remove?.();
        });
      });
      if (feedbackTimeout.current !== null) window.clearTimeout(feedbackTimeout.current);
      if (timerRef.current !== null) window.clearInterval(timerRef.current);
      gameRef.current?.dispose();
      gameRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (screen !== "playing" || question) return;
    timerRef.current = window.setInterval(() => {
      updateSave((previous) => ({
        ...previous,
        elapsed: previous.elapsed + 1,
        x: currentHud.current.x,
        z: currentHud.current.z,
        vehicle: currentHud.current.vehicle ?? previous.vehicle,
        hour: currentHud.current.timeOfDay,
      }));
    }, 1000);
    return () => {
      if (timerRef.current !== null) window.clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [screen, question, updateSave]);

  useEffect(() => {
    const timer = window.setTimeout(() => saveData(save), 600);
    return () => window.clearTimeout(timer);
  }, [save]);

  useEffect(() => {
    syncTouchControls();
  }, [hud, screen, syncTouchControls]);

  useEffect(() => {
    if (screen === "playing") {
      history.pushState({ numatikMetropolis: true }, "");
    }
    const handlePop = () => {
      if (screen === "playing") {
        gameRef.current?.setPaused(true);
        setScreen("paused");
        history.pushState({ numatikMetropolis: true }, "");
      }
    };
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, [screen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (screen === "playing" && event.key === "Escape" && !question) {
        event.preventDefault();
        gameRef.current?.setPaused(true);
        setScreen("paused");
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [screen, question]);

  const start = () => {
    if (!gameRef.current) return;
    gameRef.current.setPosition(save.x, save.z);
    gameRef.current.setVehicle(save.vehicle);
    gameRef.current.start();
    gameRef.current.setPaused(false);
    setScreen("playing");
    setNewGamePrompt(false);
  };

  const beginNewGame = () => {
    const next = { ...DEFAULT_SAVE };
    saveRef.current = next;
    setSave(next);
    setWrongAnswers([]);
    setRevealed([0]);
    gameRef.current?.reset();
    gameRef.current?.setVehicle("car");
    gameRef.current?.setPosition(8, 12);
    gameRef.current?.start();
    setScreen("playing");
    setNewGamePrompt(false);
  };

  const answerQuestion = (index: number) => {
    if (!question || answerFeedback) return;
    const treasureId = questionIdRef.current;
    if (treasureId === null) return;
    setSelectedAnswer(index);
    if (index === question.correctIndex) {
      setAnswerFeedback("correct");
      if (save.sound) playTone(true);
      feedbackTimeout.current = window.setTimeout(() => {
        const total = new Set([...saveRef.current.collected, treasureId]).size;
        gameRef.current?.setCollected(treasureId);
        questionIdRef.current = null;
        setQuestion(null);
        setAnswerFeedback(null);
        setSelectedAnswer(null);
        updateSave((previous) => ({
          ...previous,
          coins: previous.coins + 75,
          collected: previous.collected.includes(treasureId) ? previous.collected : [...previous.collected, treasureId],
        }));
        setRevealed((previous) => previous.includes(treasureId + 1) || treasureId >= 4 ? previous : [...previous, treasureId + 1]);
        if (total >= TREASURES.length) {
          gameRef.current?.setPaused(true);
          setScreen("win");
        } else {
          gameRef.current?.setPaused(false);
        }
      }, 700);
    } else {
      setAnswerFeedback("wrong");
      if (save.sound) playTone(false);
      const record: WrongAnswer = {
        text: question.text,
        selected: question.options[index] ?? "",
        answer: question.options[question.correctIndex] ?? "",
        explanation: question.explanation ?? "",
      };
      setWrongAnswers((previous) => [...previous, record]);
      updateSave((previous) => ({ ...previous, wrongAnswers: [...previous.wrongAnswers, record] }));
      feedbackTimeout.current = window.setTimeout(() => {
        retryBlockedUntil.current = Date.now() + 1800;
        questionIdRef.current = null;
        setQuestion(null);
        setAnswerFeedback(null);
        setSelectedAnswer(null);
        gameRef.current?.setPaused(false);
        setToast(t.wrong);
      }, 1100);
    }
  };

  const playTone = (correct: boolean) => {
    try {
      const context = new window.AudioContext();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = correct ? 760 : 240;
      gain.gain.setValueAtTime(0.08, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.18);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.19);
      oscillator.onended = () => void context.close();
    } catch {
      // Browser audio can be unavailable until the first user gesture.
    }
  };

  const pause = () => {
    gameRef.current?.setPaused(true);
    setScreen("paused");
  };
  const resume = () => {
    setScreen("playing");
    gameRef.current?.setPaused(false);
  };
  const returnToCity = () => {
    gameRef.current?.setPosition(-18, -18);
    gameRef.current?.setVehicle("car");
    gameRef.current?.setPaused(false);
    setScreen("playing");
  };
  const pickVehicle = (kind: VehicleKind) => {
    const offer = VEHICLE_OFFERS.find((item) => item.id === kind);
    if (!offer) return;
    if (save.owned.includes(kind)) {
      gameRef.current?.setVehicle(kind);
      updateSave((previous) => ({ ...previous, vehicle: kind }));
      setShopOpen(false);
      return;
    }
    if (save.coins < offer.price) {
      setToast(t.notEnough);
      return;
    }
    updateSave((previous) => ({ ...previous, coins: previous.coins - offer.price, owned: [...previous.owned, kind], vehicle: kind }));
    gameRef.current?.setVehicle(kind);
    setShopOpen(false);
  };

  const setQuality = (value: MetropolisQuality) => {
    updateSave((previous) => ({ ...previous, quality: value }));
    gameRef.current?.setQuality(value);
  };

  const openSettings = () => {
    returnScreen.current = screen;
    setScreen("settings");
    gameRef.current?.setPaused(true);
  };
  const openInfo = (next: "help" | "credits") => {
    returnScreen.current = screen;
    setScreen(next);
  };
  const backFromPanel = () => setScreen(returnScreen.current);

  const activeTreasure = hud.nearTreasure === null ? null : TREASURES[hud.nearTreasure];
  const nextTreasure = TREASURES.find((item) => !save.collected.includes(item.id));
  const activeClue = nextTreasure?.clue[language] ?? t.victoryText;
  const mapX = 50 + (hud.x / 720) * 46;
  const mapY = 50 + (hud.z / 720) * 46;
  const fine = WANTED_FINE[Math.min(Math.max(1, Math.round(hud.stars)), WANTED_FINE.length - 1)] ?? WANTED_FINE[1]!;
  const VehicleIcon = hud.vehicle ? VEHICLE_ICONS[hud.vehicle] : null;
  const elapsed = save.elapsed;

  const beginTouch = (event: React.PointerEvent<HTMLDivElement>, mode: string) => {
    event.preventDefault();
    touchState.current = { pointer: event.pointerId, x: event.clientX, y: event.clientY, mode };
    event.currentTarget.setPointerCapture(event.pointerId);
    updateTouch(event.clientX, event.clientY);
  };
  const updateTouch = (x: number, y: number) => {
    const state = touchState.current;
    if (state.pointer < 0 || state.mode !== "move") return;
    const bounds = 46;
    const dx = Math.max(-bounds, Math.min(bounds, x - state.x)) / bounds;
    const dy = Math.max(-bounds, Math.min(bounds, y - state.y)) / bounds;
    setJoystick({ x: dx, y: dy });
    joystickControls.current.steer = dx * save.sensitivity;
    joystickControls.current.accelerate = Math.max(0, -dy);
    joystickControls.current.brake = Math.max(0, dy);
    syncTouchControls();
  };
  const endTouch = (pointer: number) => {
    if (touchState.current.pointer !== pointer) return;
    const mode = touchState.current.mode;
    touchState.current.pointer = -1;
    touchState.current.mode = "";
    setJoystick({ x: 0, y: 0 });
    if (mode === "move") joystickControls.current = { accelerate: 0, brake: 0, steer: 0 };
    syncTouchControls();
  };

  const pointerDown = (event: React.PointerEvent<HTMLElement>) => {
    if (event.target instanceof HTMLElement && event.target.closest("button, .metro-touch-controls, .metro-map-card, .metro-panel")) return;
    cameraPointer.current = { pointer: event.pointerId, x: event.clientX, y: event.clientY };
    (event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
  };
  const pointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (cameraPointer.current.pointer !== event.pointerId) return;
    const dx = event.clientX - cameraPointer.current.x;
    const dy = event.clientY - cameraPointer.current.y;
    cameraPointer.current = { pointer: event.pointerId, x: event.clientX, y: event.clientY };
    gameRef.current?.setCameraLook(dx, dy);
  };
  const pointerUp = (event: React.PointerEvent<HTMLElement>) => {
    if (cameraPointer.current.pointer === event.pointerId) cameraPointer.current.pointer = -1;
  };

  return (
    <main className="metro-game" data-theme={isDark ? "dark" : "light"} onContextMenu={(event) => event.preventDefault()} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={pointerUp}>
      <div className="metro-canvas" ref={hostRef} />
      <div className="metro-screen-wash" />

      <header className="metro-topbar">
        <button className="metro-icon-button" type="button" onClick={() => navigate("/ruang-untuk-guru/numatik-game")} aria-label={t.back}><ArrowLeft size={18} /></button>
        <div className="metro-brand">
          <span className="metro-brand-mark"><Compass size={22} /></span>
          <span><b>NUMATIK METROPOLIS</b><small>{t.subtitle}</small></span>
        </div>
        {screen === "playing" && !question ? (
          <button className="metro-icon-button" type="button" onClick={pause} aria-label={t.pause}><Pause size={18} /></button>
        ) : <span className="metro-coins"><Coins size={16} /> {save.coins}</span>}
      </header>

      {loading < 1 && !gameError && (
        <div className="metro-loading">
          <Compass size={32} className="metro-spin" />
          <strong>{t.loading}</strong>
          <div className="metro-progress"><i style={{ width: `${Math.round(loading * 100)}%` }} /></div>
          <small>{Math.round(loading * 100)}%</small>
        </div>
      )}

      {screen === "playing" && !question && (
        <>
          <section className="metro-hud">
            <div className="metro-hud-card metro-mission-card">
              <span className="metro-eyebrow"><Gem size={13} /> {t.found}</span>
              <strong>{String(save.collected.length).padStart(2, "0")} <small>/ 05</small></strong>
              <div className="metro-dots">{TREASURES.map((item) => <i key={item.id} className={save.collected.includes(item.id) ? "is-found" : ""} />)}</div>
            </div>
            <div className="metro-hud-card metro-speed-card">
              <span className="metro-eyebrow">{VehicleIcon ? <VehicleIcon size={13} /> : <Compass size={13} />} {hud.vehicle ? t.speed : t.parked}</span>
              <strong>{hud.vehicle ? Math.round(hud.speed) : t.free}<small>{hud.vehicle ? " km/h" : ""}</small></strong>
              {(hud.vehicle === "plane" || hud.vehicle === "helicopter") && <small className="metro-altitude">{t.altitude}: {Math.round(hud.altitude)} m</small>}
            </div>
            <div className="metro-hud-card metro-stars-card">
              <span className="metro-eyebrow">{t.wanted}</span>
              <strong className={hud.stars ? "is-wanted" : ""}>{Array.from({ length: 5 }, (_, index) => <span key={index}>{index < Math.round(hud.stars) ? "★" : "☆"}</span>)}</strong>
            </div>
          </section>

          <button className="metro-map-card" type="button" onClick={() => { setLargeMap(true); pause(); }}>
            <span className="metro-map-title"><MapIcon size={13} /> {t.radar}</span>
            <MetropolisMap hud={hud} collected={save.collected} revealed={revealed} {...mapLabels} />
            <span className="metro-map-dot" style={{ left: `${mapX}%`, top: `${mapY}%` }} />
            <span className="metro-map-footer"><i /> {t.city}</span>
          </button>

          <div className="metro-objective">
            <span className="metro-objective-icon"><Sparkles size={16} /></span>
            <span><small>{t.objectives} · {save.collected.length + 1}/5</small><b>{nextTreasure ? nextTreasure.name[language] : t.victory}</b><em>{activeClue}</em></span>
          </div>

          {activeTreasure && (
            <button type="button" className="metro-interact" onClick={() => gameRef.current?.interact()}>
              <Gem size={16} /> {t.openChest} · {activeTreasure.name[language]} <kbd>E</kbd>
            </button>
          )}

          <div className="metro-touch-controls">
            <div
              className="metro-joystick"
              onPointerDown={(event) => beginTouch(event, "move")}
              onPointerMove={(event) => { if (touchState.current.pointer === event.pointerId) updateTouch(event.clientX, event.clientY); }}
              onPointerUp={(event) => endTouch(event.pointerId)}
              onPointerCancel={(event) => endTouch(event.pointerId)}
              onLostPointerCapture={(event) => endTouch(event.pointerId)}
              aria-label={t.mobile}
            >
              <span className="metro-joystick-ring"><i style={{ transform: `translate(${joystick.x * 17}px, ${joystick.y * 17}px)` }} /></span><small>{t.mobile}</small>
            </div>
            <div className="metro-action-cluster">
              <button type="button" onPointerDown={(event) => { event.preventDefault(); event.currentTarget.setPointerCapture(event.pointerId); buttonControls.current.accelerate = 1; syncTouchControls(); }} onPointerUp={() => { buttonControls.current.accelerate = 0; syncTouchControls(); }} onPointerCancel={() => { buttonControls.current.accelerate = 0; syncTouchControls(); }}>{t.gas}</button>
              <button type="button" onPointerDown={(event) => { event.preventDefault(); event.currentTarget.setPointerCapture(event.pointerId); buttonControls.current.brake = 1; syncTouchControls(); }} onPointerUp={() => { buttonControls.current.brake = 0; syncTouchControls(); }} onPointerCancel={() => { buttonControls.current.brake = 0; syncTouchControls(); }}>{t.brake}</button>
              <button type="button" className="metro-action-primary" onClick={() => gameRef.current?.interact()}>{activeTreasure ? t.openChest : t.action}</button>
              <button type="button" onClick={() => gameRef.current?.jump()}>{hud.vehicle === "helicopter" || hud.vehicle === "plane" ? t.ascend : t.jump}</button>
              <button type="button" onClick={() => gameRef.current?.honk()}>{t.honk}</button>
              <button type="button" onPointerDown={(event) => { event.preventDefault(); event.currentTarget.setPointerCapture(event.pointerId); buttonControls.current.handbrake = 1; syncTouchControls(); }} onPointerUp={() => { buttonControls.current.handbrake = 0; syncTouchControls(); }} onPointerCancel={() => { buttonControls.current.handbrake = 0; syncTouchControls(); }}>{t.drift}</button>
            </div>
          </div>
          <div className="metro-controls-hint"><kbd>WASD</kbd> · E aksi · <kbd>ESC</kbd> {t.pause}</div>
          {toast && <div className="metro-toast" role="status">{toast}</div>}
        </>
      )}

      {screen === "menu" && (
        <div className="metro-menu-wrap">
          <section className="metro-menu-panel">
            <span className="metro-menu-kicker"><Sparkles size={14} /> {t.menuTag}</span>
            <h1>NUMATIK<br /><em>METROPOLIS</em></h1>
            <p className="metro-menu-subtitle">{t.subtitle}</p>
            <p className="metro-menu-copy">{t.menuDescription}</p>
            <div className="metro-feature-row">
              <span><Gem size={16} /> {t.treasures}</span><span><CarFront size={16} /> {t.vehicles}</span><span><Clock3 size={16} /> {formatTime(save.elapsed)}</span>
            </div>
            <div className="metro-menu-actions">
              <button className="metro-primary-button" type="button" onClick={save.collected.length || save.elapsed ? start : beginNewGame}><Play size={17} /> {save.collected.length || save.elapsed ? t.continue : t.newGame}</button>
              <button className="metro-secondary-button" type="button" onClick={() => setNewGamePrompt(true)}><RotateCcw size={16} /> {t.new}</button>
            </div>
            <div className="metro-menu-links">
              <button type="button" onClick={openSettings}><Settings size={15} /> {t.settings}</button>
              <button type="button" onClick={() => openInfo("help")}><CircleHelp size={15} /> {t.controls}</button>
              <button type="button" onClick={() => openInfo("credits")}><Sparkles size={15} /> {t.credits}</button>
            </div>
            <div className="metro-content-note"><strong>ⓘ</strong> {t.content}</div>
          </section>
          <div className="metro-menu-caption"><span>{String(save.collected.length).padStart(2, "0")} / 05</span><i /> {t.missions}</div>
        </div>
      )}

      {screen === "paused" && (
        <div className="metro-modal-backdrop">
          <section className="metro-panel metro-pause-panel">
            <div className="metro-panel-header"><span><Pause size={17} /> {t.pause}</span><button type="button" onClick={resume} aria-label={t.close}><X size={18} /></button></div>
            <div className="metro-pause-content">
              <div className="metro-full-map"><h3>{t.map}</h3><MetropolisMap hud={hud} collected={save.collected} revealed={revealed} {...mapLabels} large /></div>
              <div className="metro-mission-list">
                <h3>{t.missions}</h3>
                {TREASURES.map((item) => <div key={item.id} className={save.collected.includes(item.id) ? "is-complete" : ""}>
                  <i>{save.collected.includes(item.id) ? <Check size={12} /> : String(item.id + 1).padStart(2, "0")}</i><span><b>{item.name[language]}</b><small>{item.district[language]} · {revealed.includes(item.id) ? item.clue[language] : "???"}</small></span>{save.collected.includes(item.id) && <Gem size={15} />}
                </div>)}
              </div>
            </div>
            <div className="metro-pause-actions">
              <button type="button" onClick={() => { setShopOpen(true); }}><CarFront size={16} /> {t.buyRide}</button>
              <button type="button" onClick={openSettings}><Settings size={16} /> {t.settings}</button>
              <button className="metro-primary-button" type="button" onClick={resume}><Play size={16} /> {t.resume}</button>
            </div>
          </section>
        </div>
      )}

      {(screen === "settings" || screen === "help" || screen === "credits") && (
        <div className="metro-modal-backdrop">
          <section className="metro-panel metro-info-panel">
            <div className="metro-panel-header">
              <span>{screen === "settings" ? <Settings size={17} /> : screen === "help" ? <CircleHelp size={17} /> : <Sparkles size={17} />} {screen === "settings" ? t.settings : screen === "help" ? t.controls : t.credits}</span>
              <button type="button" onClick={backFromPanel} aria-label={t.close}><X size={18} /></button>
            </div>
            {screen === "settings" ? (
              <div className="metro-settings">
                <label>{t.quality}<select value={save.quality} onChange={(event) => setQuality(event.target.value as MetropolisQuality)}>{QUALITY_OPTIONS.map((item) => <option key={item} value={item}>{item.toUpperCase()}</option>)}</select></label>
                <small>{save.quality === "auto" ? t.autoHint : save.quality === "ultra" ? t.ultraWarning : ""}</small>
                <label>{t.sound}<button className="metro-toggle" type="button" onClick={() => updateSave((previous) => ({ ...previous, sound: !previous.sound }))}>{save.sound ? <Volume2 size={16} /> : <VolumeX size={16} />}{save.sound ? "ON" : "OFF"}</button></label>
                <label>{t.sensitivity}<input type="range" min="0.35" max="2" step="0.05" value={save.sensitivity} onChange={(event) => {
                  const sensitivity = Number(event.target.value);
                  updateSave((previous) => ({ ...previous, sensitivity }));
                  gameRef.current?.setSensitivity(sensitivity);
                }} /></label>
                <label>{t.weather}<select value={save.rain ? "rain" : "clear"} onChange={(event) => {
                  const rain = event.target.value === "rain";
                  updateSave((previous) => ({ ...previous, rain }));
                  gameRef.current?.setWeather(rain ? "rain" : "clear");
                }}><option value="clear">{t.clear}</option><option value="rain">{t.rain}</option></select></label>
                <label>{t.time}<span className="metro-time-control"><input type="range" min="0" max="23.9" step="0.1" value={save.hour} onChange={(event) => {
                  const hour = Number(event.target.value);
                  updateSave((previous) => ({ ...previous, hour }));
                  gameRef.current?.setTimeOfDay(hour);
                }} />{Math.floor(save.hour)} {t.hour}</span></label>
              </div>
            ) : <div className="metro-info-copy">
              {screen === "help" ? <><p>{t.controlsText}</p><p>{t.mobileText}</p><p>{t.content}</p></> : <><p>{t.creditsText}</p><p>{t.osm}</p><a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap copyright and license</a></>}
            </div>}
            <div className="metro-panel-footer"><button className="metro-primary-button" type="button" onClick={backFromPanel}>{t.back}</button></div>
          </section>
        </div>
      )}

      {question && (
        <div className="metro-modal-backdrop">
          <section className="metro-panel metro-question-panel" role="dialog" aria-modal="true" aria-labelledby="metro-question-title">
            <div className="metro-question-gem"><Gem size={24} /></div>
            <span className="metro-menu-kicker">{t.question} · {TREASURES[questionIdRef.current ?? 0]?.name[language]}</span>
            <h2 id="metro-question-title">{question.text}</h2>
            <div className="metro-answer-options">
              {question.options.map((option, index) => {
                const selected = index === selectedAnswer;
                const status = answerFeedback && selected ? answerFeedback : "";
                return <button key={`${question.id}-${option}`} type="button" disabled={Boolean(answerFeedback)} className={`${selected ? "is-selected" : ""} ${status ? `is-${status}` : ""}`} onClick={() => answerQuestion(index)}>
                  <i>{String.fromCharCode(65 + index)}</i>{option}{status === "correct" && <Check size={17} />}
                </button>;
              })}
            </div>
            {answerFeedback && <div className={`metro-answer-feedback is-${answerFeedback}`}>{answerFeedback === "correct" ? t.correct : t.wrong}</div>}
            <small className="metro-question-explanation">{answerFeedback === "wrong" ? question.explanation : ""}</small>
          </section>
        </div>
      )}

      {screen === "caught" && (
        <div className="metro-modal-backdrop">
          <section className="metro-panel metro-outcome-panel">
            <div className="metro-outcome-icon"><Compass size={34} /></div><span className="metro-menu-kicker">{t.caught}</span>
            <h2>{t.caught}</h2><p>{t.caughtText}</p>
            <div className="metro-fine-line"><span>{t.fine}</span><b>-{fine} <Coins size={16} /></b></div>
            <button className="metro-primary-button" type="button" onClick={returnToCity}><Play size={16} /> {t.return}</button>
          </section>
        </div>
      )}

      {screen === "win" && (
        <div className="metro-modal-backdrop">
          <section className="metro-panel metro-outcome-panel metro-win-panel">
            <div className="metro-outcome-icon"><Trophy size={36} /></div><span className="metro-menu-kicker">{t.victory}</span>
            <h2>{t.victory}</h2><p>{t.victoryText}</p>
            <div className="metro-win-stats"><span><Clock3 size={15} /> {formatTime(elapsed)}</span><span><Check size={15} /> 5 / 5</span><span><Coins size={15} /> {save.coins}</span></div>
            <h3>{t.wrongList}</h3>
            <div className="metro-wrong-list">{wrongAnswers.length ? wrongAnswers.map((item, index) => <div key={`${item.text}-${index}`}><b>{item.text}</b><small>{item.selected} → {item.answer}. {item.explanation}</small></div>) : <p>{t.noWrong}</p>}</div>
            <button className="metro-primary-button" type="button" onClick={() => { setScreen("playing"); gameRef.current?.setPaused(false); }}>{t.playOn}</button>
          </section>
        </div>
      )}

      {shopOpen && (
        <div className="metro-modal-backdrop">
          <section className="metro-panel metro-shop-panel">
            <div className="metro-panel-header"><span><CarFront size={17} /> {t.buyRide}</span><button type="button" onClick={() => setShopOpen(false)} aria-label={t.close}><X size={18} /></button></div>
            <div className="metro-shop-list">{VEHICLE_OFFERS.map((offer) => {
              const Icon = VEHICLE_ICONS[offer.id];
              const owned = save.owned.includes(offer.id);
              return <article key={offer.id}>
                <span className="metro-shop-icon"><Icon size={22} /></span><span><b>{offer.name[language]}</b><small>{offer.description[language]}</small></span>
                <button type="button" onClick={() => pickVehicle(offer.id)}>{owned ? t.owned : <>{offer.price} <Coins size={14} /> · {t.buy}</>}</button>
              </article>;
            })}</div>
          </section>
        </div>
      )}

      {newGamePrompt && (
        <div className="metro-modal-backdrop">
          <section className="metro-panel metro-outcome-panel">
            <div className="metro-panel-header"><span><RotateCcw size={17} /> {t.newGame}</span><button type="button" onClick={() => setNewGamePrompt(false)} aria-label={t.close}><X size={18} /></button></div>
            <p>{t.freshSave}</p>
            <button className="metro-primary-button" type="button" onClick={beginNewGame}>{t.newGame}</button>
          </section>
        </div>
      )}

      {largeMap && screen === "paused" && (
        <div className="metro-modal-backdrop metro-map-overlay" onClick={() => setLargeMap(false)}>
          <section className="metro-panel metro-large-map-panel" onClick={(event) => event.stopPropagation()}>
            <div className="metro-panel-header"><span><MapIcon size={17} /> {t.map}</span><button type="button" onClick={() => setLargeMap(false)} aria-label={t.close}><X size={18} /></button></div>
            <MetropolisMap hud={hud} collected={save.collected} revealed={revealed} {...mapLabels} large />
            <div className="metro-legend"><span>▲ {t.desktop}</span><span>● {t.treasures}</span><span>✚ {t.buyRide}</span></div>
            <button className="metro-primary-button" type="button" onClick={() => setLargeMap(false)}>{t.back}</button>
          </section>
        </div>
      )}

      {gameError && (
        <div className="metro-error">
          <Compass size={35} /><h1>NUMATIK METROPOLIS</h1><p>{t.loadingFallback}</p><small>{gameError}</small>
          <button className="metro-secondary-button" type="button" onClick={() => navigate("/ruang-untuk-guru/numatik-game")}>{t.back}</button>
        </div>
      )}
    </main>
  );
};

export default NumatikMetropolisPage;
