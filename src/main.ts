import { foldAudio } from './audio/foldAudio';
import { PuzzleEngine } from './logic/puzzleEngine';
import { SceneView } from './renderer/sceneView';

// DOM Elements
const threeContainer = document.getElementById('threeContainer') as HTMLElement;
const levelTitle = document.getElementById('levelTitle') as HTMLElement;
const levelDesc = document.getElementById('levelDesc') as HTMLElement;
const levelIndicator = document.getElementById('levelIndicator') as HTMLElement;

const btnFold = document.getElementById('btnFold') as HTMLButtonElement;
const btnRotateLeft = document.getElementById('btnRotateLeft') as HTMLButtonElement;
const btnRotateRight = document.getElementById('btnRotateRight') as HTMLButtonElement;
const btnReset = document.getElementById('btnReset') as HTMLButtonElement;

const modalWin = document.getElementById('modalWin') as HTMLElement;
const btnNextLevel = document.getElementById('btnNextLevel') as HTMLButtonElement;
const modalAllComplete = document.getElementById('modalAllComplete') as HTMLElement;
const btnReplayAll = document.getElementById('btnReplayAll') as HTMLButtonElement;

// Systems
const engine = new PuzzleEngine(0);
const sceneView = new SceneView(threeContainer);

function syncLevelUI(): void {
  const level = engine.getLevel();
  levelTitle.textContent = level.name;
  levelDesc.textContent = level.description;
  levelIndicator.textContent = `${engine.getLevelIndex() + 1} / ${engine.getTotalLevels()}`;
  sceneView.rebuildLevel(engine);
}

syncLevelUI();

// Keyboard inputs
window.addEventListener('keydown', (e) => {
  foldAudio.ensureAudio();

  if (e.code === 'Space') {
    e.preventDefault();
    handleHingeFold();
    return;
  }

  if (e.key === 'q' || e.key === 'Q') {
    sceneView.rotateRoomView(false);
    return;
  }
  if (e.key === 'e' || e.key === 'E') {
    sceneView.rotateRoomView(true);
    return;
  }
  if (e.key === 'r' || e.key === 'R') {
    handleResetLevel();
    return;
  }

  // Directional navigation
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

function handleMove(dx: number, dz: number): void {
  const result = engine.tryMove(dx, dz);
  if (result.success) {
    foldAudio.playStep();
    sceneView.animatePlayerMove(result.targetPos);

    if (result.isGoal) {
      foldAudio.playLevelClear();
      if (engine.getLevelIndex() < engine.getTotalLevels() - 1) {
        modalWin.classList.remove('hidden');
      } else {
        modalAllComplete.classList.remove('hidden');
      }
    }
  } else {
    foldAudio.playBlocked();
  }
}

function handleHingeFold(): void {
  const result = engine.toggleHinge();
  if (result.success && result.hinge) {
    foldAudio.playFold();
    sceneView.startHingeTween(result.hinge, () => {
      engine.setState('IDLE');
    });
  }
}

function handleResetLevel(): void {
  engine.resetLevel();
  modalWin.classList.add('hidden');
  modalAllComplete.classList.add('hidden');
  syncLevelUI();
}

// Button listeners
btnFold.addEventListener('click', handleHingeFold);
btnRotateLeft.addEventListener('click', () => sceneView.rotateRoomView(false));
btnRotateRight.addEventListener('click', () => sceneView.rotateRoomView(true));
btnReset.addEventListener('click', handleResetLevel);

btnNextLevel.addEventListener('click', () => {
  modalWin.classList.add('hidden');
  engine.nextLevel();
  syncLevelUI();
});

btnReplayAll.addEventListener('click', () => {
  modalAllComplete.classList.add('hidden');
  engine.loadLevel(0);
  syncLevelUI();
});

// Animation loop
function animate(time: number): void {
  sceneView.update(time);
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
