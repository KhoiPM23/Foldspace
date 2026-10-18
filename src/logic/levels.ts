import { ArchitectGlyph, LevelData } from './types';

export const ARCHITECT_GLYPHS: ArchitectGlyph[] = [
  {
    id: 'glyph-1',
    levelNumber: 1,
    symbol: '⟐',
    title: 'THE FIRST THEOREM // SUNDERED SPIRE',
    coordinates: 'KEPLER-186F // 12.8°R-POLAR',
    epoch: 'ERA OF CRUSHED HORIZONS — 4,210 B.C.E.',
    inscription: 'A straight line is not the shortest distance between two stars. It is merely a flat sheet awaiting the hands of a Shaper.',
    philosophicalNote: 'Before the Calabi-Yau collapse, our worlds drifted as isolated planar sheets across the abyss. We carved hinges from hyper-dense dark matter to draw distant horizons into immediate contact.',
    tilePos: { x: 3, y: 0, z: 0 }
  },
  {
    id: 'glyph-2',
    levelNumber: 2,
    symbol: '⟁',
    title: 'THE SECOND THEOREM // ASCENDANT LOOM',
    coordinates: 'CYGNUS RIFT // ALTAR OF VAPORS',
    epoch: 'ERA OF RECONSTRUCTED GRAVITY — 3,890 B.C.E.',
    inscription: 'Elevation is an illusion of mass. When the plane folds upward, the valley becomes the summit, and the fall becomes ascension.',
    philosophicalNote: 'The terraced sanctuaries were built to harness anti-gravitational aquifers. By raising orthogonal staircases through empty vacuum, the Architects climbed into higher geometric orders without burning propellant.',
    tilePos: { x: 2, y: 0, z: 0 }
  },
  {
    id: 'glyph-3',
    levelNumber: 3,
    symbol: '⧖',
    title: 'THE THIRD THEOREM // CHRONO-GYRE',
    coordinates: 'SIRIUS BINARY CHASM // SECTOR 9',
    epoch: 'ERA OF ROTATIONAL ENTROPY — 3,120 B.C.E.',
    inscription: 'Turn the room ninety degrees upon its axis, and you do not simply alter your heading—you invert the flow of cosmic causality.',
    philosophicalNote: 'When two star systems approached catastrophic collision, the Rotary Chambers were turned to divert radiant energy through orthogonal pocket dimensions. What appeared to be a dead-end stone wall became an interstellar gateway.',
    tilePos: { x: 3, y: 0, z: 2 }
  },
  {
    id: 'glyph-4',
    levelNumber: 4,
    symbol: '⯃',
    title: 'THE FOURTH THEOREM // ORIGAMI GATEWAY',
    coordinates: 'VEGA VOID // 0.04 AU APHELION',
    epoch: 'ERA OF INTERLACED SEAMS — 2,750 B.C.E.',
    inscription: 'Space is not continuous fabric; it possesses seams. Find the crease, apply harmonic tension, and the gateway will blossom like a lotus.',
    philosophicalNote: 'Ancient cartographers charted the seam-lines of reality. Pilgrims who walked the folded bridge reported seeing their own reflections traversing past and future loops simultaneously.',
    tilePos: { x: 3, y: 1, z: 1 }
  },
  {
    id: 'glyph-5',
    levelNumber: 5,
    symbol: '✦',
    title: 'THE FIFTH THEOREM // CELESTIAL SANCTUM',
    coordinates: 'M87 JET TERMINUS // VOID CITADEL',
    epoch: 'ERA OF SINGULAR REPOSE — 1,980 B.C.E.',
    inscription: 'The celestial sanctuary requires dual devotion. Fold the wing, balance the terrace, and step onto the altar of light.',
    philosophicalNote: 'This sanctuary stood watch over the galactic halo. To prevent uninitiated wanderers from triggering dimensional collapse, its entry sequence required simultaneous manipulation of perpendicular spatial planes.',
    tilePos: { x: 2, y: 0, z: 0 }
  },
  {
    id: 'glyph-6',
    levelNumber: 6,
    symbol: '⯎',
    title: 'THE SIXTH THEOREM // TESSERACT CORE',
    coordinates: 'INNER CALABI-YAU HORIZON // 6-AXIS',
    epoch: 'ERA OF HIGHER TOPOLOGY — 1,140 B.C.E.',
    inscription: 'The shadow of a hypercube is a prison of eight cubes. Walk inside the shadow to manipulate the fourth spatial coordinate.',
    philosophicalNote: 'Here, the Architects abandoned three-dimensional existence altogether. The cube rolls upon an axis that human senses cannot perceive, connecting floor to ceiling without passing through the intermediate air.',
    tilePos: { x: 4, y: 2, z: 1 }
  },
  {
    id: 'glyph-7',
    levelNumber: 7,
    symbol: '♾',
    title: 'THE SEVENTH THEOREM // THE HYPERCUBE VOID',
    coordinates: 'OMEGA CONVERGENCE POINT // 0.0.0.0',
    epoch: 'ERA OF THE FINAL WEAVE — 0 B.C.E.',
    inscription: 'When all folds are aligned, the universe ceases to be divided. The seeker, the stone, and the star become a single continuous line.',
    philosophicalNote: 'The final codex left by the departing Architects. Having mastered non-Euclidean folding, they folded their entire civilization into a micro-scale Calabi-Yau manifold, escaping the heat death of this cosmos.',
    tilePos: { x: 5, y: 1, z: 1 }
  }
];

