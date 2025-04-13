// first charges
import { Scene } from "phaser";

export class BootScene extends Scene {
  constructor() {
    super("Boot");
  }

  preload() {
    this.load.image("background", "./assets/welcome.png")
    this.load.image("rabbit", "./assets/rabbit.png")
  }

  create() {
    this.scene.start("main-menu")
  }
}
