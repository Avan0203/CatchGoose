import {
  Scene,
  Color,
  PerspectiveCamera,
  WebGLRenderer,
  PCFSoftShadowMap,
  SRGBColorSpace,
  AmbientLight,
  DirectionalLight,
  Mesh,
  AxesHelper,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class SceneManager {
  container: HTMLElement;
  scene!: Scene;
  camera!: PerspectiveCamera;
  renderer!: WebGLRenderer;
  controls!: OrbitControls;

  constructor(container: HTMLElement) {
    this.container = container;

    this.init();
  }

  init() {
    this.createScene();
    this.createCamera();
    this.createRenderer();
    this.createControls();
    this.createLights();
  }

  createScene() {
    this.scene = new Scene();
    this.scene.background = new Color(0x87CEEB); // 天蓝色背景

    this.scene.add(new AxesHelper(20));
  }

  createCamera() {
    this.camera = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 8, 12);
    this.camera.lookAt(0, 0, 0);
  }

  createRenderer() {
    this.renderer = new WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;
    this.renderer.outputColorSpace = SRGBColorSpace;
    this.container.appendChild(this.renderer.domElement);
  }

  createControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.target.set(0, 2, 0);
  }

  createLights() {
    // 环境光
    const ambientLight = new AmbientLight(0x404040, 0.4);
    this.scene.add(ambientLight);

    // 方向光
    const directionalLight = new DirectionalLight(0xffffff, 4);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -10;
    directionalLight.shadow.camera.right = 10;
    directionalLight.shadow.camera.top = 10;
    directionalLight.shadow.camera.bottom = -10;
    this.scene.add(directionalLight);
  }


  update() {
    this.controls.update();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  addObject(object: Mesh) {
    this.scene.add(object);
  }

  removeObject(object: Mesh) {
    this.scene.remove(object);
  }

  destroy() {
    this.container.removeChild(this.renderer.domElement);
    this.renderer.dispose();
    this.controls.dispose();
  }

  getScene() {
    return this.scene;
  }
}
