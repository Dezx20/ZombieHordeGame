import * as PIXI from "pixi.js";
//import Matter from "matter-js";
import Player from "./player";
import Zombie from "./zombie";
import Spawner from "./spawner";
import Weather from "./weather";
import GameState from "./game-state";
import { subTextStyle, textStyle, zombies } from "./globals";

const canvasSize = 300;
const canvas = document.getElementById("mycanvas");
const app = new PIXI.Application({
  view: canvas,
  width: canvasSize,
  height: canvasSize,
  backgroundColor: 0x312a2b,
  resolution: 2
});

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
//MUSIC
const music = new Audio("./assets/HordeZee.mp3");
music.addEventListener("timeupdate", function () {
  if (this.currentTime > this.duration - 0.2) {
    this.currentTime = 0;
  }
});
//ZOMBIE SOUNDS
const zombieHorde = new Audio("./assets/horde.mp3");
zombieHorde.volume = 0.6;
zombieHorde.addEventListener("timeupdate", function () {
  if (this.currentTime > this.duration - 0.2) {
    this.currentTime = 0;
  }
});

inItGame();

async function inItGame() {
  app.gameState = GameState.PREINTRO;
  try {
    console.log("Loading.....");
    await loadAssets();
    console.log("Loaded!!");
    app.weather = new Weather({ app });
    let player = new Player({ app });
    let zombieSpawner = new Spawner({
      app,
      create: () => new Zombie({ app, player })
    });

    let gamePreIntroScene = createScene("HordeZee!!", "Click to Continue!");
    let gameStartScene = createScene("HordeZee!!", "Click to Start!");
    let gameOverScene = createScene("HordeZee!!", "GAME OVER");
    // app.gameStarted = false;

    app.ticker.add((delta) => {
      if (player.dead) app.gameState = GameState.GAMEOVER;

      gamePreIntroScene.visible = app.gameState === GameState.PREINTRO;
      gameStartScene.visible = app.gameState === GameState.START;
      gameOverScene.visible = app.gameState === GameState.GAMEOVER;

      switch (app.gameState) {
        case GameState.PREINTRO:
          player.scale = 4;
          break;
        case GameState.INTRO:
          player.scale -= 0.01;
          if (player.scale <= 1) app.gameState = GameState.START;
          break;
        case GameState.RUNNING:
          player.update(delta);
          zombieSpawner.spawns.forEach((zombie) => zombie.update(delta));
          bulletHitTest({
            bullet: player.shooting.bullet,
            zombies: zombieSpawner.spawns,
            bulletRadius: 5,
            zombieRadius: 10
          });
          break;
        default:
          break;
      }
      // if (app.gameStarted === false) return;
    });
  } catch (e) {
    console.log(e);
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

function createScene(sceneText, sceneSubText) {
  const sceneContainer = new PIXI.Container();
  const text = new PIXI.Text(sceneText, new PIXI.TextStyle(textStyle));
  text.x = app.screen.width / 2;
  text.y = app.screen.height / 10;
  text.anchor.set(0.5);
  const subText = new PIXI.Text(sceneSubText, new PIXI.TextStyle(subTextStyle));
  subText.x = app.screen.width / 2;
  subText.y = app.screen.height / 3;
  subText.anchor.set(0.5);

  sceneContainer.zIndex = 1;
  sceneContainer.addChild(text);
  sceneContainer.addChild(subText);
  app.stage.addChild(sceneContainer);
  return sceneContainer;
}
// function startGame() {
//   app.gameStarted = true;
//   app.weather.enableSound();
// }

async function loadAssets() {
  return new Promise((resolve, reject) => {
    zombies.forEach((z) => PIXI.Loader.shared.add(`assets/${z}.json`));
    PIXI.Loader.shared.add("assets/hero_male.json");
    PIXI.Loader.shared.add("bullet", "assets/bullet.png");
    PIXI.Loader.shared.add("rain", "assets/rain.png");
    PIXI.Loader.shared.onComplete.add(resolve);
    PIXI.Loader.shared.onError.add(reject);
    PIXI.Loader.shared.load();
  });
}

function clickHandler() {
  switch (app.gameState) {
    case GameState.PREINTRO:
      app.gameState = GameState.INTRO;
      music.play();
      app.weather.enableSound();
      break;
    case GameState.START:
      app.gameState = GameState.RUNNING;
      zombieHorde.play();
      break;

    default:
      break;
  }
}

document.addEventListener("click", clickHandler);
