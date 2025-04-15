// first charges
import { Scene } from "phaser";

export class BootScene extends Scene {
  constructor() {
    super("Boot");
  }

  preload() {
    this.load.image("background", "./assets/pradera.png")
    this.load.image("fase2background", "./assets/fase2.png")

    this.load.image("rabbit", "./assets/rabbit.png")
    this.load.image('mariposa', './assets/mariposa.png')

    this.load.image("platforma", './assets/plataforma-bl.png')

    this.load.spritesheet('olas', './assets/olas-spr-sh.png', {
      frameWidth: 320,
      frameHeight: 224,
    })

    // Anims del conejo?
    // this.load.spritesheet('', './assets/', {
    //   frameWidth: ,
    //   frameHeight: ,
    // })

    // this.load.spritesheet('', './assets/', {
    //   frameWidth: ,
    //   frameHeight: ,
    // })
  }

  create() {
    this.scene.start("main-menu")
  }
}

