import * as THREE from "three";
import RAPIER from "@dimforge/rapier3d-compat";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { KTX2Loader } from "three/addons/loaders/KTX2Loader.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";
import { TREASURES } from "../quests/treasures";
import type { VehicleKind } from "../economy";

export type MetropolisQuality = "auto" | "low" | "medium" | "high" | "ultra";
export type MetropolisWeather = "clear" | "rain";

export interface MetropolisControls {
  accelerate: number;
  brake: number;
  steer: number;
  handbrake: number;
}

export interface MetropolisHud {
  x: number;
  z: number;
  speed: number;
  altitude: number;
  stars: number;
  nearTreasure: number | null;
  vehicle: VehicleKind | null;
  timeOfDay: number;
}

export interface MetropolisGame {
  start: () => void;
  setPaused: (paused: boolean) => void;
  setControls: (controls: Partial<MetropolisControls>) => void;
  setCameraLook: (x: number, y: number) => void;
  setSensitivity: (sensitivity: number) => void;
  setVehicle: (vehicle: VehicleKind | null) => void;
  setQuality: (quality: MetropolisQuality) => void;
  setWeather: (weather: MetropolisWeather) => void;
  setTimeOfDay: (hour: number) => void;
  interact: () => void;
  jump: () => void;
  honk: () => void;
  setCollected: (id: number) => void;
  reset: () => void;
  setPosition: (x: number, z: number) => void;
  dispose: () => void;
}

export interface MetropolisCallbacks {
  onLoading?: (progress: number) => void;
  onHud?: (hud: MetropolisHud) => void;
  onNearbyTreasure?: (id: number | null) => void;
  onOpenTreasure?: (id: number) => void;
  onCaught?: (stars: number) => void;
  onNotice?: (message: string) => void;
}

interface BuildingInstance {
  x: number;
  z: number;
  width: number;
  depth: number;
  height: number;
  color: string;
}

interface ChunkData {
  cx: number;
  cz: number;
  instances: BuildingInstance[];
  roads?: Array<{ points: [number, number][]; width: number }>;
  parks?: Array<{ x: number; z: number; width: number; depth: number }>;
  water?: Array<{ points: [number, number][] }>;
  railways?: Array<{ points: [number, number][] }>;
}

interface QualityPreset {
  pixelRatio: number;
  far: number;
  shadows: boolean;
}
type AnimationState = "idle" | "walk" | "run" | "jump" | "fall" | "land" | "celebrate";

const CHUNK_SIZE = 128;
const QUALITY: Record<MetropolisQuality, QualityPreset> = {
  auto: { pixelRatio: 1, far: 360, shadows: true },
  low: { pixelRatio: 0.7, far: 180, shadows: false },
  medium: { pixelRatio: 0.9, far: 300, shadows: true },
  high: { pixelRatio: 1.25, far: 520, shadows: true },
  ultra: { pixelRatio: 2, far: 780, shadows: true },
};

const clamp = (value: number, minimum: number, maximum: number) =>
  Math.max(minimum, Math.min(maximum, value));

const disposeObject = (object: THREE.Object3D) => {
  object.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    child.geometry.dispose();
    const materials = Array.isArray(child.material) ? child.material : [child.material];
    materials.forEach((material) => material.dispose());
  });
};

const makeMaterial = (color: THREE.ColorRepresentation, roughness = 0.82, metalness = 0.02) =>
  new THREE.MeshStandardMaterial({ color, roughness, metalness });

const seedFor = (x: number, z: number, salt: number) => {
  const value = Math.sin(x * 127.1 + z * 311.7 + salt * 74.7) * 43758.5453;
  return value - Math.floor(value);
};

const createVehicle = (kind: VehicleKind, color: string) => {
  const group = new THREE.Group();
  const paint = makeMaterial(color, 0.35, 0.24);
  const glass = new THREE.MeshPhysicalMaterial({ color: "#b9e6ef", roughness: 0.18, metalness: 0.1, transparent: true, opacity: 0.8 });
  const rubber = makeMaterial("#202b30", 0.9);
  const bodyGeometry = new THREE.BoxGeometry(1, 1, 1);
  const body = new THREE.Mesh(bodyGeometry, paint);
  body.castShadow = true;
  if (kind === "boat") {
    body.scale.set(2.2, 0.55, 4.1);
    body.position.y = 0.6;
  } else if (kind === "plane") {
    body.scale.set(1.25, 0.62, 4.4);
    body.position.y = 0.85;
    const wing = new THREE.Mesh(new THREE.BoxGeometry(8, 0.18, 1.05), paint);
    wing.position.y = 0.92;
    wing.castShadow = true;
    group.add(wing);
    const tail = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.14, 0.65), paint);
    tail.position.set(0, 1.1, -1.72);
    group.add(tail);
    const propeller = new THREE.Mesh(new THREE.BoxGeometry(0.16, 1.35, 0.16), rubber);
    propeller.position.z = 2.25;
    group.add(propeller);
  } else if (kind === "helicopter") {
    body.scale.set(1.5, 1.1, 2.6);
    body.position.y = 0.95;
    const tail = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.26, 2.4), paint);
    tail.position.set(0, 0.95, -2.25);
    group.add(tail);
    const rotor = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.08, 0.18), rubber);
    rotor.position.y = 1.62;
    group.add(rotor);
  } else if (kind === "motorcycle") {
    body.scale.set(0.62, 0.48, 1.7);
    body.position.y = 0.88;
    for (const z of [-0.95, 0.95]) {
      const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.12, 8, 16), rubber);
      wheel.rotation.y = Math.PI / 2;
      wheel.position.set(0, 0.42, z);
      group.add(wheel);
    }
  } else {
    body.scale.set(1.85, 0.7, 3.8);
    body.position.y = 0.77;
    const roof = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.7, 1.85), glass);
    roof.position.set(0, 1.33, -0.15);
    roof.castShadow = true;
    group.add(roof);
    for (const x of [-0.92, 0.92]) {
      for (const z of [-1.17, 1.17]) {
        const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.22, 14), rubber);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(x, 0.38, z);
        wheel.castShadow = true;
        group.add(wheel);
      }
    }
  }
  group.add(body);
  return group;
};