export const FOLDSPACE_LEVELS: LevelData[] = [
  // LEVEL 1: THE FIRST FOLD
  {
    id: 'level-1',
    levelNumber: 1,
    name: 'PUZZLE 01: THE FIRST FOLD',
    subtitle: 'Learn the primary surface hinge transformation.',
    description: 'A chasm divides the path. Press [SPACE] or Click FOLD to rotate the vertical wall 90° into a horizontal bridge.',
    spawn: { x: 0, y: 0, z: 0 },
    goal: { x: 4, y: 0, z: 0 },
    monolith: ARCHITECT_GLYPHS[0],
    parMoves: 3,
    tiles: [
      { id: 'l1-s0', x: 0, y: 0, z: 0, type: 'WALKABLE', color: '#38bdf8' },
      { id: 'l1-s1', x: 1, y: 0, z: 0, type: 'WALKABLE', color: '#38bdf8' },

      // Hinged bridge panels (start vertical)
      { id: 'l1-h1', x: 1, y: 1, z: 0, type: 'WALL', transformId: 't-l1-bridge', color: '#f59e0b' },
      { id: 'l1-h2', x: 1, y: 2, z: 0, type: 'WALL', transformId: 't-l1-bridge', color: '#f59e0b' },

      // Destination platform
      { id: 'l1-d1', x: 3, y: 0, z: 0, type: 'WALKABLE', color: '#38bdf8' },
      { id: 'l1-goal', x: 4, y: 0, z: 0, type: 'GOAL', color: '#00ffaa' }
    ],
    transforms: [
      {
        id: 't-l1-bridge',
        name: 'BRIDGE HINGE [ALPHA]',
        type: 'HINGE_FOLD',
        pivot: { x: 1.5, y: 0.5, z: 0 },
        axis: 'Z',
        direction: 1,
        isTransformed: false,
        angle: 0,
        targetAngle: 0,
        tileMappings: [
          {
            tileId: 'l1-h1',
            normal: { x: 1, y: 1, z: 0, type: 'WALL' },
            transformed: { x: 2, y: 0, z: 0, type: 'WALKABLE' }
          },
          {
            tileId: 'l1-h2',
            normal: { x: 1, y: 2, z: 0, type: 'WALL' },
            transformed: { x: 3, y: 0, z: 0, type: 'WALKABLE' }
          }
        ]
      }
    ]
  },

  // LEVEL 2: THE ASCENSION TERRACES
  {
    id: 'level-2',
    levelNumber: 2,
    name: 'PUZZLE 02: THE ASCENSION TERRACES',
    subtitle: 'Sequential hinges and vertical elevation.',
    description: 'Two separate hinges: lower the first drawbridge to cross the moat, then raise the terrace lift to ascend to the shrine.',
    spawn: { x: 0, y: 0, z: 0 },
    goal: { x: 4, y: 1, z: 0 },
    monolith: ARCHITECT_GLYPHS[1],
    parMoves: 6,
    tiles: [
      { id: 'l2-s0', x: 0, y: 0, z: 0, type: 'WALKABLE', color: '#38bdf8' },
      { id: 'l2-s1', x: 1, y: 0, z: 0, type: 'WALKABLE', color: '#38bdf8' },

      // Hinge 1 (Lower bridge)
      { id: 'l2-h1', x: 1, y: 1, z: 0, type: 'WALL', transformId: 't-l2-bridge', color: '#f59e0b' },

      // Central Pillar
      { id: 'l2-mid', x: 2, y: 0, z: 0, type: 'WALKABLE', color: '#38bdf8' },

      // Hinge 2 (Elevated terrace ramp)
      { id: 'l2-h2', x: 2, y: 0, z: 1, type: 'WALL', transformId: 't-l2-lift', color: '#ec4899' },

      // High altar goal
      { id: 'l2-goal', x: 4, y: 1, z: 0, type: 'GOAL', color: '#00ffaa' }
    ],
    transforms: [
      {
        id: 't-l2-bridge',
        name: 'MOAT DRAWBRIDGE',
        type: 'HINGE_FOLD',
        pivot: { x: 1.5, y: 0.5, z: 0 },
        axis: 'Z',
        direction: 1,
        isTransformed: false,
        angle: 0,
        targetAngle: 0,
        tileMappings: [
          {
            tileId: 'l2-h1',
            normal: { x: 1, y: 1, z: 0, type: 'WALL' },
            transformed: { x: 2, y: 0, z: 0, type: 'WALKABLE' }
          }
        ]
      },
      {
        id: 't-l2-lift',
        name: 'TERRACE LIFT',
        type: 'HINGE_FOLD',
        pivot: { x: 3, y: 0.5, z: 0 },
        axis: 'Z',
        direction: -1,
        isTransformed: false,
        angle: 0,
        targetAngle: 0,
        tileMappings: [
          {
            tileId: 'l2-h2',
            normal: { x: 2, y: 0, z: 1, type: 'WALL' },
            transformed: { x: 3, y: 1, z: 0, type: 'WALKABLE' }
          }
        ]
      }
    ]
  },

  // LEVEL 3: THE ROTARY JUNCTION
  {
    id: 'level-3',
    levelNumber: 3,
    name: 'PUZZLE 03: THE ROTARY JUNCTION',
    subtitle: 'Introducing 90° Chamber Axis Rotation.',
    description: 'The central room module can be rotated 90° around its vertical axis. Re-orient the corridor to connect disjoint doorways.',
    spawn: { x: 0, y: 0, z: 2 },
    goal: { x: 4, y: 0, z: 2 },
    monolith: ARCHITECT_GLYPHS[2],
    parMoves: 4,
    tiles: [
      { id: 'l3-start', x: 0, y: 0, z: 2, type: 'WALKABLE', color: '#38bdf8' },
      { id: 'l3-entry', x: 1, y: 0, z: 2, type: 'WALKABLE', color: '#38bdf8' },

      // Rotatable 3-tile corridor chamber (around pivot at 2, 0, 2)
      { id: 'l3-rc1', x: 2, y: 0, z: 2, type: 'WALKABLE', transformId: 't-l3-rotator', color: '#a855f7' },
      { id: 'l3-rc2', x: 2, y: 0, z: 1, type: 'WALKABLE', transformId: 't-l3-rotator', color: '#a855f7' },
      { id: 'l3-rc3', x: 2, y: 0, z: 0, type: 'WALKABLE', transformId: 't-l3-rotator', color: '#a855f7' },

      // Goal platform
      { id: 'l3-d1', x: 3, y: 0, z: 2, type: 'WALKABLE', color: '#38bdf8' },
      { id: 'l3-goal', x: 4, y: 0, z: 2, type: 'GOAL', color: '#00ffaa' }
    ],
    transforms: [
      {
        id: 't-l3-rotator',
        name: 'ROTARY CHAMBER',
        type: 'CHAMBER_ROTATION',
        pivot: { x: 2, y: 0, z: 2 },
        axis: 'Y',
        direction: 1,
        isTransformed: false,
        angle: 0,
        targetAngle: 0,
        tileMappings: [
          {
            tileId: 'l3-rc1',
            normal: { x: 2, y: 0, z: 2, type: 'WALKABLE' },
            transformed: { x: 2, y: 0, z: 2, type: 'WALKABLE' }
          },
          {
            tileId: 'l3-rc2',
            normal: { x: 2, y: 0, z: 1, type: 'WALKABLE' },
            transformed: { x: 3, y: 0, z: 2, type: 'WALKABLE' }
          },
          {
            tileId: 'l3-rc3',
            normal: { x: 2, y: 0, z: 0, type: 'WALKABLE' },
            transformed: { x: 3, y: 0, z: 1, type: 'WALKABLE' }
          }
        ]
      }
    ]
  },

  // LEVEL 4: THE ORIGAMI GATEWAY
  {
    id: 'level-4',
    levelNumber: 4,
    name: 'PUZZLE 04: THE ORIGAMI GATEWAY',
    subtitle: 'Combining Hinge Folds and Chamber Rotations.',
    description: 'Transform the space in concert: fold the drawbridge to cross the divide, then rotate the pavilion to align with the elevated terrace.',
    spawn: { x: 0, y: 0, z: 0 },
    goal: { x: 3, y: 1, z: 2 },
    monolith: ARCHITECT_GLYPHS[3],
    parMoves: 6,
    tiles: [
      { id: 'l4-s0', x: 0, y: 0, z: 0, type: 'WALKABLE', color: '#38bdf8' },
      { id: 'l4-s1', x: 1, y: 0, z: 0, type: 'WALKABLE', color: '#38bdf8' },

      // Hinge panel 1
      { id: 'l4-h1', x: 1, y: 1, z: 0, type: 'WALL', transformId: 't-l4-fold', color: '#f59e0b' },

      // Rotating mid-chamber
      { id: 'l4-r1', x: 2, y: 0, z: 0, type: 'WALKABLE', transformId: 't-l4-chamber', color: '#a855f7' },
      { id: 'l4-r2', x: 2, y: 0, z: 1, type: 'WALKABLE', transformId: 't-l4-chamber', color: '#a855f7' },

      // Goal terrace
      { id: 'l4-g0', x: 3, y: 1, z: 1, type: 'WALKABLE', color: '#38bdf8' },
      { id: 'l4-goal', x: 3, y: 1, z: 2, type: 'GOAL', color: '#00ffaa' }
    ],
    transforms: [
      {
        id: 't-l4-fold',
        name: 'GATEWAY DRAWBRIDGE',
        type: 'HINGE_FOLD',
        pivot: { x: 1.5, y: 0.5, z: 0 },
        axis: 'Z',
        direction: 1,
        isTransformed: false,
        angle: 0,
        targetAngle: 0,
        tileMappings: [
          {
            tileId: 'l4-h1',
            normal: { x: 1, y: 1, z: 0, type: 'WALL' },
            transformed: { x: 2, y: 0, z: 0, type: 'WALKABLE' }
          }
        ]
      },
      {
        id: 't-l4-chamber',
        name: 'PAVILION ROTATOR',
        type: 'CHAMBER_ROTATION',
        pivot: { x: 2, y: 0, z: 0 },
        axis: 'Y',
        direction: 1,
        isTransformed: false,
        angle: 0,
        targetAngle: 0,
        tileMappings: [
          {
            tileId: 'l4-r1',
            normal: { x: 2, y: 0, z: 0, type: 'WALKABLE' },
            transformed: { x: 2, y: 0, z: 0, type: 'WALKABLE' }
          },
          {
            tileId: 'l4-r2',
            normal: { x: 2, y: 0, z: 1, type: 'WALKABLE' },
            transformed: { x: 3, y: 1, z: 0, type: 'WALKABLE' }
          }
        ]
      }
    ]
  },

  // LEVEL 5: THE CELESTIAL SANCTUM
  {
    id: 'level-5',
    levelNumber: 5,
    name: 'PUZZLE 05: THE CELESTIAL SANCTUM',
    subtitle: 'The Grand Architectural Master Trial.',
    description: 'Three interconnected spatial mechanisms. Navigate the rotating gateway, lower the outer moat, and raise the ascension ramp.',
    spawn: { x: 0, y: 0, z: 0 },
    goal: { x: 4, y: 2, z: 2 },
    monolith: ARCHITECT_GLYPHS[4],
    parMoves: 8,
    tiles: [
      { id: 'l5-s0', x: 0, y: 0, z: 0, type: 'WALKABLE', color: '#38bdf8' },
      { id: 'l5-s1', x: 1, y: 0, z: 0, type: 'WALKABLE', color: '#38bdf8' },

      // Transform 1: Drawbridge hinge
      { id: 'l5-db1', x: 1, y: 1, z: 0, type: 'WALL', transformId: 't-l5-drawbridge', color: '#f59e0b' },

      // Center Rotator Platform
      { id: 'l5-rot0', x: 2, y: 0, z: 0, type: 'WALKABLE', transformId: 't-l5-rotator', color: '#a855f7' },
      { id: 'l5-rot1', x: 2, y: 0, z: 1, type: 'WALKABLE', transformId: 't-l5-rotator', color: '#a855f7' },

      // Transform 3: Ascension Lift
      { id: 'l5-lift', x: 3, y: 0, z: 1, type: 'WALL', transformId: 't-l5-lift', color: '#ec4899' },

      // High Sanctuary Monolith
      { id: 'l5-goal-tier', x: 4, y: 2, z: 1, type: 'WALKABLE', color: '#38bdf8' },
      { id: 'l5-goal', x: 4, y: 2, z: 2, type: 'GOAL', color: '#00ffaa' }
    ],
    transforms: [
      {
        id: 't-l5-drawbridge',
        name: 'CELESTIAL DRAWBRIDGE',
        type: 'HINGE_FOLD',
        pivot: { x: 1.5, y: 0.5, z: 0 },
        axis: 'Z',
        direction: 1,
        isTransformed: false,
        angle: 0,
        targetAngle: 0,
        tileMappings: [
          {
            tileId: 'l5-db1',
            normal: { x: 1, y: 1, z: 0, type: 'WALL' },
            transformed: { x: 2, y: 0, z: 0, type: 'WALKABLE' }
          }
        ]
      },
      {
        id: 't-l5-rotator',
        name: 'CROSSWAY ROTATOR',
        type: 'CHAMBER_ROTATION',
        pivot: { x: 2, y: 0, z: 0 },
        axis: 'Y',
        direction: 1,
        isTransformed: false,
        angle: 0,
        targetAngle: 0,
        tileMappings: [
          {
            tileId: 'l5-rot0',
            normal: { x: 2, y: 0, z: 0, type: 'WALKABLE' },
            transformed: { x: 2, y: 0, z: 0, type: 'WALKABLE' }
          },
          {
            tileId: 'l5-rot1',
            normal: { x: 2, y: 0, z: 1, type: 'WALKABLE' },
            transformed: { x: 3, y: 0, z: 0, type: 'WALKABLE' }
          }
        ]
      },
      {
        id: 't-l5-lift',
        name: 'SANCTUARY ASCENSION LIFT',
        type: 'HINGE_FOLD',
        pivot: { x: 3.5, y: 1.0, z: 0 },
        axis: 'Z',
        direction: -1,
        isTransformed: false,
        angle: 0,
        targetAngle: 0,
        tileMappings: [
          {
            tileId: 'l5-lift',
            normal: { x: 3, y: 0, z: 1, type: 'WALL' },
            transformed: { x: 4, y: 1, z: 0, type: 'WALKABLE' }
          }
        ]
      }
    ]
  },

  // LEVEL 6: THE TESSERACT CORE (Climax Master Puzzle)
  {
    id: 'level-6',
    levelNumber: 6,
    name: 'PUZZLE 06: THE TESSERACT CORE',
    subtitle: 'Tri-axis spatial origami uniting hinge folds, vertical lift, and chamber rotation.',
    description: 'Master the complete non-Euclidean folding nexus: fold the skyway bridge, pivot the hypercube chamber, and elevate the spire to reach the Tesseract Singularity.',
    spawn: { x: 0, y: 0, z: 0 },
    goal: { x: 4, y: 2, z: 2 },
    monolith: ARCHITECT_GLYPHS[5],
    parMoves: 9,
    tiles: [
      { id: 'l6-s0', x: 0, y: 0, z: 0, type: 'WALKABLE', color: '#38bdf8' },
      { id: 'l6-s1', x: 1, y: 0, z: 0, type: 'WALKABLE', color: '#38bdf8' },

      // Transform 1: Skybridge Hinge
      { id: 'l6-bridge', x: 1, y: 1, z: 0, type: 'WALL', transformId: 't-l6-skybridge', color: '#f59e0b' },

      // Transform 2: Central Hypercube Chamber
      { id: 'l6-core0', x: 2, y: 0, z: 0, type: 'WALKABLE', transformId: 't-l6-tesseract-rot', color: '#a855f7' },
      { id: 'l6-core1', x: 2, y: 0, z: 1, type: 'WALKABLE', transformId: 't-l6-tesseract-rot', color: '#a855f7' },

      // Transform 3: Ascension Spire
      { id: 'l6-spire', x: 3, y: 0, z: 1, type: 'WALL', transformId: 't-l6-ascension-spire', color: '#ec4899' },

      // Apex Altar & Goal
      { id: 'l6-tier', x: 4, y: 2, z: 1, type: 'WALKABLE', color: '#38bdf8' },
      { id: 'l6-goal', x: 4, y: 2, z: 2, type: 'GOAL', color: '#00ffaa' }
    ],
    transforms: [
      {
        id: 't-l6-skybridge',
        name: 'SKYWAY HINGE [ALPHA]',
        type: 'HINGE_FOLD',
        pivot: { x: 1.5, y: 0.5, z: 0 },
        axis: 'Z',
        direction: 1,
        isTransformed: false,
        angle: 0,
        targetAngle: 0,
        tileMappings: [
          {
            tileId: 'l6-bridge',
            normal: { x: 1, y: 1, z: 0, type: 'WALL' },
            transformed: { x: 2, y: 0, z: 0, type: 'WALKABLE' }
          }
        ]
      },
      {
        id: 't-l6-tesseract-rot',
        name: 'HYPERCUBE ROTATOR [BETA]',
        type: 'CHAMBER_ROTATION',
        pivot: { x: 2, y: 0, z: 0 },
        axis: 'Y',
        direction: 1,
        isTransformed: false,
        angle: 0,
        targetAngle: 0,
        tileMappings: [
          {
            tileId: 'l6-core0',
            normal: { x: 2, y: 0, z: 0, type: 'WALKABLE' },
            transformed: { x: 2, y: 0, z: 0, type: 'WALKABLE' }
          },
          {
            tileId: 'l6-core1',
            normal: { x: 2, y: 0, z: 1, type: 'WALKABLE' },
            transformed: { x: 3, y: 0, z: 0, type: 'WALKABLE' }
          }
        ]
      },
      {
        id: 't-l6-ascension-spire',
        name: 'ASCENSION SPIRE [GAMMA]',
        type: 'HINGE_FOLD',
        pivot: { x: 3.5, y: 1.0, z: 0 },
        axis: 'Z',
        direction: -1,
        isTransformed: false,
        angle: 0,
        targetAngle: 0,
        tileMappings: [
          {
            tileId: 'l6-spire',
            normal: { x: 3, y: 0, z: 1, type: 'WALL' },
            transformed: { x: 4, y: 1, z: 1, type: 'WALKABLE' }
          }
        ]
      }
    ]
  },

  // LEVEL 7: THE HYPERCUBE VOID
  {
    id: 'level-7',
    levelNumber: 7,
    name: 'PUZZLE 07: THE HYPERCUBE VOID',
    subtitle: 'Compound 4D space folding across all three spatial axes.',
    description: 'The pinnacle spatial anomaly. Manipulate orthogonal hinges and a quantum prism rotator to traverse the abyssal void to the grand celestial monolith.',
    spawn: { x: 0, y: 0, z: 0 },
    goal: { x: 5, y: 2, z: 2 },
    monolith: ARCHITECT_GLYPHS[6],
    parMoves: 12,
    tiles: [
      { id: 'l7-s0', x: 0, y: 0, z: 0, type: 'WALKABLE', color: '#38bdf8' },
      { id: 'l7-s1', x: 1, y: 0, z: 0, type: 'WALKABLE', color: '#38bdf8' },

      // Transform 1: Inversion Fold
      { id: 'l7-h1', x: 1, y: 1, z: 0, type: 'WALL', transformId: 't-l7-inversion', color: '#f59e0b' },

      // Central Quantum Core
      { id: 'l7-q0', x: 2, y: 0, z: 0, type: 'WALKABLE', color: '#38bdf8' },

      // Transform 2: Prism Rotator
      { id: 'l7-q1', x: 2, y: 0, z: 1, type: 'WALKABLE', transformId: 't-l7-prism-rot', color: '#a855f7' },

      // Transform 3: Staircase Ramp
      { id: 'l7-stair', x: 3, y: 0, z: 1, type: 'WALL', transformId: 't-l7-staircase', color: '#ec4899' },

      // Transform 4: Zenith Bridge
      { id: 'l7-zenith', x: 4, y: 2, z: 0, type: 'WALL', transformId: 't-l7-zenith-bridge', color: '#06b6d4' },

      // Destination Sanctum
      { id: 'l7-plat', x: 5, y: 1, z: 1, type: 'WALKABLE', color: '#38bdf8' },
      { id: 'l7-goal', x: 5, y: 2, z: 2, type: 'GOAL', color: '#00ffaa' }
    ],
    transforms: [
      {
        id: 't-l7-inversion',
        name: 'INVERSION HINGE [ALPHA]',
        type: 'HINGE_FOLD',
        pivot: { x: 1.5, y: 0.5, z: 0 },
        axis: 'Z',
        direction: 1,
        isTransformed: false,
        angle: 0,
        targetAngle: 0,
        tileMappings: [
          {
            tileId: 'l7-h1',
            normal: { x: 1, y: 1, z: 0, type: 'WALL' },
            transformed: { x: 2, y: 0, z: 0, type: 'WALKABLE' }
          }
        ]
      },
      {
        id: 't-l7-prism-rot',
        name: 'PRISM ROTATOR [BETA]',
        type: 'CHAMBER_ROTATION',
        pivot: { x: 2, y: 0, z: 0 },
        axis: 'Y',
        direction: 1,
        isTransformed: false,
        angle: 0,
        targetAngle: 0,
        tileMappings: [
          {
            tileId: 'l7-q1',
            normal: { x: 2, y: 0, z: 1, type: 'WALKABLE' },
            transformed: { x: 3, y: 0, z: 0, type: 'WALKABLE' }
          }
        ]
      },
      {
        id: 't-l7-staircase',
        name: 'QUANTUM STAIRWAY [GAMMA]',
        type: 'HINGE_FOLD',
        pivot: { x: 3.5, y: 0.5, z: 0 },
        axis: 'Z',
        direction: 1,
        isTransformed: false,
        angle: 0,
        targetAngle: 0,
        tileMappings: [
          {
            tileId: 'l7-stair',
            normal: { x: 3, y: 0, z: 1, type: 'WALL' },
            transformed: { x: 4, y: 1, z: 0, type: 'WALKABLE' }
          }
        ]
      },
      {
        id: 't-l7-zenith-bridge',
        name: 'ZENITH SPRAY [DELTA]',
        type: 'HINGE_FOLD',
        pivot: { x: 4, y: 1.5, z: 0.5 },
        axis: 'X',
        direction: 1,
        isTransformed: false,
        angle: 0,
        targetAngle: 0,
        tileMappings: [
          {
            tileId: 'l7-zenith',
            normal: { x: 4, y: 2, z: 0, type: 'WALL' },
            transformed: { x: 4, y: 1, z: 1, type: 'WALKABLE' }
          }
        ]
      }
    ]
  }
];


