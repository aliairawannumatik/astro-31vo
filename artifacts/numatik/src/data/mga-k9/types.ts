import type { QuizQuestion } from "@/components/MeteorShootingGame";
import type { MQ as FlappyMQ } from "@/pages/numatik-gamez/umum/FlappyRocketPage";
import type { MQ as TankMQ } from "@/pages/numatik-gamez/umum/BattleTankPage";
import type { MQ as SpaceMQ } from "@/pages/numatik-gamez/umum/SpaceImpactPage";
import type { MQ as DinoMQ } from "@/pages/numatik-gamez/umum/DinoRunGamePage";
import type { GuruQuestion } from "@/hooks/useGuruQuiz";

export type VariantSlug =
  | "pesawat-tembak-meteor"
  | "flappy-rocket"
  | "tembak-tank"
  | "space-impact"
  | "turtle-run"
  | "tetris"
  | "snake-math";

export interface SubmaterialQuestionsK9 {
  meteor: QuizQuestion[];
  flappyRocket: FlappyMQ[];
  tembakTank: TankMQ[];
  spaceImpact: SpaceMQ[];
  turtleRun: DinoMQ[];
  snake: GuruQuestion[];
}

export interface SubmaterialEntryK9 {
  slug: string;
  label: string;
  emoji: string;
  parentSlug: string;
  parentLabel: string;
  questions: SubmaterialQuestionsK9;
}

export type RegistryK9 = Record<string, SubmaterialEntryK9>;

export interface BaseQ {
  q: string;
  opts: string[];
  correct: number;
  numAns?: number;
}
