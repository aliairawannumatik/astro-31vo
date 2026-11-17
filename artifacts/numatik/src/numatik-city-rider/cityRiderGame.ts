import * as THREE from "three";

export type CityControls = {
  accelerate: number;
  brake: number;
  steer: number;
};

export type CityTreasure = {
  id: number;
  name: string;
  position: THREE.Vector3;
};

export type CityGame = {
  start: () => void;
  setPaused: (paused: boolean) => void;
  setControls: (controls: Partial<CityControls>) => void;
  interact: () => void;
  setCollected: (id: number) => void;
  reset: () => void;
  dispose: () => void;
};

type CityGameCallbacks = {
  onNearby: (treasure: CityTreasure | null) => void;
  onOpen: (treasure: CityTreasure) => void;
  onStatus: (position: { x: number; z: number }, speed: number) => void;
};

type CityCollider =
  | { kind: "box"; x: number; z: number; halfWidth: number; halfDepth: number; radius: number }
  | { kind: "circle"; x: number; z: number; radius: number };

const CITY_SIZE = 260;
const ROAD_LINES = [-100, -40, 40, 100];
const TREASURES: CityTreasure[] = [
  { id: 0, name: "Taman Kota", position: new THREE.Vector3(15, 0, 8) },
  { id: 1, name: "Pasar Pagi", position: new THREE.Vector3(-48, 0, -50) },
  { id: 2, name: "Sekolah Pelita", position: new THREE.Vector3(50, 0, -48) },
  { id: 3, name: "Rumah Pak Budi", position: new THREE.Vector3(-49, 0, 58) },
  { id: 4, name: "Pusat Belanja", position: new THREE.Vector3(83, 0, 57) },
];

const material = (color: string, roughness = 0.82, metalness = 0) =>
  new THREE.MeshStandardMaterial({ color, roughness, metalness });

const box = (
  parent: THREE.Object3D,
  geometry: THREE.BoxGeometry,
  surface: THREE.Material,
  position: [number, number, number],
  scale?: [number, number, number],
) => {
  const mesh = new THREE.Mesh(geometry, surface);
  mesh.position.set(...position);
  if (scale) mesh.scale.set(...scale);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
};

const cylinder = (
  parent: THREE.Object3D,
  radiusTop: number,
  radiusBottom: number,
  height: number,
  surface: THREE.Material,
  position: [number, number, number],
  segments = 16,
) => {
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments),
    surface,
  );
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
};

const addTree = (
  parent: THREE.Object3D,
  x: number,
  z: number,
  scale: number,
  trunkMaterial: THREE.Material,
  leafMaterials: THREE.Material[],
) => {
  const tree = new THREE.Group();
  tree.position.set(x, 0, z);
  tree.scale.setScalar(scale);
  cylinder(tree, 0.24, 0.36, 2.2, trunkMaterial, [0, 1.1, 0], 9);
  const crown = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.35, 1),
    leafMaterials[Math.abs(Math.round(x * 13 + z * 7)) % leafMaterials.length]!,
  );
  crown.position.y = 2.75;
  crown.scale.set(1, 1.2, 1);
  crown.castShadow = true;
  tree.add(crown);
  parent.add(tree);
  return { x, z, radius: scale * 0.48 };
};

const addBuilding = (
  scene: THREE.Scene,
  x: number,
  z: number,
  width: number,
  depth: number,
  height: number,
  palette: number,
  isShop: boolean,
  geometry: THREE.BoxGeometry,
  materials: THREE.Material[],
  windowGeometry: THREE.BoxGeometry,
  windowMaterials: THREE.Material[],
) => {
  const building = new THREE.Group();
  building.position.set(x, 0, z);
  const buildingMaterial = materials[palette % materials.length]!;
  box(building, geometry, buildingMaterial, [0, height / 2, 0], [width, height, depth]);
  box(
    building,
    geometry,
    materials[(palette + 5) % materials.length]!,
    [0, height + 0.22, 0],
    [width + 0.6, 0.42, depth + 0.6],
  );

  const floorSpacing = 2.5;
  const floorCount = Math.max(1, Math.floor((height - 2) / floorSpacing));
  const columns = Math.max(2, Math.floor(width / 2.4));
  for (let floor = 0; floor < floorCount; floor += 1) {
    const y = 1.55 + floor * floorSpacing;
    for (let column = 0; column < columns; column += 1) {
      const windowX = -width / 2 + ((column + 0.5) * width) / columns;
      const windowW = Math.min(0.82, width / columns - 0.44);
      box(building, windowGeometry, windowMaterials[(floor + column + palette) % 2]!, [
        windowX,
        y,
        depth / 2 + 0.025,
      ], [windowW, 0.98, 0.055]);
      if (width > 9) {
        box(building, windowGeometry, windowMaterials[(floor + column + 1) % 2]!, [
          windowX,
          y,
          -depth / 2 - 0.025,
        ], [windowW, 0.98, 0.055]);
      }
    }
  }

  const sign = box(
    building,
    geometry,
    isShop ? materials[6]! : materials[7]!,
    [0, isShop ? 2.6 : height + 0.5, depth / 2 + 0.18],
    [Math.min(width * 0.76, 8), 0.86, 0.24],
  );
  sign.castShadow = false;
  if (isShop) {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 256;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Papan nama NUMATIK tidak dapat dibuat.");
    const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#173d43");
    gradient.addColorStop(1, "#286d68");
    context.fillStyle = gradient;
    context.beginPath();
    context.roundRect(16, 16, canvas.width - 32, canvas.height - 32, 30);
    context.fill();
    context.strokeStyle = "rgba(255,235,184,.8)";
    context.lineWidth = 8;
    context.stroke();
    context.fillStyle = "#fff2ca";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = "900 112px Arial, sans-serif";
    context.fillText("NUMATIK", canvas.width / 2, canvas.height * 0.47);
    context.fillStyle = "#d8eee0";
    context.font = "700 30px Arial, sans-serif";
    context.fillText("KOTA CERDAS • BELAJAR SAMBIL BERMAIN", canvas.width / 2, canvas.height * 0.79);
    const signTexture = new THREE.CanvasTexture(canvas);
    signTexture.colorSpace = THREE.SRGBColorSpace;
    signTexture.anisotropy = 4;
    const signFace = new THREE.Mesh(
      new THREE.PlaneGeometry(Math.min(width * 0.76, 8) * 0.94, 0.72),
      new THREE.MeshBasicMaterial({ map: signTexture }),
    );
    signFace.position.set(0, isShop ? 2.6 : height + 0.5, depth / 2 + 0.31);
    building.add(signFace);
  }
  if (isShop) {
    box(building, geometry, materials[8]!, [0, 0.08, 0], [width + 1.2, 0.16, depth + 1.2]);
  }
  scene.add(building);
  return {
    x,
    z,
    halfWidth: width / 2 + 0.85,
    halfDepth: depth / 2 + 0.85,
    radius: 1.25,
  };
};

