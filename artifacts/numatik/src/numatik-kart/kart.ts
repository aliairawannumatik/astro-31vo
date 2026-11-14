import * as THREE from "three";
import { KART_CONFIG } from "./config";
import type { KartTrack } from "./track";

export type KartInputState = {
  accelerate: number;
  reverse: number;
  steer: number;
  drift: boolean;
};

type SmokeParticle = {
  mesh: THREE.Mesh;
  age: number;
  active: boolean;
};

type RivalBehavior = {
  targetSpeed: number;
  laneOffset: number;
  weaveAmplitude: number;
  weaveFrequency: number;
  phase: number;
};

type KartAppearance = {
  bodyColor?: string;
  accentColor?: string;
  startDistance?: number;
  startLateralOffset?: number;
  rival?: RivalBehavior;
};

export type PlayerKart = {
  group: THREE.Group;
  speed: number;
  distance: number;
  lateralOffset: number;
  reset: () => void;
  update: (track: KartTrack, input: KartInputState, deltaSeconds: number) => void;
  dispose: () => void;
};

const addBox = (
  parent: THREE.Object3D,
  geometry: THREE.BoxGeometry,
  material: THREE.Material,
  position: [number, number, number],
  scale: [number, number, number],
) => {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...position);
  mesh.scale.set(...scale);
  parent.add(mesh);
  return mesh;
};

