// let THREE = require('three');

let scene,
  scene2,
  camera,
  fieldOfView,
  aspectRatio,
  nearPlane,
  farPlane,
  renderer,
  container,
  textDIV,
  clock,
  hand,
  HEIGHT,
  WIDTH;
let gifList = [];
let cubesAnim, cubesTexture, fireTexture, fire, airport, airportTex, alef, alefTex, dance, danceTex; // cat, catTex,
let TexLoader, manager; // = new THREE.TextureLoader(manager);
let isLoaded = false;

let lastPos = new THREE.Vector3(0, 0, 0);

// let manager = new THREE.LoadingManager();

let loadSpheres = [];

// let textDIV = document.querySelector("selectors");

window.addEventListener('load', init, false);

function createScene() {
  container = document.getElementById('world');
  textDIV = document.getElementById('textDIV');

  HEIGHT = container.clientHeight;
  WIDTH = container.clientWidth;

  scene = new THREE.Scene();
  scene2 = new THREE.Scene();
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
  container.appendChild(renderer.domElement);

  window.addEventListener('resize', handleWindowResize, false);

  manager = new THREE.LoadingManager();
  TexLoader = new THREE.TextureLoader(manager);

  manager.onStart = function(url, itemsLoaded, itemsTotal) {
    console.log('Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
  };
  manager.onProgress = function(url, itemsLoaded, itemsTotal) {
    console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
  };
  manager.onLoad = function() {
    console.log('all loaded!');
    isLoaded = true;
    textDIV.classList.remove('test');
  };
  manager.onError = function(url) {
    console.log('There was an error loading ' + url);
  };
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
    if (WIDTH > 768) {
      this.geom = new THREE.PlaneGeometry(4.5, 4.5);
    } else {
      this.geom = new THREE.PlaneGeometry(3.5, 3.5);
    }

    this.mat = new THREE.MeshBasicMaterial();
    let randnum = getRandomInt(5);
    if (randnum == 0) {
      this.mat.map = cubesTexture;
    }
    if (randnum == 1) {
      this.mat.map = fireTexture;
    }
    if (randnum == 2) {
      if (WIDTH > 768) {
        this.geom = new THREE.PlaneGeometry(7, 4.5);
      } else {
        this.geom = new THREE.PlaneGeometry(5, 3.5);
      }

      this.mat.map = airportTex;
    }
    if (randnum == 3) {
      this.mat.map = alefTex;
    }
    if (randnum == 4) {
      this.mat.map = danceTex;
    }

    this.mat.map.minFilter = THREE.LinearFilter;
    // this.mat.map.magFiler = THREE.NearestFilter;

    this.mat.transparent = true;
    this.mat.opacity = 1;
    let cubeMesh = new THREE.Mesh(this.geom, this.mat);

    this.mesh.add(cubeMesh);
    this.clock = new THREE.Clock(true);
  }

  selfDestruct() {
    let timetime = this.clock.getElapsedTime();
    if (timetime >= 7.5) {
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

function getRandomIntArbitrary(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function instantiateGif() {
  // let randIterations = getRandomInt(3);
  // for (let i = 0; i < randIterations; i++) {

  let min, max, maxX, pos;

  if (WIDTH > 768) {
    min = -4;
    max = 4;
    maxX = max + 3;
    pos = new THREE.Vector3(getRandomIntArbitrary(min, maxX), getRandomIntArbitrary(min, max), 0);
  } else {
    min = -2;
    max = 2;
    pos = new THREE.Vector3(getRandomIntArbitrary(0, 1), getRandomIntArbitrary(min - 1, max + 1), 0);
  }

  //handels gifs created in same X or Y
  let rollet = getRandomInt(0, 2);

  if (pos.x == lastPos.x) {
    console.log('changing x...');
    if (pos.x == min || pos.x == maxX) {
      if (pos.x == min) {
        pos.x += 2;
      }
      if (pos.x == maxX) {
        pos.x -= 2;
      }
    } else {
      if (rollet == 0) {
        pos.x -= 2;
      } else {
        pos.x += 2;
      }
    }
  }
  if (pos.y == lastPos.y) {
    console.log('changing y...');
    if (pos.y == min || pos.y == max) {
      if (pos.y == min) {
        pos.y += 2;
      }
      if (pos.y == max) {
        pos.y -= 2;
      }
    } else {
      if (rollet == 0) {
        pos.y -= 2;
      } else {
        pos.y += 2;
      }
      // pos.y = Math.floor(getRandomArbitrary(min, max));
    }
  }

  let gifCube = new Gif();
  gifCube.mesh.position.copy(pos);

  gifList.push(gifCube);
  gifCube.number = gifList.length - 1;
  scene.add(gifCube.mesh);
  lastPos.copy(pos);
  // }
}

function animLoad() {
  cubesTexture = TexLoader.load('images/cubes2.png');
  fireTexture = TexLoader.load('images/fire.jpg');
  alefTex = TexLoader.load('images/alef.jpg');
  danceTex = TexLoader.load('images/dance.png');
  airportTex = TexLoader.load('images/airport2.jpg');

  cubesTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  fireTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  alefTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  danceTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  airportTex.anisotropy = renderer.capabilities.getMaxAnisotropy();

  cubesAnim = new TextureAnimator(cubesTexture, 8, 8, 40, 40);
  fire = new TextureAnimator(fireTexture, 8, 4, 8 * 4 - 4, 45);
  airport = new TextureAnimator(airportTex, 16, 8, 110, 80);
  alef = new TextureAnimator(alefTex, 16, 8, 16 * 8, 45);
  dance = new TextureAnimator(danceTex, 16, 8, 128, 30);
}

function init() {
  createScene();
  animLoad();
  testLoading();
  loop();
}

let time = getRandomArbitrary(1, 3);

function loop() {
  let delta = clock.getDelta();

  if (isLoaded == true) {
    time -= delta;
    if (time <= 0) {
      instantiateGif();
      time = getRandomArbitrary(1, 3);
    }

    gifList.forEach(g => {
      if (g != undefined) {
        g.selfDestruct();
      }
    });

    cubesAnim.update(1000 * delta);
    fire.update(1000 * delta);
    airport.update(1000 * delta);
    alef.update(1000 * delta);
    dance.update(1000 * delta);
    renderer.render(scene, camera);
  } else {
    for (let ls = 0; ls < loadSpheres.length; ls++) {
      loadSpheres[ls].position.setComponent(1, Math.sin(10 * clock.elapsedTime + ls) * 0.2);
    }
    renderer.render(scene2, camera);
  }

  requestAnimationFrame(loop);
}

function testLoading() {
  for (let i = 0; i < 4; i++) {
    let Cgeometry = new THREE.SphereGeometry(0.1, 6, 6);
    let Cmaterial = new THREE.MeshBasicMaterial({ color: 0xff71bc });
    let Csphere = new THREE.Mesh(Cgeometry, Cmaterial);
    Csphere.position.set(0.2 * i, 0, 0);
    scene2.add(Csphere);
    loadSpheres.push(Csphere);
  }
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
      if (this.currentTile >= this.numberOfTiles) {
        this.currentTile = 0;
      }
      let currentColumn = this.currentTile % this.tilesHorizontal;
      texture.offset.x = currentColumn / this.tilesHorizontal;
      let currentRow = Math.floor(this.currentTile / this.tilesHorizontal);
      texture.offset.y = (this.tilesVertical - 1 - currentRow) / this.tilesVertical;
    }
  };
}