const makeMotorcycle = (scene: THREE.Scene) => {
  const bike = new THREE.Group();
  const frame = material("#202b35", 0.42, 0.34);
  const red = material("#f04f49", 0.34, 0.22);
  const black = material("#11181f", 0.94);
  const chrome = material("#bac6cd", 0.3, 0.72);
  const helmetCanvas = document.createElement("canvas");
  helmetCanvas.width = 1024;
  helmetCanvas.height = 512;
  const helmetContext = helmetCanvas.getContext("2d");
  if (!helmetContext) throw new Error("Motif helm pengendara tidak dapat dibuat.");
  const helmetGradient = helmetContext.createLinearGradient(0, 0, helmetCanvas.width * 0.75, helmetCanvas.height);
  helmetGradient.addColorStop(0, "#26343b");
  helmetGradient.addColorStop(0.5, "#35484d");
  helmetGradient.addColorStop(1, "#1c2a32");
  helmetContext.fillStyle = helmetGradient;
  helmetContext.fillRect(0, 0, helmetCanvas.width, helmetCanvas.height);
  helmetContext.save();
  helmetContext.lineCap = "round";
  helmetContext.lineJoin = "round";
  for (let stripe = 0; stripe < 5; stripe += 1) {
    const offset = stripe * 238 - 90;
    helmetContext.beginPath();
    helmetContext.moveTo(offset, 465);
    helmetContext.lineTo(offset + 120, 326);
    helmetContext.lineTo(offset + 214, 242);
    helmetContext.lineTo(offset + 312, 45);
    helmetContext.strokeStyle = stripe % 2 === 0 ? "#66b9b8" : "#a8b8b8";
    helmetContext.lineWidth = stripe % 2 === 0 ? 21 : 8;
    helmetContext.stroke();
  }
  helmetContext.restore();
  helmetContext.fillStyle = "rgba(18,34,40,.92)";
  helmetContext.beginPath();
  helmetContext.roundRect(439, 208, 146, 98, 22);
  helmetContext.fill();
  helmetContext.strokeStyle = "#66b9b8";
  helmetContext.lineWidth = 5;
  helmetContext.stroke();
  helmetContext.fillStyle = "#d8e4df";
  helmetContext.font = "900 68px Arial, sans-serif";
  helmetContext.textAlign = "center";
  helmetContext.textBaseline = "middle";
  helmetContext.fillText("N", 512, 255);
  const helmetTexture = new THREE.CanvasTexture(helmetCanvas);
  helmetTexture.colorSpace = THREE.SRGBColorSpace;
  helmetTexture.anisotropy = 4;
  const helmet = new THREE.MeshStandardMaterial({
    map: helmetTexture,
    color: "#ffffff",
    roughness: 0.52,
    metalness: 0.16,
  });
  const helmetTrimMaterial = material("#98aaad", 0.42, 0.34);
  const chinGuardMaterial = material("#25343b", 0.48, 0.16);
  const skin = material("#dca781", 0.9);
  const wheelGeometry = new THREE.TorusGeometry(0.42, 0.095, 10, 28);
  const wheelMaterial = black;
  const wheels: THREE.Mesh[] = [];
  const wheelDetails: THREE.Group[] = [];

  for (const z of [-0.9, 0.92]) {
    const wheelAssembly = new THREE.Group();
    wheelAssembly.position.set(0, 0.48, z);
    wheelAssembly.rotation.y = Math.PI / 2;
    const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel.castShadow = true;
    wheelAssembly.add(wheel);
    for (const side of [-1, 1]) {
      const rim = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.025, 7, 24), chrome);
      rim.position.x = side * 0.09;
      wheelAssembly.add(rim);
      const hub = cylinder(wheelAssembly, 0.075, 0.075, 0.25, chrome, [side * 0.04, 0, 0], 12);
      hub.rotation.z = Math.PI / 2;
    }
    for (let spoke = 0; spoke < 8; spoke += 1) {
      const angle = (spoke / 8) * Math.PI * 2;
      const wire = cylinder(
        wheelAssembly,
        0.012,
        0.012,
        0.51,
        chrome,
        [0, Math.sin(angle) * 0.12, Math.cos(angle) * 0.12],
        6,
      );
      wire.rotation.x = angle;
    }
    bike.add(wheelAssembly);
    wheels.push(wheel);
    wheelDetails.push(wheelAssembly);
  }
  cylinder(bike, 0.14, 0.2, 0.58, frame, [0, 0.65, 0.02], 12).rotation.x = Math.PI / 2;
  const fuelTank = new THREE.Mesh(new THREE.SphereGeometry(0.43, 16, 12), red);
  fuelTank.position.set(0, 1.02, -0.02);
  fuelTank.scale.set(0.75, 0.7, 1.14);
  fuelTank.castShadow = true;
  bike.add(fuelTank);
  box(bike, new THREE.BoxGeometry(0.58, 0.14, 0.55), black, [0, 0.96, 0.5]);
  box(bike, new THREE.BoxGeometry(0.58, 0.12, 0.35), red, [0, 0.78, -0.65]);
  for (const side of [-1, 1]) {
    const fork = cylinder(bike, 0.045, 0.045, 0.93, chrome, [side * 0.17, 0.84, -0.69], 10);
    fork.rotation.x = -0.16;
  }
  box(bike, new THREE.BoxGeometry(0.46, 0.07, 0.5), red, [0, 0.92, -0.9]);
  box(bike, new THREE.BoxGeometry(0.62, 0.08, 0.08), frame, [0, 1.24, -0.72]);
  const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.17, 12, 10), material("#fff2bf", 0.22, 0.1));
  lamp.position.set(0, 1.17, -0.91);
  bike.add(lamp);
  const tailLamp = new THREE.Mesh(
    new THREE.SphereGeometry(0.09, 10, 8),
    new THREE.MeshBasicMaterial({ color: "#ff5248" }),
  );
  tailLamp.position.set(0, 1.03, 0.83);
  bike.add(tailLamp);
  const muffler = cylinder(bike, 0.09, 0.12, 0.7, chrome, [0.34, 0.58, 0.42], 10);
  muffler.rotation.x = Math.PI / 2;
  for (const side of [-1, 1]) {
    const footrest = cylinder(bike, 0.035, 0.035, 0.3, frame, [side * 0.39, 0.56, 0.2], 8);
    footrest.rotation.z = Math.PI / 2;
    const mirrorStem = cylinder(bike, 0.018, 0.025, 0.43, chrome, [side * 0.23, 1.46, -0.7], 8);
    mirrorStem.rotation.x = -0.28;
    const mirror = new THREE.Mesh(new THREE.SphereGeometry(0.11, 12, 8), frame);
    mirror.position.set(side * 0.35, 1.62, -0.76);
    mirror.scale.set(1, 0.67, 0.35);
    bike.add(mirror);
  }
  cylinder(bike, 0.11, 0.13, 0.6, frame, [0.27, 0.66, 0.52], 10).rotation.z = Math.PI / 2;

  const rider = new THREE.Group();
  const jacket = material("#274e64", 0.92);
  const trousers = material("#243849", 0.94);
  const glove = material("#202b30", 0.9);
  const boot = material("#272b2c", 0.86);
  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.29, 0.57, 7, 14), jacket);
  torso.position.set(0, 1.68, 0.24);
  torso.rotation.x = -0.53;
  torso.castShadow = true;
  rider.add(torso);
  const neck = cylinder(rider, 0.09, 0.11, 0.2, skin, [0, 1.98, 0.1], 12);
  neck.rotation.x = -0.35;
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.23, 20, 16), skin);
  head.position.set(0, 2.13, -0.04);
  head.castShadow = true;
  rider.add(head);
  const helmetMesh = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 24), helmet);
  helmetMesh.position.set(0, 2.25, -0.04);
  helmetMesh.scale.set(1.05, 0.84, 1.22);
  helmetMesh.castShadow = true;
  rider.add(helmetMesh);
  const visor = new THREE.Mesh(
    new THREE.SphereGeometry(0.265, 24, 16, Math.PI * 0.12, Math.PI * 0.76, Math.PI * 0.34, Math.PI * 0.35),
    new THREE.MeshStandardMaterial({
      color: "#345969",
      roughness: 0.16,
      metalness: 0.3,
      transparent: true,
      opacity: 0.85,
    }),
  );
  visor.position.set(0, 2.2, -0.045);
  visor.castShadow = false;
  rider.add(visor);
  const chinGuard = box(rider, new THREE.BoxGeometry(0.36, 0.16, 0.22), chinGuardMaterial, [
    0,
    2.04,
    -0.18,
  ]);
  chinGuard.castShadow = true;
  const helmetTrim = new THREE.Mesh(
    new THREE.TorusGeometry(0.255, 0.022, 6, 24, Math.PI),
    helmetTrimMaterial,
  );
  helmetTrim.position.set(0, 2.27, -0.075);
  helmetTrim.rotation.x = -Math.PI * 0.08;
  rider.add(helmetTrim);
  const rearSpoiler = new THREE.Mesh(
    new THREE.BoxGeometry(0.33, 0.055, 0.15),
    material("#438c8a", 0.48, 0.12),
  );
  rearSpoiler.position.set(0, 2.48, 0.11);
  rearSpoiler.rotation.x = -0.16;
  rider.add(rearSpoiler);
  for (const side of [-1, 1]) {
    const upperArm = cylinder(rider, 0.105, 0.13, 0.4, jacket, [side * 0.28, 1.68, 0.02], 12);
    upperArm.rotation.x = -0.64;
    upperArm.rotation.z = side * -0.22;
    const forearm = cylinder(rider, 0.075, 0.1, 0.43, jacket, [side * 0.32, 1.49, -0.28], 12);
    forearm.rotation.x = -0.88;
    forearm.rotation.z = side * -0.1;
    const gloveMesh = new THREE.Mesh(new THREE.SphereGeometry(0.085, 12, 10), glove);
    gloveMesh.position.set(side * 0.34, 1.39, -0.53);
    rider.add(gloveMesh);
    const thigh = cylinder(rider, 0.13, 0.15, 0.39, trousers, [side * 0.19, 1.23, 0.29], 12);
    thigh.rotation.x = 0.78;
    const shin = cylinder(rider, 0.075, 0.095, 0.34, trousers, [side * 0.24, 0.99, 0.5], 12);
    shin.rotation.x = 0.32;
    const bootMesh = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.15, 0.32), boot);
    bootMesh.position.set(side * 0.24, 0.78, 0.59);
    bootMesh.castShadow = true;
    rider.add(bootMesh);
  }
  const logoCanvas = document.createElement("canvas");
  logoCanvas.width = 512;
  logoCanvas.height = 192;
  const logoContext = logoCanvas.getContext("2d");
  if (!logoContext) throw new Error("Logo seragam pengendara tidak dapat dibuat.");
  logoContext.fillStyle = "#173f4c";
  logoContext.beginPath();
  logoContext.roundRect(8, 8, 496, 176, 30);
  logoContext.fill();
  logoContext.strokeStyle = "#e7c77d";
  logoContext.lineWidth = 9;
  logoContext.stroke();
  logoContext.fillStyle = "#e7c77d";
  logoContext.beginPath();
  logoContext.moveTo(58, 96);
  logoContext.lineTo(91, 48);
  logoContext.lineTo(124, 96);
  logoContext.lineTo(91, 144);
  logoContext.closePath();
  logoContext.fill();
  logoContext.fillStyle = "#f4f4e8";
  logoContext.textAlign = "center";
  logoContext.textBaseline = "middle";
  logoContext.font = "900 72px Arial, sans-serif";
  logoContext.fillText("NUMATIK", 314, 96);
  const logoTexture = new THREE.CanvasTexture(logoCanvas);
  logoTexture.colorSpace = THREE.SRGBColorSpace;
  const jacketLogo = new THREE.Mesh(
    new THREE.PlaneGeometry(0.4, 0.15),
    new THREE.MeshBasicMaterial({ map: logoTexture, transparent: true, toneMapped: false }),
  );
  jacketLogo.position.set(0, 1.68, 0.535);
  jacketLogo.rotation.x = -0.53;
  rider.add(jacketLogo);
  bike.add(rider);
  bike.position.set(8, 0, 100);
  scene.add(bike);
  return { bike, wheels, wheelDetails, rider };
};

