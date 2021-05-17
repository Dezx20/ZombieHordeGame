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
  bulletHitTest({
    bullet: player.shooting.bullet,
    zombies: zombieSpawner.spawns,
    bulletRadius: 8,
    zombieRadius: 16
  });
});

function bulletHitTest({ bullet, zombies, bulletRadius, zombieRadius }) {
  // console.log(zombies);
  bullet.forEach((b) => {
    zombies.forEach((zombie, index) => {
      console.log(zombie.position);
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
