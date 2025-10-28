const WIDTH = 800;
const HEIGHT = 800;

const CAMERA_VIEW_SIZE = 10; 
const INITIAL_PLANE_WIDTH = 3.5; 
const INITIAL_PLANE_HEIGHT = 1.75;

const INITIAL_VELOCITY = { x: 0.05, y: 0.03 };
const SCALE_FACTOR = 0.85; 
const MAX_BOUNCES = 8; 
const INVISIBLE_SCALE_THRESHOLD = 0.01; 

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(
    CAMERA_VIEW_SIZE / - 2, 
    CAMERA_VIEW_SIZE / 2,   
    CAMERA_VIEW_SIZE / 2,   
    CAMERA_VIEW_SIZE / - 2,  
    0.1, 1000 
);
camera.position.z = 5; 

const renderer = new THREE.WebGLRenderer();
renderer.setSize(WIDTH, HEIGHT);
renderer.setClearColor(0x000000, 1); 
document.body.appendChild(renderer.domElement);

/**
 * 
 * @returns {number} 
 */
function getRandomColor() {
    return Math.floor(Math.random() * 0x1000000);
}

function changeColor() {
    dvd.material.color.setHex(getRandomColor());
}

function shrink() {
    if (dvd.scale.x > INVISIBLE_SCALE_THRESHOLD) {
        const newScale = dvd.scale.x * SCALE_FACTOR;
        dvd.scale.set(newScale, newScale, newScale);
    }
}

function handleInvisibility() {
    if (dvd.scale.x <= INVISIBLE_SCALE_THRESHOLD || bounceCount >= MAX_BOUNCES) {
         dvd.visible = false;
         console.log(`DVD invisible after ${bounceCount} bounces.`);
    }
}

const geometry = new THREE.PlaneGeometry(INITIAL_PLANE_WIDTH, INITIAL_PLANE_HEIGHT);
const material = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
const dvd = new THREE.Mesh(geometry, material);

dvd.position.set(0, 0, 0);
scene.add(dvd);

let velocity = INITIAL_VELOCITY;
let bounceCount = 0;

function animate() {
    requestAnimationFrame(animate);

    if (!dvd.visible) {
        renderer.render(scene, camera);
        return;
    }
    dvd.position.x += velocity.x;
    dvd.position.y += velocity.y;

    const cameraHalfSize = CAMERA_VIEW_SIZE / 2;
    const currentHalfWidth = (INITIAL_PLANE_WIDTH / 2) * dvd.scale.x;
    const currentHalfHeight = (INITIAL_PLANE_HEIGHT / 2) * dvd.scale.y;

    const maxX = cameraHalfSize - currentHalfWidth;
    const minX = -cameraHalfSize + currentHalfWidth;
    const maxY = cameraHalfSize - currentHalfHeight;
    const minY = -cameraHalfSize + currentHalfHeight;

    let hasBounced = false;

    if (dvd.position.x >= maxX) {
        dvd.position.x = maxX;
        velocity.x *= -1;
        hasBounced = true;
    } else if (dvd.position.x <= minX) {
        dvd.position.x = minX;
        velocity.x *= -1;
        hasBounced = true;
    }

    if (dvd.position.y >= maxY) {
        dvd.position.y = maxY;
        velocity.y *= -1;
        hasBounced = true;
    } else if (dvd.position.y <= minY) {
        dvd.position.y = minY;
        velocity.y *= -1;
        hasBounced = true;
    }

    if (hasBounced) {
        bounceCount++;
        changeColor(); 
        shrink();     
        handleInvisibility(); 
    }

    renderer.render(scene, camera);
}
animate();