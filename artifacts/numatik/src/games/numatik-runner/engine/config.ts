export const RUNNER_CONFIG = {
  render: {
    pixelRatioLimit: 1.75,
    maxDeltaSeconds: 0.04,
    cameraNear: 0.1,
    cameraFar: 180,
    fieldOfView: 66,
    exposure: 1.08,
    clearColor: "#73cafa",
    adaptivePixelRatio: true,
    lowPixelRatio: 1,
  },
  world: {
    laneCount: 3,
    laneWidth: 2.8,
    roadWidth: 10.2,
    roadLength: 30,
    roadSegments: 10,
    groundColor: "#8ccf8b",
    roadColor: "#343d4a",
    laneLineColor: "#e8eef2",
    laneLineWidth: 0.055,
    skyTop: "#3d9ce0",
    skyHorizon: "#d8f6ff",
    fogColor: "#c5eaff",
    fogNear: 48,
    fogFar: 145,
    decorationSegmentCount: 12,
    treePalette: ["#32946d", "#47a974", "#78be72", "#249b94"] as const,
  },
  movement: {
    startSpeed: 12,
    maxSpeed: 26,
    acceleration: 0.16,
    laneSwitchDuration: 0.16,
    jumpVelocity: 8.8,
    gravity: 22,
    fastFallGravityMultiplier: 2.8,
    slideDuration: 0.7,
    collisionInvulnerability: 1.5,
    startingLives: 3,
    playerZ: 1.5,
    playerStandingHeight: 1.8,
    playerSlidingHeight: 0.72,
    playerWidth: 0.86,
    playerDepth: 0.68,
  },
  obstacles: {
    firstSpawnDistance: 42,
    spawnAheadDistance: 155,
    minSpacing: 22,
    maxSpacing: 34,
    questionInterval: 120,
    questionFirstDistance: 120,
    questionNotifyDistance: 34,
    questionGateClearance: 24,
    lowBarWidth: 1.3,
    lowBarHeight: 0.88,
    lowBarDepth: 0.9,
    overheadBarWidth: 1.7,
    overheadBarHeight: 0.38,
    overheadBarDepth: 0.8,
    overheadBarBottom: 1.24,
    wallWidth: 1.2,
    wallHeight: 2.3,
    wallDepth: 0.75,
    coinRadius: 0.32,
    coinHeight: 1.15,
    coinSpacing: 2.2,
    poolSize: 64,
  },
  player: {
    bodyColor: "#f2f7fa",
    headColor: "#eaf2f8",
    accentColor: "#24c9d8",
    visorColor: "#162c45",
    jointColor: "#40536a",
    eyeColor: "#7cf3ff",
  },
  camera: {
    height: 5.2,
    distance: 9.5,
    lookHeight: 1.2,
    smoothing: 6,
  },
  scoring: {
    coinValue: 10,
    correctAnswerBonus: 100,
    wrongAnswerToastDuration: 1.4,
  },
} as const;

export type RunnerConfig = typeof RUNNER_CONFIG;

export type RunnerConfigOverrides = {
  render?: Partial<RunnerConfig["render"]>;
  world?: Partial<RunnerConfig["world"]>;
  movement?: Partial<RunnerConfig["movement"]>;
  obstacles?: Partial<RunnerConfig["obstacles"]>;
  player?: Partial<RunnerConfig["player"]>;
  camera?: Partial<RunnerConfig["camera"]>;
  scoring?: Partial<RunnerConfig["scoring"]>;
};

export const createRunnerConfig = (overrides: RunnerConfigOverrides = {}) => ({
  render: { ...RUNNER_CONFIG.render, ...overrides.render },
  world: { ...RUNNER_CONFIG.world, ...overrides.world },
  movement: { ...RUNNER_CONFIG.movement, ...overrides.movement },
  obstacles: { ...RUNNER_CONFIG.obstacles, ...overrides.obstacles },
  player: { ...RUNNER_CONFIG.player, ...overrides.player },
  camera: { ...RUNNER_CONFIG.camera, ...overrides.camera },
  scoring: { ...RUNNER_CONFIG.scoring, ...overrides.scoring },
});

export type ResolvedRunnerConfig = ReturnType<typeof createRunnerConfig>;
