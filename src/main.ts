import { foldAudio } from './audio/foldAudio';
import { PuzzleEngine } from './logic/puzzleEngine';
import { ArchitectGlyph } from './logic/types';
import { SceneView } from './renderer/sceneView';

// DOM Elements
const threeContainer = document.getElementById('threeContainer') as HTMLElement;
const levelBadge = document.getElementById('levelBadge') as HTMLElement;
const levelTitle = document.getElementById('levelTitle') as HTMLElement;
const levelDesc = document.getElementById('levelDesc') as HTMLElement;
const transformActionsHud = document.getElementById('transformActionsHud') as HTMLElement;

const btnPause = document.getElementById('btnPause') as HTMLButtonElement;
const pauseLabel = document.getElementById('pauseLabel') as HTMLElement;
const modalPause = document.getElementById('modalPause') as HTMLElement;
const btnResumeGame = document.getElementById('btnResumeGame') as HTMLButtonElement;

const btnRotateLeft = document.getElementById('btnRotateLeft') as HTMLButtonElement;
const btnRotateRight = document.getElementById('btnRotateRight') as HTMLButtonElement;
const btnReset = document.getElementById('btnReset') as HTMLButtonElement;
const btnMute = document.getElementById('btnMute') as HTMLButtonElement;
const muteLabel = document.getElementById('muteLabel') as HTMLElement;
const btnLevelsMenu = document.getElementById('btnLevelsMenu') as HTMLButtonElement;

const btnCodex = document.getElementById('btnCodex') as HTMLButtonElement;
const modalGlyphCodex = document.getElementById('modalGlyphCodex') as HTMLElement;
const btnCloseCodex = document.getElementById('btnCloseCodex') as HTMLButtonElement;
const codexProgressBadge = document.getElementById('codexProgressBadge') as HTMLElement;
const codexListContainer = document.getElementById('codexListContainer') as HTMLElement;

const modalGlyphDiscovery = document.getElementById('modalGlyphDiscovery') as HTMLElement;
const btnCloseGlyphDiscovery = document.getElementById('btnCloseGlyphDiscovery') as HTMLButtonElement;
const glyphDiscoverySymbol = document.getElementById('glyphDiscoverySymbol') as HTMLElement;
const glyphDiscoveryTitle = document.getElementById('glyphDiscoveryTitle') as HTMLElement;
const glyphDiscoveryMeta = document.getElementById('glyphDiscoveryMeta') as HTMLElement;
const glyphDiscoveryInscription = document.getElementById('glyphDiscoveryInscription') as HTMLElement;
const glyphDiscoveryNote = document.getElementById('glyphDiscoveryNote') as HTMLElement;

const btnUndo = document.getElementById('btnUndo') as HTMLButtonElement;
const curMoves = document.getElementById('curMoves') as HTMLElement;
const parMoves = document.getElementById('parMoves') as HTMLElement;

const winTitle = document.getElementById('winTitle') as HTMLElement;
const winStars = document.getElementById('winStars') as HTMLElement;
const winMoves = document.getElementById('winMoves') as HTMLElement;
const winPar = document.getElementById('winPar') as HTMLElement;
const winRatingText = document.getElementById('winRatingText') as HTMLElement;

const modalTitle = document.getElementById('modalTitle') as HTMLElement;
const btnStartGame = document.getElementById('btnStartGame') as HTMLButtonElement;
const modalWin = document.getElementById('modalWin') as HTMLElement;
const btnNextLevel = document.getElementById('btnNextLevel') as HTMLButtonElement;
const modalAllComplete = document.getElementById('modalAllComplete') as HTMLElement;
const btnReplayAll = document.getElementById('btnReplayAll') as HTMLButtonElement;

// Systems
const engine = new PuzzleEngine(0);
const sceneView = new SceneView(threeContainer);

function updateTransformButtons(): void {
  transformActionsHud.innerHTML = '';
  const level = engine.getLevel();

  if (level.transforms.length === 0) return;

  level.transforms.forEach((tr, idx) => {
    const btn = document.createElement('button');
    btn.className = `btn btn-transform ${tr.isTransformed ? 'active' : ''}`;
    btn.style.padding = '8px 18px';
    btn.style.fontSize = '12px';

    const actionType = tr.type === 'HINGE_FOLD' ? 'FOLD' : 'ROTATE';
    const statusText = tr.isTransformed ? 'REVERT' : actionType;
    btn.innerHTML = `<span>${tr.name}: ${statusText}</span> <span class="key-badge">[${idx + 1}${idx === 0 ? ' / SPACE' : ''}]</span>`;

    btn.addEventListener('mouseenter', () => sceneView.highlightTransformTiles(tr.id));
    btn.addEventListener('mouseleave', () => sceneView.highlightTransformTiles(null));
    btn.addEventListener('focus', () => sceneView.highlightTransformTiles(tr.id));
    btn.addEventListener('blur', () => sceneView.highlightTransformTiles(null));

    btn.addEventListener('click', () => {
      handleExecuteTransform(tr.id);
    });

    transformActionsHud.appendChild(btn);
  });
}

