import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Timer } from 'three/addons/misc/Timer.js'
import { Sky } from 'three/addons/objects/Sky.js'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Axes Helper
const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);

/**
 * Textures 
 */
const textureLoader = new THREE.TextureLoader();

// Floor
const floorAlphaTexture = textureLoader.load('./floor/alpha.jpg');
const floorColorTexture = textureLoader.load('./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_diff_1k.jpg');
const floorARMTexture = textureLoader.load('./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_arm_1k.jpg');
const floorNormalTexture = textureLoader.load('./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_nor_gl_1k.jpg');
const floorDisplacementTexture = textureLoader.load('./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_disp_1k.jpg');

floorColorTexture.colorSpace = THREE.SRGBColorSpace; // This is needed for color textures

floorColorTexture.repeat.set(8, 8);
floorARMTexture.repeat.set(8, 8);
floorNormalTexture.repeat.set(8, 8);
floorDisplacementTexture.repeat.set(8, 8);

floorColorTexture.wrapS = THREE.RepeatWrapping;
floorColorTexture.wrapT = THREE.RepeatWrapping

floorARMTexture.wrapS = THREE.RepeatWrapping;
floorARMTexture.wrapT = THREE.RepeatWrapping

floorNormalTexture.wrapS = THREE.RepeatWrapping;
floorNormalTexture.wrapT = THREE.RepeatWrapping

floorDisplacementTexture.wrapS = THREE.RepeatWrapping;
floorDisplacementTexture.wrapT = THREE.RepeatWrapping

// Wall
const wallColorTexture = textureLoader.load('./wall/castle_brick_broken_06_1k/castle_brick_broken_06_diff_1k.jpg');
const wallARMTexture = textureLoader.load('./wall/castle_brick_broken_06_1k/castle_brick_broken_06_arm_1k.jpg');
const wallNormalTexture = textureLoader.load('./wall/castle_brick_broken_06_1k/castle_brick_broken_06_nor_gl_1k.jpg');

wallColorTexture.colorSpace = THREE.SRGBColorSpace; // This is needed for color textures

// Roof
const roofColorTexture = textureLoader.load('./roof/roof_slates_02_1k/roof_slates_02_diff_1k.jpg');
const roofARMTexture = textureLoader.load('./roof/roof_slates_02_1k/roof_slates_02_arm_1k.jpg');
const roofNormalTexture = textureLoader.load('./roof/roof_slates_02_1k/roof_slates_02_nor_gl_1k.jpg');

roofColorTexture.colorSpace = THREE.SRGBColorSpace; // This is needed for color textures

// roofColorTexture.repeat.set(3, 1)
// roofARMTexture.repeat.set(3, 1)
// roofNormalTexture.repeat.set(3, 1)

// // Unless the repeat.y gets higher than 1, there’s no need to change the wrapT.
// roofColorTexture.wrapS = THREE.RepeatWrapping
// roofARMTexture.wrapS = THREE.RepeatWrapping
// roofNormalTexture.wrapS = THREE.RepeatWrapping

// Bush
const bushColorTexture = textureLoader.load('./bush/leaves_forest_ground_1k/leaves_forest_ground_diff_1k.webp')
const bushARMTexture = textureLoader.load('./bush/leaves_forest_ground_1k/leaves_forest_ground_arm_1k.webp')
const bushNormalTexture = textureLoader.load('./bush/leaves_forest_ground_1k/leaves_forest_ground_nor_gl_1k.webp')

bushColorTexture.colorSpace = THREE.SRGBColorSpace

bushColorTexture.repeat.set(2, 1)
bushARMTexture.repeat.set(2, 1)
bushNormalTexture.repeat.set(2, 1)

bushColorTexture.wrapS = THREE.RepeatWrapping
bushARMTexture.wrapS = THREE.RepeatWrapping
bushNormalTexture.wrapS = THREE.RepeatWrapping

// Grave
const graveColorTexture = textureLoader.load('./grave/plastered_stone_wall_1k/plastered_stone_wall_diff_1k.jpg')
const graveARMTexture = textureLoader.load('./grave/plastered_stone_wall_1k/plastered_stone_wall_arm_1k.jpg')
const graveNormalTexture = textureLoader.load('./grave/plastered_stone_wall_1k/plastered_stone_wall_nor_gl_1k.jpg')

graveColorTexture.colorSpace = THREE.SRGBColorSpace

