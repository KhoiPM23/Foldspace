import { foldAudio } from './audio/foldAudio';
import { PuzzleEngine } from './logic/puzzleEngine';
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

function handleMove(dx: number, dz: number): void {
  const result = engine.tryMove(dx, dz);
  if (result.success) {
    foldAudio.playStep();
    sceneView.animatePlayerMove(result.targetPos);

    if (result.isGoal) {
      foldAudio.playLevelClear();
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
  syncLevelUI();
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

btnPause.addEventListener('click', togglePause);
btnResumeGame.addEventListener('click', togglePause);

btnMute.addEventListener('click', toggleMute);
btnRotateLeft.addEventListener('click', () => sceneView.rotateRoomView(false));
btnRotateRight.addEventListener('click', () => sceneView.rotateRoomView(true));
btnReset.addEventListener('click', handleResetLevel);

btnNextLevel.addEventListener('click', () => {
  modalWin.classList.add('hidden');
  engine.nextLevel();
  syncLevelUI();
  try { threeContainer.focus(); } catch {}
});

btnReplayAll.addEventListener('click', () => {
  modalAllComplete.classList.add('hidden');
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
    syncLevelUI();
    try { threeContainer.focus(); } catch {}
  });
});

// Global Keyboard Navigation
window.addEventListener('keydown', (e) => {
  foldAudio.ensureAudio();

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

  // Camera rotations
  if (e.key === 'q' || e.key === 'Q') {
    sceneView.rotateRoomView(false);
    return;
  }
  if (e.key === 'e' || e.key === 'E') {
    sceneView.rotateRoomView(true);
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