function syncLevelUI(): void {
  const level = engine.getLevel();
  const currentIdx = engine.getLevelIndex();

  levelBadge.textContent = `PUZZLE ${currentIdx + 1} / ${engine.getTotalLevels()}`;
  levelTitle.textContent = level.name;
  levelDesc.textContent = level.description;

  curMoves.textContent = String(engine.getMoveCount());
  parMoves.textContent = String(level.parMoves);
  btnUndo.style.opacity = engine.canUndo() ? '1' : '0.5';

  // Highlight level selector items
  document.querySelectorAll('.btn-level-item').forEach(el => {
    const lvl = parseInt(el.getAttribute('data-level') || '0', 10);
    if (lvl === currentIdx) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  });

  updateTransformButtons();
  sceneView.rebuildLevel(engine);
}

function handleUndo(): void {
  const result = engine.undo();
  if (result.success) {
    foldAudio.playStep();
    sceneView.rebuildLevel(engine);
    sceneView.animatePlayerMove(result.playerPos);
    updateTransformButtons();
    syncLevelUI();
  }
}

function handleMove(dx: number, dz: number): void {
  const result = engine.tryMove(dx, dz);
  if (result.success) {
    foldAudio.playStep();
    sceneView.animatePlayerMove(result.targetPos);
    syncLevelUI();

    if (result.newlyDiscoveredGlyph) {
      foldAudio.playGlyphChime();
      sceneView.updateMonolithUnlocked(true);
      showGlyphModal(result.newlyDiscoveredGlyph);
    }

    if (result.isGoal) {
      foldAudio.playLevelClear();
      const moves = engine.getMoveCount();
      const par = engine.getLevel().parMoves;
      winTitle.textContent = `${engine.getLevel().name} SOLVED`;
      winMoves.textContent = String(moves);
      winPar.textContent = String(par);
      if (moves <= par) {
        winStars.textContent = '★★★';
        winRatingText.textContent = 'PERFECT (MASTER)';
        winRatingText.style.color = '#ffd700';
      } else if (moves <= par + 2) {
        winStars.textContent = '★★☆';
        winRatingText.textContent = 'EXCELLENT';
        winRatingText.style.color = '#00ffaa';
      } else {
        winStars.textContent = '★☆☆';
        winRatingText.textContent = 'SOLVED';
        winRatingText.style.color = '#38bdf8';
      }

      sceneView.animatePortalArrival(() => {
        if (engine.getLevelIndex() < engine.getTotalLevels() - 1) {
          modalWin.classList.remove('hidden');
        } else {
          modalAllComplete.classList.remove('hidden');
        }
      });
    }
  } else {
    foldAudio.playBlocked();
  }
}

function handleExecuteTransform(transformId?: string): void {
  const result = engine.executeTransform(transformId);
  if (result.success && result.transform) {
    if (result.transform.type === 'HINGE_FOLD') {
      foldAudio.playFold();
    } else {
      foldAudio.playChamberRotate();
    }

    sceneView.startTransformTween(result.transform, () => {
      engine.setState('IDLE');
      // Relocate player smoothly if they rode the transforming surface
      sceneView.animatePlayerMove(engine.getPlayerPos());
      sceneView.updateGhostPreviews(engine);
      updateTransformButtons();
      syncLevelUI();
    });
  } else {
    foldAudio.playBlocked();
  }
}

function handleResetLevel(): void {
  engine.resetLevel();
  modalWin.classList.add('hidden');
  modalAllComplete.classList.add('hidden');
  modalPause.classList.add('hidden');
  modalGlyphDiscovery.classList.add('hidden');
  modalGlyphCodex.classList.add('hidden');
  syncLevelUI();
}

function showGlyphModal(glyph: ArchitectGlyph): void {
  glyphDiscoverySymbol.textContent = glyph.symbol;
  glyphDiscoveryTitle.textContent = glyph.title;
  glyphDiscoveryMeta.textContent = `EPOCH: ${glyph.epoch} // COORD: ${glyph.coordinates}`;
  glyphDiscoveryInscription.textContent = `"${glyph.inscription}"`;
  glyphDiscoveryNote.textContent = `— ${glyph.philosophicalNote}`;
  modalGlyphDiscovery.classList.remove('hidden');
}