const createPerson = () => {
  const root = new THREE.Group();
  const shirt = makeMaterial("#2f8f82");
  const pants = makeMaterial("#33465d");
  const skin = makeMaterial("#e9b891");
  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.28, 0.72, 4, 8), shirt);
  torso.position.y = 1.18;
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.25, 12, 10), skin);
  head.position.y = 1.88;
  const legs: THREE.Mesh[] = [];
  for (const x of [-0.14, 0.14]) {
    const leg = new THREE.Mesh(new THREE.CapsuleGeometry(0.11, 0.52, 3, 6), pants);
    leg.position.set(x, 0.51, 0);
    legs.push(leg);
    root.add(leg);
  }
  root.add(torso, head);
  root.traverse((object) => {
    if (object instanceof THREE.Mesh) object.castShadow = true;
  });
  return { root, legs };
};

export const mountMetropolisGame = async (
  host: HTMLElement,
  callbacks: MetropolisCallbacks = {},
): Promise<MetropolisGame> => {
  callbacks.onLoading?.(0.08);
  await RAPIER.init();
  callbacks.onLoading?.(0.2);
  const canvas = host.ownerDocument.createElement("canvas");
  canvas.setAttribute("aria-label", "Numatik Metropolis 3D city exploration game");
  canvas.tabIndex = 0;
  const webgl2 = canvas.getContext("webgl2", { antialias: true, alpha: false });
  if (!webgl2) throw new Error("WebGL 2 is unavailable. Try an up-to-date browser or another device.");
  const renderer = new THREE.WebGLRenderer({ canvas, context: webgl2, antialias: true, powerPreference: "high-performance" });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  host.appendChild(canvas);
  const dracoLoader = new DRACOLoader().setDecoderPath("/assets/draco/");
  const ktx2Loader = new KTX2Loader().setTranscoderPath("/assets/basis/");
  ktx2Loader.detectSupport(renderer);
  const gltfLoader = new GLTFLoader()
    .setDRACOLoader(dracoLoader)
    .setKTX2Loader(ktx2Loader)
    .setMeshoptDecoder(MeshoptDecoder);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#91c9db");
  scene.fog = new THREE.Fog("#9ecbd3", 110, QUALITY.auto.far);
  const camera = new THREE.PerspectiveCamera(64, 1, 0.1, 900);
  const skyGeometry = new THREE.SphereGeometry(840, 20, 12);
  const skyMaterial = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    uniforms: { top: { value: new THREE.Color("#4389a5") }, horizon: { value: new THREE.Color("#e3d7b4") } },
    vertexShader: "varying vec3 vWorldPosition; void main(){ vec4 w=modelMatrix*vec4(position,1.0); vWorldPosition=w.xyz; gl_Position=projectionMatrix*viewMatrix*w; }",
    fragmentShader: "uniform vec3 top; uniform vec3 horizon; varying vec3 vWorldPosition; void main(){ float h=normalize(vWorldPosition).y; float k=smoothstep(-0.15,0.65,h); gl_FragColor=vec4(mix(horizon,top,k),1.0); }",
  });
  scene.add(new THREE.Mesh(skyGeometry, skyMaterial));
  scene.add(new THREE.HemisphereLight("#e4f7ff", "#596452", 1.65));
  const sun = new THREE.DirectionalLight("#fff0cf", 2.1);
  sun.position.set(-120, 180, 90);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.left = -120;
  sun.shadow.camera.right = 120;
  sun.shadow.camera.top = 120;
  sun.shadow.camera.bottom = -120;
  sun.shadow.camera.far = 400;
  scene.add(sun);
  scene.add(sun.target);
  callbacks.onLoading?.(0.34);

  const physics = new RAPIER.World({ x: 0, y: -9.81, z: 0 });
  const floorBody = physics.createRigidBody(RAPIER.RigidBodyDesc.fixed());
  physics.createCollider(RAPIER.ColliderDesc.cuboid(820, 0.25, 820).setTranslation(0, -0.3, 0), floorBody);
  const playerBody = physics.createRigidBody(
    RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(8, 1.2, 12)
      .setLinearDamping(1.4)
      .setAngularDamping(8)
      .setCanSleep(false),
  );
  physics.createCollider(RAPIER.ColliderDesc.cuboid(0.8, 0.7, 1.55).setFriction(0.8).setRestitution(0.05), playerBody);

  const chunkGroup = new THREE.Group();
  scene.add(chunkGroup);
  const chunks = new Map<string, THREE.Group>();
  const pendingChunks = new Set<string>();
  const worker = new Worker(new URL("./cityChunkWorker.ts", import.meta.url), { type: "module" });
  const buildingGeometry = new THREE.BoxGeometry(1, 1, 1);
  const streetGlowMaterial = new THREE.MeshStandardMaterial({
    color: "#ffe0a0",
    emissive: "#ffd27a",
    emissiveIntensity: 0,
    roughness: 0.3,
  });
  let quality: MetropolisQuality = "auto";
  let weather: MetropolisWeather = "clear";
  let hour = 9.5;
  let running = false;
  let paused = true;
  let disposed = false;
  let stars = 0;
  let wantedTimer = 0;
  let stoppedTimer = 0;
  let speed = 0;
  let yaw = Math.PI;
  let cameraYaw = 0;
  let cameraPitch = 0.23;
  let sensitivity = 1;
  let timeSinceHud = 0;
  let nearestTreasure: number | null = null;
  let lastNoticeAt = 0;
  let vehicle: VehicleKind | null = "car";
  let currentVehicleGroup: THREE.Group | null = null;
  let currentPerson: ReturnType<typeof createPerson> | null = null;
  const avatarRoot = new THREE.Group();
  avatarRoot.visible = false;
  scene.add(avatarRoot);
  let animationMixer: THREE.AnimationMixer | null = null;
  const animationActions = new Map<AnimationState, THREE.AnimationAction>();
  let activeAnimation: AnimationState = "idle";
  let celebrateUntil = 0;
  let autoSampleTime = 0;
  let autoSampleFrames = 0;
  const collected = new Set<number>();
  const keys = new Set<string>();
  const controls: MetropolisControls = { accelerate: 0, brake: 0, steer: 0, handbrake: 0 };
  const vehicles = new Map<VehicleKind, THREE.Group>();
  const npcCars: Array<{ group: THREE.Group; axis: "x" | "z"; lane: number; progress: number; direction: number }> = [];
  const pedestrians: Array<{ root: THREE.Group; legs: THREE.Mesh[]; x: number; z: number; phase: number; fleeingUntil: number }> = [];

  const addStaticBox = (
    parent: THREE.Object3D,
    geometry: THREE.BufferGeometry,
    material: THREE.Material,
    position: [number, number, number],
    scale: [number, number, number],
  ) => {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...position);
    mesh.scale.set(...scale);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  };

  const makeChunk = (data: ChunkData) => {
    const group = new THREE.Group();
    group.position.set(data.cx * CHUNK_SIZE, 0, data.cz * CHUNK_SIZE);
    const groundMaterial = makeMaterial("#809174", 1);
    const roadMaterial = makeMaterial("#3d4549", 0.92);
    const sidewalkMaterial = makeMaterial("#c0b9a2", 0.95);
    const stripeMaterial = new THREE.MeshBasicMaterial({ color: "#efe5bb" });
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(CHUNK_SIZE, CHUNK_SIZE), groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.04;
    ground.receiveShadow = true;
    group.add(ground);
    if (data.roads?.length) {
      for (const road of data.roads) {
        for (let index = 1; index < road.points.length; index += 1) {
          const from = road.points[index - 1]!;
          const to = road.points[index]!;
          const dx = to[0] - from[0];
          const dz = to[1] - from[1];
          const segment = new THREE.Mesh(new THREE.BoxGeometry(Math.hypot(dx, dz), 0.07, road.width), roadMaterial);
          segment.position.set((from[0] + to[0]) / 2, 0.02, (from[1] + to[1]) / 2);
          segment.rotation.y = Math.atan2(-dz, dx);
          segment.receiveShadow = true;
          group.add(segment);
        }
      }
    } else {
      for (let lane = -1; lane <= 1; lane += 1) {
        const offset = lane * 40;
        addStaticBox(group, new THREE.BoxGeometry(1, 1, 1), roadMaterial, [offset, 0.015, 0], [8, 0.06, CHUNK_SIZE]);
        addStaticBox(group, new THREE.BoxGeometry(1, 1, 1), roadMaterial, [0, 0.016, offset], [CHUNK_SIZE, 0.06, 8]);
        for (let start = -60; start <= 60; start += 14) {
          addStaticBox(group, new THREE.BoxGeometry(1, 1, 1), stripeMaterial, [offset + 2.6, 0.055, start], [0.14, 0.018, 4.2]);
          addStaticBox(group, new THREE.BoxGeometry(1, 1, 1), stripeMaterial, [start, 0.056, offset + 2.6], [4.2, 0.018, 0.14]);
        }
      }
    }
    for (const park of data.parks ?? []) {
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(Math.max(4, park.width), Math.max(4, park.depth)), makeMaterial("#73936b"));
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.set(park.x, 0.005, park.z);
      group.add(mesh);
    }
    for (const collection of data.water ?? []) {
      for (let index = 1; index < collection.points.length; index += 1) {
        const from = collection.points[index - 1]!;
        const to = collection.points[index]!;
        const segment = new THREE.Mesh(
          new THREE.BoxGeometry(Math.hypot(to[0] - from[0], to[1] - from[1]), 0.08, 7),
          new THREE.MeshStandardMaterial({ color: "#4b9ea8", roughness: 0.18, metalness: 0.32 }),
        );
        segment.position.set((from[0] + to[0]) / 2, -0.15, (from[1] + to[1]) / 2);
        segment.rotation.y = Math.atan2(-(to[1] - from[1]), to[0] - from[0]);
        group.add(segment);
      }
    }
    for (const collection of data.railways ?? []) {
      for (let index = 1; index < collection.points.length; index += 1) {
        const from = collection.points[index - 1]!;
        const to = collection.points[index]!;
        const length = Math.hypot(to[0] - from[0], to[1] - from[1]);
        const angle = Math.atan2(-(to[1] - from[1]), to[0] - from[0]);
        const track = new THREE.Mesh(new THREE.BoxGeometry(length, 0.08, 2.2), makeMaterial("#4d4d47"));
        track.position.set((from[0] + to[0]) / 2, 0.1, (from[1] + to[1]) / 2);
        track.rotation.y = angle;
        group.add(track);
        for (let tie = 0; tie < length; tie += 4) {
          const sleeper = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.12, 3.2), makeMaterial("#6d5b48"));
          sleeper.position.set(from[0] + Math.cos(angle) * tie, 0.08, from[1] - Math.sin(angle) * tie);
          sleeper.rotation.y = angle;
          group.add(sleeper);
        }
      }
    }
    const curbGeo = new THREE.BoxGeometry(1, 1, 1);
    for (const offset of [-44, -36, -4, 4, 36, 44]) {
      addStaticBox(group, curbGeo, sidewalkMaterial, [offset, 0.08, 0], [1.1, 0.18, CHUNK_SIZE]);
      addStaticBox(group, curbGeo, sidewalkMaterial, [0, 0.08, offset], [CHUNK_SIZE, 0.18, 1.1]);
    }
    if (data.instances.length) {
      const buildings = new THREE.InstancedMesh(
        buildingGeometry.clone(),
        new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.76, metalness: 0.08 }),
        data.instances.length,
      );
      const transform = new THREE.Object3D();
      data.instances.forEach((building, index) => {
        transform.position.set(building.x, building.height / 2, building.z);
        transform.scale.set(building.width, building.height, building.depth);
        transform.updateMatrix();
        buildings.setMatrixAt(index, transform.matrix);
        buildings.setColorAt(index, new THREE.Color(building.color));
      });
      buildings.castShadow = true;
      buildings.receiveShadow = true;
      group.add(buildings);
    }
    if (seedFor(data.cx, data.cz, 9) > 0.72) {
      const trees = new THREE.InstancedMesh(
        new THREE.ConeGeometry(1, 5, 7),
        makeMaterial("#4d8d62", 0.9),
        8,
      );
      const transform = new THREE.Object3D();
      for (let i = 0; i < 8; i += 1) {
        const x = -54 + seedFor(data.cx, data.cz, i + 21) * 108;
        const z = -54 + seedFor(data.cz, data.cx, i + 41) * 108;
        transform.position.set(x, 2.45, z);
        transform.scale.setScalar(0.8 + seedFor(i, data.cx, data.cz) * 0.6);
        transform.updateMatrix();
        trees.setMatrixAt(i, transform.matrix);
      }
      trees.castShadow = true;
      group.add(trees);
    }
    const lampPost = new THREE.InstancedMesh(
      new THREE.CylinderGeometry(0.08, 0.12, 6, 6),
      makeMaterial("#424b48", 0.76, 0.28),
      6,
    );
    const lampHeads = new THREE.InstancedMesh(new THREE.BoxGeometry(0.65, 0.22, 0.34), streetGlowMaterial, 6);
    const lampTransform = new THREE.Object3D();
    for (let index = 0; index < 6; index += 1) {
      const x = index < 3 ? -52 : 52;
      const z = -44 + (index % 3) * 44;
      lampTransform.position.set(x, 3, z);
      lampTransform.updateMatrix();
      lampPost.setMatrixAt(index, lampTransform.matrix);
      lampTransform.position.set(x, 6.1, z);
      lampTransform.updateMatrix();
      lampHeads.setMatrixAt(index, lampTransform.matrix);
    }
    group.add(lampPost, lampHeads);
    const worldX = data.cx * CHUNK_SIZE;
    const worldZ = data.cz * CHUNK_SIZE;
    if (Math.abs(worldX) < 70) {
      const water = new THREE.Mesh(
        new THREE.PlaneGeometry(27, CHUNK_SIZE),
        new THREE.MeshStandardMaterial({ color: "#4b9ea8", roughness: 0.18, metalness: 0.32 }),
      );
      water.rotation.x = -Math.PI / 2;
      water.position.set(-worldX, -0.17, 0);
      group.add(water);
      if (data.cz % 2 === 0) {
        addStaticBox(group, new THREE.BoxGeometry(1, 1, 1), roadMaterial, [-worldX, 0.25, 0], [34, 0.45, 10]);
      }
      if (data.cz === 1) {
        const island = new THREE.Mesh(new THREE.CylinderGeometry(13, 16, 0.7, 28), makeMaterial("#80a46b"));
        island.position.set(-worldX, 0.18, 60);
        group.add(island);
      }
    }
    if (data.cx === 2 && data.cz === -2) {
      const runway = addStaticBox(group, new THREE.BoxGeometry(1, 1, 1), makeMaterial("#565d5d"), [100, 0.08, -36], [28, 0.16, 118]);
      runway.name = "runway";
      for (let z = -86; z <= 16; z += 13) {
        addStaticBox(group, new THREE.BoxGeometry(1, 1, 1), stripeMaterial, [100, 0.17, z], [0.8, 0.02, 6]);
      }
      addStaticBox(group, new THREE.BoxGeometry(1, 1, 1), makeMaterial("#4c8da3"), [68, 6, 14], [24, 12, 18]);
    }
    if (data.cx === 3 && data.cz === 1) {
      addStaticBox(group, new THREE.BoxGeometry(1, 1, 1), makeMaterial("#889f73"), [30, 12, 80], [CHUNK_SIZE, 24, CHUNK_SIZE]);
      const tower = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.5, 16, 12), makeMaterial("#ded2a6"));
      tower.position.set(40, 24, 80);
      group.add(tower);
    }
    return group;
  };

  worker.onmessage = (event: MessageEvent<ChunkData>) => {
    if (disposed) return;
    const { cx, cz } = event.data;
    const key = `${cx}:${cz}`;
    pendingChunks.delete(key);
    if (Math.abs(cx - Math.floor(playerBody.translation().x / CHUNK_SIZE)) > 2
      || Math.abs(cz - Math.floor(playerBody.translation().z / CHUNK_SIZE)) > 2) return;
    const group = makeChunk(event.data);
    chunks.set(key, group);
    chunkGroup.add(group);
  };

  const syncChunks = () => {
    const { x, z } = playerBody.translation();
    const cx = Math.floor(x / CHUNK_SIZE);
    const cz = Math.floor(z / CHUNK_SIZE);
    for (let dx = -2; dx <= 2; dx += 1) {
      for (let dz = -2; dz <= 2; dz += 1) {
        const key = `${cx + dx}:${cz + dz}`;
        if (chunks.has(key) || pendingChunks.has(key)) continue;
        pendingChunks.add(key);
        worker.postMessage({ cx: cx + dx, cz: cz + dz, size: CHUNK_SIZE });
      }
    }
    for (const [key, group] of chunks) {
      const [chunkX, chunkZ] = key.split(":").map(Number);
      if (Math.abs((chunkX ?? 0) - cx) <= 2 && Math.abs((chunkZ ?? 0) - cz) <= 2) continue;
      chunkGroup.remove(group);
      chunks.delete(key);
      disposeObject(group);
    }
  };

  const chestGroups = TREASURES.map((treasure) => {
    const chest = new THREE.Group();
    chest.position.set(treasure.x, treasure.y + 0.65, treasure.z);
    const wood = makeMaterial("#9a5d38", 0.65);
    const gold = new THREE.MeshStandardMaterial({ color: "#ffd15a", metalness: 0.68, roughness: 0.25, emissive: "#aa6b14", emissiveIntensity: 0.45 });
    const box = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.9, 1.05), wood);
    box.castShadow = true;
    const lid = new THREE.Mesh(new THREE.BoxGeometry(1.56, 0.3, 1.1), gold);
    lid.position.y = 0.6;
    chest.add(box, lid);
    const light = new THREE.PointLight("#ffc553", 2, 13);
    light.position.y = 1.65;
    chest.add(light);
    scene.add(chest);
    return chest;
  });

  const playerCar = createVehicle("car", "#e7a34f");
  const motorcycle = createVehicle("motorcycle", "#e87d67");
  const boat = createVehicle("boat", "#47a7b0");
  const plane = createVehicle("plane", "#e9e4d7");
  const helicopter = createVehicle("helicopter", "#76a6b0");
  vehicles.set("car", playerCar);
  vehicles.set("motorcycle", motorcycle);
  vehicles.set("boat", boat);
  vehicles.set("plane", plane);
  vehicles.set("helicopter", helicopter);
  for (const group of vehicles.values()) {
    group.visible = false;
    scene.add(group);
  }
  const pedestrian = createPerson();
  currentPerson = pedestrian;
  pedestrian.root.visible = false;
  scene.add(pedestrian.root);
  const optionalAnimations: Array<[AnimationState, string]> = [
    ["idle", "idle-in-place.glb"],
    ["walk", "walk-in-place.glb"],
    ["run", "run-in-place.glb"],
    ["jump", "jump-in-place.glb"],
    ["fall", "fall-in-place.glb"],
    ["land", "land-in-place.glb"],
    ["celebrate", "celebrate-in-place.glb"],
  ];
  const loadOptionalAvatar = async () => {
    try {
      const modelResponse = await fetch("/assets/models/city-avatar.glb", { method: "HEAD" });
      if (!modelResponse.ok) return;
      const avatar = await new Promise<THREE.Group>((resolve, reject) => {
        gltfLoader.load("/assets/models/city-avatar.glb", (gltf) => resolve(gltf.scene), undefined, reject);
      });
      if (disposed) {
        disposeObject(avatar);
        return;
      }
      avatarRoot.add(avatar);
      animationMixer = new THREE.AnimationMixer(avatar);
      const availableAnimations = await Promise.all(optionalAnimations.map(async ([state, file]) => {
        const response = await fetch(`/assets/animations/${file}`, { method: "HEAD" });
        if (!response.ok) return null;
        const gltf = await new Promise<{ scene: THREE.Group; animations: THREE.AnimationClip[] }>((resolve, reject) => {
          gltfLoader.load(`/assets/animations/${file}`, resolve, undefined, reject);
        });
        disposeObject(gltf.scene);
        const clip = gltf.animations[0];
        return clip ? { state, clip } : null;
      }));
      if (disposed) return;
      for (const animation of availableAnimations) {
        if (!animation) continue;
        const action = animationMixer.clipAction(animation.clip);
        action.play();
        action.enabled = animation.state === "idle";
        action.weight = animation.state === "idle" ? 1 : 0;
        animationActions.set(animation.state, action);
      }
      avatarRoot.visible = vehicle === null;
      pedestrian.root.visible = vehicle !== null;
    } catch (error) {
      console.info(`Optional Mixamo character not loaded; using the built-in character. ${error instanceof Error ? error.message : String(error)}`);
    }
  };
  void loadOptionalAvatar();
  const policeCar = createVehicle("car", "#4b6f93");
  policeCar.scale.setScalar(0.95);
  policeCar.visible = false;
  scene.add(policeCar);
  currentVehicleGroup = playerCar;
  playerCar.visible = true;
  currentVehicleGroup.position.set(8, 0, 12);

  const trafficColors = ["#d9b469", "#819cac", "#c57a5a", "#7c9a7b", "#9d8caf"];
  for (let index = 0; index < 12; index += 1) {
    const axis = index % 2 === 0 ? "x" : "z";
    const group = createVehicle("car", trafficColors[index % trafficColors.length]!);
    group.scale.setScalar(0.72);
    scene.add(group);
    npcCars.push({
      group,
      axis,
      lane: ((index % 5) - 2) * 40,
      progress: (index * 47) % 700 - 350,
      direction: index % 3 === 0 ? -1 : 1,
    });
  }
  for (let index = 0; index < 18; index += 1) {
    const person = createPerson();
    const x = (seedFor(index, 2, 4) - 0.5) * 580;
    const z = (seedFor(index, 3, 7) - 0.5) * 580;
    person.root.position.set(x, 0, z);
    scene.add(person.root);
    pedestrians.push({ ...person, x, z, phase: seedFor(index, 9, 1) * Math.PI * 2, fleeingUntil: 0 });
  }

  const rainMaterial = new THREE.PointsMaterial({ color: "#c5eaff", size: 0.12, transparent: true, opacity: 0.65 });
  const rainVertices = new Float32Array(900 * 3);
  for (let index = 0; index < rainVertices.length; index += 3) {
    rainVertices[index] = (Math.random() - 0.5) * 100;
    rainVertices[index + 1] = Math.random() * 50;
    rainVertices[index + 2] = (Math.random() - 0.5) * 100;
  }
  const rainGeometry = new THREE.BufferGeometry();
  rainGeometry.setAttribute("position", new THREE.BufferAttribute(rainVertices, 3));
  const rain = new THREE.Points(rainGeometry, rainMaterial);
  rain.visible = false;
  scene.add(rain);

  const keyDown = (event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    if (["w", "a", "s", "d", " ", "arrowup", "arrowdown", "arrowleft", "arrowright", "shift"].includes(key)) event.preventDefault();
    keys.add(key);
    if (key === "e" && !event.repeat) interact();
    if (key === " " && !event.repeat) jump();
    if (key === "h" && !event.repeat) honk();
  };
  const keyUp = (event: KeyboardEvent) => keys.delete(event.key.toLowerCase());
  window.addEventListener("keydown", keyDown);
  window.addEventListener("keyup", keyUp);

  const updateQuality = (next: MetropolisQuality) => {
    quality = next;
    const preset = QUALITY[quality];
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, preset.pixelRatio));
    scene.fog = new THREE.Fog(weather === "rain" ? "#8298a1" : "#9ecbd3", preset.far * 0.28, preset.far);
    renderer.shadowMap.enabled = preset.shadows;
    sun.castShadow = preset.shadows;
  };

  const selectVehicle = (next: VehicleKind | null) => {
    if (currentVehicleGroup) currentVehicleGroup.visible = false;
    vehicle = next;
    currentVehicleGroup = next ? vehicles.get(next) ?? null : null;
    if (currentVehicleGroup) {
      const position = playerBody.translation();
      currentVehicleGroup.position.set(position.x, next === "boat" ? -0.1 : Math.max(0, position.y - 0.65), position.z);
      currentVehicleGroup.rotation.y = yaw;
      currentVehicleGroup.visible = true;
    }
    if (currentPerson) currentPerson.root.visible = next === null && avatarRoot.children.length === 0;
    avatarRoot.visible = next === null && avatarRoot.children.length > 0;
    playerBody.setLinvel({ x: 0, y: next === "helicopter" || next === "plane" ? 0 : playerBody.linvel().y, z: 0 }, true);
    speed = 0;
  };

  const interact = () => {
    if (!running || paused) return;
    const position = playerBody.translation();
    if (nearestTreasure !== null) {
      const treasure = TREASURES.find((item) => item.id === nearestTreasure);
      if (!treasure || collected.has(treasure.id)) return;
      const distance = Math.hypot(position.x - treasure.x, position.z - treasure.z, position.y - treasure.y);
      if (distance < 10) {
        callbacks.onOpenTreasure?.(treasure.id);
        paused = true;
      }
      return;
    }
    selectVehicle(vehicle ? null : "car");
  };

  const jump = () => {
    if (!running || paused) return;
    if (vehicle === "helicopter" || vehicle === "plane") {
      const velocity = playerBody.linvel();
      playerBody.setLinvel({ x: velocity.x, y: clamp(velocity.y + 5.5, -12, 12), z: velocity.z }, true);
      return;
    }
    if (vehicle) return;
    const position = playerBody.translation();
    if (position.y < 1.65) playerBody.applyImpulse({ x: 0, y: 6.5, z: 0 }, true);
  };

  const honk = () => {
    if (!running || paused) return;
    const now = performance.now();
    if (now - lastNoticeAt > 900) {
      callbacks.onNotice?.("Beep beep! People move safely aside.");
      lastNoticeAt = now;
    }
    if (vehicle && stars === 0) {
      stars = 1;
      wantedTimer = 5;
    }
  };

  const setPosition = (x: number, z: number) => {
    stars = 0;
    wantedTimer = 0;
    policeCar.visible = false;
    playerBody.setTranslation({ x, y: vehicle === "helicopter" ? 18 : vehicle === "plane" ? 1 : 1.2, z }, true);
    playerBody.setLinvel({ x: 0, y: 0, z: 0 }, true);
    if (currentVehicleGroup) currentVehicleGroup.position.set(x, 0, z);
    syncChunks();
  };

  const updateControls = (delta: number) => {
    const pad = navigator.getGamepads?.().find((item) => item?.connected) ?? null;
    const padSteer = pad?.axes[0] ?? 0;
    const padAccel = pad?.buttons[7]?.value ?? 0;
    const padBrake = pad?.buttons[6]?.value ?? 0;
    const accelerate = Math.max(
      controls.accelerate,
      Number(keys.has("w") || keys.has("arrowup")),
      padAccel,
    );
    const brake = Math.max(
      controls.brake,
      Number(keys.has("s") || keys.has("arrowdown")),
      padBrake,
    );
    const steer = Math.abs(controls.steer) > 0.05
      ? controls.steer
      : Math.abs(padSteer) > 0.12
        ? padSteer
        : Number(keys.has("a") || keys.has("arrowleft")) - Number(keys.has("d") || keys.has("arrowright"));
    const forward = accelerate - brake * 0.72;
    const velocity = playerBody.linvel();
    const flying = vehicle === "helicopter" || vehicle === "plane";
    const boatMode = vehicle === "boat";
    const walkMode = vehicle === null;
    const handbrake = controls.handbrake > 0 || (!flying && keys.has("shift"));
    const maxSpeed = walkMode ? 5.2 : vehicle === "motorcycle" ? 28 : vehicle === "plane" ? 42 : vehicle === "helicopter" ? 25 : boatMode ? 20 : 24;
    if (flying) {
      const verticalInput = Number(keys.has(" ") || keys.has("shift")) - Number(keys.has("control"));
      const vertical = clamp(velocity.y + verticalInput * 10 * delta, -9, vehicle === "helicopter" ? 10 : 6);
      playerBody.setLinvel({ x: velocity.x, y: vertical, z: velocity.z }, true);
    }
    const steeringStrength = walkMode ? 1.8 : 1.3;
    yaw += steer * steeringStrength * delta * clamp(Math.abs(speed) / 8 + 0.25, 0.25, 1.5) * Math.sign(speed || 1);
    const direction = new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw));
    const accel = walkMode ? 20 : vehicle === "plane" ? 12 : 14;
    let nextSpeed = speed + forward * accel * delta;
    if (!forward) nextSpeed *= Math.max(0, 1 - delta * (handbrake ? 5.4 : 1.25));
    if (handbrake && vehicle === "car") nextSpeed *= Math.max(0.8, 1 - delta * 0.45);
    nextSpeed = clamp(nextSpeed, -maxSpeed * 0.38, maxSpeed);
    if (flying || boatMode) nextSpeed = clamp(nextSpeed, -maxSpeed * 0.4, maxSpeed);
    speed = nextSpeed;
    const currentVelocity = playerBody.linvel();
    const verticalVelocity = flying ? currentVelocity.y : Math.max(currentVelocity.y, -8);
    if (!flying && !boatMode && !walkMode) {
      playerBody.setLinvel({ x: direction.x * speed, y: verticalVelocity, z: direction.z * speed }, true);
    } else if (walkMode || boatMode || flying) {
      playerBody.setLinvel({ x: direction.x * speed, y: verticalVelocity, z: direction.z * speed }, true);
    }
    playerBody.setRotation({ x: 0, y: Math.sin(yaw / 2), z: 0, w: Math.cos(yaw / 2) }, true);
    if (vehicle === "helicopter" || vehicle === "plane") {
      playerBody.setTranslation({ x: playerBody.translation().x, y: Math.max(1.2, playerBody.translation().y), z: playerBody.translation().z }, true);
    } else if (boatMode) {
      const position = playerBody.translation();
      playerBody.setTranslation({ x: position.x, y: -0.1, z: position.z }, true);
    } else {
      const position = playerBody.translation();
      if (position.y < 1.2) playerBody.setTranslation({ x: position.x, y: 1.2, z: position.z }, true);
    }
  };

  const updateScene = (delta: number) => {
    const position = playerBody.translation();
    const now = performance.now() / 1000;
    for (const pedestrian of pedestrians) {
      const dx = pedestrian.root.position.x - position.x;
      const dz = pedestrian.root.position.z - position.z;
      if (Math.hypot(dx, dz) < 7) pedestrian.fleeingUntil = now + 2.4;
      const fleeing = now < pedestrian.fleeingUntil;
      if (fleeing) {
        const angle = Math.atan2(-dx, -dz);
        pedestrian.root.position.x += Math.sin(angle) * delta * 5;
        pedestrian.root.position.z += Math.cos(angle) * delta * 5;
      } else {
        pedestrian.phase += delta * 1.1;
      }
      pedestrian.root.rotation.y = fleeing ? Math.atan2(-dx, -dz) : Math.sin(pedestrian.phase) * 0.14;
      pedestrian.legs.forEach((leg, index) => { leg.rotation.x = Math.sin(pedestrian.phase * 4 + index * Math.PI) * (fleeing ? 0.7 : 0.12); });
    }
    for (const npc of npcCars) {
      npc.progress += delta * 4.5 * npc.direction;
      if (npc.progress > 390) npc.progress = -390;
      if (npc.progress < -390) npc.progress = 390;
      if (npc.axis === "x") {
        npc.group.position.set(npc.progress, 0, npc.lane);
        npc.group.rotation.y = npc.direction > 0 ? Math.PI / 2 : -Math.PI / 2;
      } else {
        npc.group.position.set(npc.lane, 0, npc.progress);
        npc.group.rotation.y = npc.direction > 0 ? Math.PI : 0;
      }
    }
    if (vehicle && currentVehicleGroup) {
      currentVehicleGroup.position.set(position.x, vehicle === "boat" ? -0.1 : position.y - 0.65, position.z);
      currentVehicleGroup.rotation.y = yaw;
      if (vehicle === "helicopter" || vehicle === "plane") {
        currentVehicleGroup.rotation.z = clamp(-controls.steer * 0.16, -0.2, 0.2);
      }
    } else if (currentPerson) {
      currentPerson.root.position.set(position.x, Math.max(0, position.y - 1), position.z);
      currentPerson.root.rotation.y = yaw;
      avatarRoot.position.set(position.x, Math.max(0, position.y - 1), position.z);
      avatarRoot.rotation.y = yaw;
      const moving = Math.abs(speed) > 0.5;
      currentPerson.legs.forEach((leg, index) => {
        leg.rotation.x = moving ? Math.sin(now * (Math.abs(speed) > 3 ? 10 : 6) + index * Math.PI) * 0.48 : 0;
      });
    }
    if (stars > 0) {
      const policeDistance = Math.hypot(policeCar.position.x - position.x, policeCar.position.z - position.z);
      const chaseAngle = Math.atan2(position.x - policeCar.position.x, position.z - policeCar.position.z);
      const approach = Math.min(1, delta * (stars * 0.6 + 0.8));
      const targetX = position.x - Math.sin(chaseAngle) * Math.min(16, 6 + stars * 2);
      const targetZ = position.z - Math.cos(chaseAngle) * Math.min(16, 6 + stars * 2);
      policeCar.position.x += (targetX - policeCar.position.x) * approach;
      policeCar.position.z += (targetZ - policeCar.position.z) * approach;
      policeCar.rotation.y = Math.atan2(position.x - policeCar.position.x, position.z - policeCar.position.z);
      policeCar.visible = stars >= 1;
      const stopped = Math.abs(speed) < 1.5 && policeDistance < 8;
      stoppedTimer = stopped ? stoppedTimer + delta : 0;
      if ((stoppedTimer > 3.5 || (!vehicle && policeDistance < 4)) && !paused) {
        paused = true;
        stoppedTimer = 0;
        callbacks.onCaught?.(stars);
      }
    } else {
      policeCar.visible = false;
      stoppedTimer = 0;
    }
    const target = new THREE.Vector3(position.x, position.y + (vehicle ? 0.9 : 1.1), position.z);
    const horizontalDistance = vehicle === "plane" || vehicle === "helicopter" ? 16 : vehicle ? 11 : 7;
    const cameraDirection = new THREE.Vector3(Math.sin(cameraYaw), 0, Math.cos(cameraYaw));
    const desired = target.clone().addScaledVector(cameraDirection, horizontalDistance);
    desired.y += vehicle === "helicopter" || vehicle === "plane" ? 5 + cameraPitch * 12 : 4 + cameraPitch * 10;
    camera.position.lerp(desired, clamp(delta * 5, 0, 1));
    camera.lookAt(target);
    sun.position.set(position.x - 120, position.y + 180, position.z + 90);
    sun.target.position.copy(target);
    rain.position.set(position.x, position.y + 15, position.z);
    const night = hour < 6.2 || hour > 18.5;
    const intensity = night ? 0.48 : hour < 8 || hour > 16.5 ? 1.35 : 2.1;
    sun.intensity = intensity;
    skyMaterial.uniforms.top.value.set(night ? "#18284b" : "#4389a5");
    skyMaterial.uniforms.horizon.value.set(night ? "#765f65" : "#e3d7b4");
    for (const chest of chestGroups) chest.children[2]!.visible = night || hour > 17;
    streetGlowMaterial.emissiveIntensity = night ? 2.3 : 0;
  };

  const animate = () => {
    if (disposed) return;
    const delta = Math.min(0.05, clock.getDelta());
    if (running && !paused) {
      updateControls(delta);
      physics.timestep = 1 / 60;
      physics.step();
      const position = playerBody.translation();
      if (Math.abs(position.x) > 780 || Math.abs(position.z) > 780) {
        playerBody.setTranslation({ x: clamp(position.x, -770, 770), y: Math.max(1.2, position.y), z: clamp(position.z, -770, 770) }, true);
      }
      syncChunks();
      const speeding = vehicle !== null && Math.abs(speed) > 18;
      if (speeding) {
        stars = Math.min(5, Math.max(1, stars + (Math.abs(speed) > 30 ? delta * 0.12 : 0)));
        wantedTimer = 8;
      } else if (stars > 0) {
        wantedTimer -= delta;
        if (wantedTimer <= 0) {
          stars = Math.max(0, stars - 1);
          wantedTimer = stars ? 3 : 0;
        }
      }
      let closest: number | null = null;
      let closestDistance = Infinity;
      TREASURES.forEach((treasure) => {
        if (collected.has(treasure.id)) return;
        const distance = Math.hypot(position.x - treasure.x, position.z - treasure.z, position.y - treasure.y);
        if (distance < 12 && distance < closestDistance) {
          closest = treasure.id;
          closestDistance = distance;
        }
        chestGroups[treasure.id]!.visible = true;
        chestGroups[treasure.id]!.rotation.y = Math.sin(performance.now() / 800 + treasure.id) * 0.09;
      });
      if (closest !== nearestTreasure) {
        nearestTreasure = closest;
        callbacks.onNearbyTreasure?.(closest);
      }
      wantedTimer = Math.max(0, wantedTimer);
      if (weather === "rain") {
        const array = rainGeometry.attributes.position.array as Float32Array;
        for (let i = 1; i < array.length; i += 3) {
          array[i] = array[i]! - delta * 28;
          if (array[i]! < 0) array[i] = 45;
        }
        rainGeometry.attributes.position.needsUpdate = true;
      }
      hour = (hour + delta / 210) % 24;
      updateScene(delta);
      animationMixer?.update(delta);
      const animationState: AnimationState = performance.now() < celebrateUntil
        ? "celebrate"
        : vehicle
          ? "idle"
          : position.y > 2
            ? (playerBody.linvel().y > 0.5 ? "jump" : "fall")
            : Math.abs(speed) > 3
              ? "run"
              : Math.abs(speed) > 0.25
                ? "walk"
                : "idle";
      if (animationState !== activeAnimation) {
        const nextAction = animationActions.get(animationState);
        if (nextAction) {
          nextAction.enabled = true;
          nextAction.reset().play();
          nextAction.crossFadeFrom(animationActions.get(activeAnimation) ?? nextAction, 0.18, false);
          activeAnimation = animationState;
        }
      }
      if (quality === "auto") {
        autoSampleTime += delta;
        autoSampleFrames += 1;
        if (autoSampleTime >= 2) {
          const fps = autoSampleFrames / autoSampleTime;
          const ratio = fps < 34 ? 0.65 : fps < 45 ? 0.82 : 1;
          const far = fps < 34 ? 260 : QUALITY.auto.far;
          renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, ratio));
          scene.fog = new THREE.Fog(weather === "rain" ? "#8298a1" : "#9ecbd3", far * 0.28, far);
          autoSampleFrames = 0;
          autoSampleTime = 0;
        }
      }
      timeSinceHud += delta;
      if (timeSinceHud > 0.12) {
        timeSinceHud = 0;
        callbacks.onHud?.({
          x: position.x,
          z: position.z,
          speed: Math.abs(speed) * 3.6,
          altitude: Math.max(0, position.y),
          stars,
          nearTreasure: nearestTreasure,
          vehicle,
          timeOfDay: hour,
        });
      }
    }
    renderer.render(scene, camera);
    frameId = requestAnimationFrame(animate);
  };
  const clock = new THREE.Clock();
  let frameId = requestAnimationFrame(animate);

  const resize = () => {
    const width = Math.max(1, host.clientWidth);
    const height = Math.max(1, host.clientHeight);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);
  resize();
  updateQuality("auto");
  syncChunks();
  callbacks.onLoading?.(0.78);

  const game: MetropolisGame = {
    start: () => {
      running = true;
      paused = false;
    },
    setPaused: (nextPaused) => { paused = nextPaused; },
    setControls: (next) => Object.assign(controls, next),
    setCameraLook: (x, y) => {
      cameraYaw += x * 0.0035 * sensitivity;
      cameraPitch = clamp(cameraPitch + y * 0.002 * sensitivity, -0.12, 0.62);
    },
    setSensitivity: (next) => { sensitivity = clamp(next, 0.35, 2); },
    setVehicle: (next) => selectVehicle(next),
    setQuality: updateQuality,
    setWeather: (next) => {
      weather = next;
      rain.visible = next === "rain";
      const preset = QUALITY[quality];
      scene.fog = new THREE.Fog(next === "rain" ? "#8298a1" : "#9ecbd3", preset.far * 0.28, preset.far);
    },
    setTimeOfDay: (next) => { hour = ((next % 24) + 24) % 24; },
    interact,
    jump,
    honk,
    setCollected: (id) => {
      if (!TREASURES.some((item) => item.id === id)) return;
      collected.add(id);
      chestGroups[id]!.visible = false;
      celebrateUntil = performance.now() + 1800;
    },
    reset: () => {
      collected.clear();
      chestGroups.forEach((chest) => { chest.visible = true; });
      stars = 0;
      wantedTimer = 0;
      policeCar.visible = false;
      selectVehicle("car");
      setPosition(8, 12);
    },
    setPosition,
    dispose: () => {
      if (disposed) return;
      disposed = true;
      cancelAnimationFrame(frameId);
      worker.terminate();
      window.removeEventListener("keydown", keyDown);
      window.removeEventListener("keyup", keyUp);
      resizeObserver.disconnect();
      renderer.dispose();
      dracoLoader.dispose();
      ktx2Loader.dispose();
      animationMixer?.stopAllAction();
      physics.free();
      scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh) && !(object instanceof THREE.Points)) return;
        object.geometry.dispose();
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach((material) => material.dispose());
      });
      host.replaceChildren();
    },
  };
  callbacks.onLoading?.(1);
  return game;
};
