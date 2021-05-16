import * as PIXI from "pixi.js";
//import Matter from "matter-js";
import Player from "./player";
import Zombie from "./zombie";
import Spawner from "./spawner";

const canvasSize = 500;
const canvas = document.getElementById("mycanvas");
const app = new PIXI.Application({
  view: canvas,
  width: canvasSize,
  height: canvasSize,
  backgroundColor: 0x5c812f
});

let player = new Player({ app });
let zombieSpawner = new Spawner({ create: () => new Zombie({ app, player }) });

app.ticker.add((delta) => {
  player.update();
  zombieSpawner.spawns.forEach((zombie) => zombie.update());
});
