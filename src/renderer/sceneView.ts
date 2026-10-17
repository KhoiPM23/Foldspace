import * as THREE from 'three';
import { PuzzleEngine } from '../logic/puzzleEngine';
import { SpatialTransform } from '../logic/types';

export class SceneView {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.OrthographicCamera;
  private renderer: THREE.WebGLRenderer;

  private tileMeshes: Map<string, THREE.Mesh> = new Map();
  private transformGroups: Map<string, THREE.Group> = new Map();
  private ghostMeshes: THREE.Mesh[] = [];
  private playerMesh: THREE.Group;
  private goalMesh: THREE.Mesh | null = null;

  private targetPlayerPos = new THREE.Vector3();

  constructor(container: HTMLElement) {
    this.container = container;
    const width = container.clientWidth || 900;
    const height = container.clientHeight || 600;

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#070b14');

    // 2. Orthographic Isometric Camera
    const aspect = width / height;
    const d = 5.2;
    this.camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 0.1, 100);
    this.camera.position.set(12, 14, 12);
    this.camera.lookAt(2, 0.5, 1.5);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    container.appendChild(this.renderer.domElement);

    // 4. Lights
    const ambient = new THREE.AmbientLight('#a5b4fc', 0.9);
    this.scene.add(ambient);

    const dirLight = new THREE.DirectionalLight('#ffffff', 1.4);
    dirLight.position.set(10, 20, 12);
    dirLight.castShadow = true;
    this.scene.add(dirLight);

    // Subtle blue rim light from bottom left
    const rimLight = new THREE.DirectionalLight('#38bdf8', 0.6);
    rimLight.position.set(-10, -5, -8);
    this.scene.add(rimLight);

    // 5. Player Model
    this.playerMesh = this.createPlayerModel();
    this.scene.add(this.playerMesh);