function hideGlyphModal(): void {
  modalGlyphDiscovery.classList.add('hidden');
  try { threeContainer.focus(); } catch {}
}

function renderCodexList(): void {
  const allGlyphs = engine.getAllGlyphs();
  const unlocked = engine.getUnlockedGlyphs();
  codexProgressBadge.textContent = `${unlocked.size} / ${allGlyphs.length} THEOREMS ATTUNED`;

  codexListContainer.innerHTML = '';
  allGlyphs.forEach(glyph => {
    const isUnlocked = unlocked.has(glyph.id);
    const item = document.createElement('div');
    item.style.padding = '12px 14px';
    item.style.borderRadius = '6px';
    item.style.border = isUnlocked ? '1px solid rgba(0, 229, 255, 0.4)' : '1px solid #1e2b40';
    item.style.background = isUnlocked ? 'rgba(0, 229, 255, 0.05)' : 'rgba(10, 16, 26, 0.5)';
    item.style.display = 'flex';
    item.style.flexDirection = 'column';
    item.style.gap = '6px';

    if (isUnlocked) {
      item.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 24px; color: #00e5ff; text-shadow: 0 0 10px rgba(0, 229, 255, 0.6);">${glyph.symbol}</span>
            <div>
              <span style="font-weight: 700; color: #f1f5f9; font-size: 13px;">${glyph.title}</span>
              <div style="font-size: 10px; color: #38bdf8; font-family: 'Space Mono', monospace;">EPOCH: ${glyph.epoch} // COORD: ${glyph.coordinates}</div>
            </div>
          </div>
          <span class="level-badge" style="background: rgba(0, 229, 255, 0.15); border-color: #00e5ff; color: #00e5ff; font-size: 10px;">RESONATING</span>
        </div>
        <p style="font-size: 12px; font-style: italic; color: #cbd5e1; margin: 4px 0 2px; line-height: 1.5; border-left: 2px solid #00e5ff; padding-left: 8px;">
          "${glyph.inscription}"
        </p>
        <div style="font-size: 11px; color: #94a3b8;">— ${glyph.philosophicalNote}</div>
      `;
    } else {
      item.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; opacity: 0.6;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 20px; color: #64748b;">🔒</span>
            <div>
              <span style="font-weight: 700; color: #94a3b8; font-size: 13px;">SANCTUARY 0${glyph.levelNumber} // UNDISCOVERED THEOREM</span>
              <div style="font-size: 10px; color: #64748b; font-family: 'Space Mono', monospace;">COORD: ${glyph.coordinates} (UNEXPLORED MANIFOLD)</div>
            </div>
          </div>
          <span class="level-badge" style="background: rgba(100, 116, 139, 0.2); border-color: #475569; color: #94a3b8; font-size: 10px;">LOCKED</span>
        </div>
      `;
    }

    codexListContainer.appendChild(item);
  });
}

function toggleCodexModal(): void {
  const isHidden = modalGlyphCodex.classList.contains('hidden');
  if (isHidden) {
    renderCodexList();
    modalGlyphCodex.classList.remove('hidden');
  } else {
    modalGlyphCodex.classList.add('hidden');
    try { threeContainer.focus(); } catch {}
  }
}

function togglePause(): void {
  const isPaused = engine.getState() === 'PAUSED';
  if (isPaused) {
    engine.setPaused(false);
    pauseLabel.textContent = 'PAUSE';
    modalPause.classList.add('hidden');
  } else {
    engine.setPaused(true);
    pauseLabel.textContent = 'RESUME';
    modalPause.classList.remove('hidden');
  }
}

function toggleMute(): void {
  const muted = foldAudio.setMuted(!foldAudio.isAudioMuted());
  muteLabel.textContent = muted ? 'SFX: MUTED' : 'SFX: ON';
  if (muted) {
    foldAudio.stopCosmicDrone();
  } else {
    foldAudio.startCosmicDrone();
  }
}

// Initial Sync
syncLevelUI();

// Event Listeners
btnStartGame.addEventListener('click', () => {
  foldAudio.ensureAudio();
  foldAudio.startCosmicDrone();
  modalTitle.classList.add('hidden');
  try { threeContainer.focus(); } catch {}
});

btnLevelsMenu.addEventListener('click', () => {
  modalTitle.classList.toggle('hidden');
});

btnCodex.addEventListener('click', toggleCodexModal);
btnCloseCodex.addEventListener('click', toggleCodexModal);
btnCloseGlyphDiscovery.addEventListener('click', hideGlyphModal);
btnUndo.addEventListener('click', handleUndo);

btnPause.addEventListener('click', togglePause);
btnResumeGame.addEventListener('click', togglePause);

