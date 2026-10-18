import { ARCHITECT_GLYPHS, FOLDSPACE_LEVELS } from './levels';
import { ArchitectGlyph, GridTile, LevelData, Position3D, PuzzleState, SpatialTransform } from './types';

export interface HistorySnapshot {
  playerPos: Position3D;
  tiles: GridTile[];
  transforms: SpatialTransform[];
  moveCount: number;
}

export class PuzzleEngine {
  private currentLevelIndex = 0;
  private currentLevel: LevelData;
  private playerPos: Position3D;
  private puzzleState: PuzzleState = 'IDLE';
  private unlockedGlyphs: Set<string> = new Set();
  private moveCount = 0;
  private history: HistorySnapshot[] = [];

  constructor(initialLevelIndex = 0) {
    this.currentLevelIndex = Math.max(0, Math.min(FOLDSPACE_LEVELS.length - 1, initialLevelIndex));
    this.currentLevel = JSON.parse(JSON.stringify(FOLDSPACE_LEVELS[this.currentLevelIndex]));
    this.playerPos = { ...this.currentLevel.spawn };
  }

  public getLevel(): Readonly<LevelData> {
    return this.currentLevel;
  }

  public getAllLevels(): readonly LevelData[] {
    return FOLDSPACE_LEVELS;
  }

  public getLevelIndex(): number {
    return this.currentLevelIndex;
  }

  public getTotalLevels(): number {
    return FOLDSPACE_LEVELS.length;
  }

  public getPlayerPos(): Readonly<Position3D> {
    return this.playerPos;
  }

  public getState(): PuzzleState {
    return this.puzzleState;
  }

  public setState(s: PuzzleState): void {
    this.puzzleState = s;
  }

  public setPaused(paused: boolean): void {
    if (paused && this.puzzleState !== 'TRANSFORMING' && this.puzzleState !== 'LEVEL_CLEAR') {
      this.puzzleState = 'PAUSED';
    } else if (!paused && this.puzzleState === 'PAUSED') {
      this.puzzleState = 'IDLE';
    }
  }

  public canMoveTo(target: Position3D): boolean {
    if (this.puzzleState !== 'IDLE') return false;
    const tile = this.getTileAt(target.x, target.y, target.z);
    if (!tile) return false;
    return tile.type === 'WALKABLE' || tile.type === 'GOAL';
  }

  public getUnlockedGlyphs(): Set<string> {
    return this.unlockedGlyphs;
  }

  public isGlyphUnlocked(glyphId: string): boolean {
    return this.unlockedGlyphs.has(glyphId);
  }

  public getAllGlyphs(): ArchitectGlyph[] {
    return ARCHITECT_GLYPHS;
  }

  public tryMove(dx: number, dz: number): {
    success: boolean;
    isGoal: boolean;
    targetPos: Position3D;
    newlyDiscoveredGlyph: ArchitectGlyph | null;
  } {
    if (this.puzzleState !== 'IDLE') {
      return { success: false, isGoal: false, targetPos: { ...this.playerPos }, newlyDiscoveredGlyph: null };
    }

    const target: Position3D = {
      x: this.playerPos.x + dx,
      y: this.playerPos.y,
      z: this.playerPos.z + dz
    };

    // Check same elevation
    let validTile = this.getTileAt(target.x, target.y, target.z);
    if (!validTile || validTile.type === 'WALL' || validTile.type === 'VOID') {
      // Check step up (+1 y)
      const upTile = this.getTileAt(target.x, target.y + 1, target.z);
      if (upTile && (upTile.type === 'WALKABLE' || upTile.type === 'GOAL')) {
        target.y += 1;
        validTile = upTile;
      } else {
        // Check step down (-1 y)
        const downTile = this.getTileAt(target.x, target.y - 1, target.z);
        if (downTile && (downTile.type === 'WALKABLE' || downTile.type === 'GOAL')) {
          target.y -= 1;
          validTile = downTile;
        }
      }
    }

    if (validTile && (validTile.type === 'WALKABLE' || validTile.type === 'GOAL')) {
      // Record undo snapshot
      this.history.push({
        playerPos: { ...this.playerPos },
        tiles: JSON.parse(JSON.stringify(this.currentLevel.tiles)),
        transforms: JSON.parse(JSON.stringify(this.currentLevel.transforms)),
        moveCount: this.moveCount
      });
      this.moveCount++;

      this.playerPos = { ...target };
      const isGoal = validTile.type === 'GOAL';
      if (isGoal) {
        this.puzzleState = 'LEVEL_CLEAR';
      }

      // Check if stepped onto Architect Monolith
      let newlyDiscoveredGlyph: ArchitectGlyph | null = null;
      const m = this.currentLevel.monolith;
      if (m && m.tilePos.x === target.x && m.tilePos.y === target.y && m.tilePos.z === target.z) {
        if (!this.unlockedGlyphs.has(m.id)) {
          this.unlockedGlyphs.add(m.id);
          newlyDiscoveredGlyph = m;
        }
      }

      return { success: true, isGoal, targetPos: { ...target }, newlyDiscoveredGlyph };
    }

    return { success: false, isGoal: false, targetPos: { ...this.playerPos }, newlyDiscoveredGlyph: null };
  }