    window.addEventListener('resize', this.onResize.bind(this));
  }

  private createPlayerModel(): THREE.Group {
    const group = new THREE.Group();

    // Body sphere
    const bodyGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: '#00e5ff',
      roughness: 0.2,
      metalness: 0.3
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.45;
    group.add(body);

    // Visor eye
    const visorGeo = new THREE.BoxGeometry(0.22, 0.08, 0.12);
    const visorMat = new THREE.MeshBasicMaterial({ color: '#ffffff' });
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.position.set(0, 0.48, 0.24);
    group.add(visor);

    return group;
  }

  public rebuildLevel(engine: PuzzleEngine): void {
    // Clear old level meshes
    this.tileMeshes.forEach(m => this.scene.remove(m));
    this.tileMeshes.clear();

    this.transformGroups.forEach(g => this.scene.remove(g));
    this.transformGroups.clear();

    this.ghostMeshes.forEach(gm => this.scene.remove(gm));
    this.ghostMeshes = [];

    if (this.goalMesh) {
      this.scene.remove(this.goalMesh);
      this.goalMesh = null;
    }

    const level = engine.getLevel();
    const boxGeo = new THREE.BoxGeometry(0.92, 0.4, 0.92);

    // 1. Setup transform pivot groups
    for (const tr of level.transforms) {
      const group = new THREE.Group();
      group.position.set(tr.pivot.x, tr.pivot.y, tr.pivot.z);
      this.scene.add(group);
      this.transformGroups.set(tr.id, group);

      // Create ghost preview wireframe for where tiles transform to!
      for (const mapping of tr.tileMappings) {
        const dest = tr.isTransformed ? mapping.normal : mapping.transformed;
        const ghostMat = new THREE.MeshBasicMaterial({
          color: '#f59e0b',
          wireframe: true,
          transparent: true,
          opacity: 0.35
        });
        const ghost = new THREE.Mesh(boxGeo, ghostMat);
        ghost.position.set(dest.x, dest.y, dest.z);
        this.scene.add(ghost);
        this.ghostMeshes.push(ghost);
      }
    }

    // 2. Build tile meshes
    for (const tile of level.tiles) {
      const color = tile.color || '#38bdf8';
      const mat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.35,
        metalness: 0.15
      });
      const mesh = new THREE.Mesh(boxGeo, mat);

      if (tile.transformId && this.transformGroups.has(tile.transformId)) {
        const tr = level.transforms.find(t => t.id === tile.transformId)!;
        mesh.position.set(
          tile.x - tr.pivot.x,
          tile.y - tr.pivot.y,
          tile.z - tr.pivot.z
        );
        this.transformGroups.get(tile.transformId)!.add(mesh);
      } else {
        mesh.position.set(tile.x, tile.y, tile.z);
        this.scene.add(mesh);
      }
      this.tileMeshes.set(tile.id, mesh);
    }

    // 3. Goal Monolith (Golden floating crystal)
    const goalGeo = new THREE.OctahedronGeometry(0.38, 0);
    const goalMat = new THREE.MeshStandardMaterial({
      color: '#ffd700',
      roughness: 0.1,
      metalness: 0.8,
      emissive: '#ffd700',
      emissiveIntensity: 0.4
    });
    this.goalMesh = new THREE.Mesh(goalGeo, goalMat);
    this.goalMesh.position.set(level.goal.x, level.goal.y + 0.65, level.goal.z);
    this.scene.add(this.goalMesh);

    // Set player position
    const p = engine.getPlayerPos();
    this.playerMesh.position.set(p.x, p.y, p.z);
    this.targetPlayerPos.set(p.x, p.y, p.z);

    // Look at center of level
    this.camera.lookAt(level.goal.x * 0.5, 0.5, level.goal.z * 0.5);
  }

  public animatePlayerMove(target: { x: number; y: number; z: number }): void {
    this.targetPlayerPos.set(target.x, target.y, target.z);
  }

  public startTransformTween(transform: SpatialTransform, onComplete: () => void): void {
    const currentAngle = transform.angle;
    const targetAngle = transform.targetAngle;
    const duration = 320; // 320ms smooth tween
    const startTime = performance.now();

    const group = this.transformGroups.get(transform.id);

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const t = Math.min(1.0, elapsed / duration);
      const ease = 1 - Math.pow(1 - t, 3); // Ease out cubic
      const angle = currentAngle + (targetAngle - currentAngle) * ease;
      transform.angle = angle;

      if (group) {
        if (transform.axis === 'Z') {
          group.rotation.z = angle;
        } else if (transform.axis === 'X') {
          group.rotation.x = angle;
        } else if (transform.axis === 'Y') {
          group.rotation.y = angle;
        }
      }

      if (t < 1.0) {
        requestAnimationFrame(animate);
      } else {
        transform.angle = targetAngle;
        onComplete();
      }
    };
    requestAnimationFrame(animate);
  }

  public update(time: number): void {
    // Smooth lerp player position
    this.playerMesh.position.lerp(this.targetPlayerPos, 0.24);

    // Rotate and bob goal monolith
    if (this.goalMesh) {
      this.goalMesh.rotation.y += 0.025;
      this.goalMesh.rotation.z += 0.01;
      this.goalMesh.position.y = this.goalMesh.position.y + Math.sin(time * 0.003) * 0.003;
    }

    // Pulse ghost preview wireframes
    const pulseOpacity = 0.25 + Math.sin(time * 0.004) * 0.15;
    for (const ghost of this.ghostMeshes) {
      (ghost.material as THREE.MeshBasicMaterial).opacity = pulseOpacity;
    }

    this.renderer.render(this.scene, this.camera);
  }

  public updateGhostPreviews(engine: PuzzleEngine): void {
    const level = engine.getLevel();
    let idx = 0;
    for (const tr of level.transforms) {
      for (const mapping of tr.tileMappings) {
        if (idx < this.ghostMeshes.length) {
          const dest = tr.isTransformed ? mapping.normal : mapping.transformed;
          this.ghostMeshes[idx].position.set(dest.x, dest.y, dest.z);
          idx++;
        }
      }
    }
  }

  public rotateRoomView(clockwise = true): void {
    const delta = (clockwise ? 1 : -1) * (Math.PI / 2);
    const startAngle = Math.atan2(this.camera.position.z, this.camera.position.x);
    const endAngle = startAngle + delta;
    const radius = Math.hypot(this.camera.position.x, this.camera.position.z);
    const startY = this.camera.position.y;
    const startTime = performance.now();

    const animate = (now: number) => {
      const t = Math.min(1.0, (now - startTime) / 280);
      const ease = 1 - Math.pow(1 - t, 3);
      const angle = startAngle + (endAngle - startAngle) * ease;
      this.camera.position.x = Math.cos(angle) * radius;
      this.camera.position.z = Math.sin(angle) * radius;
      this.camera.position.y = startY;
      this.camera.lookAt(2, 0.5, 1.5);

      if (t < 1.0) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }

  private onResize(): void {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    if (width === 0 || height === 0) return;

    const aspect = width / height;
    const d = 5.2;
    this.camera.left = -d * aspect;
    this.camera.right = d * aspect;
    this.camera.top = d;
    this.camera.bottom = -d;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }
}
