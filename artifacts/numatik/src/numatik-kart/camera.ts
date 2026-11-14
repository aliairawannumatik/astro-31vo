import * as THREE from "three";
import { KART_CONFIG } from "./config";

export const createRaceCamera = (aspect: number) => {
  const camera = new THREE.PerspectiveCamera(
    KART_CONFIG.render.fieldOfView,
    aspect,
    KART_CONFIG.render.cameraNear,
    KART_CONFIG.render.cameraFar,
  );
  camera.position.set(0, KART_CONFIG.camera.followHeight, KART_CONFIG.camera.followDistance);
  return camera;
};

export const updateRaceCamera = (
  camera: THREE.PerspectiveCamera,
  kart: THREE.Group,
  speed: number,
  deltaSeconds: number,
) => {
  const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(kart.quaternion).normalize();
  const targetPosition = kart.position.clone()
    .addScaledVector(forward, -KART_CONFIG.camera.followDistance)
    .add(new THREE.Vector3(0, KART_CONFIG.camera.followHeight, 0));
  const lookTarget = kart.position.clone()
    .addScaledVector(forward, KART_CONFIG.camera.lookAhead)
    .add(new THREE.Vector3(0, KART_CONFIG.camera.lookTargetHeight, 0));
  camera.position.lerp(targetPosition, 1 - Math.exp(-KART_CONFIG.camera.smoothing * deltaSeconds));
  camera.lookAt(lookTarget);
  const speedRatio = THREE.MathUtils.clamp(
    Math.abs(speed) / KART_CONFIG.camera.fovSpeedReference,
    0,
    1,
  );
  camera.fov = KART_CONFIG.render.fieldOfView + speedRatio * KART_CONFIG.camera.speedFovBoost;
  camera.updateProjectionMatrix();
};