graveColorTexture.repeat.set(0.3, 0.4)
graveARMTexture.repeat.set(0.3, 0.4)
graveNormalTexture.repeat.set(0.3, 0.4)

// Door
const doorColorTexture = textureLoader.load('./door/color.jpg')
const doorAlphaTexture = textureLoader.load('./door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('./door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('./door/height.jpg')
const doorNormalTexture = textureLoader.load('./door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('./door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('./door/roughness.jpg')

doorColorTexture.colorSpace = THREE.SRGBColorSpace

/**
 * House
 */

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20, 100, 100),
    new THREE.MeshStandardMaterial({
        // wireframe: true,
        alphaMap: floorAlphaTexture,
        transparent: true,
        map: floorColorTexture,
        aoMap: floorARMTexture,
        roughnessMap: floorARMTexture,
        metalnessMap: floorARMTexture,
        normalMap: floorNormalTexture,
        displacementMap: floorDisplacementTexture,
        displacementScale: 0.3,
        displacementBias: -0.2
    })
);
floor.rotation.x = - Math.PI * 0.5;
scene.add(floor);

gui.add(floor.material, 'displacementScale').min(0).max(1).step(0.001).name('FloorDisplacementScale');
gui.add(floor.material, 'displacementBias').min(-1).max(1).step(0.001).name('FloorDisplacementBias');


// House Container (Three.js Group)
const houseGroup = new THREE.Group();
scene.add(houseGroup);

// Walls
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4, 100, 100, 100),
    new THREE.MeshStandardMaterial({
        // wireframe: true,
        map: wallColorTexture,
        aoMap: wallARMTexture,
        roughnessMap: wallARMTexture,
        metalnessMap: wallARMTexture,
        normalMap: wallNormalTexture
    })
);

walls.position.y = 2.5 / 2;
houseGroup.add(walls);

// Own geometry for the roof (pyramid)
// Create an empty BufferGeometry
// const geometry = new THREE.BufferGeometry();
// // Define the vertices for the pyramid
// const vertices = new Float32Array([
//     // Base vertices
//     -2.8, 0, -2.8,  // Vertex 0
//     2.8, 0, -2.8,  // Vertex 1
//     2.8, 0, 2.8,  // Vertex 2
//     -2.8, 0, 2.8,  // Vertex 3

//     // Apex vertex
//     0, 1.5, 0   // Vertex 4 (top of the pyramid)
// ]);
// // Define the indices for the triangles
// const indices = [
//     // Base
//     0, 1, 2,
//     0, 2, 3,

//     // Sides
//     0, 4, 1,  // Side 1
//     1, 4, 2,  // Side 2
//     2, 4, 3,  // Side 3
//     3, 4, 0   // Side 4
// ];
// // Define UV coordinates for texture mapping
// const uvs = new Float32Array([
//     // Base UVs
//     0, 0,  // Vertex 0
//     1, 0,  // Vertex 1
//     1, 1,  // Vertex 2
//     0, 1,  // Vertex 3

//     // Apex UV (this is repeated for simplicity)
//     0.5, 0.5,  // Vertex 4

// ]);
// // Set the position attribute
// geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
// // Set the UV attribute
// geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
// // Set the indices
// geometry.setIndex(indices);
// // Compute normals for shading
// geometry.computeVertexNormals();
// // Create a material and mesh
// const material = new THREE.MeshStandardMaterial({
//     // wireframe: true,
//     // color: 0xffd700,
//     // side: THREE.DoubleSide // Ensure both sides are visible
//     map: roofColorTexture,
//     aoMap: roofARMTexture,
//     roughnessMap: roofARMTexture,
//     metalnessMap: roofARMTexture,
//     normalMap: roofNormalTexture
// });
// const pyramid = new THREE.Mesh(geometry, material);
// pyramid.position.y = 2.5;
// // Add the pyramid to the scene
// houseGroup.add(pyramid);

