import { KART_CONFIG } from "./config";
import type { KartInputState } from "./kart";

export type KartUI = {
  update: (speed: number) => void;
  dispose: () => void;
};

export const createKartUI = (
  host: HTMLElement,
  onRestart: () => void,
  onTouchInput: (state: Partial<KartInputState>) => void,
): KartUI => {
  const style = document.createElement("style");
  style.textContent = `
    .kart-ui{position:absolute;inset:0;z-index:2;pointer-events:none;color:#18324a;font-family:var(--font-body,'Exo 2'),sans-serif}
    .kart-hud-card{position:absolute;left:18px;top:18px;padding:14px 18px;border:2px solid rgba(255,255,255,.9);border-radius:18px;background:rgba(255,255,255,.84);box-shadow:0 10px 24px rgba(27,71,103,.18);backdrop-filter:blur(8px)}
    .kart-hud-label{font:900 10px var(--font-display,'Orbitron'),sans-serif;letter-spacing:.16em;color:#3b7397}
    .kart-speed{margin-top:3px;font:900 38px/.95 var(--font-display,'Orbitron'),sans-serif;color:#163f58}
    .kart-speed small{font:800 10px var(--font-display,'Orbitron'),sans-serif;color:#56809a}
    .kart-debug{position:absolute;right:18px;top:18px;padding:10px 14px;border:2px solid rgba(255,255,255,.9);border-radius:14px;background:rgba(255,255,255,.82);font:900 10px var(--font-display,'Orbitron'),sans-serif;letter-spacing:.08em;color:#27845e}
    .kart-rivals{position:absolute;right:18px;top:66px;padding:8px 12px;border:1px solid rgba(255,255,255,.9);border-radius:12px;background:rgba(255,255,255,.78);font:900 10px var(--font-display,'Orbitron'),sans-serif;letter-spacing:.08em;color:#315b78}
    .kart-controls{position:absolute;left:50%;bottom:18px;transform:translateX(-50%);padding:10px 16px;border:1px solid rgba(255,255,255,.85);border-radius:14px;background:rgba(255,255,255,.78);font-size:11px;font-weight:800;text-align:center;white-space:nowrap;box-shadow:0 8px 18px rgba(27,71,103,.12)}
    .kart-controls kbd{padding:2px 5px;border:1px solid #aac2d0;border-radius:5px;background:#fff;color:#245674}
    .kart-restart{position:absolute;right:18px;bottom:18px;min-height:44px;padding:0 16px;border:0;border-radius:13px;background:linear-gradient(135deg,#ff765e,#f34f61);color:#fff;font:900 10px var(--font-display,'Orbitron'),sans-serif;letter-spacing:.08em;box-shadow:0 5px 0 #b83549,0 10px 18px rgba(165,49,68,.22);pointer-events:auto;cursor:pointer}
    .kart-restart:active{transform:translateY(3px);box-shadow:0 2px 0 #b83549}
    .kart-mobile-controls{display:none;position:absolute;inset:0;pointer-events:none;touch-action:none;user-select:none;-webkit-user-select:none}
    .kart-analog{position:absolute;left:22px;bottom:28px;width:118px;height:118px;border:2px solid rgba(255,255,255,.72);border-radius:50%;background:rgba(28,55,78,.28);box-shadow:inset 0 0 0 10px rgba(255,255,255,.1),0 8px 20px rgba(10,30,48,.18);pointer-events:auto;touch-action:none}
    .kart-analog:before{content:'';position:absolute;left:16%;right:16%;top:50%;height:2px;background:rgba(255,255,255,.34)}
    .kart-analog-stick{position:absolute;left:50%;top:50%;width:48px;height:48px;border:2px solid rgba(255,255,255,.92);border-radius:50%;background:linear-gradient(145deg,#fff,#a9d8ed);box-shadow:0 5px 12px rgba(8,28,44,.3);transform:translate(-50%,-50%);will-change:transform}
    .kart-analog-label{position:absolute;left:0;right:0;bottom:-22px;color:#fff;text-align:center;font:900 9px var(--font-display,'Orbitron'),sans-serif;text-shadow:0 1px 5px #16364c}
    .kart-touch-button{position:absolute;display:grid;place-items:center;border:2px solid rgba(255,255,255,.82);border-radius:50%;color:#fff;font:900 10px var(--font-display,'Orbitron'),sans-serif;letter-spacing:.04em;text-shadow:0 1px 3px rgba(0,0,0,.3);box-shadow:0 6px 14px rgba(8,28,44,.24);pointer-events:auto;touch-action:none;user-select:none;-webkit-user-select:none}
    .kart-touch-button.is-pressed{filter:brightness(1.2);transform:scale(.94)}
    .kart-gas{right:18px;bottom:30px;width:78px;height:78px;background:linear-gradient(145deg,#48c98d,#169c72)}
    .kart-brake{right:110px;bottom:30px;width:56px;height:56px;background:linear-gradient(145deg,#ff9878,#ec5c51)}
    .kart-drift{right:110px;bottom:102px;width:56px;height:56px;background:linear-gradient(145deg,#ad8aff,#7356c9)}
    @media(max-width:700px){.kart-mobile-controls{display:block}.kart-hud-card{left:10px;top:10px;padding:10px 13px}.kart-speed{font-size:30px}.kart-debug{right:10px;top:10px;font-size:8px}.kart-rivals{right:10px;top:52px;font-size:8px}.kart-controls{display:none}.kart-restart{right:10px;top:100px;bottom:auto;padding:0 11px;font-size:9px}}
  `;
  const root = document.createElement("div");
  root.className = "kart-ui";
  root.innerHTML = `
    <div class="kart-hud-card" aria-live="polite">
      <div class="kart-hud-label">KECEPATAN</div>
      <div class="kart-speed"><span data-kart-speed>0</span><small> KM/J</small></div>
    </div>
    <div class="kart-debug">TAHAP 1 SELESAI</div>
    <div class="kart-rivals">LAWAN: ${KART_CONFIG.kart.rivalKartCount} MOBIL</div>
    <div class="kart-controls"><kbd>WASD</kbd> / <kbd>←↑→↓</kbd> berkendara · <kbd>SHIFT</kbd>/<kbd>SPACE</kbd> drift · <kbd>R</kbd> ulang</div>
    <button class="kart-restart" type="button">ULANGI</button>
    <div class="kart-mobile-controls">
      <div class="kart-analog" data-kart-analog role="slider" aria-label="Analog kemudi" aria-valuemin="-1" aria-valuemax="1" aria-valuenow="0" tabindex="0">
        <div class="kart-analog-stick" data-kart-stick></div>
        <div class="kart-analog-label">KEMUDI</div>
      </div>
      <button class="kart-touch-button kart-gas" data-kart-action="accelerate" type="button" aria-label="Gas">GAS</button>
      <button class="kart-touch-button kart-brake" data-kart-action="reverse" type="button" aria-label="Rem dan mundur">REM</button>
      <button class="kart-touch-button kart-drift" data-kart-action="drift" type="button" aria-label="Drift">DRIFT</button>
    </div>
  `;
  const speedValue = root.querySelector<HTMLElement>("[data-kart-speed]");
  const restartButton = root.querySelector<HTMLButtonElement>(".kart-restart");
  const analog = root.querySelector<HTMLElement>("[data-kart-analog]");
  const stick = root.querySelector<HTMLElement>("[data-kart-stick]");
  const gasButton = root.querySelector<HTMLButtonElement>('[data-kart-action="accelerate"]');
  const brakeButton = root.querySelector<HTMLButtonElement>('[data-kart-action="reverse"]');
  const driftButton = root.querySelector<HTMLButtonElement>('[data-kart-action="drift"]');
  if (!speedValue || !restartButton || !analog || !stick || !gasButton || !brakeButton || !driftButton) {
    throw new Error("Komponen HUD kart gagal dibuat.");
  }
  const onRestartClick = () => onRestart();
  restartButton.addEventListener("click", onRestartClick);
  const removeTouchListeners: Array<() => void> = [];
  let analogPointerId: number | null = null;
  const updateAnalog = (event: PointerEvent) => {
    const bounds = analog.getBoundingClientRect();
    const maxTravel = bounds.width * 0.3;
    const offsetX = Math.max(-maxTravel, Math.min(maxTravel, event.clientX - (bounds.left + bounds.width / 2)));
    const steer = -offsetX / maxTravel;
    stick.style.transform = `translate(calc(-50% + ${offsetX}px), -50%)`;
    analog.setAttribute("aria-valuenow", steer.toFixed(2));
    onTouchInput({ steer });
  };
  const startAnalog = (event: PointerEvent) => {
    event.preventDefault();
    if (analogPointerId !== null) return;
    analogPointerId = event.pointerId;
    analog.setPointerCapture(event.pointerId);
    updateAnalog(event);
  };
  const moveAnalog = (event: PointerEvent) => {
    if (event.pointerId === analogPointerId) updateAnalog(event);
  };
  const stopAnalog = (event: PointerEvent) => {
    if (event.pointerId !== analogPointerId) return;
    analogPointerId = null;
    stick.style.transform = "translate(-50%, -50%)";
    analog.setAttribute("aria-valuenow", "0");
    onTouchInput({ steer: 0 });
  };
  analog.addEventListener("pointerdown", startAnalog);
  analog.addEventListener("pointermove", moveAnalog);
  analog.addEventListener("pointerup", stopAnalog);
  analog.addEventListener("pointercancel", stopAnalog);
  analog.addEventListener("lostpointercapture", stopAnalog);
  removeTouchListeners.push(() => {
    analog.removeEventListener("pointerdown", startAnalog);
    analog.removeEventListener("pointermove", moveAnalog);
    analog.removeEventListener("pointerup", stopAnalog);
    analog.removeEventListener("pointercancel", stopAnalog);
    analog.removeEventListener("lostpointercapture", stopAnalog);
  });
  const bindHoldButton = (
    button: HTMLButtonElement,
    setPressed: () => void,
    setReleased: () => void,
  ) => {
    let activePointerId: number | null = null;
    const press = (event: PointerEvent) => {
      event.preventDefault();
      if (activePointerId !== null) return;
      activePointerId = event.pointerId;
      button.setPointerCapture(event.pointerId);
      button.classList.add("is-pressed");
      setPressed();
    };
    const release = (event: PointerEvent) => {
      if (event.pointerId !== activePointerId) return;
      activePointerId = null;
      button.classList.remove("is-pressed");
      setReleased();
    };
    button.addEventListener("pointerdown", press);
    button.addEventListener("pointerup", release);
    button.addEventListener("pointercancel", release);
    button.addEventListener("lostpointercapture", release);
    removeTouchListeners.push(() => {
      button.removeEventListener("pointerdown", press);
      button.removeEventListener("pointerup", release);
      button.removeEventListener("pointercancel", release);
      button.removeEventListener("lostpointercapture", release);
      if (activePointerId !== null) setReleased();
    });
  };
  bindHoldButton(gasButton, () => onTouchInput({ accelerate: 1 }), () => onTouchInput({ accelerate: 0 }));
  bindHoldButton(brakeButton, () => onTouchInput({ reverse: 1 }), () => onTouchInput({ reverse: 0 }));
  bindHoldButton(driftButton, () => onTouchInput({ drift: true }), () => onTouchInput({ drift: false }));
  host.append(style, root);

  return {
    update: (speed) => {
      const displaySpeed = Math.min(
        KART_CONFIG.ui.maxSpeedDisplay,
        Math.round(Math.abs(speed) * KART_CONFIG.ui.speedDisplayScale),
      );
      speedValue.textContent = String(displaySpeed);
    },
    dispose: () => {
      restartButton.removeEventListener("click", onRestartClick);
      removeTouchListeners.forEach((removeListener) => removeListener());
      onTouchInput({ accelerate: 0, reverse: 0, steer: 0, drift: false });
      style.remove();
      root.remove();
    },
  };
};
