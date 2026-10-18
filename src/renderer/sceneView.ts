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
  private goalGroup: THREE.Group | null = null;
  private goalMonolith: THREE.Mesh | null = null;
  private goalRing1: THREE.Mesh | null = null;
  private goalRing2: THREE.Mesh | null = null;
  private portalParticles: THREE.Points | null = null;

  private targetPlayerPos = new THREE.Vector3();
  private cameraLookTarget = new THREE.Vector3(2, 0.5, 1);

  // Orbit camera parameters
  private cameraRadius = 18;
  private cameraTheta = Math.PI / 4;
  private cameraPhi = 0.85;
  private targetTheta = Math.PI / 4;
  private targetPhi = 0.85;
  private zoomD = 5.2;

  private isDragging = false;
  private prevPointerX = 0;
  private prevPointerY = 0;

  // Stardust stars
  private stardustSystem: THREE.Points;

  constructor(container: HTMLElement) {
    this.container = container;
    const width = container.clientWidth || 900;
    const height = container.clientHeight || 600;

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#05070e');
    this.scene.fog = new THREE.FogExp2('#05070e', 0.025);

    // 2. Camera
    const aspect = width / height;
    this.camera = new THREE.OrthographicCamera(
      -this.zoomD * aspect,
      this.zoomD * aspect,
      this.zoomD,
      -this.zoomD,
      0.1,
      150
    );
    this.updateCameraPosition();

    // 3. WebGL Renderer with Shadow Map
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(this.renderer.domElement);

    // 4. Studio & Atmospheric Lighting
    const ambientLight = new THREE.AmbientLight('#818cf8', 0.85);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight('#ffffff', 1.6);
    dirLight.position.set(12, 24, 14);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.bias = -0.001;
    this.scene.add(dirLight);

    // Cyan key rim light
    const cyanRim = new THREE.DirectionalLight('#00e5ff', 0.7);
    cyanRim.position.set(-14, -6, -10);
    this.scene.add(cyanRim);

    // Magenta accent fill
    const magentaFill = new THREE.PointLight('#f43f5e', 0.6, 20);
    magentaFill.position.set(2, 6, -4);
    this.scene.add(magentaFill);

    // 5. Abyssal Grid
    const gridHelper = new THREE.GridHelper(40, 40, '#1e1b4b', '#0f172a');
    gridHelper.position.y = -3.5;
    this.scene.add(gridHelper);

    // 6. Cosmic Stardust Particle Field (1,200 stars)
    this.stardustSystem = this.createStardustField();
    this.scene.add(this.stardustSystem);

    // 7. Player Mesh (Cyber Geometrist Drone)
    this.playerMesh = this.createPlayerModel();
    this.scene.add(this.playerMesh);

    // Setup interactive orbit controls
    this.setupOrbitInteractions();

    window.addEventListener('resize', this.onResize.bind(this));
  }

  private createStardustField(): THREE.Points {
    const starCount = 1200;
    const starGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 80;

      // Subtle cyan, purple, and white stars
      const r = 0.5 + Math.random() * 0.5;
      const g = 0.6 + Math.random() * 0.4;
      const b = 0.9 + Math.random() * 0.1;
      colors[i * 3] = r;
      colors[i * 3 + 1] = g;
      colors[i * 3 + 2] = b;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });

    return new THREE.Points(starGeo, starMat);
  }

  private createPlayerModel(): THREE.Group {
    const group = new THREE.Group();

    // 1. Ground projection shadow disc (visually anchors drone to floor)
    const shadowGeo = new THREE.CircleGeometry(0.36, 24);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: '#001a24',
      transparent: true,
      opacity: 0.72,
      depthWrite: false
    });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.02;
    group.add(shadow);

    // 2. Holographic downward vertical alignment beam
    const beamGeo = new THREE.CylinderGeometry(0.04, 0.26, 0.42, 16, 1, true);
    const beamMat = new THREE.MeshBasicMaterial({
      color: '#00e5ff',
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.position.y = 0.21;
    group.add(beam);

    // 3. Central core sphere
    const bodyGeo = new THREE.SphereGeometry(0.32, 24, 24);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: '#00e5ff',
      roughness: 0.15,
      metalness: 0.6,
      emissive: '#005577',
      emissiveIntensity: 0.35
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.castShadow = true;
    body.position.y = 0.45;
    group.add(body);

    // 4. Horizontal thruster halo ring
    const ringGeo = new THREE.TorusGeometry(0.42, 0.04, 12, 32);
    const ringMat = new THREE.MeshStandardMaterial({
      color: '#38bdf8',
      roughness: 0.2,
      metalness: 0.8,
      emissive: '#38bdf8',
      emissiveIntensity: 0.65
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.45;
    group.add(ring);

    // 5. Visor eye
    const visorGeo = new THREE.BoxGeometry(0.24, 0.08, 0.14);
    const visorMat = new THREE.MeshBasicMaterial({ color: '#ffffff' });
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.position.set(0, 0.48, 0.25);
    group.add(visor);

    return group;
  }

  private setupOrbitInteractions(): void {
    const dom = this.renderer.domElement;

    dom.addEventListener('pointerdown', (e: PointerEvent) => {
      this.isDragging = true;
      this.prevPointerX = e.clientX;
      this.prevPointerY = e.clientY;
      dom.setPointerCapture(e.pointerId);
    });

    dom.addEventListener('pointermove', (e: PointerEvent) => {
      if (!this.isDragging) return;
      const dx = e.clientX - this.prevPointerX;
      const dy = e.clientY - this.prevPointerY;
      this.prevPointerX = e.clientX;
      this.prevPointerY = e.clientY;

      this.targetTheta -= dx * 0.007;
      this.targetPhi = THREE.MathUtils.clamp(this.targetPhi + dy * 0.007, 0.25, 1.45);
    });

    const stopDrag = (e: PointerEvent) => {
      if (this.isDragging) {
        this.isDragging = false;
        try {
          dom.releasePointerCapture(e.pointerId);
        } catch {}
      }
    };

    dom.addEventListener('pointerup', stopDrag);
    dom.addEventListener('pointercancel', stopDrag);

    // Wheel zoom
    dom.addEventListener('wheel', (e: WheelEvent) => {
      e.preventDefault();
      this.zoomD = THREE.MathUtils.clamp(this.zoomD + e.deltaY * 0.004, 3.2, 8.5);
      this.updateCameraProjection();
    }, { passive: false });
  }

  private updateCameraPosition(): void {
    this.camera.position.x = this.cameraLookTarget.x + this.cameraRadius * Math.sin(this.cameraPhi) * Math.cos(this.cameraTheta);
    this.camera.position.z = this.cameraLookTarget.z + this.cameraRadius * Math.sin(this.cameraPhi) * Math.sin(this.cameraTheta);
    this.camera.position.y = this.cameraLookTarget.y + this.cameraRadius * Math.cos(this.cameraPhi);
    this.camera.lookAt(this.cameraLookTarget);
  }

  private updateCameraProjection(): void {
    const width = this.container.clientWidth || 900;
    const height = this.container.clientHeight || 600;
    const aspect = width / height;

    this.camera.left = -this.zoomD * aspect;
    this.camera.right = this.zoomD * aspect;
    this.camera.top = this.zoomD;
    this.camera.bottom = -this.zoomD;
    this.camera.updateProjectionMatrix();
  }

  public rebuildLevel(engine: PuzzleEngine): void {
    // Clear old meshes
    this.tileMeshes.forEach(m => this.scene.remove(m));
    this.tileMeshes.clear();

    this.transformGroups.forEach(g => this.scene.remove(g));
    this.transformGroups.clear();

    this.ghostMeshes.forEach(gm => this.scene.remove(gm));
    this.ghostMeshes = [];

    if (this.goalGroup) {
      this.scene.remove(this.goalGroup);
      this.goalGroup = null;
      this.goalMonolith = null;
      this.goalRing1 = null;
      this.goalRing2 = null;
      this.portalParticles = null;
    }

    const level = engine.getLevel();
    const boxGeo = new THREE.BoxGeometry(0.92, 0.4, 0.92);

    // Center camera on puzzle
    this.cameraLookTarget.set(level.goal.x * 0.5, 0.5, level.goal.z * 0.5);

    // 1. Transform pivot groups & ghost previews
    for (const tr of level.transforms) {
      const group = new THREE.Group();
      group.position.set(tr.pivot.x, tr.pivot.y, tr.pivot.z);
      this.scene.add(group);
      this.transformGroups.set(tr.id, group);

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

    // 2. Build Tile Meshes
    for (const tile of level.tiles) {
      const isTransformable = !!tile.transformId;
      const baseColor = tile.color || '#38bdf8';

      const mat = new THREE.MeshStandardMaterial({
        color: baseColor,
        roughness: 0.22,
        metalness: 0.35,
        emissive: isTransformable ? '#f59e0b' : '#0284c7',
        emissiveIntensity: isTransformable ? 0.3 : 0.08
      });

      const mesh = new THREE.Mesh(boxGeo, mat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;

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

    // 3. Goal Sanctum Monolith with Gyroscopic Rings & Portal Vortex
    this.goalGroup = new THREE.Group();
    this.goalGroup.position.set(level.goal.x, level.goal.y + 0.65, level.goal.z);

    // Golden Octahedron Core
    const goalGeo = new THREE.OctahedronGeometry(0.38, 0);
    const goalMat = new THREE.MeshStandardMaterial({
      color: '#ffd700',
      roughness: 0.1,
      metalness: 0.85,
      emissive: '#ffd700',
      emissiveIntensity: 0.45
    });
    this.goalMonolith = new THREE.Mesh(goalGeo, goalMat);
    this.goalGroup.add(this.goalMonolith);

    // Gyro Ring 1
    const gRing1Geo = new THREE.TorusGeometry(0.55, 0.03, 12, 32);
    const gRingMat = new THREE.MeshStandardMaterial({
      color: '#00ffaa',
      roughness: 0.1,
      metalness: 0.7,
      emissive: '#00ffaa',
      emissiveIntensity: 0.5
    });
    this.goalRing1 = new THREE.Mesh(gRing1Geo, gRingMat);
    this.goalGroup.add(this.goalRing1);

    // Gyro Ring 2
    const gRing2Geo = new THREE.TorusGeometry(0.68, 0.03, 12, 32);
    this.goalRing2 = new THREE.Mesh(gRing2Geo, gRingMat);
    this.goalRing2.rotation.x = Math.PI / 2;
    this.goalGroup.add(this.goalRing2);

    // Portal vortex particles around goal
    const portalCount = 80;
    const portalGeo = new THREE.BufferGeometry();
    const pPositions = new Float32Array(portalCount * 3);
    for (let i = 0; i < portalCount; i++) {
      const angle = (i / portalCount) * Math.PI * 2;
      const r = 0.4 + Math.random() * 0.35;
      pPositions[i * 3] = Math.cos(angle) * r;
      pPositions[i * 3 + 1] = (Math.random() - 0.5) * 0.8;
      pPositions[i * 3 + 2] = Math.sin(angle) * r;
    }
    portalGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    const portalMat = new THREE.PointsMaterial({
      size: 0.12,
      color: '#00ffaa',
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    });
    this.portalParticles = new THREE.Points(portalGeo, portalMat);
    this.goalGroup.add(this.portalParticles);

    this.scene.add(this.goalGroup);

    // Position player
    const p = engine.getPlayerPos();
    this.playerMesh.position.set(p.x, p.y, p.z);
    this.targetPlayerPos.set(p.x, p.y, p.z);
  }

  public animatePlayerMove(target: { x: number; y: number; z: number }): void {
    this.targetPlayerPos.set(target.x, target.y, target.z);
  }

  public startTransformTween(transform: SpatialTransform, onComplete: () => void): void {
    const currentAngle = transform.angle;
    const targetAngle = transform.targetAngle;
    const duration = 340;
    const startTime = performance.now();
    const group = this.transformGroups.get(transform.id);

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const t = Math.min(1.0, elapsed / duration);
      const ease = 1 - Math.pow(1 - t, 3);
      const angle = currentAngle + (targetAngle - currentAngle) * ease;
      transform.angle = angle;

      if (group) {
        if (transform.axis === 'Z') group.rotation.z = angle;
        else if (transform.axis === 'X') group.rotation.x = angle;
        else if (transform.axis === 'Y') group.rotation.y = angle;
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

  public highlightTransformTiles(transformId: string | null): void {
    const group = transformId ? this.transformGroups.get(transformId) : null;
    this.tileMeshes.forEach((mesh) => {
      const mat = mesh.material as THREE.MeshStandardMaterial;
      if (group && group.children.includes(mesh)) {
        mat.emissive.set('#00ffaa');
        mat.emissiveIntensity = 0.85;
      } else {
        mat.emissive.set('#1e1b4b');
        mat.emissiveIntensity = 0.25;
      }
    });
  }

  public animatePortalArrival(onComplete: () => void): void {
    const startTime = performance.now();
    const duration = 500;
    const startY = this.playerMesh.position.y;
    const startScale = this.playerMesh.scale.x;

    const warpAnim = (time: number) => {
      const elapsed = time - startTime;
      const t = Math.min(1.0, elapsed / duration);
      const ease = t * t;

      this.playerMesh.position.y = startY + ease * 0.8;
      this.playerMesh.rotation.y += 0.25;
      const currentScale = THREE.MathUtils.lerp(startScale, 0.15, ease);
      this.playerMesh.scale.set(currentScale, currentScale, currentScale);

      if (t < 1.0) {
        requestAnimationFrame(warpAnim);
      } else {
        this.playerMesh.scale.set(1, 1, 1);
        this.playerMesh.rotation.y = 0;
        onComplete();
      }
    };
    requestAnimationFrame(warpAnim);
  }

  public update(time: number): void {
    // 1. Smooth Orbit Camera Lerp
    this.cameraTheta = THREE.MathUtils.lerp(this.cameraTheta, this.targetTheta, 0.12);
    this.cameraPhi = THREE.MathUtils.lerp(this.cameraPhi, this.targetPhi, 0.12);
    this.updateCameraPosition();

    // 2. Smooth Lerp Player Position & Hover Bob
    const hoverY = Math.sin(time * 0.005) * 0.03;
    this.playerMesh.position.x = THREE.MathUtils.lerp(this.playerMesh.position.x, this.targetPlayerPos.x, 0.22);
    this.playerMesh.position.y = THREE.MathUtils.lerp(this.playerMesh.position.y, this.targetPlayerPos.y + hoverY, 0.22);
    this.playerMesh.position.z = THREE.MathUtils.lerp(this.playerMesh.position.z, this.targetPlayerPos.z, 0.22);

    // 3. Gyroscopic Goal Sanctum Animation
    if (this.goalGroup) {
      if (this.goalMonolith) {
        this.goalMonolith.rotation.y += 0.02;
        this.goalMonolith.rotation.z += 0.01;
      }
      if (this.goalRing1) {
        this.goalRing1.rotation.x += 0.025;
        this.goalRing1.rotation.y += 0.015;
      }
      if (this.goalRing2) {
        this.goalRing2.rotation.z -= 0.02;
        this.goalRing2.rotation.x += 0.01;
      }
      if (this.portalParticles) {
        this.portalParticles.rotation.y += 0.03;
      }
      this.goalGroup.position.y += Math.sin(time * 0.004) * 0.002;
    }

    // 4. Ghost Wireframe Pulse
    const pulseOpacity = 0.25 + Math.sin(time * 0.005) * 0.16;
    for (const ghost of this.ghostMeshes) {
      (ghost.material as THREE.MeshBasicMaterial).opacity = pulseOpacity;
    }

    // 5. Slowly Drift Cosmic Stardust
    if (this.stardustSystem) {
      this.stardustSystem.rotation.y += 0.0003;
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
    this.targetTheta += delta;
  }

  private onResize(): void {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    if (width === 0 || height === 0) return;
    this.updateCameraProjection();
    this.renderer.setSize(width, height);
  }
}
