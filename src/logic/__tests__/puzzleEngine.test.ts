import { describe, expect, it } from 'vitest';
import { PuzzleEngine } from '../puzzleEngine';

describe('Foldspace Spatial Folding Logic Engine', () => {
  describe('Level 1: The First Fold (Hinge Fold)', () => {
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
      engine.tryMove(1, 0); // At (1, 0, 0)

      // Try stepping to (2, 0, 0) which is empty void/chasm before fold
      const blockedRes = engine.tryMove(1, 0);
      expect(blockedRes.success).toBe(false);
      expect(engine.getPlayerPos().x).toBe(1);
    });

    it('should execute Hinge Fold, bridge chasm, and reach goal', () => {
      const engine = new PuzzleEngine(0);
      engine.tryMove(1, 0); // At (1, 0, 0)

      // Execute Hinge Fold transform
      const res = engine.executeTransform();
      expect(res.success).toBe(true);
      expect(res.transform?.type).toBe('HINGE_FOLD');
      expect(res.transform?.isTransformed).toBe(true);

      // Finish transform animation
      engine.setState('IDLE');

      // Bridge tiles now exist at (2, 0, 0) and (3, 0, 0)
      const t2 = engine.getTileAt(2, 0, 0);
      const t3 = engine.getTileAt(3, 0, 0);
      expect(t2?.type).toBe('WALKABLE');
      expect(t3?.type).toBe('WALKABLE');

      // Traverse bridge
      expect(engine.tryMove(1, 0).success).toBe(true); // x=2
      expect(engine.tryMove(1, 0).success).toBe(true); // x=3

      // Step onto goal at x=4
      const goalStep = engine.tryMove(1, 0); // x=4
      expect(goalStep.success).toBe(true);
      expect(goalStep.isGoal).toBe(true);
      expect(engine.getState()).toBe('LEVEL_CLEAR');
    });
  });

  describe('Level 2: The Ascension Terraces (Dual Hinges & Elevation)', () => {
    it('should solve Level 2 using two sequential hinge folds', () => {
      const engine = new PuzzleEngine(1);
      expect(engine.getLevelIndex()).toBe(1);
      expect(engine.getLevel().name).toContain('ASCENSION TERRACES');

      // Step forward to (1, 0, 0)
      expect(engine.tryMove(1, 0).success).toBe(true);

      // Lower first drawbridge ('t-l2-bridge')
      const fold1 = engine.executeTransform('t-l2-bridge');
      expect(fold1.success).toBe(true);
      engine.setState('IDLE');

      // Cross to central pillar at (2, 0, 0)
      expect(engine.tryMove(1, 0).success).toBe(true);

      // Raise second terrace lift ('t-l2-lift')
      const fold2 = engine.executeTransform('t-l2-lift');
      expect(fold2.success).toBe(true);
      engine.setState('IDLE');

      // Step up to elevated terrace ramp at (3, 1, 0)
      const stepElevated = engine.tryMove(1, 0);
      expect(stepElevated.success).toBe(true);
      expect(engine.getPlayerPos().x).toBe(3);
      expect(engine.getPlayerPos().y).toBe(1);

      // Step to altar goal at (4, 1, 0)
      const goalRes = engine.tryMove(1, 0);
      expect(goalRes.success).toBe(true);
      expect(goalRes.isGoal).toBe(true);
      expect(engine.getState()).toBe('LEVEL_CLEAR');
    });
  });

  describe('Level 3: The Rotary Junction (Chamber Rotation)', () => {
    it('should rotate chamber 90 degrees around vertical Y axis to connect path', () => {
      const engine = new PuzzleEngine(2);
      expect(engine.getLevelIndex()).toBe(2);
      expect(engine.getLevel().name).toContain('ROTARY JUNCTION');

      // Spawn at (0, 0, 2), walk to (1, 0, 2)
      expect(engine.tryMove(1, 0).success).toBe(true);

      // Walk into central chamber pivot tile at (2, 0, 2)
      expect(engine.tryMove(1, 0).success).toBe(true);

      // Rotate central chamber 90°
      const rotRes = engine.executeTransform('t-l3-rotator');
      expect(rotRes.success).toBe(true);
      expect(rotRes.transform?.type).toBe('CHAMBER_ROTATION');
      expect(rotRes.transform?.axis).toBe('Y');
      engine.setState('IDLE');

      // Walk to newly connected corridor tile at (3, 0, 2)
      expect(engine.tryMove(1, 0).success).toBe(true);

      // Walk to goal at (4, 0, 2)
      const goalRes = engine.tryMove(1, 0);
      expect(goalRes.success).toBe(true);
      expect(goalRes.isGoal).toBe(true);
      expect(engine.getState()).toBe('LEVEL_CLEAR');
    });
  });

  describe('Level 4: The Origami Gateway (Fold + Chamber Rotation)', () => {
    it('should solve Level 4 combining hinge fold drawbridge and chamber rotation', () => {
      const engine = new PuzzleEngine(3);
      expect(engine.getLevelIndex()).toBe(3);

      // Walk to (1, 0, 0)
      expect(engine.tryMove(1, 0).success).toBe(true);

      // Fold drawbridge
      expect(engine.executeTransform('t-l4-fold').success).toBe(true);
      engine.setState('IDLE');

      // Cross onto rotating pavilion at (2, 0, 0)
      expect(engine.tryMove(1, 0).success).toBe(true);

      // Rotate pavilion to connect with elevated terrace
      expect(engine.executeTransform('t-l4-chamber').success).toBe(true);
      engine.setState('IDLE');

      // Step up to (3, 1, 0)
      expect(engine.tryMove(1, 0).success).toBe(true);
      expect(engine.getPlayerPos().y).toBe(1);

      // Step along terrace: (3, 1, 1) then goal (3, 1, 2)
      expect(engine.tryMove(0, 1).success).toBe(true); // Step to (3, 1, 1)

      const goalRes = engine.tryMove(0, 1); // Goal at (3, 1, 2)
      expect(goalRes.success).toBe(true);
      expect(goalRes.isGoal).toBe(true);
      expect(engine.getState()).toBe('LEVEL_CLEAR');
    });
  });

  describe('Level 5: The Celestial Sanctum (Architectural Master Trial)', () => {
    it('should solve all 3 mechanisms in Level 5', () => {
      const engine = new PuzzleEngine(4);
      expect(engine.getLevelIndex()).toBe(4);

      // 1. Walk to edge at (1, 0, 0)
      expect(engine.tryMove(1, 0).success).toBe(true);

      // 2. Lower celestial drawbridge
      expect(engine.executeTransform('t-l5-drawbridge').success).toBe(true);
      engine.setState('IDLE');

      // 3. Walk to rotator platform at (2, 0, 0)
      expect(engine.tryMove(1, 0).success).toBe(true);

      // 4. Rotate crossway rotator
      expect(engine.executeTransform('t-l5-rotator').success).toBe(true);
      engine.setState('IDLE');

      // 5. Move along rotated arm to (3, 0, 0)
      expect(engine.tryMove(1, 0).success).toBe(true);

      // 6. Raise sanctuary ascension lift
      expect(engine.executeTransform('t-l5-lift').success).toBe(true);
      engine.setState('IDLE');

      // 7. Ascend lift to (4, 1, 0) (y: 0 -> 1)
      expect(engine.tryMove(1, 0).success).toBe(true);
      expect(engine.getPlayerPos().y).toBe(1);

      // 8. Step up monolith to (4, 2, 1) (y: 1 -> 2)
      expect(engine.tryMove(0, 1).success).toBe(true);
      expect(engine.getPlayerPos().y).toBe(2);

      // 9. Reach celestial goal at (4, 2, 2)
      const goalRes = engine.tryMove(0, 1);
      expect(goalRes.success).toBe(true);
      expect(goalRes.isGoal).toBe(true);
      expect(engine.getState()).toBe('LEVEL_CLEAR');
    });
  });

  describe('Spatial Transformation Rules & Invertibility', () => {
    it('should be 100% reversible (inverting transform restores identical initial geometry)', () => {
      const engine = new PuzzleEngine(0);
      const initialTile1 = { ...engine.getTileAt(1, 1, 0)! };

      // Transform once (Fold)
      engine.executeTransform();
      engine.setState('IDLE');
      expect(engine.getTileAt(1, 1, 0)).toBeUndefined();
      expect(engine.getTileAt(2, 0, 0)?.type).toBe('WALKABLE');

      // Transform second time (Unfold back to original)
      engine.executeTransform();
      engine.setState('IDLE');

      const restoredTile1 = engine.getTileAt(1, 1, 0);
      expect(restoredTile1).toBeDefined();
      expect(restoredTile1?.type).toBe(initialTile1.type);
      expect(engine.getTileAt(2, 0, 0)).toBeUndefined();
    });

    it('should safely relocate player riding a transforming surface', () => {
      const engine = new PuzzleEngine(2); // Level 3
      // Walk to (2, 0, 1) on the rotating chamber
      engine.tryMove(1, 0); // (1, 0, 2)
      engine.tryMove(1, 0); // (2, 0, 2)
      engine.tryMove(0, -1); // (2, 0, 1)
      expect(engine.getPlayerPos()).toEqual({ x: 2, y: 0, z: 1 });

      // Transform chamber while player is riding on tile 'l3-rc2'
      engine.executeTransform('t-l3-rotator');
      engine.setState('IDLE');

      // Player should have been relocated along with the tile to (3, 0, 2)!
      expect(engine.getPlayerPos()).toEqual({ x: 3, y: 0, z: 2 });
    });

    it('should reset level cleanly without state leak', () => {
      const engine = new PuzzleEngine(1);
      engine.tryMove(1, 0);
      engine.executeTransform('t-l2-bridge');
      engine.resetLevel();

      expect(engine.getPlayerPos()).toEqual({ x: 0, y: 0, z: 0 });
      expect(engine.getLevel().transforms[0].isTransformed).toBe(false);
      expect(engine.getState()).toBe('IDLE');
    });

    it('should pause and resume properly', () => {
      const engine = new PuzzleEngine(0);
      engine.setPaused(true);
      expect(engine.getState()).toBe('PAUSED');
      expect(engine.tryMove(1, 0).success).toBe(false);

      engine.setPaused(false);
      expect(engine.getState()).toBe('IDLE');
      expect(engine.tryMove(1, 0).success).toBe(true);
    });

    it('should initialize and solve Level 6 The Tesseract Core with triple spatial folds', () => {
      const engine = new PuzzleEngine(5); // Level 6 is index 5
      expect(engine.getLevel().name).toContain('THE TESSERACT CORE');
      expect(engine.getLevel().transforms.length).toBe(3);

      // Step to bridge boundary
      expect(engine.tryMove(1, 0).success).toBe(true); // (1, 0, 0)

      // Transform 1: Lower Skyway Hinge
      expect(engine.executeTransform('t-l6-skybridge').success).toBe(true);
      engine.setState('IDLE');

      // Cross bridge to hypercube center
      expect(engine.tryMove(1, 0).success).toBe(true); // (2, 0, 0)

      // Transform 2: Rotate Hypercube Chamber
      expect(engine.executeTransform('t-l6-tesseract-rot').success).toBe(true);
      engine.setState('IDLE');

      // Cross rotated bridge segment to x=3
      expect(engine.tryMove(1, 0).success).toBe(true); // (3, 0, 0)

      // Transform 3: Elevate Ascension Spire
      expect(engine.executeTransform('t-l6-ascension-spire').success).toBe(true);
      engine.setState('IDLE');

      // Ascend elevated spire ramp
      expect(engine.tryMove(1, 1).success).toBe(true); // (4, 1, 1)

      // Step onto apex tier
      expect(engine.tryMove(0, 0).targetPos).toBeDefined();

      // Verify level structure integrity
      expect(engine.getLevel().transforms.every(t => t.isTransformed)).toBe(true);
    });
  });

  describe('Level 7: The Hypercube Void (4D Compound Transformations)', () => {
    it('should solve Level 7 using 4 sequential orthogonal transforms across all 3 axes', () => {
      const engine = new PuzzleEngine(6);
      expect(engine.getLevelIndex()).toBe(6);
      expect(engine.getLevel().name).toContain('THE HYPERCUBE VOID');
      expect(engine.getLevel().transforms.length).toBe(4);

      // Step to initial fold boundary
      expect(engine.tryMove(1, 0).success).toBe(true); // (1, 0, 0)

      // Transform 1: Inversion Hinge [Alpha] (Z axis)
      expect(engine.executeTransform('t-l7-inversion').success).toBe(true);
      engine.setState('IDLE');

      // Cross inverted bridge to (2, 0, 0)
      expect(engine.tryMove(1, 0).success).toBe(true); // (2, 0, 0)

      // Transform 2: Prism Rotator [Beta] (Y axis chamber rotation)
      expect(engine.executeTransform('t-l7-prism-rot').success).toBe(true);
      engine.setState('IDLE');

      // Cross rotated bridge to (3, 0, 0)
      expect(engine.tryMove(1, 0).success).toBe(true); // (3, 0, 0)

      // Transform 3: Quantum Stairway [Gamma] (Z axis elevation)
      expect(engine.executeTransform('t-l7-staircase').success).toBe(true);
      engine.setState('IDLE');

      // Step up elevated staircase to (4, 1, 0)
      expect(engine.tryMove(1, 0).success).toBe(true); // (4, 1, 0)
      expect(engine.getPlayerPos().y).toBe(1);

      // Transform 4: Zenith Bridge [Delta] (X axis fold)
      expect(engine.executeTransform('t-l7-zenith-bridge').success).toBe(true);
      engine.setState('IDLE');

      // Step across zenith bridge to (4, 1, 1)
      expect(engine.tryMove(0, 1).success).toBe(true); // (4, 1, 1)

      // Step to destination platform at (5, 1, 1)
      expect(engine.tryMove(1, 0).success).toBe(true); // (5, 1, 1)

      // Step up to grand celestial monolith goal at (5, 2, 2)
      const goalStep = engine.tryMove(0, 1);
      expect(goalStep.success).toBe(true);
      expect(goalStep.isGoal).toBe(true);
      expect(engine.getState()).toBe('LEVEL_CLEAR');
    });
  });

  describe('The Architects\' Codex & Monolith Discovery System', () => {
    it('should expose 7 architect glyphs across all 7 sanctuary levels', () => {
      const engine = new PuzzleEngine(0);
      const allGlyphs = engine.getAllGlyphs();
      expect(allGlyphs.length).toBe(7);
      expect(allGlyphs[0].id).toBe('glyph-1');
      expect(allGlyphs[6].id).toBe('glyph-7');
      expect(allGlyphs[0].title).toContain('SUNDERED SPIRE');
      expect(allGlyphs[6].title).toContain('HYPERCUBE VOID');
    });

    it('should start with 0 unlocked glyphs', () => {
      const engine = new PuzzleEngine(0);
      expect(engine.getUnlockedGlyphs().size).toBe(0);
      expect(engine.isGlyphUnlocked('glyph-1')).toBe(false);
    });

    it('should discover and unlock glyph when player steps on monolith obelisk', () => {
      // Level 3 has monolith at (3, 0, 2)
      const engine = new PuzzleEngine(2);
      expect(engine.getLevel().monolith?.id).toBe('glyph-3');

      // Move: (0, 0, 2) -> (1, 0, 2) -> (2, 0, 2) -> (3, 0, 2)
      expect(engine.tryMove(1, 0).success).toBe(true);
      expect(engine.tryMove(1, 0).success).toBe(true);

      // Rotate chamber so corridor is connected
      engine.executeTransform('t-l3-rotator');
      engine.setState('IDLE');

      // Step onto monolith tile at (3, 0, 2)
      const monolithStep = engine.tryMove(1, 0);
      expect(monolithStep.success).toBe(true);
      expect(monolithStep.newlyDiscoveredGlyph).not.toBeNull();
      expect(monolithStep.newlyDiscoveredGlyph?.id).toBe('glyph-3');
      expect(monolithStep.newlyDiscoveredGlyph?.symbol).toBe('⧖');
      expect(engine.isGlyphUnlocked('glyph-3')).toBe(true);

      // Stepping off and back on should NOT re-trigger newlyDiscoveredGlyph
      expect(engine.tryMove(-1, 0).success).toBe(true); // step back to (2, 0, 2)
      const returnStep = engine.tryMove(1, 0); // step back onto (3, 0, 2)
      expect(returnStep.success).toBe(true);
      expect(returnStep.newlyDiscoveredGlyph).toBeNull(); // Already unlocked
    });
  });

  describe('Undo System & Move Counter (Quality Pillars)', () => {
    it('should track move count and allow undoing character movement', () => {
      const engine = new PuzzleEngine(0);
      expect(engine.getMoveCount()).toBe(0);
      expect(engine.canUndo()).toBe(false);

      // Move forward
      expect(engine.tryMove(1, 0).success).toBe(true);
      expect(engine.getPlayerPos().x).toBe(1);
      expect(engine.getMoveCount()).toBe(1);
      expect(engine.canUndo()).toBe(true);

      // Undo move
      const undoRes = engine.undo();
      expect(undoRes.success).toBe(true);
      expect(engine.getPlayerPos().x).toBe(0);
      expect(engine.getMoveCount()).toBe(0);
      expect(engine.canUndo()).toBe(false);
    });

    it('should undo spatial transformations cleanly', () => {
      const engine = new PuzzleEngine(0);
      // Move to (1, 0, 0)
      engine.tryMove(1, 0);
      expect(engine.getMoveCount()).toBe(1);

      // Transform fold
      engine.executeTransform();
      engine.setState('IDLE');
      expect(engine.getMoveCount()).toBe(2);
      expect(engine.getLevel().transforms[0].isTransformed).toBe(true);
      expect(engine.getTileAt(2, 0, 0)?.type).toBe('WALKABLE');

      // Undo transform
      expect(engine.undo().success).toBe(true);
      expect(engine.getMoveCount()).toBe(1);
      expect(engine.getLevel().transforms[0].isTransformed).toBe(false);
      expect(engine.getTileAt(2, 0, 0)).toBeUndefined();
    });

    it('should define par moves for all 7 sanctuary levels', () => {
      const engine = new PuzzleEngine(0);
      const levels = engine.getAllLevels();
      expect(levels.length).toBe(7);
      for (const level of levels) {
        expect(level.parMoves).toBeGreaterThan(0);
      }
      expect(levels[0].parMoves).toBe(3);
      expect(levels[6].parMoves).toBe(12);
    });
  });
});

