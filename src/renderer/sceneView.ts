import * as THREE from 'three';
import { PuzzleEngine } from '../logic/puzzleEngine';
import { HingeDefinition } from '../logic/types';

export class SceneView {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.OrthographicCamera;
  private renderer: THREE.WebGLRenderer;

  private tileMeshes: Map<string, THREE.Mesh> = new Map();
  private hingeGroups: Map<string, THREE.Group> = new Map();
  private playerMesh: THREE.Group;
  private goalMesh: THREE.Mesh | null = null;

  private targetPlayerPos = new THREE.Vector3();

  constructor(container: HTMLElement) {
    this.container = container;
    const width = container.clientWidth || 900;
    const height = container.clientHeight || 600;

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#090d16');

    // 2. Orthographic Isometric Camera
    const aspect = width / height;
    const d = 5.5;
    this.camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 0.1, 100);
    this.camera.position.set(12, 14, 12);
    this.camera.lookAt(2, 0, 1.5);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    container.appendChild(this.renderer.domElement);

    // 4. Lights
    const ambient = new THREE.AmbientLight('#a5b4fc', 0.85);
    this.scene.add(ambient);

    const dirLight = new THREE.DirectionalLight('#ffffff', 1.4);
    dirLight.position.set(10, 20, 12);
    dirLight.castShadow = true;
    this.scene.add(dirLight);

    // 5. Player Model
    this.playerMesh = this.createPlayerModel();
    this.scene.add(this.playerMesh);

    window.addEventListener('resize', this.onResize.bind(this));
  }

  private createPlayerModel(): THREE.Group {
    const group = new THREE.Group();

    // Body sphere / capsule
    const bodyGeo = new THREE.SphereGeometry(0.32, 16, 16);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: '#00e5ff',
      roughness: 0.3,
      metalness: 0.2
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.45;
    group.add(body);

    // Visor eye
    const visorGeo = new THREE.BoxGeometry(0.24, 0.1, 0.12);
    const visorMat = new THREE.MeshBasicMaterial({ color: '#ffffff' });
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.position.set(0, 0.5, 0.26);
    group.add(visor);

    return group;
  }

  public rebuildLevel(engine: PuzzleEngine): void {
    // Clear old level meshes
    this.tileMeshes.forEach(m => this.scene.remove(m));
    this.tileMeshes.clear();

    this.hingeGroups.forEach(g => this.scene.remove(g));
    this.hingeGroups.clear();

    if (this.goalMesh) {
      this.scene.remove(this.goalMesh);
      this.goalMesh = null;
    }

    const level = engine.getLevel();
    const boxGeo = new THREE.BoxGeometry(0.92, 0.4, 0.92);

    // Setup hinge groups first
    for (const hinge of level.hinges) {
      const group = new THREE.Group();
      group.position.set(hinge.pivot.x, hinge.pivot.y, hinge.pivot.z);
      this.scene.add(group);
      this.hingeGroups.set(hinge.id, group);
    }

    // Build tile meshes
    for (const tile of level.tiles) {
      const color = tile.color || '#38bdf8';
      const mat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.4,
        metalness: 0.1
      });
      const mesh = new THREE.Mesh(boxGeo, mat);

      if (tile.hingeId && this.hingeGroups.has(tile.hingeId)) {
        // Position relative to hinge pivot
        const hinge = level.hinges.find(h => h.id === tile.hingeId)!;
        mesh.position.set(
          tile.x - hinge.pivot.x,
          tile.y - hinge.pivot.y,
          tile.z - hinge.pivot.z
        );
        this.hingeGroups.get(tile.hingeId)!.add(mesh);
      } else {
        mesh.position.set(tile.x, tile.y, tile.z);
        this.scene.add(mesh);
      }
      this.tileMeshes.set(tile.id, mesh);
    }

    // Goal Monolith (Golden floating crystal)
    const goalGeo = new THREE.OctahedronGeometry(0.38, 0);
    const goalMat = new THREE.MeshStandardMaterial({
      color: '#ffd700',
      roughness: 0.1,
      metalness: 0.8,
      emissive: '#ffd700',
      emissiveIntensity: 0.3
    });
    this.goalMesh = new THREE.Mesh(goalGeo, goalMat);
    this.goalMesh.position.set(level.goal.x, level.goal.y + 0.65, level.goal.z);
    this.scene.add(this.goalMesh);

    // Set player position
    const p = engine.getPlayerPos();
    this.playerMesh.position.set(p.x, p.y, p.z);
    this.targetPlayerPos.set(p.x, p.y, p.z);

    // Center camera on level center
    this.camera.lookAt(level.goal.x * 0.5, 0, level.goal.z * 0.5);
  }

  public animatePlayerMove(target: { x: number; y: number; z: number }): void {
    this.targetPlayerPos.set(target.x, target.y, target.z);
  }

  public startHingeTween(hinge: HingeDefinition, onComplete: () => void): void {
    const currentAngle = hinge.angle;
    const targetAngle = hinge.targetAngle;

    const duration = 320; // 320ms smooth tween
    const startTime = performance.now();

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const t = Math.min(1.0, elapsed / duration);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - t, 3);
      const angle = currentAngle + (targetAngle - currentAngle) * ease;
      hinge.angle = angle;

      const group = this.hingeGroups.get(hinge.id);
      if (group) {
        if (hinge.axis === 'Z') {
          group.rotation.z = angle;
        } else {
          group.rotation.x = angle;
        }
      }

      if (t < 1.0) {
        requestAnimationFrame(animate);
      } else {
        hinge.angle = targetAngle;
        onComplete();
      }
    };
    requestAnimationFrame(animate);
  }

  public update(time: number): void {
    // Smooth lerp player position
    this.playerMesh.position.lerp(this.targetPlayerPos, 0.22);

    // Rotate and bob goal monolith
    if (this.goalMesh) {
      this.goalMesh.rotation.y += 0.025;
      this.goalMesh.rotation.z += 0.01;
      this.goalMesh.position.y = 0.65 + Math.sin(time * 0.003) * 0.08;
    }

    this.renderer.render(this.scene, this.camera);
  }

  private onResize(): void {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    if (width === 0 || height === 0) return;

    const aspect = width / height;
    const d = 5.5;
    this.camera.left = -d * aspect;
    this.camera.right = d * aspect;
    this.camera.top = d;
    this.camera.bottom = -d;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  public rotateRoomView(clockwise = true): void {
    const delta = (clockwise ? 1 : -1) * (Math.PI / 2);
    const startAngle = Math.atan2(this.camera.position.z, this.camera.position.x);
    const endAngle = startAngle + delta;
    const radius = Math.hypot(this.camera.position.x, this.camera.position.z);
    const startY = this.camera.position.y;
    const startTime = performance.now();

    const animate = (now: number) => {
      const t = Math.min(1.0, (now - startTime) / 300);
      const ease = 1 - Math.pow(1 - t, 3);
      const angle = startAngle + (endAngle - startAngle) * ease;
      this.camera.position.x = Math.cos(angle) * radius;
      this.camera.position.z = Math.sin(angle) * radius;
      this.camera.position.y = startY;
      this.camera.lookAt(1.5, 0, 1.5);

      if (t < 1.0) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }
}
