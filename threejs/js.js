const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);

const renderer = new THREE.WebGLRenderer();
renderer.serSize(widnow.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);
