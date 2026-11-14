import type { KartInputState } from "./kart";

export type KartInput = {
  read: () => KartInputState & { restart: boolean };
  setTouchInput: (state: Partial<KartInputState>) => void;
  dispose: () => void;
};

export const createInput = (): KartInput => {
  const pressed = new Set<string>();
  const touchState: KartInputState = { accelerate: 0, reverse: 0, steer: 0, drift: false };
  let restartRequested = false;

  const onKeyDown = (event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(key)) event.preventDefault();
    if (key === "r" && !event.repeat) restartRequested = true;
    pressed.add(key);
  };
  const onKeyUp = (event: KeyboardEvent) => pressed.delete(event.key.toLowerCase());
  const onBlur = () => {
    pressed.clear();
    Object.assign(touchState, { accelerate: 0, reverse: 0, steer: 0, drift: false });
  };
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
  window.addEventListener("blur", onBlur);

  return {
    read: () => {
      const accelerate = Number(pressed.has("w") || pressed.has("arrowup"));
      const reverse = Number(pressed.has("s") || pressed.has("arrowdown"));
      const steer = Number(pressed.has("a") || pressed.has("arrowleft"))
        - Number(pressed.has("d") || pressed.has("arrowright"));
      const state = {
        accelerate: Math.max(accelerate, touchState.accelerate),
        reverse: Math.max(reverse, touchState.reverse),
        steer: THREEClamp(steer + touchState.steer, -1, 1),
        drift: pressed.has("shift") || pressed.has(" ") || touchState.drift,
        restart: restartRequested,
      };
      restartRequested = false;
      return state;
    },
    setTouchInput: (state) => {
      Object.assign(touchState, state);
    },
    dispose: () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
    },
  };
};

const THREEClamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
