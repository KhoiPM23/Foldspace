export type TileType = 'WALKABLE' | 'VOID' | 'WALL' | 'GOAL';

export interface Position3D {
  x: number;
  y: number;
  z: number;
}

export type TransformType = 'HINGE_FOLD' | 'CHAMBER_ROTATION';

export interface TileStateMap {
  tileId: string;
  normal: { x: number; y: number; z: number; type: TileType };
  transformed: { x: number; y: number; z: number; type: TileType };
}

export interface SpatialTransform {
  id: string;
  name: string;
  type: TransformType;
  pivot: Position3D;
  axis: 'X' | 'Y' | 'Z';
  direction: 1 | -1;
  isTransformed: boolean;
  angle: number;
  targetAngle: number;
  tileMappings: TileStateMap[];
}

export interface GridTile {
  id: string;
  x: number;
  y: number;
  z: number;
  type: TileType;
  color?: string;
  transformId?: string;
}

export interface ArchitectGlyph {
  id: string;
  levelNumber: number;
  symbol: string;
  title: string;
  coordinates: string;
  epoch: string;
  inscription: string;
  philosophicalNote: string;
  tilePos: Position3D;
}

export interface LevelData {
  id: string;
  levelNumber: number;
  name: string;
  subtitle: string;
  description: string;
  spawn: Position3D;
  goal: Position3D;
  tiles: GridTile[];
  transforms: SpatialTransform[];
  monolith?: ArchitectGlyph;
  parMoves: number;
}

export type PuzzleState = 'IDLE' | 'MOVING' | 'TRANSFORMING' | 'LEVEL_CLEAR' | 'PAUSED';

