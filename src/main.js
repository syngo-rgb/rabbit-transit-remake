import { BootScene } from './scenes/Bootscene.js'

import { MenuScene } from './scenes/MenuScene.js'
import { LevelOneScene } from './scenes/LevelOneScene.js'
import { LevelTwoScene } from './scenes/LevelTwoScene.js'
// import { CutScene } from './scenes/CutScene.js'
// import { UIScene } from './scenes/UIScene.js'

const config = {
  type: Phaser.AUTO,
  width: 320,
  height: 224,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },

  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 500 },
      debug: false,
    },
  },
  input: {
    gamepad: true
  },

  backgroundColor: "#262626", // 000000  o Negro o Gris
  scene: [BootScene, MenuScene, LevelOneScene, LevelTwoScene]
}

export default new Phaser.Game(config);
