import { LEVELS } from './levels';
import { HingeDefinition, LevelData, Position3D, PuzzleState } from './types';

export class PuzzleEngine {
  private currentLevelIndex = 0;
  private currentLevel: LevelData;
  private playerPos: Position3D;
  private puzzleState: PuzzleState = 'IDLE';

  constructor(initialLevelIndex = 0) {
    this.currentLevelIndex = initialLevelIndex;
    this.currentLevel = JSON.parse(JSON.stringify(LEVELS[this.currentLevelIndex]));
    this.playerPos = { ...this.currentLevel.spawn };
  }

  public getLevel(): Readonly<LevelData> {
    return this.currentLevel;
  }

  public getLevelIndex(): number {
    return this.currentLevelIndex;
  }

  public getTotalLevels(): number {
    return LEVELS.length;
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

  public canMoveTo(target: Position3D): boolean {
    if (this.puzzleState !== 'IDLE') return false;

    // Check if tile exists at target position
    const tile = this.getTileAt(target.x, target.y, target.z);
    if (!tile) return false;

    return tile.type === 'WALKABLE' || tile.type === 'GOAL';
  }

  public tryMove(dx: number, dz: number): { success: boolean; isGoal: boolean; targetPos: Position3D } {
    if (this.puzzleState !== 'IDLE') {
      return { success: false, isGoal: false, targetPos: { ...this.playerPos } };
    }

    const target: Position3D = {
      x: this.playerPos.x + dx,
      y: this.playerPos.y, // Primary plane movement
      z: this.playerPos.z + dz
    };

    // Also check step-up or step-down tile at target x/z
    let validTile = this.getTileAt(target.x, target.y, target.z);
    if (!validTile || validTile.type === 'WALL' || validTile.type === 'VOID') {
      // Check if there is an elevated tile (step up +1)
      const upTile = this.getTileAt(target.x, target.y + 1, target.z);
      if (upTile && (upTile.type === 'WALKABLE' || upTile.type === 'GOAL')) {
        target.y += 1;
        validTile = upTile;
      } else {
        // Check if there is a lowered tile (step down -1)
        const downTile = this.getTileAt(target.x, target.y - 1, target.z);
        if (downTile && (downTile.type === 'WALKABLE' || downTile.type === 'GOAL')) {
          target.y -= 1;
          validTile = downTile;
        }
      }
    }

    if (validTile && (validTile.type === 'WALKABLE' || validTile.type === 'GOAL')) {
      this.playerPos = { ...target };
      const isGoal = validTile.type === 'GOAL';
      if (isGoal) {
        this.puzzleState = 'LEVEL_CLEAR';
      }
      return { success: true, isGoal, targetPos: { ...target } };
    }

    return { success: false, isGoal: false, targetPos: { ...this.playerPos } };
  }

  public toggleHinge(hingeId?: string): { success: boolean; hinge: HingeDefinition | null } {
    if (this.puzzleState !== 'IDLE') return { success: false, hinge: null };

    const hinges = this.currentLevel.hinges;
    if (hinges.length === 0) return { success: false, hinge: null };

    const hinge = hingeId ? hinges.find(h => h.id === hingeId) : hinges[0];
    if (!hinge) return { success: false, hinge: null };

    // Toggle folded state
    hinge.folded = !hinge.folded;
    hinge.targetAngle = hinge.folded ? Math.PI / 2 : 0;
    this.puzzleState = 'TRANSFORMING';

    // Apply topological updates to affected tiles
    this.updateHingeTopology(hinge);

    return { success: true, hinge };
  }

  private updateHingeTopology(hinge: HingeDefinition): void {
    if (this.currentLevel.id === 'level-1' && hinge.id === 'hinge-1') {
      const hb1 = this.currentLevel.tiles.find(t => t.id === 'hb-1');
      const hb2 = this.currentLevel.tiles.find(t => t.id === 'hb-2');

      if (hinge.folded) {
        // Folds down into bridge: (2, 0, 0) and (3, 0, 0)
        if (hb1) { hb1.x = 2; hb1.y = 0; hb1.z = 0; hb1.type = 'WALKABLE'; }
        if (hb2) { hb2.x = 3; hb2.y = 0; hb2.z = 0; hb2.type = 'WALKABLE'; }
      } else {
        // Folds back up into vertical wall
        if (hb1) { hb1.x = 1; hb1.y = 1; hb1.z = 0; hb1.type = 'WALL'; }
        if (hb2) { hb2.x = 1; hb2.y = 2; hb2.z = 0; hb2.type = 'WALL'; }
      }
    } else if (this.currentLevel.id === 'level-2' && hinge.id === 'hinge-elevate') {
      const h1 = this.currentLevel.tiles.find(t => t.id === 'l2-h1');
      if (hinge.folded) {
        // Bridges to terrace
        if (h1) { h1.x = 2; h1.y = 0; h1.z = 2; h1.type = 'WALKABLE'; }
      } else {
        if (h1) { h1.x = 1; h1.y = 0; h1.z = 2; h1.type = 'WALL'; }
      }
    } else if (this.currentLevel.id === 'level-3') {
      if (hinge.id === 'hinge-3a') {
        const h1a = this.currentLevel.tiles.find(t => t.id === 'l3-h1a');
        const h1b = this.currentLevel.tiles.find(t => t.id === 'l3-h1b');
        if (hinge.folded) {
          if (h1a) { h1a.x = 2; h1a.y = 0; h1a.z = 0; h1a.type = 'WALKABLE'; }
          if (h1b) { h1b.x = 2; h1b.y = 0; h1b.z = 1; h1b.type = 'WALKABLE'; }
        } else {
          if (h1a) { h1a.x = 1; h1a.y = 1; h1a.z = 0; h1a.type = 'WALL'; }
          if (h1b) { h1b.x = 1; h1b.y = 2; h1b.z = 0; h1b.type = 'WALL'; }
        }
      } else if (hinge.id === 'hinge-3b') {
        const h2a = this.currentLevel.tiles.find(t => t.id === 'l3-h2a');
        if (hinge.folded) {
          if (h2a) { h2a.x = 3; h2a.y = 0; h2a.z = 2; h2a.type = 'WALKABLE'; }
        } else {
          if (h2a) { h2a.x = 2; h2a.y = 0; h2a.z = 2; h2a.type = 'WALL'; }
        }
      }
    }
  }

  public getTileAt(x: number, y: number, z: number) {
    return this.currentLevel.tiles.find(t => t.x === x && t.y === y && t.z === z);
  }

  public loadLevel(idx: number): void {
    if (idx < 0 || idx >= LEVELS.length) return;
    this.currentLevelIndex = idx;
    this.currentLevel = JSON.parse(JSON.stringify(LEVELS[this.currentLevelIndex]));
    this.playerPos = { ...this.currentLevel.spawn };
    this.puzzleState = 'IDLE';
  }

  public nextLevel(): boolean {
    if (this.currentLevelIndex < LEVELS.length - 1) {
      this.loadLevel(this.currentLevelIndex + 1);
      return true;
    }
    return false;
  }

  public resetLevel(): void {
    this.loadLevel(this.currentLevelIndex);
  }
}
