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

    this.add.text(x * 0.5, y * 0.26, "RABBIT TRANSIT",  {
      fontSize: "8px",
      fontFamily: "'Press Start 2P'",
      color: "#ffffff",
    }).setOrigin(0.5)

    this.inputManager = new InputManager(this);
    this.inputManager.setup();

    // Cursor para mover entre opciones
    this.cursor = this.input.keyboard.createCursorKeys();
  }

  update() {
    // Detectar input de joystick o teclado
    this.inputManager.update();

    // Detecta si hay movimiento en los ejes del joystick
    const movement = this.inputManager.getMovement();
    const isJoystickMoved = Math.abs(movement.x) > 0 || Math.abs(movement.y) > 0;

    // Detecta si se presiona cualquier botón del joystick
    const isButtonPressed = this.inputManager.pad?.buttons.some(button => button.pressed);

    // Detecta si se presiona una tecla del teclado
    const isKeyPressed =
      this.cursor.up.isDown ||
      this.cursor.down.isDown ||
      this.cursor.left.isDown ||
      this.cursor.right.isDown;

    if (isKeyPressed || isJoystickMoved || isButtonPressed) {
      // Inicializa las vidas
      this.registry.set("lives", 3);

      // Cambia a la escena del nivel uno
      this.scene.start("level-one", { lives: this.registry.get("lives") });
    }
  }

}