  public executeTransform(transformId?: string): { success: boolean; transform: SpatialTransform | null; reason?: string } {
    if (this.puzzleState !== 'IDLE') {
      return { success: false, transform: null, reason: 'System busy' };
    }

    const transforms = this.currentLevel.transforms;
    if (transforms.length === 0) {
      return { success: false, transform: null, reason: 'No transforms available' };
    }

    // Default to first transform or match by ID
    const transform = transformId
      ? transforms.find(t => t.id === transformId)
      : transforms.find(t => !t.isTransformed) || transforms[0];

    if (!transform) {
      return { success: false, transform: null, reason: 'Transform not found' };
    }

    const nextState = !transform.isTransformed;

    // Check collision / player safety:
    // If player is on an affected tile, calculate where they will land
    let newPlayerPos: Position3D | null = null;
    for (const mapping of transform.tileMappings) {
      const fromPos = transform.isTransformed ? mapping.transformed : mapping.normal;
      const toPos = transform.isTransformed ? mapping.normal : mapping.transformed;

      if (this.playerPos.x === fromPos.x && this.playerPos.y === fromPos.y && this.playerPos.z === fromPos.z) {
        newPlayerPos = { x: toPos.x, y: toPos.y, z: toPos.z };
        break;
      }
    }

    // Record undo snapshot before transforming
    this.history.push({
      playerPos: { ...this.playerPos },
      tiles: JSON.parse(JSON.stringify(this.currentLevel.tiles)),
      transforms: JSON.parse(JSON.stringify(this.currentLevel.transforms)),
      moveCount: this.moveCount
    });
    this.moveCount++;

    // Apply the spatial transformation to all affected tiles
    transform.isTransformed = nextState;
    transform.targetAngle = nextState ? (Math.PI / 2) * transform.direction : 0;
    this.puzzleState = 'TRANSFORMING';

    for (const mapping of transform.tileMappings) {
      const tile = this.currentLevel.tiles.find(t => t.id === mapping.tileId);
      if (tile) {
        const dest = nextState ? mapping.transformed : mapping.normal;
        tile.x = dest.x;
        tile.y = dest.y;
        tile.z = dest.z;
        tile.type = dest.type;
      }
    }

    // Relocate player safely if they were riding the transformed surface
    if (newPlayerPos) {
      this.playerPos = { ...newPlayerPos };
    }

    return { success: true, transform };
  }

  public getMoveCount(): number {
    return this.moveCount;
  }

  public canUndo(): boolean {
    return this.history.length > 0 && this.puzzleState === 'IDLE';
  }

  public undo(): { success: boolean; playerPos: Position3D } {
    if (!this.canUndo()) {
      return { success: false, playerPos: { ...this.playerPos } };
    }

    const snap = this.history.pop();
    if (!snap) {
      return { success: false, playerPos: { ...this.playerPos } };
    }

    this.playerPos = { ...snap.playerPos };
    this.currentLevel.tiles = JSON.parse(JSON.stringify(snap.tiles));
    this.currentLevel.transforms = JSON.parse(JSON.stringify(snap.transforms));
    this.moveCount = snap.moveCount;
    this.puzzleState = 'IDLE';

    return { success: true, playerPos: { ...this.playerPos } };
  }

  public getTileAt(x: number, y: number, z: number) {
    return this.currentLevel.tiles.find(t => t.x === x && t.y === y && t.z === z);
  }

  public loadLevel(idx: number): void {
    if (idx < 0 || idx >= FOLDSPACE_LEVELS.length) return;
    this.currentLevelIndex = idx;
    this.currentLevel = JSON.parse(JSON.stringify(FOLDSPACE_LEVELS[this.currentLevelIndex]));
    this.playerPos = { ...this.currentLevel.spawn };
    this.moveCount = 0;
    this.history = [];
    this.puzzleState = 'IDLE';
  }

  public nextLevel(): boolean {
    if (this.currentLevelIndex < FOLDSPACE_LEVELS.length - 1) {
      this.loadLevel(this.currentLevelIndex + 1);
      return true;
    }
    return false;
  }

  public resetLevel(): void {
    this.loadLevel(this.currentLevelIndex);
  }
}
