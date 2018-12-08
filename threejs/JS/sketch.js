// let THREE = require('three');

let Colors = {
  blue: new THREE.Color(0x404d79),
  pink: new THREE.Color(0xf15a83),
  yellow: new THREE.Color(0xfabd14),
  green: new THREE.Color(0x7dc770),
  grey: new THREE.Color(0xc8c8c8),
  white: new THREE.Color('white'),
};

let scene, camera, fieldOfView, aspectRatio, nearPlane, farPlane, renderer, container, clock, hand, HEIGHT, WIDTH;
let gifList = [];
let cubesAnim, cubesTexture, fireTexture, fire, cat, catTex, airport, airportTex;

window.addEventListener('load', init, false);

function createScene() {
  container = document.getElementById('world');

  HEIGHT = container.clientHeight;
  WIDTH = container.clientWidth;

  scene = new THREE.Scene();
  aspectRatio = WIDTH / HEIGHT;
  fieldOfView = 55;
  nearPlane = 0.1;
  farPlane = 10000;
  camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
  let camPos = new THREE.Vector3(0, 0, 10);
  camera.position.copy(camPos);
  clock = new THREE.Clock();
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(WIDTH, HEIGHT);

  // scene.fog = new THREE.Fog(0xffffff, 0, 20);
  container.appendChild(renderer.domElement);

  window.addEventListener('resize', handleWindowResize, false);
}

function handleWindowResize() {
  HEIGHT = container.clientHeight;
  WIDTH = container.clientWidth;

  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
}

class Gif {
  constructor() {
    this.number = 0;
    this.mesh = new THREE.Object3D();
    this.geom = new THREE.PlaneGeometry(4.5, 4.5);

    this.mat = new THREE.MeshBasicMaterial({
      // color: new THREE.Color(Math.random(), Math.random(), Math.random()),
      // map: cubesTexture,
    });
    let randnum = getRandomInt(3);
    if (randnum == 0) {
      this.mat.map = cubesTexture;
    }
    if (randnum == 1) {
      this.mat.map = fireTexture;
    }
    if (randnum == 2) {
      this.geom = new THREE.PlaneGeometry(7, 4.5);
      this.mat.map = airportTex; // catTex;
    }

    this.mat.transparent = true;
    this.mat.opacity = 1;
    let cubeMesh = new THREE.Mesh(this.geom, this.mat);

    this.mesh.add(cubeMesh);
    this.timeToDie = getRandomArbitrary(4, 8);
    this.clock = new THREE.Clock(true);
  }

  selfDestruct() {
    let timetime = this.clock.getElapsedTime();
    if (timetime >= 6.5) {
      //this.timeToDie
      //9
      scene.remove(this.mesh);

      this.geom.dispose();
      this.mat.dispose();

      gifList[this.number] = undefined;
    }
  }
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function DrawTheGifs() {
  let randIterations = getRandomInt(3);
  // for (let i = 0; i < randIterations; i++) {
  let min = -5;
  let max = 5;
  let pos = new THREE.Vector3(
    Math.floor(getRandomArbitrary(min, max + 3)),
    Math.floor(getRandomArbitrary(min, max)),
    0
    // getRandomArbitrary(-1, 1)
  );
  console.log(pos);
  let gifCube = new Gif();
  gifCube.mesh.position.copy(pos);

  gifList.push(gifCube);
  gifCube.number = gifList.length - 1;
  scene.add(gifCube.mesh);
  // }
}

function init() {
  createScene();

  airportTex = new THREE.TextureLoader().load('images/airport.png');
  catTex = new THREE.TextureLoader().load('images/jul.png');
  cubesTexture = new THREE.TextureLoader().load('images/cubes3.png');
  fireTexture = new THREE.TextureLoader().load('images/fire2.png');
  cubesAnim = new TextureAnimator(cubesTexture, 8, 5, 40, 40); // texture, #horiz, #vert, #total, duration.
  fire = new TextureAnimator(fireTexture, 7, 4, 28, 45); // texture, #horiz, #vert, #total, duration.
  cat = new TextureAnimator(catTex, 5, 3, 12, 45); // texture, #horiz, #vert, #total, duration.
  airport = new TextureAnimator(airportTex, 16, 24, 16 * 24, 40); //24 on 16

  loop();
}

let time = getRandomArbitrary(0.7, 2);
function loop() {
  renderer.render(scene, camera);
  requestAnimationFrame(loop);

  let delta = clock.getDelta();
  time -= delta; //clock.getDelta();
  if (time <= 0) {
    console.log(clock.elapsedTime);
    DrawTheGifs();
    time = getRandomArbitrary(1.2, 3);
  }

  gifList.forEach(g => {
    if (g != undefined) {
      g.selfDestruct();
    }
  });

  cubesAnim.update(1000 * delta);
  fire.update(1000 * delta);
  airport.update(1000 * delta);
  // cat.update(1000 * delta);
}

function TextureAnimator(texture, tilesHoriz, tilesVert, numTiles, tileDispDuration) {
  // note: texture passed by reference, will be updated by the update function.

  this.tilesHorizontal = tilesHoriz;
  this.tilesVertical = tilesVert;
  // how many images does this spritesheet contain?
  //  usually equals tilesHoriz * tilesVert, but not necessarily,
  //  if there at blank tiles at the bottom of the spritesheet.
  this.numberOfTiles = numTiles;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1 / this.tilesHorizontal, 1 / this.tilesVertical);

  // how long should each image be displayed?
  this.tileDisplayDuration = tileDispDuration;

  // how long has the current image been displayed?
  this.currentDisplayTime = 0;

  // which image is currently being displayed?
  this.currentTile = 0;

  this.update = function(milliSec) {
    this.currentDisplayTime += milliSec;
    while (this.currentDisplayTime > this.tileDisplayDuration) {
      this.currentDisplayTime -= this.tileDisplayDuration;
      this.currentTile++;
      if (this.currentTile == this.numberOfTiles) this.currentTile = 0;
      let currentColumn = this.currentTile % this.tilesHorizontal;
      texture.offset.x = currentColumn / this.tilesHorizontal;
      let currentRow = Math.floor(this.currentTile / this.tilesHorizontal);
      texture.offset.y = 1 - currentRow / this.tilesVertical;
    }
  };
}

// document.addEventListener('keydown', onDocumentKeyDown, false);
// function onDocumentKeyDown(event) {
//   let keyCode = event.which;
//   if (keyCode == 32) {
//   }
// }