const makeCar = (parent: THREE.Object3D, color: string) => {
  const car = new THREE.Group();
  const bodyMaterial = material(color, 0.3, 0.2);
  const glass = material("#9dd2df", 0.2, 0.24);
  const tire = material("#20242a", 0.95);
  box(car, new THREE.BoxGeometry(1.9, 0.72, 3.6), bodyMaterial, [0, 0.78, 0]);
  box(car, new THREE.BoxGeometry(1.45, 0.74, 1.8), glass, [0, 1.45, -0.14]);
  box(car, new THREE.BoxGeometry(1.56, 0.09, 0.42), material("#fff2c0", 0.25), [
    0,
    0.92,
    -1.84,
  ]);
  for (const x of [-0.88, 0.88]) {
    for (const z of [-1.18, 1.18]) {
      const wheel = cylinder(car, 0.35, 0.35, 0.17, tire, [x, 0.42, z], 12);
      wheel.rotation.z = Math.PI / 2;
    }
  }
  car.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      object.castShadow = true;
      object.receiveShadow = true;
    }
  });
  parent.add(car);
  return car;
};

const makeWalker = (parent: THREE.Object3D, color: string) => {
  const person = new THREE.Group();
  const clothes = material(color, 0.78);
  const face = material("#d9ac8a", 0.9);
  const hair = material("#42352d", 0.94);
  const pants = material("#36546a", 0.92);
  const shoes = material("#252a2a", 0.9);
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.22, 0.44, 5, 10), clothes);
  body.position.y = 1.2;
  body.castShadow = true;
  person.add(body);
  cylinder(person, 0.09, 0.1, 0.17, face, [0, 1.52, 0], 10);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 12), face);
  head.position.y = 1.72;
  head.castShadow = true;
  person.add(head);
  const hairCap = new THREE.Mesh(new THREE.SphereGeometry(0.185, 16, 10, 0, Math.PI * 2, 0, Math.PI * 0.55), hair);
  hairCap.position.y = 1.77;
  person.add(hairCap);
  for (const side of [-1, 1]) {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 6), material("#29373a", 0.85));
    eye.position.set(side * 0.063, 1.73, -0.158);
    person.add(eye);
  }
  const arms: THREE.Group[] = [];
  const legs: THREE.Group[] = [];
  for (const side of [-1, 1]) {
    const arm = new THREE.Group();
    arm.position.set(side * 0.23, 1.38, 0);
    cylinder(arm, 0.065, 0.075, 0.34, clothes, [0, -0.15, 0], 9);
    cylinder(arm, 0.045, 0.06, 0.31, clothes, [0, -0.44, -0.015], 9);
    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.055, 10, 8), face);
    hand.position.set(0, -0.6, -0.015);
    arm.add(hand);
    person.add(arm);
    arms.push(arm);

    const leg = new THREE.Group();
    leg.position.set(side * 0.12, 0.9, 0);
    cylinder(leg, 0.085, 0.1, 0.4, pants, [0, -0.19, 0], 10);
    cylinder(leg, 0.055, 0.075, 0.34, pants, [0, -0.53, -0.025], 10);
    box(leg, new THREE.BoxGeometry(0.15, 0.11, 0.24), shoes, [0, -0.72, -0.085]);
    person.add(leg);
    legs.push(leg);
  }
  parent.add(person);
  return { person, arms, legs };
};

