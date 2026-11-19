# Numatik Metropolis optional character assets

The game runs offline without downloaded models. Its original low-poly character and vehicle models are the built-in fallback. To replace the walking character with a Mixamo-rigged humanoid, download these exact files as **FBX Binary**, with **Skin**, then convert them to GLB with the repository's `gltf-transform` CLI.

Put the converted files at:

| Destination | Mixamo animation to download | In Place |
| --- | --- | --- |
| `public/assets/models/city-avatar.glb` | Character model, T-pose (no animation) | n/a |
| `public/assets/animations/idle-in-place.glb` | Idle | On |
| `public/assets/animations/walk-in-place.glb` | Walking | On |
| `public/assets/animations/run-in-place.glb` | Running | On |
| `public/assets/animations/jump-in-place.glb` | Jump | On |
| `public/assets/animations/fall-in-place.glb` | Falling Idle | On |
| `public/assets/animations/land-in-place.glb` | Landing | On |
| `public/assets/animations/celebrate-in-place.glb` | Victory | On |

Use the same Mixamo character and skeleton for every animation. Export each animation as FBX Binary, use 30 FPS, and select **In Place** so locomotion stays controlled by the game. Convert each downloaded file to GLB with `gltf-transform copy input.fbx output.glb`. The character and animation files are optional and are not fetched from the network while playing.

Optional compressed assets may use Draco, Meshopt, or KTX2. Decoder files used by the app belong under `public/assets/draco/` and `public/assets/basis/`; `scripts/prepare-asset-decoders.mjs` prepares the repository's configured decoders.
