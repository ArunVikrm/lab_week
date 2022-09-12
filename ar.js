if (ZapparThree.browserIncompatible()) {
    ZapparThree.browserIncompatibleUI();
    throw new Error('Unsupported browser');
}

const manager = new ZapparThree.LoadingManager();

const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
const scene = new THREE.Scene();
document.body.appendChild(renderer.domElement);

renderer.setSize(window.innerWidth, window.innerHeight);
window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
});

const camera = new ZapparThree.Camera();

ZapparThree.permissionRequestUI().then((granted) => {
    if (granted) camera.start(true);
    else ZapparThree.permissionDeniedUI();
});

ZapparThree.glContextSet(renderer.getContext());


scene.background = camera.backgroundTexture;

// Load a 3D model to place within our group (using ThreeJS's GLTF loader)
// Pass our loading manager in to ensure the progress bar works correctly
const comcastSrc = new URL('./assets/logo_7.glb', import.meta.url).href;
const gltfLoader = new THREE.GLTFLoader(manager);
gltfLoader.load(comcastSrc, (gltf) => {
  // Position the loaded content to overlay user's face
  gltf.scene.position.set(-0.4, -1.2, -3);
  gltf.scene.rotation.x = Math.PI/2;
  gltf.scene.scale.set(8, 8, 8);
  scene.add(gltf.scene)
}, undefined, () => {
  console.log('An error ocurred loading the GLTF model');
});

const directionalLight = new THREE.DirectionalLight('white', 0.8);
directionalLight.position.set(0, 5, 0);
directionalLight.lookAt(0, 0, 0);
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight('white', 0.4);
scene.add(ambientLight);

const placeButton = document.getElementById('snapshot') || document.createElement('div');

placeButton.addEventListener('click', () => {
    const canvas = document.querySelector('canvas') || document.createElement('canvas');
    const url = canvas.toDataURL('image/jpeg', 0.8);
    // Take snapshot
    ZapparSharing({
      data: url,
    });
});

function render() {
    camera.updateFrame(renderer);
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

render();