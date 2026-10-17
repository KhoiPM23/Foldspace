import { LevelData } from './types';

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
  }
];

