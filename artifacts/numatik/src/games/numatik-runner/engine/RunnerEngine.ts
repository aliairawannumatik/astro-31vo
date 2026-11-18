import * as THREE from "three";
import { createRunnerConfig, type RunnerConfigOverrides } from "./config";
import { getNextQuestion, type QuestionBankConfig, type RunnerQuestion as BankQuestion } from "../questions/bank";

export interface RunnerQuestion {
  id: string;
  text: string;
  options: [string, string, string];
  correctIndex: number;
  answer: string;
}

export interface RunnerHud {
  score: number;
  distance: number;
  lives: number;
  combo: number;
  correct: number;
  wrong: number;
}

export type RunnerSound = "jump" | "slide" | "coin" | "hit" | "correct" | "incorrect" | "countdown";

export interface RunnerEngineCallbacks {
  onHud?: (hud: RunnerHud) => void;
  onQuestion?: (question: RunnerQuestion) => void;
  onAnswer?: (correct: boolean, explanation: string) => void;
  onGameOver?: (score: number, correct: number, wrong: number) => void;
  onCountdown?: (countdown: number) => void;
  onToast?: (message: string) => void;
  onSound?: (sound: RunnerSound) => void;
}

export interface RunnerEngineOptions extends RunnerEngineCallbacks {
  config?: RunnerConfigOverrides;
  questionConfig?: QuestionBankConfig;
}

export interface RunnerGame {
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  setPaused: (paused: boolean) => void;
  moveLane: (direction: -1 | 1) => void;
  jump: () => void;
  slide: () => void;
  setMuted: (muted: boolean) => void;
  dispose: () => void;
}

type EntityKind = "low-bar" | "overhead-bar" | "wall" | "coin" | "question";
type ObstacleKind = Exclude<EntityKind, "coin" | "question">;

interface RunnerEntity {
  kind: EntityKind;
  distance: number;
  lane: number;
  group: THREE.Group;
  question?: RunnerQuestion;
  notified?: boolean;
}

interface Pool {
  available: THREE.Group[];
  active: Set<THREE.Group>;
}

const laneCenter = (lane: number, laneWidth: number) => (lane - 1) * laneWidth;
const randomBetween = (minimum: number, maximum: number) => minimum + Math.random() * (maximum - minimum);

const makeMaterial = (color: THREE.ColorRepresentation, roughness = 0.75) =>
  new THREE.MeshStandardMaterial({ color, roughness, metalness: 0.02 });

const makeCanvasTexture = (question: RunnerQuestion, lane: number) => {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Unable to create question panel canvas");
  const backgrounds = ["#123a67", "#164f61", "#392c70"];
  const background = context.createLinearGradient(0, 0, canvas.width, canvas.height);
  background.addColorStop(0, backgrounds[lane]!);
  background.addColorStop(1, "#07172c");
  context.fillStyle = background;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = "#75e9ef";
  context.lineWidth = 12;
  context.strokeRect(8, 8, canvas.width - 16, canvas.height - 16);
  context.textAlign = "center";
  context.fillStyle = "#a9f7f5";
  context.font = "bold 28px sans-serif";
  context.fillText(`LANE ${lane + 1}`, canvas.width / 2, 48);
  context.fillStyle = "#ffffff";
  context.font = "bold 42px sans-serif";
  context.fillText(question.text, canvas.width / 2, 116, 450);
  context.fillStyle = "#ffda68";
  context.font = "bold 66px sans-serif";
  context.fillText(question.options[lane]!, canvas.width / 2, 202, 440);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 2;
  return texture;
};

const makeAnswerQuestion = (question: BankQuestion): RunnerQuestion => ({
  id: question.id,
  text: question.prompt,
  options: question.choices,
  correctIndex: question.correctIndex,
  answer: question.answer,
});

