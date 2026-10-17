import { LevelData } from './types';

export const LEVELS: LevelData[] = [
  {
    id: 'level-1',
    name: 'PUZZLE 01: THE HINGE BRIDGE',
    description: 'A chasm divides the sanctuary. Press [SPACE] or Click FOLD to rotate the vertical wall 90° into a traversable bridge.',
    spawn: { x: 0, y: 0, z: 0 },
    goal: { x: 4, y: 0, z: 0 },
    tiles: [
      // Starting platform
      { id: 't-0', x: 0, y: 0, z: 0, type: 'WALKABLE', color: '#38bdf8' },
      { id: 't-1', x: 1, y: 0, z: 0, type: 'WALKABLE', color: '#38bdf8' },

      // Hinged bridge tiles (starts vertical at y=1 and y=2, folds down to y=0 at x=2, x=3)
      { id: 'hb-1', x: 1, y: 1, z: 0, type: 'WALL', hingeId: 'hinge-1', color: '#f59e0b' },
      { id: 'hb-2', x: 1, y: 2, z: 0, type: 'WALL', hingeId: 'hinge-1', color: '#f59e0b' },

      // Destination platform
      { id: 't-3', x: 3, y: 0, z: 0, type: 'WALKABLE', color: '#38bdf8' },
      { id: 't-4', x: 4, y: 0, z: 0, type: 'GOAL', color: '#00ffaa' }
    ],
    hinges: [
      {
        id: 'hinge-1',
        name: 'BRIDGE HINGE [ALPHA]',
        pivot: { x: 1.5, y: 0.5, z: 0 },
        axis: 'Z',
        folded: false,
        angle: 0,
        targetAngle: 0,
        affectedTileIds: ['hb-1', 'hb-2']
      }
    ]
  },
  {
    id: 'level-2',
    name: 'PUZZLE 02: ASCENSION FOLD',
    description: 'The monolith rests on an elevated ridge. Fold the cliff face to bridge the lower terrace to the upper shrine.',
    spawn: { x: 0, y: 0, z: 0 },
    goal: { x: 2, y: 1, z: 2 },
    tiles: [
      { id: 'l2-0', x: 0, y: 0, z: 0, type: 'WALKABLE', color: '#38bdf8' },
      { id: 'l2-1', x: 1, y: 0, z: 0, type: 'WALKABLE', color: '#38bdf8' },
      { id: 'l2-2', x: 1, y: 0, z: 1, type: 'WALKABLE', color: '#38bdf8' },

      // Hinged ramp segment
      { id: 'l2-h1', x: 1, y: 0, z: 2, type: 'WALL', hingeId: 'hinge-elevate', color: '#f59e0b' },

      // High terrace
      { id: 'l2-3', x: 2, y: 1, z: 2, type: 'GOAL', color: '#00ffaa' }
    ],
    hinges: [
      {
        id: 'hinge-elevate',
        name: 'TERRACE LIFT',
        pivot: { x: 1, y: 0, z: 1.5 },
        axis: 'X',
        folded: false,
        angle: 0,
        targetAngle: 0,
        affectedTileIds: ['l2-h1']
      }
    ]
  },
  {
    id: 'level-3',
    name: 'PUZZLE 03: DUAL ORTHOGONAL HINGE',
    description: 'Two interlocking geometric folds. Fold the transverse walkway first, then lower the exit gate.',
    spawn: { x: 0, y: 0, z: 0 },
    goal: { x: 3, y: 0, z: 3 },
    tiles: [
      { id: 'l3-0', x: 0, y: 0, z: 0, type: 'WALKABLE', color: '#38bdf8' },
      { id: 'l3-1', x: 1, y: 0, z: 0, type: 'WALKABLE', color: '#38bdf8' },

      // Hinge 1 tiles
      { id: 'l3-h1a', x: 1, y: 1, z: 0, type: 'WALL', hingeId: 'hinge-3a', color: '#f59e0b' },
      { id: 'l3-h1b', x: 1, y: 2, z: 0, type: 'WALL', hingeId: 'hinge-3a', color: '#f59e0b' },

      // Middle junction
      { id: 'l3-mid', x: 2, y: 0, z: 1, type: 'WALKABLE', color: '#38bdf8' },

      // Hinge 2 tiles
      { id: 'l3-h2a', x: 2, y: 0, z: 2, type: 'WALL', hingeId: 'hinge-3b', color: '#a855f7' },

      // Monolith goal
      { id: 'l3-goal', x: 3, y: 0, z: 3, type: 'GOAL', color: '#00ffaa' }
    ],
    hinges: [
      {
        id: 'hinge-3a',
        name: 'TRANSVERSE HINGE',
        pivot: { x: 1.5, y: 0.5, z: 0 },
        axis: 'Z',
        folded: false,
        angle: 0,
        targetAngle: 0,
        affectedTileIds: ['l3-h1a', 'l3-h1b']
      },
      {
        id: 'hinge-3b',
        name: 'SANCTUARY GATE',
        pivot: { x: 2.5, y: 0, z: 2.5 },
        axis: 'X',
        folded: false,
        angle: 0,
        targetAngle: 0,
        affectedTileIds: ['l3-h2a']
      }
    ]
  }
];