const makeChest = (scene: THREE.Scene, treasure: CityTreasure) => {
  const chest = new THREE.Group();
  const darkWood = material("#774528", 0.48);
  const gold = material("#ffd36a", 0.28, 0.45);
  box(chest, new THREE.BoxGeometry(1.45, 0.86, 1), darkWood, [0, 0.58, 0]);
  box(chest, new THREE.BoxGeometry(1.57, 0.14, 1.08), gold, [0, 0.57, 0]);
  box(chest, new THREE.BoxGeometry(1.54, 0.14, 1.07), gold, [0, 0.99, 0]);
  box(chest, new THREE.BoxGeometry(0.22, 0.28, 1.08), gold, [0, 0.73, 0]);
  const lid = new THREE.Mesh(new THREE.BoxGeometry(1.52, 0.22, 1.05), darkWood);
  lid.position.set(0, 1.11, 0);
  lid.castShadow = true;
  chest.add(lid);
  const beacon = new THREE.Mesh(
    new THREE.TorusGeometry(1.25, 0.055, 8, 48),
    new THREE.MeshBasicMaterial({ color: "#ffd166", transparent: true, opacity: 0.75 }),
  );
  beacon.rotation.x = -Math.PI / 2;
  beacon.position.y = 0.09;
  chest.add(beacon);
  const jewel = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.23, 0),
    new THREE.MeshStandardMaterial({
      color: "#c5fff1",
      emissive: "#20efbd",
      emissiveIntensity: 2.2,
      metalness: 0.45,
      roughness: 0.18,
    }),
  );
  jewel.position.set(0, 1.57, 0);
  chest.add(jewel);
  const waveColors = ["#ff4fb8", "#ffcb45", "#47f5bb", "#45b7ff", "#ad70ff"];
  const waves = waveColors.map((color, index) => {
    const wave = new THREE.Mesh(
      new THREE.TorusGeometry(0.68, 0.052, 8, 36),
      new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.82,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      }),
    );
    wave.rotation.x = -Math.PI / 2;
    wave.position.y = 0.72 + index * 0.8;
    chest.add(wave);
    return wave;
  });
  const glow = new THREE.PointLight("#70ffd7", 12, 16, 2);
  glow.position.set(0, 2.6, 0);
  chest.add(glow);
  chest.position.copy(treasure.position);
  scene.add(chest);
  return { chest, beacon, jewel, waves, glow };
};

