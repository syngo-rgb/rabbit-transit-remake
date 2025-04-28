import { BootScene } from './scenes/Bootscene.js'
import { MenuScene } from './scenes/MenuScene.js'
import { LevelOneScene } from './scenes/LevelOneScene.js'
import { LevelTwoScene } from './scenes/LevelTwoScene.js'
import { LevelThreeScene } from './scenes/LevelThreeScene.js'
import { LevelFourScene } from './scenes/LevelFourScene.js'
import { WinScene } from './scenes/WinScene.js'
import { CutScene } from './scenes/CutScene.js' 
import UIScene from './scenes/UIScene.js'

console.log("se esta ejecutando Main");
const config = {
  type: Phaser.AUTO,
  width: 320,
  height: 224,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  backgroundColor: "#262626", // 000000  o Negro o Gris
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: true,
    },
  },
  input: {
    gamepad: true
  },

  scene: [BootScene, MenuScene, LevelOneScene, LevelTwoScene, LevelThreeScene, LevelFourScene, WinScene, CutScene, UIScene]
}

export default new Phaser.Game(config);
