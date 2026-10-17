import { describe, expect, it } from 'vitest';
import { PuzzleEngine } from '../puzzleEngine';

describe('Foldspace Spatial Folding Logic Engine', () => {
  it('should initialize player at Level 1 spawn', () => {
    const engine = new PuzzleEngine(0);
    const pos = engine.getPlayerPos();
    const level = engine.getLevel();

    expect(pos.x).toBe(level.spawn.x);
    expect(pos.y).toBe(level.spawn.y);
    expect(pos.z).toBe(level.spawn.z);
    expect(engine.getState()).toBe('IDLE');
  });

  it('should allow valid step on connected walkable tile', () => {
    const engine = new PuzzleEngine(0);
    // Move from (0, 0, 0) to (1, 0, 0)
    const res = engine.tryMove(1, 0);

    expect(res.success).toBe(true);
    expect(res.isGoal).toBe(false);
    expect(engine.getPlayerPos().x).toBe(1);
  });

  it('should block movement across chasm when hinge is unfolded', () => {
    const engine = new PuzzleEngine(0);
    // Step to (1, 0, 0)
    engine.tryMove(1, 0);

    // Try stepping to (2, 0, 0) which is empty chasm before fold
    const blockedRes = engine.tryMove(1, 0);
    expect(blockedRes.success).toBe(false);
    expect(engine.getPlayerPos().x).toBe(1);
  });

  it('should fold hinge, connect bridge, and allow reaching goal', () => {
    const engine = new PuzzleEngine(0);
    // Step to (1, 0, 0)
    engine.tryMove(1, 0);

    // Fold the bridge hinge
    const foldRes = engine.toggleHinge();
    expect(foldRes.success).toBe(true);
    expect(foldRes.hinge?.folded).toBe(true);

    // Simulate completion of transform
    engine.setState('IDLE');

    // Bridge tiles should now exist at x=2 and x=3
    const tile2 = engine.getTileAt(2, 0, 0);
    const tile3 = engine.getTileAt(3, 0, 0);
    expect(tile2?.type).toBe('WALKABLE');
    expect(tile3?.type).toBe('WALKABLE');

    // Walk across bridge
    const step2 = engine.tryMove(1, 0); // To x=2
    expect(step2.success).toBe(true);

    const step3 = engine.tryMove(1, 0); // To x=3
    expect(step3.success).toBe(true);

    // Step onto Goal at x=4
    const goalStep = engine.tryMove(1, 0); // To x=4
    expect(goalStep.success).toBe(true);
    expect(goalStep.isGoal).toBe(true);
    expect(engine.getState()).toBe('LEVEL_CLEAR');
  });

  it('should load next level cleanly', () => {
    const engine = new PuzzleEngine(0);
    const advanced = engine.nextLevel();

    expect(advanced).toBe(true);
    expect(engine.getLevelIndex()).toBe(1);
    expect(engine.getLevel().id).toBe('level-2');
  });
});