export const mountCityGame = (
  host: HTMLElement,
  callbacks: CityGameCallbacks,
): CityGame => {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#b5d9ec");
  scene.fog = new THREE.Fog("#b5d9ec", 110, 340);
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
  renderer.setSize(host.clientWidth || window.innerWidth, host.clientHeight || window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.setAttribute("aria-label", "Jelajahi kota Numatik dengan sepeda motor 3D");
  host.appendChild(renderer.domElement);

  const camera = new THREE.PerspectiveCamera(54, 1, 0.1, 500);
  scene.add(new THREE.HemisphereLight("#ecf7ff", "#69735d", 2.2));
  const sun = new THREE.DirectionalLight("#fff1d2", 3.3);
  sun.position.set(-80, 120, 55);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -155;
  sun.shadow.camera.right = 155;
  sun.shadow.camera.top = 155;
  sun.shadow.camera.bottom = -155;
  sun.shadow.bias = -0.00015;
  scene.add(sun);

  const groundMaterial = material("#86a77a");
  const roadMaterial = material("#414c55", 0.96);
  const sidewalkMaterial = material("#d1c9b9", 0.95);
  const curbMaterial = material("#eee9de", 0.84);
  const grassMaterial = material("#8cae77", 0.98);
  const asphaltStripe = material("#f4dfaa", 0.8);
  const concrete = new THREE.BoxGeometry(1, 1, 1);
  const thinBox = new THREE.BoxGeometry(1, 1, 1);
  const leafMaterials = ["#39784f", "#568f56", "#6f9c5e", "#42856d"].map((color) => material(color, 0.96));
  const trunkMaterial = material("#725540", 0.98);
  const windowMaterials = [
    material("#c8e4e6", 0.26, 0.14),
    material("#f5d69c", 0.28, 0.08),
  ];
  const buildingMaterials = [
    "#e7d8c6",
    "#d3d9d4",
    "#edc3a6",
    "#bdd0ce",
    "#e9dfae",
    "#81969b",
    "#e56e55",
    "#4c7580",
    "#deb86d",
    "#a8a2c2",
    "#d4c6b1",
    "#adceb9",
  ].map((color) => material(color, 0.86));

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(CITY_SIZE, CITY_SIZE), groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.14;
  ground.receiveShadow = true;
  scene.add(ground);
  const staticColliders: CityCollider[] = [];

  for (const line of ROAD_LINES) {
    box(scene, concrete, roadMaterial, [line, -0.04, 0], [13, 0.12, CITY_SIZE]);
    box(scene, concrete, roadMaterial, [0, -0.04, line], [CITY_SIZE, 0.12, 13]);
    for (const side of [-1, 1]) {
      box(scene, concrete, sidewalkMaterial, [line + side * 8.3, 0.02, 0], [3.6, 0.2, CITY_SIZE]);
      box(scene, concrete, sidewalkMaterial, [0, 0.02, line + side * 8.3], [CITY_SIZE, 0.2, 3.6]);
      box(scene, thinBox, curbMaterial, [line + side * 6.8, 0.14, 0], [0.28, 0.28, CITY_SIZE]);
      box(scene, thinBox, curbMaterial, [0, 0.14, line + side * 6.8], [CITY_SIZE, 0.28, 0.28]);
    }
    for (let dash = -120; dash <= 120; dash += 12) {
      const verticalDash = box(scene, thinBox, asphaltStripe, [line, 0.035, dash], [0.16, 0.025, 5.2]);
      const horizontalDash = box(scene, thinBox, asphaltStripe, [dash, 0.035, line], [5.2, 0.025, 0.16]);
      verticalDash.castShadow = false;
      verticalDash.receiveShadow = false;
      horizontalDash.castShadow = false;
      horizontalDash.receiveShadow = false;
    }
  }

  const park = new THREE.Group();
  park.position.set(0, 0.04, 0);
  const parkBase = new THREE.Mesh(new THREE.BoxGeometry(34, 0.2, 34), grassMaterial);
  parkBase.position.y = 0;
  parkBase.receiveShadow = true;
  park.add(parkBase);
  const pathMat = material("#e6d9bb", 0.98);
  box(park, concrete, pathMat, [0, 0.12, 0], [3.4, 0.08, 31]);
  box(park, concrete, pathMat, [0, 0.12, 0], [31, 0.08, 3.4]);
  box(park, concrete, pathMat, [0, 0.12, 0], [13.5, 0.08, 13.5]);
  cylinder(park, 4.1, 4.7, 0.5, material("#b9ab95"), [0, 0.42, 0], 32);
  const water = cylinder(park, 3.7, 3.7, 0.16, material("#66bfd1", 0.22, 0.25), [0, 0.74, 0], 32);
  water.material.transparent = true;
  (water.material as THREE.Material).opacity = 0.88;
  cylinder(park, 0.48, 0.7, 0.68, material("#bdcbd0", 0.3, 0.34), [0, 1.12, 0], 20);
  cylinder(park, 0.22, 0.32, 0.76, material("#d4dfe0", 0.26, 0.32), [0, 1.75, 0], 18);
  const jets: THREE.Mesh[] = [];
  for (let index = 0; index < 8; index += 1) {
    const angle = (index / 8) * Math.PI * 2;
    const jet = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.11, 1, 8),
      new THREE.MeshBasicMaterial({ color: "#c5f8ff", transparent: true, opacity: 0.78 }),
    );
    jet.position.set(Math.cos(angle) * 1.9, 1.35, Math.sin(angle) * 1.9);
    jet.rotation.z = Math.cos(angle) * -0.28;
    jet.rotation.x = Math.sin(angle) * 0.28;
    park.add(jet);
    jets.push(jet);
  }
  for (const [x, z] of [[-12, -12], [12, -12], [-12, 12], [12, 12], [-12, 0], [12, 0], [0, -12], [0, 12]] as const) {
    addTree(park, x, z, 0.76, trunkMaterial, leafMaterials);
  }
  scene.add(park);

  const blocks = [-70, 0, 70];
  let buildingIndex = 0;
  for (const blockX of blocks) {
    for (const blockZ of blocks) {
      if (blockX === 0 && blockZ === 0) continue;
      const isCommercial = blockX === -70 && blockZ === -70
        || blockX === 70 && blockZ === 70
        || blockX === -70 && blockZ === 70;
      const center = new THREE.Vector3(blockX, 0, blockZ);
      const buildingPositions: Array<[number, number, number, number]> = isCommercial
        ? [[blockX, blockZ, 20, 17], [blockX + 13, blockZ + 10, 12, 13]]
        : [[blockX - 10, blockZ - 8, 10, 10], [blockX + 10, blockZ + 9, 10, 10], [blockX - 10, blockZ + 11, 8, 8]];
      for (const [buildingX, buildingZ, width, depth] of buildingPositions) {
        const height = isCommercial
          ? 14 + (buildingIndex % 3) * 6
          : 7 + (buildingIndex % 3) * 2;
        const buildingCollider = addBuilding(
          scene,
          buildingX,
          buildingZ,
          width,
          depth,
          height,
          buildingIndex,
          isCommercial,
          concrete,
          buildingMaterials,
          thinBox,
          windowMaterials,
        );
        staticColliders.push({ kind: "box", ...buildingCollider });
        buildingIndex += 1;
      }

      const plot = new THREE.Mesh(new THREE.BoxGeometry(46, 0.11, 46), grassMaterial);
      plot.position.set(center.x, -0.02, center.z);
      plot.receiveShadow = true;
      scene.add(plot);
      for (const [treeX, treeZ] of [[-19, -19], [19, -19], [-19, 19], [19, 19]] as const) {
        if (isCommercial && treeX === -19 && treeZ === -19) continue;
        addTree(
          scene,
          blockX + treeX,
          blockZ + treeZ,
          0.66 + (buildingIndex % 3) * 0.05,
          trunkMaterial,
          leafMaterials,
        );
      }
    }
  }

  for (const x of [-100, -40, 40, 100]) {
    for (const z of [-112, -77, -22, 22, 77, 112]) {
      const pole = new THREE.Group();
      const poleX = x + (x < 0 ? 9 : -9);
      pole.position.set(poleX, 0, z);
      cylinder(pole, 0.07, 0.1, 6, material("#52636a", 0.6, 0.35), [0, 3, 0], 8);
      const lamp = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 10, 8),
        new THREE.MeshBasicMaterial({ color: "#fff1bd" }),
      );
      lamp.position.set(0, 5.8, 0);
      pole.add(lamp);
      scene.add(pole);
    }
  }

  const treasureObjects = TREASURES.map((treasure) => makeChest(scene, treasure));
  const { bike, wheels } = makeMotorcycle(scene);
  camera.position.set(8, 5.8, 122);
  camera.lookAt(8, 1.15, 107);
  const speedLines = new THREE.Group();
  const traffic = Array.from({ length: 5 }, (_, index) => {
    const car = makeCar(scene, ["#e8e9df", "#d34c42", "#4d83a4", "#e9b64d", "#55a17b"][index]!);
    return {
      car,
      position: new THREE.Vector3(index % 2 === 0 ? -40 : 40, 0, -100 + index * 44),
      direction: index % 2 === 0 ? 1 : -1,
      axis: index % 2 === 0 ? "z" as const : "x" as const,
      speed: 5 + (index % 3) * 1.5,
    };
  });
  const walkers = [
    { person: makeWalker(scene, "#df7862"), x: -18, z: 3, phase: 0 },
    { person: makeWalker(scene, "#416f85"), x: 18, z: 4, phase: 1.7 },
    { person: makeWalker(scene, "#d0a448"), x: -5, z: -16, phase: 3.1 },
  ];
  walkers.forEach(({ person, x, z }) => person.person.position.set(x, 0, z));
  const dog = new THREE.Group();
  const dogBody = new THREE.Mesh(new THREE.CapsuleGeometry(0.28, 0.72, 4, 8), material("#ba8050"));
  dogBody.rotation.z = Math.PI / 2;
  dogBody.position.y = 0.46;
  dog.add(dogBody);
  const dogHead = new THREE.Mesh(new THREE.SphereGeometry(0.28, 12, 10), material("#c78e5d"));
  dogHead.position.set(0.5, 0.65, -0.08);
  dog.add(dogHead);
  for (const side of [-1, 1]) {
    for (const z of [-0.4, 0.4]) {
      cylinder(dog, 0.055, 0.07, 0.34, material("#805638"), [side * 0.15, 0.18, z], 7);
    }
  }
  dog.position.set(-3, 0, -7);
  scene.add(dog);
  const movingColliders: CityCollider[] = [
    ...traffic.map(({ position }) => ({
      kind: "circle" as const,
      x: position.x,
      z: position.z,
      radius: 2.15,
    })),
  ];

  const touchState: CityControls = { accelerate: 0, brake: 0, steer: 0 };
  const pressed = new Set<string>();
  const collected = new Set<number>();
  let speed = 0;
  let started = false;
  let paused = false;
  let disposed = false;
  let previousTime = performance.now();
  let lastStatusUpdate = 0;
  let frameId = 0;
  let activeNearby: CityTreasure | null = null;
  let promptedTreasureId: number | null = null;
  let lastOpenTime = 0;

  const setNearby = (nearby: CityTreasure | null) => {
    if (activeNearby?.id === nearby?.id) return;
    activeNearby = nearby;
    callbacks.onNearby(nearby);
  };
  const interact = () => {
    if (!activeNearby || collected.has(activeNearby.id) || promptedTreasureId === activeNearby.id
      || performance.now() - lastOpenTime < 450) return;
    lastOpenTime = performance.now();
    promptedTreasureId = activeNearby.id;
    callbacks.onOpen(activeNearby);
  };
  const onKeyDown = (event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(key)) event.preventDefault();
    if ((key === "e" || key === "enter") && !event.repeat) interact();
    pressed.add(key);
  };
  const onKeyUp = (event: KeyboardEvent) => pressed.delete(event.key.toLowerCase());
  const onBlur = () => {
    pressed.clear();
    Object.assign(touchState, { accelerate: 0, brake: 0, steer: 0 });
  };
  const collidesAt = (x: number, z: number) => {
    const bikeRadius = 0.82;
    return staticColliders.some((collider) => {
      if (collider.kind === "circle") {
        return Math.hypot(x - collider.x, z - collider.z) < bikeRadius + collider.radius;
      }
      const nearestX = THREE.MathUtils.clamp(x, collider.x - collider.halfWidth, collider.x + collider.halfWidth);
      const nearestZ = THREE.MathUtils.clamp(z, collider.z - collider.halfDepth, collider.z + collider.halfDepth);
      return Math.hypot(x - nearestX, z - nearestZ) < bikeRadius;
    }) || movingColliders.some((collider) => (
      Math.hypot(x - collider.x, z - collider.z) < bikeRadius + collider.radius
    ));
  };
  const resize = () => {
    const width = host.clientWidth;
    const height = host.clientHeight;
    if (!width || !height) return;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
    renderer.setSize(width, height);
  };
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
  window.addEventListener("blur", onBlur);
  window.addEventListener("resize", resize);
  resize();

  const animate = (now: number) => {
    if (disposed) return;
    frameId = window.requestAnimationFrame(animate);
    const delta = Math.min((now - previousTime) / 1000, 0.04);
    previousTime = now;
    const time = now / 1000;

    treasureObjects.forEach(({ chest, beacon, jewel, waves, glow }, index) => {
      const isCollected = collected.has(index);
      chest.visible = !isCollected;
      if (!isCollected) {
        beacon.rotation.z = time * 0.65;
        jewel.rotation.y = time * 1.4;
        jewel.position.y = 1.55 + Math.sin(time * 2.2 + index) * 0.12;
        jewel.scale.setScalar(1 + Math.sin(time * 2.2 + index) * 0.08);
        waves.forEach((wave, waveIndex) => {
          const progress = (time * 0.48 + waveIndex / waves.length + index * 0.17) % 1;
          wave.position.y = 0.55 + progress * 4.4;
          wave.scale.setScalar(0.6 + progress * 1.25);
          (wave.material as THREE.MeshBasicMaterial).opacity = (1 - progress) * 0.82;
        });
        glow.color.setHSL((time * 0.12 + index * 0.18) % 1, 0.88, 0.62);
        glow.intensity = 9 + Math.sin(time * 3 + index) * 2.5;
      }
    });
    jets.forEach((jet, index) => {
      jet.scale.y = 0.65 + Math.sin(time * 5 + index) * 0.24;
    });

    if (started && !paused) {
      const accelerate = Math.max(Number(pressed.has("w") || pressed.has("arrowup")), touchState.accelerate);
      const brake = Math.max(Number(pressed.has("s") || pressed.has("arrowdown")), touchState.brake);
      const steering = THREE.MathUtils.clamp(
        Number(pressed.has("a") || pressed.has("arrowleft"))
          - Number(pressed.has("d") || pressed.has("arrowright"))
          + touchState.steer,
        -1,
        1,
      );
      speed += (accelerate * 17 - brake * 24 - (accelerate || brake ? 0 : Math.sign(speed) * 4)) * delta;
      speed = THREE.MathUtils.clamp(speed, -7, 25);
      bike.rotation.y += steering * (0.25 + Math.abs(speed) * 0.033) * delta * (speed >= 0 ? 1 : -1);
      const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(bike.quaternion);
      const currentX = bike.position.x;
      const currentZ = bike.position.z;
      const nextX = THREE.MathUtils.clamp(currentX + forward.x * speed * delta, -119, 119);
      const nextZ = THREE.MathUtils.clamp(currentZ + forward.z * speed * delta, -119, 119);
      let blocked = false;
      if (!collidesAt(nextX, currentZ)) {
        bike.position.x = nextX;
      } else {
        blocked = true;
      }
      if (!collidesAt(bike.position.x, nextZ)) {
        bike.position.z = nextZ;
      } else {
        blocked = true;
      }
      if (blocked) speed = 0;
      bike.rotation.z = THREE.MathUtils.damp(bike.rotation.z, -steering * Math.min(Math.abs(speed) / 27, 0.16), 5, delta);
      wheels.forEach((wheel) => {
        wheel.rotation.z += speed * delta * 1.9;
      });

      const followPosition = bike.position.clone()
        .add(new THREE.Vector3(0, 5.8, 10.4).applyQuaternion(bike.quaternion));
      camera.position.lerp(followPosition, 1 - Math.exp(-3.8 * delta));
      const lookAt = bike.position.clone().addScaledVector(forward, 5.4).add(new THREE.Vector3(0, 1.15, 0));
      camera.lookAt(lookAt);

      traffic.forEach((vehicle) => {
        const sign = vehicle.direction;
        if (vehicle.axis === "z") {
          vehicle.position.z += sign * vehicle.speed * delta;
          if (vehicle.position.z > 118) vehicle.position.z = -118;
          if (vehicle.position.z < -118) vehicle.position.z = 118;
          vehicle.car.position.set(vehicle.position.x, 0, vehicle.position.z);
          vehicle.car.rotation.y = sign > 0 ? Math.PI : 0;
        } else {
          vehicle.position.x += sign * vehicle.speed * delta;
          if (vehicle.position.x > 118) vehicle.position.x = -118;
          if (vehicle.position.x < -118) vehicle.position.x = 118;
          vehicle.car.position.set(vehicle.position.x, 0, vehicle.position.z);
          vehicle.car.rotation.y = sign > 0 ? -Math.PI / 2 : Math.PI / 2;
        }
      });
      traffic.forEach(({ position }, index) => {
        movingColliders[index]!.x = position.x;
        movingColliders[index]!.z = position.z;
      });
      walkers.forEach(({ person: walker, x, z, phase }) => {
        walker.person.position.x = x + Math.sin(time * 0.46 + phase) * 1.2;
        walker.person.position.z = z + Math.cos(time * 0.46 + phase) * 1.2;
        walker.person.position.y = Math.abs(Math.sin(time * 3.4 + phase)) * 0.07;
        walker.person.rotation.y = time * 0.42 + phase;
        walker.legs.forEach((leg, index) => {
          leg.rotation.x = Math.sin(time * 3.4 + phase + index * Math.PI) * 0.32;
        });
        walker.arms.forEach((arm, index) => {
          arm.rotation.x = -Math.sin(time * 3.4 + phase + index * Math.PI) * 0.2;
        });
      });
      dog.position.x = -3 + Math.sin(time * 0.6) * 2.4;
      dog.position.z = -7 + Math.cos(time * 0.6) * 2.4;
      dog.position.y = Math.abs(Math.sin(time * 3)) * 0.06;
      dog.rotation.y = time * 0.6;

      const nearby = TREASURES.find((treasure) =>
        !collected.has(treasure.id) && treasure.position.distanceTo(bike.position) < 11,
      ) ?? null;
      setNearby(nearby);
      const reachedTreasure = nearby && nearby.position.distanceTo(bike.position) < 5.2 ? nearby : null;
      if (reachedTreasure && promptedTreasureId !== reachedTreasure.id) {
        promptedTreasureId = reachedTreasure.id;
        lastOpenTime = now;
        callbacks.onOpen(reachedTreasure);
      } else if (!nearby) {
        promptedTreasureId = null;
      }
      if (now - lastStatusUpdate >= 120) {
        callbacks.onStatus({ x: bike.position.x, z: bike.position.z }, speed);
        lastStatusUpdate = now;
      }
    }
    renderer.render(scene, camera);
  };
  frameId = window.requestAnimationFrame(animate);

  return {
    start: () => {
      started = true;
      previousTime = performance.now();
    },
    setPaused: (nextPaused) => {
      paused = nextPaused;
      if (paused) Object.assign(touchState, { accelerate: 0, brake: 0, steer: 0 });
    },
    setControls: (controls) => Object.assign(touchState, controls),
    interact,
    setCollected: (id) => {
      collected.add(id);
      if (activeNearby?.id === id) {
        setNearby(null);
        promptedTreasureId = null;
      }
    },
    reset: () => {
      collected.clear();
      promptedTreasureId = null;
      lastOpenTime = 0;
      speed = 0;
      paused = false;
      bike.position.set(8, 0, 100);
      bike.rotation.set(0, 0, 0);
      setNearby(null);
    },
    dispose: () => {
      disposed = true;
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("resize", resize);
      const geometries = new Set<THREE.BufferGeometry>();
      const materials = new Set<THREE.Material>();
      const textures = new Set<THREE.Texture>();
      scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;
        geometries.add(object.geometry);
        const meshMaterials = Array.isArray(object.material) ? object.material : [object.material];
        meshMaterials.forEach((meshMaterial) => {
          materials.add(meshMaterial);
          Object.values(meshMaterial).forEach((value) => {
            if (value instanceof THREE.Texture) textures.add(value);
          });
        });
      });
      textures.forEach((texture) => texture.dispose());
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((meshMaterial) => meshMaterial.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
};

export const CITY_TREASURES = TREASURES;
