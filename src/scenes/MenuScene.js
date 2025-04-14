// first charges
import { Scene } from "phaser";
import { InputManager } from "../components/InputManager";

export class MenuScene extends Scene {
  constructor() {
    super("main-menu");
  }

  create() {
    const x = this.scale.width
    const y = this.scale.height
    this.add.sprite(x  * 0.5,y  * 0.5, "background");

    this.add.sprite(x * 0.5, y * 0.5, "rabbit");

    this.inputManager = new InputManager(this);
    this.inputManager.setup();

    // Cursor para mover entre opciones
    this.cursor = this.input.keyboard.createCursorKeys();
  }

  update() {
    // Joysticks Input
    this.inputManager.update();
    const direction = this.inputManager.getMenuNavigation();
    
    if (this.cursor) {
      // Initialize lives
      this.registry.set('lives', 3);
      this.scene.start("level-one", { lives: this.registry.get('lives') });
      // this.scene.start('game-scene', { level: 'level1', phase: 'phase1' })
    } 
  }
}
