# Foldspace — Spatial Folding Puzzle Architecture

A spatial puzzle game where connected rooms and architectural surfaces transform according to consistent geometric rules, built with Three.js and TypeScript.

![Foldspace](https://img.shields.io/badge/License-MIT-blue.svg)
![Build](https://img.shields.io/badge/Build-Passing-brightgreen.svg)
![Tests](https://img.shields.io/badge/Tests-5%2F5%20Passing-brightgreen.svg)

---

## 🏛️ The Concept

Step into a minimalist non-Euclidean sanctuary. Walkways end abruptly at chasms, and goals are suspended on unreachable ridges. By triggering spatial hinge transformations, vertical walls rotate down 90° into bridges, and disjointed platforms re-align into walkable architectural paths.

### Handcrafted Puzzles Included:
1. **Puzzle 01: The Hinge Bridge** — Introduces the core 90° vertical-to-horizontal hinge fold that bridges a chasm.
2. **Puzzle 02: Ascension Fold** — Multi-tier elevation fold that connects lower terraces to an upper sanctuary.
3. **Puzzle 03: Dual Orthogonal Hinge** — Two interlocking geometric hinges that must be folded in sequence.

---

## 🕹️ Controls

| Control | Action |
| :--- | :--- |
| `W` `A` `S` `D` / `Arrow Keys` | Move operative along connected walkable tiles |
| `Space` | **Fold Hinge**: Rotates architectural hinge face 90° |
| `Q` / `E` | **Rotate Perspective**: Rotates isometric camera view 90° |
| `R` | **Reset Puzzle**: Restores level to initial state |

---

## 🛠️ Architecture & 3D Spatial Geometry

- **Three.js Isometric SceneGraph**: Orthographic projection optimized for Intel Iris Xe integrated graphics with clean directional shadows, ambient occlusion, and zero frame stutter.
- **Topological Navigation Engine**: Movement is decoupled from rendering and validated against a discrete 3D tile graph. During spatial folding, inputs are locked for ~320ms while matrix groups smoothly tween, preventing any collision clipping.
- **Procedural Audio**: 100% offline Web Audio synthesizing stone clicks, resonant mechanical folding whooshes, and sanctuary completion fanfares.

---

## 🧪 Testing & Verification

Run the Vitest test suite:
```bash
npm test
```

Build production bundle:
```bash
npm run build
```

Run local dev server:
```bash
npm run dev
```

---

## 📜 License
MIT License.