// Create an empty BufferGeometry
const geometry = new THREE.BufferGeometry();
// Define the vertices for each triangle (no shared vertices)
const vertices = new Float32Array([
    // Side 1
    -2.5, 0, -2.5,  // Vertex 0
    0, 1.5, 0,      // Vertex 4
    2.5, 0, -2.5,   // Vertex 1

    // Side 2
    2.5, 0, -2.5,   // Vertex 1
    0, 1.5, 0,      // Vertex 4
    2.5, 0, 2.5,    // Vertex 2

    // Side 3
    2.5, 0, 2.5,    // Vertex 2
    0, 1.5, 0,      // Vertex 4
    -2.5, 0, 2.5,   // Vertex 3

    // Side 4
    -2.5, 0, 2.5,   // Vertex 3
    0, 1.5, 0,      // Vertex 4
    -2.5, 0, -2.5,  // Vertex 0

    // Base (two triangles)
    -2.5, 0, -2.5,  // Vertex 0
    2.5, 0, -2.5,   // Vertex 1
    2.5, 0, 2.5,    // Vertex 2
    
    -2.5, 0, -2.5,  // Vertex 0
    2.5, 0, 2.5,    // Vertex 2
    -2.5, 0, 2.5    // Vertex 3
]);

// Define UV coordinates for each vertex
const uvs = new Float32Array([
    // Side 1
    0, 0,  // Vertex 0
    0.5, 1, // Vertex 4
    1, 0,  // Vertex 1

    // Side 2
    0, 0,  // Vertex 1
    0.5, 1, // Vertex 4
    1, 0,  // Vertex 2

    // Side 3
    0, 0,  // Vertex 2
    0.5, 1, // Vertex 4
    1, 0,  // Vertex 3

    // Side 4
    0, 0,  // Vertex 3
    0.5, 1, // Vertex 4
    1, 0,  // Vertex 0

    // Base (first triangle)
    0, 0,  // Vertex 0
    1, 0,  // Vertex 1
    1, 1,  // Vertex 2

    // Base (second triangle)
    0, 0,  // Vertex 0
    1, 1,  // Vertex 2
    0, 1   // Vertex 3
]);

// Set the position and UV attributes
geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));

// Compute normals for shading
geometry.computeVertexNormals();

// Create a material and mesh
const material = new THREE.MeshStandardMaterial({
    // wireframe: true,
    // color: 0xffd700,
    map: roofColorTexture,
    aoMap: roofARMTexture,
    roughnessMap: roofARMTexture,
    metalnessMap: roofARMTexture,
    normalMap: roofNormalTexture
});

const pyramid = new THREE.Mesh(geometry, material);
pyramid.position.y = 2.5;

// Add the pyramid to the scene
houseGroup.add(pyramid);


// Roof
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1.5, 4),
    new THREE.MeshStandardMaterial({
        map: roofColorTexture,
        aoMap: roofARMTexture,
        roughnessMap: roofARMTexture,
        metalnessMap: roofARMTexture,
        normalMap: roofNormalTexture
    })
);
roof.position.y = 2.5 + (1.5 / 2);
roof.rotation.y = Math.PI * 0.25;
// houseGroup.add(roof);

// door
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
    new THREE.MeshStandardMaterial({
        map: doorColorTexture,
        transparent: true,
        alphaMap: doorAlphaTexture,
        aoMap: doorAmbientOcclusionTexture,
        displacementMap: doorHeightTexture,
        displacementScale: 0.15,
        displacementBias: -0.04,
        normalMap: doorNormalTexture,
        metalnessMap: doorMetalnessTexture,
        roughnessMap: doorRoughnessTexture
    })
);
door.position.y = 1;
// door.position.z = 2 + 0.001;
door.position.z = 2;
houseGroup.add(door);

// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({
    color: '#ccffcc',
    map: bushColorTexture,
    aoMap: bushARMTexture,
    roughnessMap: bushARMTexture,
    metalnessMap: bushARMTexture,
    normalMap: bushNormalTexture
});

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(0.8, 0.2, 2.2);
bush1.rotation.x = - 0.75

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, 0.1, 2.1);
bush2.rotation.x = - 0.75

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(- 0.8, 0.1, 2.2);
bush3.rotation.x = - 0.75

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(- 1, 0.05, 2.6);
bush4.rotation.x = - 0.75

houseGroup.add(bush1, bush2, bush3, bush4);

// Graves
const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMAterial = new THREE.MeshStandardMaterial({
    map: graveColorTexture,
    aoMap: graveARMTexture,
    roughnessMap: graveARMTexture,
    metalnessMap: graveARMTexture,
    normalMap: graveNormalTexture
});

const graves = new THREE.Group();
scene.add(graves);

