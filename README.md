# Foldspace — Spatial Folding Puzzle Architecture

A browser-based spatial puzzle game where rooms and architectural surfaces transform along non-Euclidean axes to discover paths that were previously inaccessible, built with Three.js, TypeScript, and Vite.

![Foldspace](https://img.shields.io/badge/License-MIT-blue.svg)
![Build](https://img.shields.io/badge/Build-Passing-brightgreen.svg)
![Tests](https://img.shields.io/badge/Tests-12%2F12%20Passing-brightgreen.svg)
![Bundle](https://img.shields.io/badge/Bundle-124%20kB%20gzip-informational.svg)

---

## 🏛️ Spatial Mechanics & Core Concept

Step into a non-Euclidean architectural sanctuary. Walkways end abruptly at chasms, and goals are suspended on unreachable ridges. By triggering spatial transformations, vertical walls rotate down 90° into bridges, and disjoint chambers rotate to connect perpendicular doorways.

### 2 Distinct Spatial Transformation Types:
1. **Hinge Fold (`HINGE_FOLD`)**: Rotates vertical wall panels 90° into horizontal bridges or elevates terraces between vertical tiers.
2. **Chamber Rotation (`CHAMBER_ROTATION`)**: Rotates entire room modules 90° around vertical Y axes, connecting perpendicular doors and re-orienting corridor spans.

### Deterministic Transformation Model:
- **Discrete Coordinate Graph**: Decoupled from mesh physics. All transformations use explicit `TileStateMap` definitions (`normal` ⇄ `transformed`), guaranteeing 100% mathematical reversibility and zero floating-point accumulation drift.
- **Player Ride-Along Safety**: If the player occupies a tile being transformed, the engine automatically calculates their destination coordinates and smoothly relocates them with the moving surface, preventing void falls or geometry clipping.
- **Ghost Preview System**: Dynamic amber wireframes pulse in the 3D viewport, visually predicting where transforming geometry will land before committing the action.

---

## 🧩 5 Handcrafted Puzzles

1. **Puzzle 01: The First Fold**
   - *Mechanic*: Primary Hinge Fold.
   - *Objective*: Lower vertical panels 90° across a deep void to form a direct walkway to the golden monolith.
2. **Puzzle 02: The Ascension Terraces**
   - *Mechanic*: Dual Sequential Hinges & Elevation.
   - *Objective*: Lower the moat drawbridge, cross to the center pillar, then raise the elevated terrace ramp to ascend to the high altar.
3. **Puzzle 03: The Rotary Junction**
   - *Mechanic*: 90° Chamber Axis Rotation.
   - *Objective*: Rotate a 3-tile central corridor chamber around its vertical pivot to bridge disjoint entry and exit doors.
4. **Puzzle 04: The Origami Gateway**
   - *Mechanic*: Combined Hinge Fold + Chamber Rotation.
   - *Objective*: Fold the gateway drawbridge, advance into the pavilion, then rotate the pavilion to align with the elevated goal terrace.
5. **Puzzle 05: The Celestial Sanctum**
   - *Mechanic*: Architectural Master Trial (3 Interconnected Mechanisms).
   - *Objective*: Coordinate celestial drawbridge, crossway chamber rotator, and sanctuary ascension lift to harmonize the high sanctuary monolith.

---

## 🕹️ Controls

| Key / Input | Action | Description |
| :--- | :--- | :--- |
| `W` `A` `S` `D` / `Arrows` | Move | Step cardinal directions along connected walkable tiles |
| `Space` | Transform Primary | Trigger default/next available spatial transformation |
| `1`, `2`, `3` | Transform Direct | Trigger specific numbered transformation mechanism |
| `Q` / `E` | Rotate Camera | Orbit isometric perspective 90° clockwise / counter-clockwise |
| `R` | Reset Level | Reload current puzzle state safely |
| `P` / `Escape` | Pause / Resume | Suspend/resume rendering and transformations |
| `M` | SFX Mute | Toggle Web Audio procedural sound effects |

---

## 🛠️ Architecture & Performance

- **Engine**: Three.js `v0.170.0` with `THREE.OrthographicCamera` for isometric precision.
- **Rendering & Intel Iris Xe Compatibility**:
  - Procedural box and octahedron geometries with shared materials.
  - Zero heavy textures or complex external GLTF downloads; instant cold boot.
  - Directional shadow maps and ambient lighting tuned for 60 FPS on integrated GPUs.
  - Production bundle: **124 kB gzip** / 489 kB uncompressed.
- **Audio**: 100% offline procedural Web Audio synthesizer:
  - Custom triangle and sine wave audio ramps for tile footsteps, hinge folds, chamber rotations, blocked bumps, and harmonious victory fanfares.
- **UI & Modals**:
  - Title start screen with immediate level selector (Puzzles 1–5).
  - In-game HUD displaying puzzle name, instructions, and dynamic transform buttons.
  - Pause modal, win modal, and Grand Master Completion screen.

---

## 🧪 Testing & Verification

12 unit tests covering all 5 puzzles, reversibility, player ride-along, and collision validity:

```bash
# Run Vitest test suite
npm test

# Build production bundle
npm run build

# Run local development server (Dedicated port 7002 — no port collision)
npm run dev
# Open http://localhost:7002
```

---

## 📜 Asset Licenses & Attribution

- **Source Code**: MIT License.
- **3D Meshes**: 100% procedural Three.js primitives (`THREE.BoxGeometry`, `THREE.SphereGeometry`, `THREE.OctahedronGeometry`).
- **Sound Effects**: 100% procedural synthesized Web Audio API (zero third-party audio files).
- **Fonts**: Space Mono and Plus Jakarta Sans (Google Fonts, SIL Open Font License).