btnMute.addEventListener('click', toggleMute);
btnRotateLeft.addEventListener('click', () => sceneView.rotateRoomView(false));
btnRotateRight.addEventListener('click', () => sceneView.rotateRoomView(true));
btnReset.addEventListener('click', handleResetLevel);

btnNextLevel.addEventListener('click', () => {
  modalWin.classList.add('hidden');
  modalGlyphDiscovery.classList.add('hidden');
  modalGlyphCodex.classList.add('hidden');
  engine.nextLevel();
  syncLevelUI();
  try { threeContainer.focus(); } catch {}
});

btnReplayAll.addEventListener('click', () => {
  modalAllComplete.classList.add('hidden');
  modalGlyphDiscovery.classList.add('hidden');
  modalGlyphCodex.classList.add('hidden');
  engine.loadLevel(0);
  syncLevelUI();
  try { threeContainer.focus(); } catch {}
});

// Level selector buttons
document.querySelectorAll('.btn-level-item').forEach(el => {
  el.addEventListener('click', (e) => {
    const lvl = parseInt((e.currentTarget as HTMLElement).getAttribute('data-level') || '0', 10);
    engine.loadLevel(lvl);
    modalTitle.classList.add('hidden');
    modalWin.classList.add('hidden');
    modalAllComplete.classList.add('hidden');
    modalGlyphDiscovery.classList.add('hidden');
    modalGlyphCodex.classList.add('hidden');
    syncLevelUI();
    try { threeContainer.focus(); } catch {}
  });
});

// Global Keyboard Navigation
window.addEventListener('keydown', (e) => {
  foldAudio.ensureAudio();

  // If Glyph Discovery modal is open, dismiss on Space / Enter / Escape
  if (!modalGlyphDiscovery.classList.contains('hidden')) {
    if (e.key === 'Escape' || e.code === 'Space' || e.key === 'Enter') {
      e.preventDefault();
      hideGlyphModal();
      return;
    }
  }

  // If Codex is open, dismiss on Escape or C
  if (!modalGlyphCodex.classList.contains('hidden')) {
    if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
      e.preventDefault();
      toggleCodexModal();
      return;
    }
  }

  // Toggle Codex with C
  if (e.key === 'c' || e.key === 'C') {
    e.preventDefault();
    toggleCodexModal();
    return;
  }

  // Escape or P for Pause
  if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
    e.preventDefault();
    togglePause();
    return;
  }

  // If paused, ignore gameplay keys
  if (engine.getState() === 'PAUSED') {
    return;
  }

  // Mute
  if (e.key === 'm' || e.key === 'M') {
    e.preventDefault();
    toggleMute();
    return;
  }

  // If Victory modal is open, advance on Space or Enter
  if (!modalWin.classList.contains('hidden')) {
    if (e.code === 'Space' || e.key === 'Enter') {
      e.preventDefault();
      modalWin.classList.add('hidden');
      engine.nextLevel();
      syncLevelUI();
      try { threeContainer.focus(); } catch {}
      return;
    }
  }

  // Camera rotations
  if (e.key === 'q' || e.key === 'Q') {
    sceneView.rotateRoomView(false);
    return;
  }
  if (e.key === 'e' || e.key === 'E') {
    sceneView.rotateRoomView(true);
    return;
  }

  // Undo move or transform
  if (e.key === 'z' || e.key === 'Z' || e.key === 'u' || e.key === 'U') {
    e.preventDefault();
    handleUndo();
    return;
  }

  // Reset
  if (e.key === 'r' || e.key === 'R') {
    handleResetLevel();
    return;
  }

  // Space for default/first transform
  if (e.code === 'Space') {
    e.preventDefault();
    handleExecuteTransform();
    return;
  }

  // 1, 2, 3, 4 for numbered transforms (supporting compound Level 7 transforms)
  if (e.key >= '1' && e.key <= '4') {
    const trIdx = parseInt(e.key, 10) - 1;
    const transforms = engine.getLevel().transforms;
    if (transforms[trIdx]) {
      e.preventDefault();
      handleExecuteTransform(transforms[trIdx].id);
      return;
    }
  }

  // Directional Movement
  let dx = 0;
  let dz = 0;
  if (e.key === 'w' || e.key === 'ArrowUp') dz -= 1;
  else if (e.key === 's' || e.key === 'ArrowDown') dz += 1;
  else if (e.key === 'a' || e.key === 'ArrowLeft') dx -= 1;
  else if (e.key === 'd' || e.key === 'ArrowRight') dx += 1;

  if (dx !== 0 || dz !== 0) {
    e.preventDefault();
    handleMove(dx, dz);
  }
});

// Continuous Render Loop
function animate(time: number): void {
  sceneView.update(time);
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