export const mountRunnerGame = (
  host: HTMLElement,
  callbacks: RunnerEngineOptions = {},
): RunnerGame => {
  const config = createRunnerConfig(callbacks.config);
  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false,
    powerPreference: "high-performance",
  });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = config.render.exposure;
  renderer.shadowMap.enabled = false;
  renderer.domElement.setAttribute("aria-label", "Numatik Runner 3D game");
  renderer.domElement.tabIndex = 0;
  host.appendChild(renderer.domElement);

  const camera = new THREE.PerspectiveCamera(
    config.render.fieldOfView,
    host.clientWidth / Math.max(host.clientHeight, 1),
    config.render.cameraNear,
    config.render.cameraFar,
  );
  camera.position.set(0, config.camera.height, config.movement.playerZ + config.camera.distance);
  camera.lookAt(0, config.camera.lookHeight, config.movement.playerZ - 8);

  scene.background = new THREE.Color(config.world.skyHorizon);
  scene.fog = new THREE.Fog(config.world.fogColor, config.world.fogNear, config.world.fogFar);

  const hemisphere = new THREE.HemisphereLight("#f4fcff", "#71916c", 2.1);
  scene.add(hemisphere);
  const sunlight = new THREE.DirectionalLight("#fff5d5", 2.4);
  sunlight.position.set(-18, 30, 12);
  scene.add(sunlight);

  const sharedGeometries = new Set<THREE.BufferGeometry>();
  const sharedMaterials = new Set<THREE.Material>();
  const rememberGeometry = <T extends THREE.BufferGeometry>(geometry: T) => {
    sharedGeometries.add(geometry);
    return geometry;
  };
  const rememberMaterial = <T extends THREE.Material>(material: T) => {
    sharedMaterials.add(material);
    return material;
  };

  const skyCanvas = document.createElement("canvas");
  skyCanvas.width = 4;
  skyCanvas.height = 256;
  const skyContext = skyCanvas.getContext("2d");
  if (skyContext) {
    const gradient = skyContext.createLinearGradient(0, 0, 0, skyCanvas.height);
    gradient.addColorStop(0, config.world.skyTop);
    gradient.addColorStop(0.68, config.world.skyHorizon);
    gradient.addColorStop(1, "#f5fdff");
    skyContext.fillStyle = gradient;
    skyContext.fillRect(0, 0, skyCanvas.width, skyCanvas.height);
    const skyTexture = new THREE.CanvasTexture(skyCanvas);
    skyTexture.colorSpace = THREE.SRGBColorSpace;
    const sky = new THREE.Mesh(
      rememberGeometry(new THREE.SphereGeometry(115, 24, 16)),
      rememberMaterial(new THREE.MeshBasicMaterial({ map: skyTexture, side: THREE.BackSide, depthWrite: false })),
    );
    scene.add(sky);
  }

  const roadMaterial = rememberMaterial(makeMaterial(config.world.roadColor, 0.92));
  const markingMaterial = rememberMaterial(new THREE.MeshBasicMaterial({ color: config.world.laneLineColor }));
  const curbMaterial = rememberMaterial(makeMaterial("#a7c7d1", 0.7));
  const roadGeometry = rememberGeometry(new THREE.BoxGeometry(config.world.roadWidth, 0.16, config.world.roadLength));
  const markingGeometry = rememberGeometry(new THREE.BoxGeometry(config.world.laneLineWidth, 0.018, 2.5));
  const curbGeometry = rememberGeometry(new THREE.BoxGeometry(0.17, 0.24, config.world.roadLength));

  const roadSegments: THREE.Group[] = [];
  for (let index = 0; index < config.world.roadSegments; index += 1) {
    const segment = new THREE.Group();
    segment.position.z = config.movement.playerZ - index * config.world.roadLength;
    segment.add(new THREE.Mesh(roadGeometry, roadMaterial));
    for (let laneLine = 1; laneLine < config.world.laneCount; laneLine += 1) {
      const x = (laneLine - config.world.laneCount / 2) * config.world.laneWidth;
      for (let dash = 0; dash < 6; dash += 1) {
        const marker = new THREE.Mesh(markingGeometry, markingMaterial);
        marker.position.set(x, 0.09, -config.world.roadLength / 2 + 2.7 + dash * 5);
        segment.add(marker);
      }
    }
    for (const side of [-1, 1]) {
      const curb = new THREE.Mesh(curbGeometry, curbMaterial);
      curb.position.set(side * (config.world.roadWidth / 2 + 0.12), 0.02, 0);
      segment.add(curb);
    }
    scene.add(segment);
    roadSegments.push(segment);
  }

  const groundMaterial = rememberMaterial(makeMaterial(config.world.groundColor, 1));
  const ground = new THREE.Mesh(
    rememberGeometry(new THREE.PlaneGeometry(900, 900)),
    groundMaterial,
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(0, -0.19, -300);
  scene.add(ground);

  const trunkMaterial = rememberMaterial(makeMaterial("#76523c"));
  const foliageMaterials = config.world.treePalette.map((color) => rememberMaterial(makeMaterial(color)));
  const trunkGeometry = rememberGeometry(new THREE.CylinderGeometry(0.12, 0.19, 1.6, 6));
  const foliageGeometry = rememberGeometry(new THREE.IcosahedronGeometry(0.9, 0));
  const scenerySegments: THREE.Group[] = [];
  const sceneryLength = config.world.roadLength;
  for (let index = 0; index < config.world.decorationSegmentCount; index += 1) {
    const decorations = new THREE.Group();
    decorations.position.z = config.movement.playerZ - index * sceneryLength;
    for (const side of [-1, 1]) {
      const tree = new THREE.Group();
      const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
      trunk.position.y = 0.8;
      tree.add(trunk);
      const crown = new THREE.Mesh(foliageGeometry, foliageMaterials[(index + (side > 0 ? 1 : 0)) % foliageMaterials.length]!);
      crown.position.y = 2.05;
      crown.scale.set(1.05, 1.35, 0.95);
      tree.add(crown);
      tree.position.set(
        side * (config.world.roadWidth / 2 + randomBetween(2.5, 6)),
        -0.08,
        randomBetween(-sceneryLength * 0.38, sceneryLength * 0.38),
      );
      decorations.add(tree);
    }
    scene.add(decorations);
    scenerySegments.push(decorations);
  }

  const robot = new THREE.Group();
  const robotRoot = new THREE.Group();
  robot.add(robotRoot);
  const bodyMaterial = rememberMaterial(makeMaterial(config.player.bodyColor, 0.42));
  const headMaterial = rememberMaterial(makeMaterial(config.player.headColor, 0.4));
  const accentMaterial = rememberMaterial(makeMaterial(config.player.accentColor, 0.35));
  const visorMaterial = rememberMaterial(new THREE.MeshStandardMaterial({
    color: config.player.visorColor,
    emissive: config.player.eyeColor,
    emissiveIntensity: 0.16,
    roughness: 0.28,
    metalness: 0.18,
  }));
  const jointMaterial = rememberMaterial(makeMaterial(config.player.jointColor, 0.6));
  const eyeMaterial = rememberMaterial(new THREE.MeshBasicMaterial({ color: config.player.eyeColor }));
  const torso = new THREE.Mesh(rememberGeometry(new THREE.BoxGeometry(0.78, 0.66, 0.48)), bodyMaterial);
  torso.position.y = 1.03;
  robotRoot.add(torso);
  const chestPlate = new THREE.Mesh(rememberGeometry(new THREE.BoxGeometry(0.43, 0.27, 0.055)), accentMaterial);
  chestPlate.position.set(0, 1.07, -0.27);
  robotRoot.add(chestPlate);
  const chestLight = new THREE.Mesh(rememberGeometry(new THREE.BoxGeometry(0.1, 0.065, 0.025)), eyeMaterial);
  chestLight.position.set(0, 1.08, -0.305);
  robotRoot.add(chestLight);
  const head = new THREE.Mesh(rememberGeometry(new THREE.BoxGeometry(0.75, 0.58, 0.58)), headMaterial);
  head.position.y = 1.68;
  robotRoot.add(head);
  const face = new THREE.Mesh(rememberGeometry(new THREE.BoxGeometry(0.53, 0.25, 0.045)), visorMaterial);
  face.position.set(0, 1.69, -0.315);
  robotRoot.add(face);
  for (const side of [-1, 1]) {
    const eye = new THREE.Mesh(rememberGeometry(new THREE.BoxGeometry(0.08, 0.075, 0.025)), eyeMaterial);
    eye.position.set(side * 0.13, 1.7, -0.345);
    robotRoot.add(eye);
  }
  const antenna = new THREE.Mesh(rememberGeometry(new THREE.CylinderGeometry(0.035, 0.035, 0.2, 6)), jointMaterial);
  antenna.position.set(0, 2.06, 0);
  robotRoot.add(antenna);
  const antennaTip = new THREE.Mesh(rememberGeometry(new THREE.IcosahedronGeometry(0.09, 0)), accentMaterial);
  antennaTip.position.set(0, 2.18, 0);
  robotRoot.add(antennaTip);
  const arms: THREE.Group[] = [];
  const legs: THREE.Group[] = [];
  for (const side of [-1, 1]) {
    const arm = new THREE.Group();
    arm.position.set(side * 0.48, 1.25, 0);
    const upperArm = new THREE.Mesh(rememberGeometry(new THREE.BoxGeometry(0.22, 0.48, 0.23)), accentMaterial);
    upperArm.position.y = -0.19;
    arm.add(upperArm);
    const hand = new THREE.Mesh(rememberGeometry(new THREE.IcosahedronGeometry(0.16, 0)), jointMaterial);
    hand.position.y = -0.47;
    arm.add(hand);
    robotRoot.add(arm);
    arms.push(arm);

    const leg = new THREE.Group();
    leg.position.set(side * 0.22, 0.7, 0);
    const shin = new THREE.Mesh(rememberGeometry(new THREE.BoxGeometry(0.25, 0.52, 0.27)), jointMaterial);
    shin.position.y = -0.2;
    leg.add(shin);
    const foot = new THREE.Mesh(rememberGeometry(new THREE.BoxGeometry(0.31, 0.16, 0.4)), accentMaterial);
    foot.position.set(0, -0.47, -0.045);
    leg.add(foot);
    robotRoot.add(leg);
    legs.push(leg);
  }
  robot.position.z = config.movement.playerZ;
  scene.add(robot);

  const obstacleMaterial = rememberMaterial(makeMaterial("#ed7c36", 0.55));
  const obstacleAccent = rememberMaterial(makeMaterial("#ffcf66", 0.45));
  const wallMaterial = rememberMaterial(makeMaterial("#cb4c59", 0.6));
  const coinMaterial = rememberMaterial(new THREE.MeshStandardMaterial({
    color: "#ffd54a",
    emissive: "#c78000",
    emissiveIntensity: 0.35,
    metalness: 0.55,
    roughness: 0.32,
  }));
  const gateFrameMaterial = rememberMaterial(makeMaterial("#8ef6f1", 0.35));
  const barGeometry = rememberGeometry(new THREE.BoxGeometry(1, 1, 1));
  const coinGeometry = rememberGeometry(new THREE.TorusGeometry(config.obstacles.coinRadius, 0.09, 8, 16));
  const pools = new Map<EntityKind, Pool>();
  const makeObstacleGroup = (kind: EntityKind): THREE.Group => {
    const group = new THREE.Group();
    if (kind === "coin") {
      const coin = new THREE.Mesh(coinGeometry, coinMaterial);
      coin.rotation.y = Math.PI / 2;
      group.add(coin);
    } else if (kind === "question") {
      for (let lane = 0; lane < config.world.laneCount; lane += 1) {
        const panel = new THREE.Group();
        panel.position.x = laneCenter(lane, config.world.laneWidth);
        const board = new THREE.Mesh(
          rememberGeometry(new THREE.PlaneGeometry(2.45, 1.42)),
          new THREE.MeshBasicMaterial({ color: "#123a67", side: THREE.DoubleSide }),
        );
        board.position.y = 2.12;
        panel.add(board);
        const border = new THREE.Mesh(
          rememberGeometry(new THREE.BoxGeometry(2.55, 1.52, 0.09)),
          gateFrameMaterial,
        );
        border.position.set(0, 2.12, 0.06);
        panel.add(border);
        group.add(panel);
      }
      const topRail = new THREE.Mesh(rememberGeometry(new THREE.BoxGeometry(config.world.roadWidth - 0.35, 0.16, 0.2)), gateFrameMaterial);
      topRail.position.set(0, 3.02, 0);
      group.add(topRail);
    } else if (kind === "wall") {
      const block = new THREE.Mesh(barGeometry, wallMaterial);
      block.scale.set(config.obstacles.wallWidth, config.obstacles.wallHeight, config.obstacles.wallDepth);
      block.position.y = config.obstacles.wallHeight / 2;
      group.add(block);
      const stripe = new THREE.Mesh(barGeometry, obstacleAccent);
      stripe.scale.set(0.16, config.obstacles.wallHeight * 0.88, config.obstacles.wallDepth + 0.02);
      stripe.position.set(0, config.obstacles.wallHeight / 2, -0.01);
      group.add(stripe);
    } else {
      const low = kind === "low-bar";
      const width = low ? config.obstacles.lowBarWidth : config.obstacles.overheadBarWidth;
      const height = low ? config.obstacles.lowBarHeight : config.obstacles.overheadBarHeight;
      const depth = low ? config.obstacles.lowBarDepth : config.obstacles.overheadBarDepth;
      const bar = new THREE.Mesh(barGeometry, obstacleMaterial);
      bar.scale.set(width, height, depth);
      bar.position.y = low ? height / 2 : config.obstacles.overheadBarBottom + height / 2;
      group.add(bar);
      const stripe = new THREE.Mesh(barGeometry, obstacleAccent);
      stripe.scale.set(width * 0.82, 0.075, depth + 0.015);
      stripe.position.set(0, bar.position.y, -0.01);
      group.add(stripe);
      if (!low) {
        for (const side of [-1, 1]) {
          const support = new THREE.Mesh(barGeometry, obstacleMaterial);
          support.scale.set(0.12, config.obstacles.overheadBarBottom, depth * 0.75);
          support.position.set(side * width * 0.45, config.obstacles.overheadBarBottom / 2, 0);
          group.add(support);
        }
      }
    }
    group.visible = false;
    scene.add(group);
    return group;
  };

  const poolFor = (kind: EntityKind): Pool => {
    let pool = pools.get(kind);
    if (!pool) {
      pool = { available: [], active: new Set() };
      pools.set(kind, pool);
    }
    return pool;
  };
  const acquire = (kind: EntityKind) => {
    const pool = poolFor(kind);
    const group = pool.available.pop() ?? makeObstacleGroup(kind);
    pool.active.add(group);
    group.visible = true;
    return group;
  };
  const release = (entity: RunnerEntity) => {
    const pool = poolFor(entity.kind);
    pool.active.delete(entity.group);
    if (entity.kind === "question") {
      entity.group.children.forEach((laneGroup) => laneGroup.children.forEach((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshBasicMaterial && child.material.map) {
          child.material.map.dispose();
          child.material.map = null;
        }
      }));
    }
    entity.group.visible = false;
    entity.group.position.set(0, 0, 0);
    pool.available.push(entity.group);
  };

  const entities: RunnerEntity[] = [];
  const obstacleKinds: ObstacleKind[] = ["low-bar", "overhead-bar", "wall"];
  const makeQuestion = () => makeAnswerQuestion(getNextQuestion(callbacks.questionConfig));
  const createEntity = (kind: EntityKind, distance: number, lane: number, question?: RunnerQuestion) => {
    const group = acquire(kind);
    group.position.set(laneCenter(lane, config.world.laneWidth), 0, 0);
    if (kind === "coin") group.position.y = config.obstacles.coinHeight;
    if (kind === "question" && question) {
      group.children.forEach((laneGroup, index) => {
        const board = laneGroup.children.find((child) => child instanceof THREE.Mesh && child.geometry instanceof THREE.PlaneGeometry);
        if (board instanceof THREE.Mesh && board.material instanceof THREE.MeshBasicMaterial) {
          const texture = makeCanvasTexture(question, index);
          board.material.map = texture;
          board.material.color.set("#ffffff");
          board.material.needsUpdate = true;
        }
      });
    }
    const entity: RunnerEntity = { kind, distance, lane, group, question };
    entities.push(entity);
    return entity;
  };

  let distance = 0;
  let speed: number = config.movement.startSpeed;
  let score = 0;
  let lives: number = config.movement.startingLives;
  let combo = 1;
  let correctCount = 0;
  let wrongCount = 0;
  let lane = 1;
  let lanePosition = laneCenter(lane, config.world.laneWidth);
  let targetLanePosition = lanePosition;
  let jumpHeight = 0;
  let jumpVelocity = 0;
  let slidingRemaining = 0;
  let invulnerabilityRemaining = 0;
  let laneSwitchRemaining = 0;
  let nextObstacleDistance = config.obstacles.firstSpawnDistance;
  let nextQuestionDistance = config.obstacles.questionFirstDistance;
  let nextCoinDistance = 25;
  let playing = false;
  let disposed = false;
  let muted = false;
  let countdownRemaining = 0;
  let countdownValue = 0;
  let toastRemaining = 0;
  let hudTimer = 0;
  let previousFrameTime = performance.now();
  let animationFrame = 0;
  let fpsElapsed = 0;
  let fpsFrameCount = 0;
  let adaptiveRatio = renderer.getPixelRatio();

  const emitHud = () => callbacks.onHud?.({
    score: Math.floor(score),
    distance: Math.floor(distance),
    lives,
    combo,
    correct: correctCount,
    wrong: wrongCount,
  });
  const emitSound = (sound: RunnerSound) => {
    if (!muted) callbacks.onSound?.(sound);
  };

  const createQuestionGate = (atDistance: number) => {
    const question = makeQuestion();
    createEntity("question", atDistance, 1, question);
  };

  const spawnObstaclePattern = (atDistance: number) => {
    const kind = obstacleKinds[Math.floor(Math.random() * obstacleKinds.length)]!;
    const obstacleLane = Math.floor(Math.random() * config.world.laneCount);
    createEntity(kind, atDistance, obstacleLane);
    if (Math.random() < 0.48) {
      const coinLane = (obstacleLane + (Math.random() < 0.5 ? 1 : 2)) % config.world.laneCount;
      for (let index = 0; index < 4; index += 1) {
        createEntity("coin", atDistance + 7 + index * config.obstacles.coinSpacing, coinLane);
      }
    }
  };

  const generateWorldAhead = () => {
    while (nextQuestionDistance <= distance + config.obstacles.spawnAheadDistance) {
      createQuestionGate(nextQuestionDistance);
      nextQuestionDistance += config.obstacles.questionInterval;
    }
    while (nextObstacleDistance <= distance + config.obstacles.spawnAheadDistance) {
      const gateDistance = config.obstacles.questionFirstDistance
        + Math.max(0, Math.round((nextObstacleDistance - config.obstacles.questionFirstDistance) / config.obstacles.questionInterval))
          * config.obstacles.questionInterval;
      if (Math.abs(nextObstacleDistance - gateDistance) > config.obstacles.questionGateClearance) {
        spawnObstaclePattern(nextObstacleDistance);
      }
      nextObstacleDistance += randomBetween(config.obstacles.minSpacing, config.obstacles.maxSpacing);
    }
    while (nextCoinDistance <= distance + config.obstacles.spawnAheadDistance) {
      if (Math.abs(nextCoinDistance - config.obstacles.questionFirstDistance) > 10) {
        const coinLane = Math.floor(Math.random() * config.world.laneCount);
        for (let index = 0; index < 4; index += 1) {
          createEntity("coin", nextCoinDistance + index * config.obstacles.coinSpacing, coinLane);
        }
      }
      nextCoinDistance += randomBetween(13, 22);
    }
  };

  const resize = () => {
    const width = host.clientWidth;
    const height = host.clientHeight;
    if (!width || !height || disposed) return;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    const deviceRatio = window.devicePixelRatio || 1;
    const ratioLimit = config.render.adaptivePixelRatio && width < 720
      ? Math.min(config.render.pixelRatioLimit, config.render.lowPixelRatio)
      : config.render.pixelRatioLimit;
    renderer.setPixelRatio(Math.min(deviceRatio, ratioLimit));
    renderer.setSize(width, height);
  };
  resize();
  const resizeObserver = typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
  resizeObserver?.observe(host);
  window.addEventListener("resize", resize);

  const moveLane = (direction: -1 | 1) => {
    if (!playing || laneSwitchRemaining > 0 || disposed) return;
    lane = THREE.MathUtils.clamp(lane + direction, 0, config.world.laneCount - 1);
    targetLanePosition = laneCenter(lane, config.world.laneWidth);
    laneSwitchRemaining = config.movement.laneSwitchDuration;
  };

  const jump = () => {
    if (!playing || jumpHeight > 0.01 || slidingRemaining > 0 || disposed) return;
    jumpVelocity = config.movement.jumpVelocity;
    emitSound("jump");
  };

  const slide = () => {
    if (!playing || disposed) return;
    if (jumpHeight > 0.12) {
      jumpVelocity = Math.min(jumpVelocity, -2);
      return;
    }
    slidingRemaining = config.movement.slideDuration;
    emitSound("slide");
  };

  const resetState = () => {
    entities.splice(0).forEach(release);
    distance = 0;
    speed = config.movement.startSpeed;
    score = 0;
    lives = config.movement.startingLives;
    combo = 1;
    correctCount = 0;
    wrongCount = 0;
    lane = 1;
    lanePosition = laneCenter(lane, config.world.laneWidth);
    targetLanePosition = lanePosition;
    jumpHeight = 0;
    jumpVelocity = 0;
    slidingRemaining = 0;
    invulnerabilityRemaining = 0;
    laneSwitchRemaining = 0;
    nextObstacleDistance = config.obstacles.firstSpawnDistance;
    nextQuestionDistance = config.obstacles.questionFirstDistance;
    nextCoinDistance = 25;
    toastRemaining = 0;
    callbacks.onToast?.("");
    roadSegments.forEach((segment, index) => {
      segment.position.z = config.movement.playerZ - index * config.world.roadLength;
    });
    scenerySegments.forEach((segment, index) => {
      segment.position.z = config.movement.playerZ - index * sceneryLength;
    });
    robot.position.set(lanePosition, 0, config.movement.playerZ);
    robotRoot.visible = true;
    emitHud();
  };

  const beginCountdown = () => {
    playing = false;
    countdownRemaining = 3;
    countdownValue = 3;
    callbacks.onCountdown?.(countdownValue);
    emitSound("countdown");
  };

  const start = () => {
    if (disposed) return;
    resetState();
    beginCountdown();
  };

  const pause = () => {
    playing = false;
    countdownRemaining = 0;
  };

  const resume = () => {
    if (disposed) return;
    beginCountdown();
  };

  const setPaused = (paused: boolean) => {
    if (paused) pause();
    else {
      countdownRemaining = 0;
      playing = true;
    }
  };

  const reset = () => {
    start();
  };

  const collides = (entity: RunnerEntity) => {
    const entityZ = config.movement.playerZ - (entity.distance - distance);
    const playerHalfWidth = config.movement.playerWidth / 2;
    let obstacleHalfWidth = 0.55;
    let obstacleBottom = 0;
    let obstacleTop = 0;
    let obstacleHalfDepth = 0.45;
    if (entity.kind === "low-bar") {
      obstacleHalfWidth = config.obstacles.lowBarWidth / 2;
      obstacleTop = config.obstacles.lowBarHeight;
      obstacleHalfDepth = config.obstacles.lowBarDepth / 2;
    } else if (entity.kind === "overhead-bar") {
      obstacleHalfWidth = config.obstacles.overheadBarWidth / 2;
      obstacleBottom = config.obstacles.overheadBarBottom;
      obstacleTop = obstacleBottom + config.obstacles.overheadBarHeight;
      obstacleHalfDepth = config.obstacles.overheadBarDepth / 2;
    } else if (entity.kind === "wall") {
      obstacleHalfWidth = config.obstacles.wallWidth / 2;
      obstacleTop = config.obstacles.wallHeight;
      obstacleHalfDepth = config.obstacles.wallDepth / 2;
    } else {
      return false;
    }
    const horizontalOverlap = Math.abs(lanePosition - laneCenter(entity.lane, config.world.laneWidth))
      < playerHalfWidth + obstacleHalfWidth;
    const longitudinalOverlap = Math.abs(entityZ - config.movement.playerZ)
      < config.movement.playerDepth / 2 + obstacleHalfDepth;
    const playerHeight = slidingRemaining > 0
      ? config.movement.playerSlidingHeight
      : config.movement.playerStandingHeight;
    const playerBottom = jumpHeight;
    const playerTop = jumpHeight + playerHeight;
    const verticalOverlap = playerBottom < obstacleTop && playerTop > obstacleBottom;
    return horizontalOverlap && longitudinalOverlap && verticalOverlap;
  };

  const handleCollision = (entity: RunnerEntity) => {
    if (invulnerabilityRemaining > 0) return;
    lives = Math.max(0, lives - 1);
    combo = 1;
    invulnerabilityRemaining = config.movement.collisionInvulnerability;
    emitSound("hit");
    callbacks.onToast?.("Oops! Keep going!");
    toastRemaining = 1.1;
    emitHud();
    if (lives === 0) {
      playing = false;
      callbacks.onGameOver?.(score, correctCount, wrongCount);
    }
  };

  const setQuestionNotice = (entity: RunnerEntity) => {
    if (!entity.question || entity.notified) return;
    entity.notified = true;
    callbacks.onQuestion?.(entity.question);
  };

  const answerQuestion = (entity: RunnerEntity) => {
    if (!entity.question) return;
    const selectedLane = THREE.MathUtils.clamp(Math.round(lanePosition / config.world.laneWidth + 1), 0, 2);
    const correct = selectedLane === entity.question.correctIndex;
    if (correct) {
      correctCount += 1;
      score += config.scoring.correctAnswerBonus * combo;
      combo += 1;
      emitSound("correct");
      callbacks.onAnswer?.(true, `Answer: ${entity.question.answer}`);
      callbacks.onToast?.("Correct!");
    } else {
      wrongCount += 1;
      combo = 1;
      lives = Math.max(0, lives - 1);
      invulnerabilityRemaining = config.movement.collisionInvulnerability;
      emitSound("incorrect");
      callbacks.onAnswer?.(false, `Answer: ${entity.question.answer}`);
      callbacks.onToast?.("Not quite!");
      if (lives === 0) {
        playing = false;
        callbacks.onGameOver?.(Math.floor(score), correctCount, wrongCount);
      }
    }
    toastRemaining = config.scoring.wrongAnswerToastDuration;
    emitHud();
  };

  const updateEntities = (deltaSeconds: number) => {
    generateWorldAhead();
    for (let index = entities.length - 1; index >= 0; index -= 1) {
      const entity = entities[index]!;
      const remaining = entity.distance - distance;
      entity.group.position.z = config.movement.playerZ - remaining;
      if (entity.kind === "coin") {
        entity.group.rotation.y += deltaSeconds * 2.8;
        entity.group.position.y = config.obstacles.coinHeight + Math.sin(performance.now() * 0.003 + entity.distance) * 0.08;
      }
      if (entity.kind === "question") {
        if (remaining <= config.obstacles.questionNotifyDistance && remaining >= 0) setQuestionNotice(entity);
        if (remaining <= 0) {
          answerQuestion(entity);
          release(entity);
          entities.splice(index, 1);
          continue;
        }
      } else if (entity.kind === "coin") {
        if (remaining < -0.5) {
          release(entity);
          entities.splice(index, 1);
          continue;
        }
        if (Math.abs(remaining) < 1.25
          && Math.abs(lanePosition - laneCenter(entity.lane, config.world.laneWidth)) < 0.95
          && Math.abs(jumpHeight + (slidingRemaining > 0 ? 0.5 : 1) - config.obstacles.coinHeight) < 1.35) {
          score += config.scoring.coinValue;
          emitSound("coin");
          release(entity);
          entities.splice(index, 1);
          emitHud();
          continue;
        }
      } else if (remaining < -2) {
        release(entity);
        entities.splice(index, 1);
        continue;
      } else if (collides(entity)) {
        handleCollision(entity);
        release(entity);
        entities.splice(index, 1);
        continue;
      }
    }
  };

  const animatePlayer = (deltaSeconds: number) => {
    if (laneSwitchRemaining > 0) {
      laneSwitchRemaining = Math.max(0, laneSwitchRemaining - deltaSeconds);
      const step = Math.min(1, deltaSeconds / Math.max(config.movement.laneSwitchDuration, 0.001));
      lanePosition = THREE.MathUtils.lerp(lanePosition, targetLanePosition, step);
      if (laneSwitchRemaining === 0) lanePosition = targetLanePosition;
    }
    if (jumpHeight > 0 || jumpVelocity > 0) {
      const gravity = jumpVelocity < 0
        ? config.movement.gravity * config.movement.fastFallGravityMultiplier
        : config.movement.gravity;
      jumpVelocity -= gravity * deltaSeconds;
      jumpHeight = Math.max(0, jumpHeight + jumpVelocity * deltaSeconds);
      if (jumpHeight === 0) jumpVelocity = 0;
    }
    slidingRemaining = Math.max(0, slidingRemaining - deltaSeconds);
    invulnerabilityRemaining = Math.max(0, invulnerabilityRemaining - deltaSeconds);
    robot.position.x = lanePosition;
    robot.position.y = jumpHeight;
    robotRoot.scale.y = slidingRemaining > 0 ? 0.58 : 1;
    robotRoot.position.y = slidingRemaining > 0 ? 0.36 : 0;
    const runCycle = performance.now() * 0.012 * Math.min(1.7, speed / config.movement.startSpeed);
    legs[0]!.rotation.x = Math.sin(runCycle) * (jumpHeight > 0 ? 0.25 : 0.62);
    legs[1]!.rotation.x = -legs[0]!.rotation.x;
    arms[0]!.rotation.x = -legs[0]!.rotation.x * 0.68;
    arms[1]!.rotation.x = -legs[1]!.rotation.x * 0.68;
    robot.visible = invulnerabilityRemaining <= 0 || Math.floor(performance.now() / 90) % 2 === 0;
  };

  const updateWorld = (deltaSeconds: number) => {
    const advance = speed * deltaSeconds;
    for (const segment of roadSegments) {
      segment.position.z += advance;
      if (segment.position.z > config.movement.playerZ + config.world.roadLength / 2) {
        segment.position.z -= config.world.roadSegments * config.world.roadLength;
      }
    }
    for (const segment of scenerySegments) {
      segment.position.z += advance;
      if (segment.position.z > config.movement.playerZ + sceneryLength / 2) {
        segment.position.z -= config.world.decorationSegmentCount * sceneryLength;
        segment.children.forEach((tree, index) => {
          tree.position.x = Math.sign(tree.position.x) * (config.world.roadWidth / 2 + randomBetween(2.5, 6));
          tree.position.z = randomBetween(-sceneryLength * 0.38, sceneryLength * 0.38);
          if (tree.children[1] instanceof THREE.Mesh) {
            tree.children[1].material = foliageMaterials[
              Math.floor(Math.random() * foliageMaterials.length)
            ]!;
          }
          tree.rotation.y = randomBetween(-0.2, 0.2) + index * 0.03;
        });
      }
    }
    const desiredCamera = new THREE.Vector3(
      lanePosition * 0.28,
      config.camera.height,
      config.movement.playerZ + config.camera.distance,
    );
    const cameraBlend = 1 - Math.exp(-config.camera.smoothing * deltaSeconds);
    camera.position.lerp(desiredCamera, cameraBlend);
    camera.lookAt(lanePosition * 0.18, config.camera.lookHeight + jumpHeight * 0.12, config.movement.playerZ - 8);
  };

  const clearToast = (deltaSeconds: number) => {
    if (toastRemaining <= 0) return;
    toastRemaining -= deltaSeconds;
    if (toastRemaining <= 0) callbacks.onToast?.("");
  };

  const update = (now: number) => {
    if (disposed) return;
    animationFrame = window.requestAnimationFrame(update);
    const deltaSeconds = Math.min((now - previousFrameTime) / 1000, config.render.maxDeltaSeconds);
    previousFrameTime = now;
    fpsElapsed += deltaSeconds;
    fpsFrameCount += 1;
    if (fpsElapsed >= 2) {
      const fps = fpsFrameCount / fpsElapsed;
      if (fps < 45 && adaptiveRatio > config.render.lowPixelRatio) {
        adaptiveRatio = config.render.lowPixelRatio;
        renderer.setPixelRatio(adaptiveRatio);
        renderer.setSize(host.clientWidth, host.clientHeight);
      }
      fpsElapsed = 0;
      fpsFrameCount = 0;
    }
    if (countdownRemaining > 0) {
      countdownRemaining -= deltaSeconds;
      const nextValue = Math.max(0, Math.ceil(countdownRemaining));
      if (nextValue !== countdownValue) {
        countdownValue = nextValue;
        callbacks.onCountdown?.(countdownValue);
        if (countdownValue > 0) emitSound("countdown");
      }
      if (countdownRemaining <= 0) {
        playing = true;
        countdownRemaining = 0;
      }
    }
    if (playing) {
      distance += speed * deltaSeconds;
      speed = Math.min(config.movement.maxSpeed, speed + config.movement.acceleration * deltaSeconds);
      score += deltaSeconds * speed * 0.35;
      animatePlayer(deltaSeconds);
      updateWorld(deltaSeconds);
      updateEntities(deltaSeconds);
      hudTimer += deltaSeconds;
      if (hudTimer >= 0.15) {
        hudTimer = 0;
        emitHud();
      }
    } else {
      animatePlayer(deltaSeconds);
    }
    clearToast(deltaSeconds);
    renderer.render(scene, camera);
  };
  animationFrame = window.requestAnimationFrame(update);

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.repeat || disposed) return;
    const key = event.key.toLowerCase();
    if (key === "arrowleft" || key === "a") {
      event.preventDefault();
      moveLane(-1);
    } else if (key === "arrowright" || key === "d") {
      event.preventDefault();
      moveLane(1);
    } else if (key === "arrowup" || key === "w" || event.code === "Space") {
      event.preventDefault();
      jump();
    } else if (key === "arrowdown" || key === "s") {
      event.preventDefault();
      if (jumpHeight > 0) {
        jumpVelocity = Math.min(jumpVelocity, -2);
      } else {
        slide();
      }
    }
  };
  renderer.domElement.addEventListener("keydown", onKeyDown);

  const onVisibilityChange = () => {
    if (document.hidden && playing) pause();
  };
  document.addEventListener("visibilitychange", onVisibilityChange);

  const dispose = () => {
    if (disposed) return;
    disposed = true;
    playing = false;
    window.cancelAnimationFrame(animationFrame);
    window.removeEventListener("resize", resize);
    resizeObserver?.disconnect();
    document.removeEventListener("visibilitychange", onVisibilityChange);
    renderer.domElement.removeEventListener("keydown", onKeyDown);
    entities.splice(0).forEach(release);
    const geometries = new Set(sharedGeometries);
    const materials = new Set(sharedMaterials);
    const textures = new Set<THREE.Texture>();
    scene.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      geometries.add(object.geometry);
      const meshMaterials = Array.isArray(object.material) ? object.material : [object.material];
      meshMaterials.forEach((material) => {
        materials.add(material);
        Object.values(material).forEach((value) => {
          if (value instanceof THREE.Texture) textures.add(value);
        });
      });
    });
    textures.forEach((texture) => texture.dispose());
    geometries.forEach((geometry) => geometry.dispose());
    materials.forEach((material) => material.dispose());
    renderer.dispose();
    renderer.domElement.remove();
  };

  return {
    start,
    pause,
    resume,
    reset,
    setPaused,
    moveLane,
    jump,
    slide,
    setMuted: (value) => {
      muted = value;
    },
    dispose,
  };
};

export const destroyRunnerGame = (game: RunnerGame) => game.dispose();
export const mountRunnerEngine = mountRunnerGame;
export const destroyRunnerEngine = destroyRunnerGame;
