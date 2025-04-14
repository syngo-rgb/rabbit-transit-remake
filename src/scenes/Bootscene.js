// first charges
import { Scene } from "phaser";

export class BootScene extends Scene {
  constructor() {
    super("Boot");
  }

  preload() {
    this.load.image("background", "./assets/pradera.png")
    this.load.image("rabbit", "./assets/rabbit.png")
    this.load.image('mariposa', './assets/mariposa.png')
  }

  create() {
    this.scene.start("main-menu")
  }
}

