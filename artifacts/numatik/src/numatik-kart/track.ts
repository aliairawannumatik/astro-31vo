import * as THREE from "three";
import { KART_CONFIG } from "./config";

export type TrackSample = {
  position: THREE.Vector3;
  tangent: THREE.Vector3;
  right: THREE.Vector3;
};

export type KartTrack = {
  curve: THREE.CatmullRomCurve3;
  length: number;
  sampleAtDistance: (distance: number) => TrackSample;
  isOffRoad: (lateralOffset: number) => boolean;
};

const createSeededRandom = (seed: number) => {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
};

const createCanvasTexture = () => {
  const canvas = document.createElement("canvas");
  canvas.width = KART_CONFIG.track.asphaltCanvasSize;
  canvas.height = KART_CONFIG.track.asphaltCanvasSize;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas 2D tidak tersedia untuk tekstur lintasan kart.");

  context.fillStyle = KART_CONFIG.track.asphaltColor;
  context.fillRect(0, 0, canvas.width, canvas.height);
  const random = createSeededRandom(KART_CONFIG.track.randomSeed);
  for (let index = 0; index < KART_CONFIG.track.asphaltNoiseCount; index += 1) {
    const brightness = random() > 0.5 ? 255 : 0;
    context.globalAlpha = KART_CONFIG.track.asphaltNoiseOpacity * random();
    context.fillStyle = `rgb(${brightness},${brightness},${brightness})`;
    context.fillRect(
      random() * canvas.width,
      random() * canvas.height,
      KART_CONFIG.track.asphaltNoiseSize,
      KART_CONFIG.track.asphaltNoiseSize,
    );
  }
  context.globalAlpha = KART_CONFIG.track.centerLineOpacity;
  context.strokeStyle = KART_CONFIG.track.centerLineColor;
  context.lineWidth = KART_CONFIG.track.centerLineWidthPixels;
  context.setLineDash([
    KART_CONFIG.track.centerLineDashPixels,
    KART_CONFIG.track.centerLineGapPixels,
  ]);
  context.beginPath();
  context.moveTo(canvas.width / 2, 0);
  context.lineTo(canvas.width / 2, canvas.height);
  context.stroke();
  context.globalAlpha = 1;
  context.setLineDash([]);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = KART_CONFIG.render.textureAnisotropy;
  return texture;
};

