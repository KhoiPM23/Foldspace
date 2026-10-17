export type TileType = 'WALKABLE' | 'VOID' | 'WALL' | 'SWITCH' | 'GOAL';

export interface Position3D {
  x: number;
  y: number;
  z: number;
}

export interface GridTile {
  id: string;
  x: number;
  y: number;
  z: number;
  type: TileType;
  color?: string;
  hingeId?: string; // If part of a folding face
}

export interface HingeDefinition {
  id: string;
  name: string;
  pivot: Position3D;
  axis: 'X' | 'Z';
  folded: boolean;
  angle: number; // 0 (unfolded) to PI/2 (folded 90 deg)
  targetAngle: number;
  affectedTileIds: string[];
}

export interface LevelData {
  id: string;
  name: string;
  description: string;
  spawn: Position3D;
  goal: Position3D;
  tiles: GridTile[];
  hinges: HingeDefinition[];
}

export type PuzzleState = 'IDLE' | 'MOVING' | 'TRANSFORMING' | 'LEVEL_CLEAR';