for (let i = 0; i < 30; i++) {

    const angle = Math.random() * Math.PI * 2;
    const radius = 3 + Math.random() * 4;
    const x = Math.sin(angle) * radius;
    const z = Math.cos(angle) * radius;

    // Mesh
    const grave = new THREE.Mesh(graveGeometry, graveMAterial);
    grave.position.x = x;
    grave.position.y = Math.random() * 0.4;
    grave.position.z = z;
    grave.rotation.x = (Math.random() - 0.5) * 0.4;
    grave.rotation.y = (Math.random() - 0.5) * 0.4;
    grave.rotation.z = (Math.random() - 0.5) * 0.4;

    // Add to graves group
    graves.add(grave);
};


/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#86cdff', 0.275)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight('#86cdff', 1)
directionalLight.position.set(3, 2, -8)
scene.add(directionalLight)

// Door light
const doorLight = new THREE.PointLight('#ff7d46', 5)
doorLight.position.set(0, 2.2, 2.5)
houseGroup.add(doorLight)

// Light Helpers. help shows where are the light
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2);
directionalLightHelper.visible = false;
scene.add(directionalLightHelper);


// Camera Helpers. help shows where are the cameras
const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
directionalLightCameraHelper.visible = false;
scene.add(directionalLightCameraHelper);

/**
 * Ghosts
 */
const ghost1 = new THREE.PointLight('#8800ff', 6)
const ghost2 = new THREE.PointLight('#ff0088', 6)
const ghost3 = new THREE.PointLight('#ff0000', 6)
scene.add(ghost1, ghost2, ghost3)




/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Shadows
 */
// Renderer
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
// Cast and receive
directionalLight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true

walls.castShadow = true
walls.receiveShadow = true
roof.castShadow = true
floor.receiveShadow = true

for (const grave of graves.children) {
    grave.castShadow = true
    grave.receiveShadow = true
};

// Mappings for optimizing the shadows
directionalLight.shadow.mapSize.width = 256
directionalLight.shadow.mapSize.height = 256
directionalLight.shadow.camera.top = 8
directionalLight.shadow.camera.right = 8
directionalLight.shadow.camera.bottom = - 8
directionalLight.shadow.camera.left = - 8
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 20

ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far = 10

ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far = 10

ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far = 10

/**
 * Sky
 */
const sky = new Sky()
// sky.scale.set(100, 100, 100) // or
sky.scale.setScalar(100)
scene.add(sky)

sky.material.uniforms['turbidity'].value = 10
sky.material.uniforms['rayleigh'].value = 3
sky.material.uniforms['mieCoefficient'].value = 0.1
sky.material.uniforms['mieDirectionalG'].value = 0.95
sky.material.uniforms['sunPosition'].value.set(0.3, -0.038, -0.95)

/**
 * Fog
 */
// scene.fog = new THREE.Fog('#04343f', 1, 13)
scene.fog = new THREE.FogExp2('#04343f', 0.1)

/**
 * Animate
 */
// Alternative to the clock and fixes bugs with clock
const timer = new Timer()

const tick = () => {
    // Timer
    timer.update()
    const elapsedTime = timer.getElapsed()

    // Ghost
    const ghost1Angle = elapsedTime * 0.5;
    ghost1.position.x = Math.cos(ghost1Angle) * 4;
    ghost1.position.z = Math.sin(ghost1Angle) * 4;
    ghost1.position.y = Math.sin(ghost1Angle) * Math.sin(ghost1Angle * 2.34) * Math.sin(ghost1Angle * 3.45);

    const ghost2Angle = - elapsedTime * 0.38;
    ghost2.position.x = Math.cos(ghost2Angle) * 5;
    ghost2.position.z = Math.sin(ghost2Angle) * 5;
    ghost2.position.y = Math.sin(ghost2Angle) * Math.sin(ghost2Angle * 2.34) * Math.sin(ghost2Angle * 3.45);

    const ghost3Angle = elapsedTime * 0.23
    ghost3.position.x = Math.cos(ghost3Angle) * 6
    ghost3.position.z = Math.sin(ghost3Angle) * 6
    ghost3.position.y = Math.sin(ghost3Angle) * Math.sin(ghost3Angle * 2.34) * Math.sin(ghost3Angle * 3.45)

    // Flicker door light
    setTimeout(() => {
        for (let i = 0; i < 6; i++) {
            doorLight.intensity = Math.random(i);
        }
    }, elapsedTime * 2000);

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()