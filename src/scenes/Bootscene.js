// BootScene.js
import { Scene } from "phaser";
  
export class BootScene extends Scene {
  constructor() {
    super("Boot");
  }

  preload() {
    this.load.spritesheet("tittle", "./assets/title.png",  {
      frameWidth: 152,
      frameHeight: 75,
    });

    this.load.image("background", "./assets/pradera.png");
    this.load.image("fase2background", "./assets/fase2.png");
    this.load.image("background2", "./assets/pradera2.png");

    this.load.spritesheet("rabbit", "./assets/rabbit-idle-spritesheet.png",  {
      frameWidth: 60,
      frameHeight: 60,
    });
    this.load.spritesheet("rabbit_life", "./assets/rabbit_life.png",  {
      frameWidth: 9,
      frameHeight: 8,
    });

    // Salto
    this.load.spritesheet("rabbit_jump", "./assets/rabbit-spritesheet.png",  {
      frameWidth: 60,
      frameHeight: 60,
    });

    this.load.spritesheet("mariposa", "./assets/mariposa.png", {
      frameWidth: 7,
      frameHeight: 11,
    });
    this.load.image("platforma", './assets/plataforma-bl.png');
    this.load.spritesheet('olas', './assets/olas-spr-sh.png', {
      frameWidth: 320,
      frameHeight: 224,
    });
    this.load.image("nube", "./assets/nube.png");

    // 🎵 Carga de sonidos
    this.load.audio("cut_scene", "./assets/audio/cut_scene.wav");
    this.load.audio("jump_down", "./assets/audio/jump_down.wav");
    this.load.audio("jump_up", "./assets/audio/jump_up.wav");
    this.load.audio("lose_game", "./assets/audio/lose_game.wav");
    this.load.audio("lose_life", "./assets/audio/lose_life.wav");
    this.load.audio("music_level1", "./assets/audio/music_level1.mp3");
    this.load.audio("music_level2", "./assets/audio/music_level2.mp3");
    this.load.audio("music_menu", "./assets/audio/music_menu.mp3");
    this.load.audio("no_move", "./assets/audio/no_move.wav");
    this.load.audio("tortoise1", "./assets/audio/tortoise1.wav");
    this.load.audio("tortoise2", "./assets/audio/tortoise2.wav");
    this.load.audio("win_game", "./assets/audio/win_game.wav");
  }

  create() {


    this.scene.start("main-menu");
  }
}
