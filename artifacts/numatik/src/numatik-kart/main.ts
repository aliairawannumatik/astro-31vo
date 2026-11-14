import * as THREE from "three";
import { KART_CONFIG } from "./config";
import { createRaceCamera, updateRaceCamera } from "./camera";
import { createInput } from "./input";
import { createKart } from "./kart";
import { createTrack } from "./track";
import { createKartUI } from "./ui";

export const mountKartGame = (host: HTMLElement) => {
  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, KART_CONFIG.render.pixelRatioLimit));
  renderer.setSize(host.clientWidth, host.clientHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = KART_CONFIG.render.exposure;
  renderer.shadowMap.enabled = false;
  renderer.domElement.setAttribute("aria-label", "Lintasan balap kart NUMATIK tahap satu");
  host.appendChild(renderer.domElement);

  scene.background = new THREE.Color(KART_CONFIG.render.clearColor);
  const track = createTrack(scene);
  const camera = createRaceCamera(host.clientWidth / Math.max(host.clientHeight, 1));
  scene.add(new THREE.HemisphereLight(
    "#ffffff",
    "#7d9e78",
    KART_CONFIG.render.hemisphereIntensity,
  ));
  const sunlight = new THREE.DirectionalLight("#fff7dd", KART_CONFIG.render.sunlightIntensity);
  sunlight.position.set(...KART_CONFIG.render.sunlightPosition);
  scene.add(sunlight);

  const kart = createKart(scene);
  const rivals = Array.from({ length: KART_CONFIG.kart.rivalKartCount }, (_, index) => {
    const colorPair = KART_CONFIG.kart.rivalColors[index]!;
    return createKart(scene, {
      bodyColor: colorPair[0],
      accentColor: colorPair[1],
      startDistance: KART_CONFIG.kart.rivalStartDistance
        + index * KART_CONFIG.kart.rivalSpacing,
      startLateralOffset: KART_CONFIG.kart.rivalLaneOffsets[index]!,
      rival: {
        targetSpeed: KART_CONFIG.kart.rivalTargetSpeeds[index]!,
        laneOffset: KART_CONFIG.kart.rivalLaneOffsets[index]!,
        weaveAmplitude: KART_CONFIG.kart.rivalWeaveAmplitudes[index]!,
        weaveFrequency: KART_CONFIG.kart.rivalWeaveFrequencies[index]!,
        phase: KART_CONFIG.kart.rivalPhases[index]!,
      },
    });
  });
  const input = createInput();
  const resetRace = () => {
    kart.reset();
    rivals.forEach((rival) => rival.reset());
  };
  const ui = createKartUI(host, resetRace, input.setTouchInput);
  let previousTime = performance.now();
  let frameId = 0;
  let disposed = false;

  const resize = () => {
    const width = host.clientWidth;
    const height = host.clientHeight;
    if (!width || !height) return;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, KART_CONFIG.render.pixelRatioLimit));
    renderer.setSize(width, height);
  };
  window.addEventListener("resize", resize);

  const animate = (now: number) => {
    if (disposed) return;
    frameId = window.requestAnimationFrame(animate);
    const deltaSeconds = Math.min(
      (now - previousTime) / 1000,
      KART_CONFIG.render.maxDeltaSeconds,
    );
    previousTime = now;
    const controls = input.read();
    if (controls.restart) resetRace();
    kart.update(track, controls, deltaSeconds);
    rivals.forEach((rival) => {
      rival.update(track, { accelerate: 0, reverse: 0, steer: 0, drift: false }, deltaSeconds);
    });
    updateRaceCamera(camera, kart.group, kart.speed, deltaSeconds);
    ui.update(kart.speed);
    renderer.render(scene, camera);
  };
  frameId = window.requestAnimationFrame(animate);

  return () => {
    disposed = true;
    window.cancelAnimationFrame(frameId);
    window.removeEventListener("resize", resize);
    input.dispose();
    ui.dispose();
    kart.dispose();
    rivals.forEach((rival) => rival.dispose());
    const geometries = new Set<THREE.BufferGeometry>();
    const materials = new Set<THREE.Material>();
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
};