const addRoadRibbon = (
  curve: THREE.CatmullRomCurve3,
  length: number,
  segments: number,
  width: number,
  yOffset: number,
  textureRepeatMeters: number,
) => {
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  const up = new THREE.Vector3(0, 1, 0);

  for (let index = 0; index <= segments; index += 1) {
    const progress = index / segments;
    const point = curve.getPointAt(progress);
    const tangent = curve.getTangentAt(progress).normalize();
    const right = new THREE.Vector3().crossVectors(tangent, up).normalize();
    const halfWidth = width / 2;
    const left = point.clone().addScaledVector(right, -halfWidth);
    const rightEdge = point.clone().addScaledVector(right, halfWidth);
    positions.push(left.x, left.y + yOffset, left.z, rightEdge.x, rightEdge.y + yOffset, rightEdge.z);
    const v = (progress * length) / textureRepeatMeters;
    uvs.push(0, v, 1, v);

    if (index < segments) {
      const base = index * 2;
      indices.push(base, base + 1, base + 2, base + 1, base + 3, base + 2);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
};

const addEdgeStripes = (
  scene: THREE.Scene,
  curve: THREE.CatmullRomCurve3,
  length: number,
) => {
  const { ribbonSegments, width, edgeStripeWidth, edgeStripeLength, surfaceOffset, edgeStripeColors } = KART_CONFIG.track;
  const up = new THREE.Vector3(0, 1, 0);
  const stripeMaterials = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: KART_CONFIG.track.stripeRoughness,
  });

  for (const side of [-1, 1]) {
    const positions: number[] = [];
    const colors: number[] = [];
    const indices: number[] = [];
    for (let index = 0; index <= ribbonSegments; index += 1) {
      const progress = index / ribbonSegments;
      const point = curve.getPointAt(progress);
      const tangent = curve.getTangentAt(progress).normalize();
      const right = new THREE.Vector3().crossVectors(tangent, up).normalize();
      const edge = point.addScaledVector(right, side * (width / 2 - edgeStripeWidth / 2));
      const across = right.clone().multiplyScalar(edgeStripeWidth / 2);
      positions.push(
        edge.x - across.x, edge.y + surfaceOffset + KART_CONFIG.track.stripeSurfaceLift, edge.z - across.z,
        edge.x + across.x, edge.y + surfaceOffset + KART_CONFIG.track.stripeSurfaceLift, edge.z + across.z,
      );
      const colorIndex = Math.floor((progress * length) / edgeStripeLength) % edgeStripeColors.length;
      const color = new THREE.Color(edgeStripeColors[colorIndex]!);
      colors.push(color.r, color.g, color.b, color.r, color.g, color.b);
      if (index < ribbonSegments) {
        const base = index * 2;
        indices.push(base, base + 1, base + 2, base + 1, base + 3, base + 2);
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    scene.add(new THREE.Mesh(geometry, stripeMaterials));
  }
};

const addBarriers = (scene: THREE.Scene, curve: THREE.CatmullRomCurve3) => {
  const { ribbonSegments, width, barrierOffset, barrierHeight, barrierColor, surfaceOffset, barrierOpacity } = KART_CONFIG.track;
  const up = new THREE.Vector3(0, 1, 0);
  const material = new THREE.MeshStandardMaterial({
    color: barrierColor,
    roughness: KART_CONFIG.track.barrierRoughness,
    metalness: KART_CONFIG.track.barrierMetalness,
    transparent: true,
    opacity: barrierOpacity,
    side: THREE.DoubleSide,
  });

  for (const side of [-1, 1]) {
    const positions: number[] = [];
    const indices: number[] = [];
    for (let index = 0; index <= ribbonSegments; index += 1) {
      const point = curve.getPointAt(index / ribbonSegments);
      const tangent = curve.getTangentAt(index / ribbonSegments).normalize();
      const right = new THREE.Vector3().crossVectors(tangent, up).normalize();
      const edge = point.addScaledVector(right, side * (width / 2 + barrierOffset));
      positions.push(
        edge.x, edge.y + surfaceOffset, edge.z,
        edge.x, edge.y + surfaceOffset + barrierHeight, edge.z,
      );
      if (index < ribbonSegments) {
        const base = index * 2;
        indices.push(base, base + 2, base + 1, base + 1, base + 2, base + 3);
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    scene.add(new THREE.Mesh(geometry, material));
  }
};

const addFinishLine = (scene: THREE.Scene, sampleAtDistance: KartTrack["sampleAtDistance"]) => {
  const { width, finishDepth, finishColumns, finishRows, surfaceOffset, finishLight, finishDark } = KART_CONFIG.track;
  const positions: number[] = [];
  const colors: number[] = [];
  const indices: number[] = [];
  const palette = [new THREE.Color(finishLight), new THREE.Color(finishDark)];

  for (let row = 0; row < finishRows; row += 1) {
    for (let column = 0; column < finishColumns; column += 1) {
      const lateralStart = -width / 2 + (column / finishColumns) * width;
      const lateralEnd = -width / 2 + ((column + 1) / finishColumns) * width;
      const distanceStart = (row / finishRows) * finishDepth;
      const distanceEnd = ((row + 1) / finishRows) * finishDepth;
      const corners = [
        [distanceStart, lateralStart],
        [distanceEnd, lateralStart],
        [distanceStart, lateralEnd],
        [distanceEnd, lateralEnd],
      ] as const;
      const base = positions.length / 3;
      corners.forEach(([distance, lateral]) => {
        const sample = sampleAtDistance(distance);
        const vertex = sample.position
          .addScaledVector(sample.right, lateral)
          .add(new THREE.Vector3(0, surfaceOffset + KART_CONFIG.track.finishSurfaceLift, 0));
        positions.push(vertex.x, vertex.y, vertex.z);
      });
      const color = palette[(row + column) % palette.length]!;
      for (let vertex = 0; vertex < corners.length; vertex += 1) colors.push(color.r, color.g, color.b);
      indices.push(base, base + 2, base + 1, base + 2, base + 3, base + 1);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  const material = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: KART_CONFIG.track.finishRoughness,
    side: THREE.DoubleSide,
  });
  scene.add(new THREE.Mesh(geometry, material));
};

const addEnvironment = (scene: THREE.Scene, curve: THREE.CatmullRomCurve3) => {
  const { groundSize, groundColor, skyTop, skyHorizon, skyBottom } = KART_CONFIG.track;
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(
      groundSize,
      groundSize,
      KART_CONFIG.track.groundSegments,
      KART_CONFIG.track.groundSegments,
    ),
    new THREE.MeshStandardMaterial({ color: groundColor, roughness: KART_CONFIG.track.groundRoughness }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = KART_CONFIG.track.groundHeight;
  scene.add(ground);

  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(
      KART_CONFIG.render.cameraFar * KART_CONFIG.track.skyRadiusScale,
      KART_CONFIG.track.skyWidthSegments,
      KART_CONFIG.track.skyHeightSegments,
    ),
    new THREE.ShaderMaterial({
      uniforms: {
        topColor: { value: new THREE.Color(skyTop) },
        horizonColor: { value: new THREE.Color(skyHorizon) },
        bottomColor: { value: new THREE.Color(skyBottom) },
      },
      vertexShader: "varying float skyHeight; void main(){ skyHeight=normalize(position).y; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }",
      fragmentShader: "uniform vec3 topColor; uniform vec3 horizonColor; uniform vec3 bottomColor; varying float skyHeight; void main(){ float upper=smoothstep(-0.02,0.48,skyHeight); float lower=smoothstep(-0.36,-0.02,skyHeight); vec3 color=mix(bottomColor,horizonColor,lower); color=mix(color,topColor,upper); gl_FragColor=vec4(color,1.0); }",
      side: THREE.BackSide,
      depthWrite: false,
    }),
  );
  scene.add(sky);

  const random = createSeededRandom(KART_CONFIG.track.randomSeed);
  const hillGeometry = new THREE.SphereGeometry(
    1,
    KART_CONFIG.track.hillSegments,
    KART_CONFIG.track.hillRings,
  );
  const hillMaterials = KART_CONFIG.track.hillPalette.map((color) => (
    new THREE.MeshStandardMaterial({ color, roughness: KART_CONFIG.track.hillRoughness })
  ));
  for (let index = 0; index < KART_CONFIG.track.hillCount; index += 1) {
    const angle = (index / KART_CONFIG.track.hillCount) * Math.PI * 2;
    const hill = new THREE.Mesh(hillGeometry, hillMaterials[index % hillMaterials.length]!);
    hill.position.set(
      Math.cos(angle) * KART_CONFIG.track.hillExtentX,
      KART_CONFIG.track.hillHeightMin + random() * KART_CONFIG.track.hillHeightRange,
      Math.sin(angle) * KART_CONFIG.track.hillExtentZ,
    );
    const scale = KART_CONFIG.track.hillScaleMin + random() * KART_CONFIG.track.hillScaleRange;
    hill.scale.set(
      scale,
      scale * KART_CONFIG.track.hillVerticalScale,
      scale * KART_CONFIG.track.hillDepthScale,
    );
    scene.add(hill);
  }

  const trunkGeometry = new THREE.CylinderGeometry(
    KART_CONFIG.track.treeTrunkRadius * KART_CONFIG.track.treeTrunkRadiusScale,
    KART_CONFIG.track.treeTrunkRadius,
    KART_CONFIG.track.treeTrunkHeight,
    KART_CONFIG.track.treeTrunkSegments,
  );
  const canopyGeometry = new THREE.ConeGeometry(
    KART_CONFIG.track.treeCanopyRadius,
    KART_CONFIG.track.treeCanopyHeight,
    KART_CONFIG.track.treeCanopySegments,
  );
  const trunkMaterial = new THREE.MeshStandardMaterial({ color: "#8d6042", roughness: 1 });
  const canopyMaterials = KART_CONFIG.track.treePalette.map((color) => (
    new THREE.MeshStandardMaterial({ color, roughness: KART_CONFIG.track.treeRoughness })
  ));
  const trackSamples = Array.from({ length: KART_CONFIG.track.sampleNearestCount }, (_, index) => (
    curve.getPointAt(index / KART_CONFIG.track.sampleNearestCount)
  ));
  const minClearance = KART_CONFIG.track.width / 2 + KART_CONFIG.track.treeClearance;
  const nearestTrackDistance = (x: number, z: number) => {
    let nearest = Number.POSITIVE_INFINITY;
    for (const point of trackSamples) {
      nearest = Math.min(nearest, Math.hypot(point.x - x, point.z - z));
    }
    return nearest;
  };

  for (let treeIndex = 0; treeIndex < KART_CONFIG.track.treeCount; treeIndex += 1) {
    let x = 0;
    let z = 0;
    let foundPosition = false;
    for (let attempt = 0; attempt < KART_CONFIG.track.treeAttempts; attempt += 1) {
      x = (random() * 2 - 1) * KART_CONFIG.track.treeSpawnExtentX;
      z = (random() * 2 - 1) * KART_CONFIG.track.treeSpawnExtentZ;
      if (nearestTrackDistance(x, z) > minClearance) {
        foundPosition = true;
        break;
      }
    }
    if (!foundPosition) continue;

    const tree = new THREE.Group();
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = KART_CONFIG.track.treeTrunkHeight / 2;
    tree.add(trunk);
    const canopy = new THREE.Mesh(
      canopyGeometry,
      canopyMaterials[treeIndex % canopyMaterials.length]!,
    );
    canopy.position.y = KART_CONFIG.track.treeTrunkHeight
      + KART_CONFIG.track.treeCanopyHeight * KART_CONFIG.track.treeCanopyPositionScale;
    tree.add(canopy);
    tree.position.set(x, 0, z);
    tree.rotation.y = random() * Math.PI * 2;
    const scale = KART_CONFIG.track.treeScaleMin + random() * KART_CONFIG.track.treeScaleRange;
    tree.scale.setScalar(scale);
    scene.add(tree);
  }

  const cloudGeometry = new THREE.SphereGeometry(
    1,
    KART_CONFIG.track.cloudWidthSegments,
    KART_CONFIG.track.cloudHeightSegments,
  );
  const cloudMaterial = new THREE.MeshStandardMaterial({
    color: "#ffffff",
    roughness: KART_CONFIG.track.cloudRoughness,
    transparent: true,
    opacity: KART_CONFIG.track.cloudOpacity,
  });
  for (let cloudIndex = 0; cloudIndex < KART_CONFIG.track.cloudCount; cloudIndex += 1) {
    const cloud = new THREE.Group();
    const cloudScale = KART_CONFIG.track.cloudScaleMin + random() * KART_CONFIG.track.cloudScaleRange;
    const puffs = KART_CONFIG.track.cloudPuffMin
      + Math.floor(random() * KART_CONFIG.track.cloudPuffRange);
    for (let puff = 0; puff < puffs; puff += 1) {
      const mesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
      mesh.position.set(
        puff * cloudScale * KART_CONFIG.track.cloudPuffSpacingScale,
        random() * cloudScale * KART_CONFIG.track.cloudPuffHeightScale,
        random() * cloudScale * KART_CONFIG.track.cloudPuffDepthScale,
      );
      mesh.scale.set(
        cloudScale * KART_CONFIG.track.cloudPuffWidthScale,
        cloudScale * KART_CONFIG.track.cloudPuffVerticalScale,
        cloudScale * KART_CONFIG.track.cloudPuffDepthScaleY,
      );
      cloud.add(mesh);
    }
    cloud.position.set(
      (random() * 2 - 1) * KART_CONFIG.track.cloudExtentX,
      KART_CONFIG.track.cloudMinHeight + random() * KART_CONFIG.track.cloudHeightRange,
      (random() * 2 - 1) * KART_CONFIG.track.cloudExtentZ,
    );
    scene.add(cloud);
  }
};

export const createTrack = (scene: THREE.Scene): KartTrack => {
  const points = KART_CONFIG.track.controlPoints.map(([x, y, z]) => new THREE.Vector3(
    x * KART_CONFIG.track.controlPointScale,
    y * KART_CONFIG.track.controlPointScale,
    z * KART_CONFIG.track.controlPointScale,
  ));
  const curve = new THREE.CatmullRomCurve3(points, true, "centripetal", KART_CONFIG.track.curveTension);
  const length = curve.getLength();
  const sampleAtDistance = (distance: number): TrackSample => {
    const wrapped = THREE.MathUtils.euclideanModulo(distance, length);
    const progress = wrapped / length;
    const position = curve.getPointAt(progress);
    const tangent = curve.getTangentAt(progress).normalize();
    const right = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), tangent).normalize();
    return { position, tangent, right };
  };

  addEnvironment(scene, curve);
  const roadTexture = createCanvasTexture();
  const roadMaterial = new THREE.MeshStandardMaterial({
    map: roadTexture,
    roughness: KART_CONFIG.track.roadRoughness,
    metalness: KART_CONFIG.track.roadMetalness,
  });
  scene.add(new THREE.Mesh(
    addRoadRibbon(
      curve,
      length,
      KART_CONFIG.track.ribbonSegments,
      KART_CONFIG.track.width,
      KART_CONFIG.track.surfaceOffset,
      KART_CONFIG.track.asphaltTextureRepeatMeters,
    ),
    roadMaterial,
  ));
  addEdgeStripes(scene, curve, length);
  addBarriers(scene, curve);
  addFinishLine(scene, sampleAtDistance);

  return {
    curve,
    length,
    sampleAtDistance,
    isOffRoad: (lateralOffset) => Math.abs(lateralOffset) > KART_CONFIG.kart.offRoadThreshold,
  };
};
