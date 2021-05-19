import * as PIXI from "pixi.js";
//import Matter from "matter-js";
import Player from "./player";
import Zombie from "./zombie";
import Spawner from "./spawner";

const canvasSize = 300;
const canvas = document.getElementById("mycanvas");
const app = new PIXI.Application({
  view: canvas,
  width: canvasSize,
  height: canvasSize,
  backgroundColor: 0x5c812f
});
inItGame();

async function inItGame() {
  try {
    console.log("Loading.....");
    await loadAssets();
    console.log("Loaded!!");
    let player = new Player({ app });
    let zombieSpawner = new Spawner({
      app,
      create: () => new Zombie({ app, player })
    });

    let gameStartScene = createScene("CLICK TO START!");
    let gameOverScene = createScene("GAME OVER");
    app.gameStarted = false;
    app.ticker.add((delta) => {
      gameOverScene.visible = player.dead;
      gameStartScene.visible = !app.gameStarted;
      if (app.gameStarted === false) return;
      player.update(delta);
      zombieSpawner.spawns.forEach((zombie) => zombie.update(delta));
      bulletHitTest({
        bullet: player.shooting.bullet,
        zombies: zombieSpawner.spawns,
        bulletRadius: 8,
        zombieRadius: 16
      });
    });
  } catch (e) {
    console.log(e.message);
    console.log("Load Failed!!");
  }
}

function bulletHitTest({ bullet, zombies, bulletRadius, zombieRadius }) {
  bullet.forEach((b) => {
    zombies.forEach((zombie, index) => {
      let dx = zombie.position.x - b.position.x;
      let dy = zombie.position.y - b.position.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < bulletRadius + zombieRadius) {
        zombies.splice(index, 1);
        zombie.kill();
      }
    });
  });
}

function createScene(sceneText) {
  const sceneContainer = new PIXI.Container();
  const text = new PIXI.Text(sceneText);
  text.x = app.screen.width / 2;
  text.y = 0;
  text.anchor.set(0.5);
  sceneContainer.zIndex = 1;
  sceneContainer.addChild(text);
  app.stage.addChild(sceneContainer);
  return sceneContainer;
}
function startGame() {
  app.gameStarted = true;
}

async function loadAssets() {
  return new Promise((resolve, reject) => {
    PIXI.Loader.shared.add("assets/hero_male.json");
    PIXI.Loader.shared.onComplete.add(resolve);
    PIXI.Loader.shared.onError.add(reject);
    PIXI.Loader.load();
  });
}

document.addEventListener("click", startGame);