export const createKart = (scene: THREE.Scene, appearance: KartAppearance = {}): PlayerKart => {
  const bodyColor = appearance.bodyColor ?? KART_CONFIG.kart.bodyColor;
  const accentColor = appearance.accentColor ?? KART_CONFIG.kart.accentColor;
  const materials = {
    body: new THREE.MeshStandardMaterial({
      color: bodyColor,
      roughness: KART_CONFIG.kart.bodyRoughness,
      metalness: KART_CONFIG.kart.bodyMetalness,
    }),
    accent: new THREE.MeshStandardMaterial({
      color: accentColor,
      roughness: KART_CONFIG.kart.accentRoughness,
      metalness: KART_CONFIG.kart.accentMetalness,
    }),
    seat: new THREE.MeshStandardMaterial({ color: KART_CONFIG.kart.seatColor, roughness: KART_CONFIG.kart.seatRoughness }),
    tire: new THREE.MeshStandardMaterial({ color: KART_CONFIG.kart.tireColor, roughness: KART_CONFIG.kart.tireRoughness }),
    hub: new THREE.MeshStandardMaterial({
      color: KART_CONFIG.kart.hubColor,
      roughness: KART_CONFIG.kart.hubRoughness,
      metalness: KART_CONFIG.kart.hubMetalness,
    }),
    chassis: new THREE.MeshStandardMaterial({
      color: KART_CONFIG.kart.chassisColor,
      roughness: KART_CONFIG.kart.detailRoughness,
      metalness: KART_CONFIG.kart.chassisMetalness,
    }),
    engine: new THREE.MeshStandardMaterial({
      color: KART_CONFIG.kart.engineColor,
      roughness: KART_CONFIG.kart.engineRoughness,
      metalness: KART_CONFIG.kart.engineMetalness,
    }),
    exhaust: new THREE.MeshStandardMaterial({
      color: KART_CONFIG.kart.exhaustColor,
      roughness: KART_CONFIG.kart.exhaustRoughness,
      metalness: KART_CONFIG.kart.exhaustMetalness,
    }),
    light: new THREE.MeshBasicMaterial({ color: "#fff5b0" }),
    tailLight: new THREE.MeshBasicMaterial({ color: "#ff3b32" }),
    smoke: new THREE.MeshBasicMaterial({ color: KART_CONFIG.kart.smokeColor, transparent: true, opacity: 0, depthWrite: false }),
  };
  const bodyOutline = new THREE.Shape();
  KART_CONFIG.kart.bodyOutline.forEach(([x, z], index) => {
    const pointX = x * KART_CONFIG.kart.bodyWidth;
    const pointZ = z * KART_CONFIG.kart.bodyLength;
    if (index === 0) bodyOutline.moveTo(pointX, pointZ);
    else bodyOutline.lineTo(pointX, pointZ);
  });
  bodyOutline.closePath();
  const bodyGeometry = new THREE.ExtrudeGeometry(bodyOutline, {
    depth: KART_CONFIG.kart.bodyHeight,
    bevelEnabled: true,
    bevelSegments: KART_CONFIG.kart.bodyBevelSegments,
    steps: KART_CONFIG.kart.bodyExtrudeSteps,
    bevelSize: KART_CONFIG.kart.bodyBevelSize,
    bevelThickness: KART_CONFIG.kart.bodyBevelThickness,
  });
  const seatGeometry = new THREE.BoxGeometry(...KART_CONFIG.kart.seatSize);
  const noseGeometry = new THREE.ConeGeometry(
    KART_CONFIG.kart.noseRadius,
    KART_CONFIG.kart.noseLength,
    KART_CONFIG.kart.noseSegments,
  );
  const wheelGeometry = new THREE.CylinderGeometry(
    KART_CONFIG.kart.wheelRadius,
    KART_CONFIG.kart.wheelRadius,
    KART_CONFIG.kart.wheelWidth,
    KART_CONFIG.kart.wheelSegments,
  );
  const hubGeometry = new THREE.CylinderGeometry(
    KART_CONFIG.kart.wheelRadius * KART_CONFIG.kart.hubRadiusScale,
    KART_CONFIG.kart.wheelRadius * KART_CONFIG.kart.hubRadiusScale,
    KART_CONFIG.kart.wheelWidth * KART_CONFIG.kart.hubWidthScale,
    KART_CONFIG.kart.hubSegments,
  );
  const boxGeometry = new THREE.BoxGeometry(...KART_CONFIG.kart.boxSize);
  const chassisGeometry = new THREE.BoxGeometry(
    KART_CONFIG.kart.bodyWidth * KART_CONFIG.kart.chassisSizeScale[0],
    KART_CONFIG.kart.bodyHeight * KART_CONFIG.kart.chassisSizeScale[1],
    KART_CONFIG.kart.bodyLength * KART_CONFIG.kart.chassisSizeScale[2],
  );
  const wingGeometry = new THREE.BoxGeometry(...KART_CONFIG.kart.wingSize);
  const rimGeometry = new THREE.TorusGeometry(
    KART_CONFIG.kart.wheelRadius * KART_CONFIG.kart.rimRadiusScale,
    KART_CONFIG.kart.rimTubeRadius,
    ...KART_CONFIG.kart.rimSegments,
  );
  const spokeGeometry = new THREE.BoxGeometry(
    KART_CONFIG.kart.wheelWidth * KART_CONFIG.kart.rimSpokeDepthScale,
    KART_CONFIG.kart.wheelRadius * KART_CONFIG.kart.rimSpokeLengthScale,
    KART_CONFIG.kart.wheelRadius * KART_CONFIG.kart.rimSpokeWidthScale,
  );
  const engineGeometry = new THREE.CylinderGeometry(
    KART_CONFIG.kart.engineRadius,
    KART_CONFIG.kart.engineRadius,
    KART_CONFIG.kart.engineLength,
    KART_CONFIG.kart.engineSegments,
  );
  const exhaustGeometry = new THREE.CylinderGeometry(
    KART_CONFIG.kart.exhaustRadius,
    KART_CONFIG.kart.exhaustRadius,
    KART_CONFIG.kart.exhaustLength,
    KART_CONFIG.kart.exhaustSegments,
  );
  const dashboardGeometry = new THREE.BoxGeometry(...KART_CONFIG.kart.dashboardSize);
  const steeringWheelGeometry = new THREE.TorusGeometry(
    KART_CONFIG.kart.steeringWheelRadius,
    KART_CONFIG.kart.steeringWheelTubeRadius,
    ...KART_CONFIG.kart.steeringWheelSegments,
  );
  const geometries: THREE.BufferGeometry[] = [
    bodyGeometry,
    seatGeometry,
    noseGeometry,
    wheelGeometry,
    hubGeometry,
    boxGeometry,
    chassisGeometry,
    wingGeometry,
    rimGeometry,
    spokeGeometry,
    engineGeometry,
    exhaustGeometry,
    dashboardGeometry,
    steeringWheelGeometry,
  ];
  const group = new THREE.Group();
  scene.add(group);
  const chassis = new THREE.Mesh(chassisGeometry, materials.chassis);
  chassis.position.y = KART_CONFIG.kart.wheelRadius * KART_CONFIG.kart.chassisHeightScale;
  group.add(chassis);
  const body = new THREE.Mesh(bodyGeometry, materials.body);
  body.rotation.x = Math.PI / 2;
  body.position.y = KART_CONFIG.kart.bodyHeight + KART_CONFIG.kart.bodyShellBottomOffset;
  group.add(body);
  const nose = new THREE.Mesh(noseGeometry, materials.accent);
  nose.rotation.x = -Math.PI / 2;
  nose.position.set(
    0,
    KART_CONFIG.kart.wheelRadius * KART_CONFIG.kart.noseVerticalPositionScale,
    -KART_CONFIG.kart.bodyLength * KART_CONFIG.kart.noseLongitudinalPositionScale,
  );
  nose.scale.set(
    KART_CONFIG.kart.bodyWidth * KART_CONFIG.kart.noseWidthScale,
    KART_CONFIG.kart.noseHeightScale,
    KART_CONFIG.kart.noseDepthScale,
  );
  group.add(nose);
  [-1, 1].forEach((side) => {
    addBox(
      group,
      boxGeometry,
      materials.body,
      [
        side * KART_CONFIG.kart.bodyWidth * KART_CONFIG.kart.sidePodLateralScale,
        KART_CONFIG.kart.wheelRadius * KART_CONFIG.kart.sidePodHeightScale,
        KART_CONFIG.kart.bodyLength * KART_CONFIG.kart.sidePodLongitudinalScale,
      ],
      [...KART_CONFIG.kart.sidePodSizeScale],
    );
  });
  addBox(
    group,
    boxGeometry,
    materials.accent,
    [0, KART_CONFIG.kart.wheelRadius * KART_CONFIG.kart.deckVerticalPositionScale, 0],
    [...KART_CONFIG.kart.deckSize],
  );
  const seat = new THREE.Mesh(seatGeometry, materials.seat);
  seat.position.set(
    0,
    KART_CONFIG.kart.wheelRadius * KART_CONFIG.kart.seatVerticalPositionScale,
    KART_CONFIG.kart.bodyLength * KART_CONFIG.kart.seatLongitudinalPositionScale,
  );
  group.add(seat);
  const dashboard = new THREE.Mesh(dashboardGeometry, materials.chassis);
  dashboard.position.set(
    0,
    KART_CONFIG.kart.wheelRadius * KART_CONFIG.kart.dashboardHeightScale,
    KART_CONFIG.kart.bodyLength * KART_CONFIG.kart.dashboardLongitudinalScale,
  );
  group.add(dashboard);
  const steeringWheel = new THREE.Mesh(steeringWheelGeometry, materials.chassis);
  steeringWheel.position.set(
    0,
    KART_CONFIG.kart.wheelRadius * KART_CONFIG.kart.steeringWheelHeightScale * 2.4,
    -KART_CONFIG.kart.bodyLength * KART_CONFIG.kart.steeringWheelLongitudinalScale,
  );
  steeringWheel.rotation.x = KART_CONFIG.kart.steeringWheelTilt;
  group.add(steeringWheel);

  const frontWing = new THREE.Mesh(wingGeometry, materials.accent);
  frontWing.position.set(
    0,
    KART_CONFIG.kart.wheelRadius * KART_CONFIG.kart.frontWingHeightScale,
    -KART_CONFIG.kart.bodyLength * KART_CONFIG.kart.frontWingLongitudinalScale,
  );
  group.add(frontWing);
  const rearWing = new THREE.Mesh(wingGeometry, materials.accent);
  rearWing.position.set(
    0,
    KART_CONFIG.kart.wheelRadius * KART_CONFIG.kart.rearWingHeightScale,
    KART_CONFIG.kart.bodyLength * KART_CONFIG.kart.rearWingLongitudinalScale,
  );
  group.add(rearWing);
  [-1, 1].forEach((side) => {
    addBox(
      group,
      boxGeometry,
      materials.accent,
      [
        side * KART_CONFIG.kart.bodyWidth * KART_CONFIG.kart.wingEndplateLateralScale,
        KART_CONFIG.kart.wheelRadius * KART_CONFIG.kart.rearWingHeightScale,
        KART_CONFIG.kart.bodyLength * KART_CONFIG.kart.rearWingLongitudinalScale,
      ],
      [...KART_CONFIG.kart.wingEndplateSize],
    );
    addBox(
      group,
      boxGeometry,
      materials.chassis,
      [
        side * KART_CONFIG.kart.bodyWidth * KART_CONFIG.kart.wingSupportLateralScale,
        KART_CONFIG.kart.wheelRadius * KART_CONFIG.kart.wingSupportHeightScale,
        KART_CONFIG.kart.bodyLength * KART_CONFIG.kart.wingSupportLongitudinalScale,
      ],
      [...KART_CONFIG.kart.wingSupportSize],
    );
  });
  const engine = new THREE.Mesh(engineGeometry, materials.engine);
  engine.position.set(
    0,
    KART_CONFIG.kart.wheelRadius * KART_CONFIG.kart.engineHeightScale,
    KART_CONFIG.kart.bodyLength * KART_CONFIG.kart.engineLongitudinalScale,
  );
  engine.rotation.x = Math.PI / 2;
  group.add(engine);
  [-1, 1].forEach((side) => {
    const exhaust = new THREE.Mesh(exhaustGeometry, materials.exhaust);
    exhaust.position.set(
      side * KART_CONFIG.kart.bodyWidth * KART_CONFIG.kart.exhaustLateralScale,
      KART_CONFIG.kart.wheelRadius * KART_CONFIG.kart.exhaustHeightScale,
      KART_CONFIG.kart.bodyLength * KART_CONFIG.kart.exhaustLongitudinalScale,
    );
    exhaust.rotation.x = Math.PI / 2;
    group.add(exhaust);
  });
  const tailLightGeometry = new THREE.SphereGeometry(
    KART_CONFIG.kart.tailLightRadius,
    ...KART_CONFIG.kart.tailLightSegments,
  );
  geometries.push(tailLightGeometry);
  [-1, 1].forEach((side) => {
    const tailLight = new THREE.Mesh(tailLightGeometry, materials.tailLight);
    tailLight.position.set(
      side * KART_CONFIG.kart.bodyWidth * KART_CONFIG.kart.tailLightLateralScale,
      KART_CONFIG.kart.wheelRadius * KART_CONFIG.kart.tailLightHeightScale,
      KART_CONFIG.kart.bodyLength * KART_CONFIG.kart.tailLightLongitudinalScale,
    );
    group.add(tailLight);
  });
  const bumper = new THREE.Mesh(
    new THREE.TorusGeometry(
      KART_CONFIG.kart.bumperRadius,
      KART_CONFIG.kart.bumperTubeRadius,
      KART_CONFIG.kart.bumperRadialSegments,
      KART_CONFIG.kart.bumperTubularSegments,
    ),
    materials.accent,
  );
  geometries.push(bumper.geometry);
  bumper.position.set(
    0,
    KART_CONFIG.kart.wheelRadius * KART_CONFIG.kart.bumperVerticalPositionScale,
    -KART_CONFIG.kart.bodyLength * KART_CONFIG.kart.bumperLongitudinalPositionScale,
  );
  bumper.rotation.x = Math.PI / 2;
  group.add(bumper);

  const headlightGeometry = new THREE.SphereGeometry(
    KART_CONFIG.kart.headlightRadius,
    KART_CONFIG.kart.headlightWidthSegments,
    KART_CONFIG.kart.headlightHeightSegments,
  );
  geometries.push(headlightGeometry);
  [-1, 1].forEach((side) => {
    const headlight = new THREE.Mesh(headlightGeometry, materials.light);
    headlight.position.set(
      side * KART_CONFIG.kart.bodyWidth * KART_CONFIG.kart.headlightLateralPositionScale,
      KART_CONFIG.kart.wheelRadius * KART_CONFIG.kart.headlightVerticalPositionScale,
      -KART_CONFIG.kart.bodyLength * KART_CONFIG.kart.headlightLongitudinalPositionScale,
    );
    group.add(headlight);
  });

  const frontWheelPivots: THREE.Group[] = [];
  const wheelSpinGroups: THREE.Group[] = [];
  for (const axle of [-1, 1]) {
    for (const side of [-1, 1]) {
      const pivot = new THREE.Group();
      pivot.position.set(
        side * KART_CONFIG.kart.wheelTrack / 2,
        KART_CONFIG.kart.wheelRadius,
        axle * KART_CONFIG.kart.wheelBase / 2,
      );
      group.add(pivot);
      const wheelSpin = new THREE.Group();
      pivot.add(wheelSpin);
      const tire = new THREE.Mesh(wheelGeometry, materials.tire);
      tire.rotation.z = Math.PI / 2;
      wheelSpin.add(tire);
      const hub = new THREE.Mesh(hubGeometry, materials.hub);
      hub.rotation.z = Math.PI / 2;
      hub.position.x = side * KART_CONFIG.kart.wheelWidth * KART_CONFIG.kart.hubSideOffsetScale;
      wheelSpin.add(hub);
      const rim = new THREE.Mesh(rimGeometry, materials.hub);
      rim.rotation.y = side * Math.PI / 2;
      rim.position.x = side * KART_CONFIG.kart.wheelWidth * KART_CONFIG.kart.rimSideOffsetScale;
      wheelSpin.add(rim);
      for (let spokeIndex = 0; spokeIndex < KART_CONFIG.kart.rimSpokeCount; spokeIndex += 1) {
        const spoke = new THREE.Mesh(spokeGeometry, materials.hub);
        spoke.position.x = side * KART_CONFIG.kart.wheelWidth * KART_CONFIG.kart.rimSideOffsetScale;
        spoke.rotation.x = (spokeIndex / KART_CONFIG.kart.rimSpokeCount) * Math.PI * 2;
        wheelSpin.add(spoke);
      }
      wheelSpinGroups.push(wheelSpin);
      if (axle < 0) frontWheelPivots.push(pivot);
    }
  }

  const smokeGeometry = appearance.rival
    ? null
    : new THREE.SphereGeometry(1, ...KART_CONFIG.kart.smokeSegments);
  if (smokeGeometry) geometries.push(smokeGeometry);
  const smokeParticles: SmokeParticle[] = [];
  if (smokeGeometry) {
    for (let index = 0; index < KART_CONFIG.kart.smokeCount; index += 1) {
      const material = materials.smoke.clone();
      const mesh = new THREE.Mesh(smokeGeometry, material);
      mesh.visible = false;
      scene.add(mesh);
      smokeParticles.push({ mesh, age: 0, active: false });
    }
  }
  let smokeCursor = 0;
  let smokeTimer = 0;
  let rivalElapsed = 0;
  let speed: number = KART_CONFIG.kart.resetSpeed;
  const initialDistance = appearance.startDistance ?? 0;
  const initialLateralOffset = appearance.startLateralOffset ?? 0;
  let distance = initialDistance;
  let lateralOffset = initialLateralOffset;
  let smokeMaterialsDisposed = false;

  const placeKartOnTrack = (
    track: KartTrack,
    steering = 0,
    lateralSpeed = 0,
    longitudinalSpeed = speed,
  ) => {
    const sample = track.sampleAtDistance(distance);
    group.position.copy(sample.position)
      .addScaledVector(sample.right, lateralOffset)
      .add(new THREE.Vector3(0, KART_CONFIG.kart.groundOffset, 0));
    const headingCorrection = longitudinalSpeed === 0
      ? 0
      : THREE.MathUtils.clamp(
        Math.atan(lateralSpeed / longitudinalSpeed),
        -KART_CONFIG.kart.steeringHeadingLimit,
        KART_CONFIG.kart.steeringHeadingLimit,
      );
    group.rotation.y = Math.atan2(-sample.tangent.x, -sample.tangent.z) - headingCorrection;
    frontWheelPivots.forEach((pivot) => {
      pivot.rotation.y = -steering * KART_CONFIG.kart.steeringWheelAngle;
    });
  };

  const reset = () => {
    speed = KART_CONFIG.kart.resetSpeed;
    distance = initialDistance;
    lateralOffset = initialLateralOffset;
    rivalElapsed = 0;
    group.rotation.set(0, 0, 0);
    smokeParticles.forEach((particle) => {
      particle.active = false;
      particle.mesh.visible = false;
    });
  };

  const update = (track: KartTrack, input: KartInputState, deltaSeconds: number) => {
    if (appearance.rival) {
      rivalElapsed += deltaSeconds;
      const wave = Math.sin(
        rivalElapsed * appearance.rival.weaveFrequency + appearance.rival.phase,
      );
      speed += (appearance.rival.targetSpeed - speed)
        * (1 - Math.exp(-KART_CONFIG.kart.rivalAcceleration * deltaSeconds));
      distance = THREE.MathUtils.euclideanModulo(distance + speed * deltaSeconds, track.length);
      const previousLateralOffset = lateralOffset;
      lateralOffset = appearance.rival.laneOffset
        + wave * appearance.rival.weaveAmplitude;
      const steering = wave * KART_CONFIG.kart.rivalSteeringAmplitude;
      const lateralSpeed = deltaSeconds > 0
        ? (lateralOffset - previousLateralOffset) / deltaSeconds
        : 0;
      placeKartOnTrack(track, steering, lateralSpeed);
      wheelSpinGroups.forEach((wheelSpin) => {
        wheelSpin.rotation.x -= (speed / KART_CONFIG.kart.wheelRadius)
          * deltaSeconds
          * KART_CONFIG.kart.wheelSpinScale;
      });
      return;
    }

    if (input.accelerate > 0) {
      speed = Math.min(KART_CONFIG.kart.maxForwardSpeed, speed + KART_CONFIG.kart.acceleration * deltaSeconds);
    } else if (input.reverse > 0) {
      if (speed > 0) speed = Math.max(0, speed - KART_CONFIG.kart.braking * deltaSeconds);
      else speed = Math.max(-KART_CONFIG.kart.maxReverseSpeed, speed - KART_CONFIG.kart.reverseAcceleration * deltaSeconds);
    } else {
      speed *= Math.exp(-KART_CONFIG.kart.coastFriction * deltaSeconds);
    }

    const steeringSpeed = THREE.MathUtils.clamp(
      Math.abs(speed) / KART_CONFIG.kart.maxForwardSpeed,
      KART_CONFIG.kart.steeringAtLowSpeed,
      KART_CONFIG.kart.steeringAtHighSpeed,
    );
    const previousLateralOffset = lateralOffset;
    const offRoad = track.isOffRoad(lateralOffset);
    const driftMultiplier = input.drift ? KART_CONFIG.kart.driftSteeringMultiplier : 1;
    const grassSteering = offRoad ? KART_CONFIG.kart.offRoadSteeringMultiplier : 1;
    const direction = speed < 0 ? -1 : 1;
    const lateralVelocity = input.steer
      * KART_CONFIG.kart.steeringRate
      * steeringSpeed
      * driftMultiplier
      * grassSteering
      * direction;
    lateralOffset += lateralVelocity * deltaSeconds;
    if (input.steer === 0) {
      lateralOffset *= Math.exp(-deltaSeconds * (
        input.drift ? KART_CONFIG.kart.driftGrip : KART_CONFIG.kart.lateralRecentering
      ));
    } else if (input.drift) {
      lateralOffset += lateralVelocity * deltaSeconds * KART_CONFIG.kart.driftGrip;
    }

    const barrierLimit = KART_CONFIG.kart.maxLateralOffset;
    if (Math.abs(lateralOffset) > barrierLimit) {
      lateralOffset = Math.sign(lateralOffset) * barrierLimit;
      speed *= KART_CONFIG.kart.barrierRebound;
    }
    const grassMultiplier = track.isOffRoad(lateralOffset)
      ? KART_CONFIG.track.grassFrictionMultiplier
      : 1;
    if (grassMultiplier < 1) speed *= Math.exp(-KART_CONFIG.track.grassSlowEdge * deltaSeconds);

    const lateralSpeed = deltaSeconds > 0
      ? (lateralOffset - previousLateralOffset) / deltaSeconds
      : 0;
    distance = THREE.MathUtils.euclideanModulo(distance + speed * grassMultiplier * deltaSeconds, track.length);
    placeKartOnTrack(track, input.steer, lateralSpeed, speed * grassMultiplier);
    wheelSpinGroups.forEach((wheelSpin) => {
      wheelSpin.rotation.x -= (speed / KART_CONFIG.kart.wheelRadius) * deltaSeconds * KART_CONFIG.kart.wheelSpinScale;
    });

    smokeTimer += deltaSeconds;
    if (
      input.drift
      && Math.abs(speed) > KART_CONFIG.kart.maxForwardSpeed * KART_CONFIG.kart.smokeTriggerSpeedScale
      && smokeTimer >= KART_CONFIG.kart.smokeInterval
    ) {
      smokeTimer = 0;
      const particle = smokeParticles[smokeCursor]!;
      smokeCursor = (smokeCursor + 1) % smokeParticles.length;
      particle.age = 0;
      particle.active = true;
      particle.mesh.visible = true;
      const rear = new THREE.Vector3(0, KART_CONFIG.kart.groundOffset, KART_CONFIG.kart.bodyLength * 0.42)
        .applyQuaternion(group.quaternion);
      particle.mesh.position.copy(group.position).add(rear);
      particle.mesh.scale.setScalar(KART_CONFIG.kart.smokeSize * KART_CONFIG.kart.smokeBaseScale);
      (particle.mesh.material as THREE.MeshBasicMaterial).opacity = KART_CONFIG.kart.smokeBaseOpacity;
    }

    smokeParticles.forEach((particle) => {
      if (!particle.active) return;
      particle.age += deltaSeconds;
      const progress = THREE.MathUtils.clamp(particle.age / KART_CONFIG.kart.smokeLifetime, 0, 1);
      particle.mesh.position.y += deltaSeconds * KART_CONFIG.kart.smokeRiseSpeed;
      particle.mesh.scale.setScalar(KART_CONFIG.kart.smokeSize * (KART_CONFIG.kart.smokeBaseScale + progress));
      (particle.mesh.material as THREE.MeshBasicMaterial).opacity = KART_CONFIG.kart.smokeBaseOpacity * (1 - progress);
      if (progress >= 1) {
        particle.active = false;
        particle.mesh.visible = false;
      }
    });
  };

  const dispose = () => {
    scene.remove(group);
    smokeParticles.forEach(({ mesh }) => scene.remove(mesh));
    geometries.forEach((geometry) => geometry.dispose());
    Object.values(materials).forEach((material) => material.dispose());
    if (!smokeMaterialsDisposed) {
      smokeParticles.forEach(({ mesh }) => (mesh.material as THREE.Material).dispose());
      smokeMaterialsDisposed = true;
    }
  };

  return {
    group,
    get speed() { return speed; },
    get distance() { return distance; },
    get lateralOffset() { return lateralOffset; },
    reset,
    update,
    dispose,
  };
};
