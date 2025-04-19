// scenes/MenuScene.js
import { Scene } from "phaser";
import { InputManager } from "../components/InputManager";
import { initialAnimations } from "../anims/anims";
import { SoundManager } from "../managers/SoundManager";

export class MenuScene extends Scene {
  constructor() {
    super("main-menu");
  }

  create() {
    const x = this.scale.width
    const y = this.scale.height
    this.add.sprite(x  * 0.5,y  * 0.5, "background2").setDepth(0);
    initialAnimations(this)

    // 🎛️ Crear e iniciar el SoundManager
    this.soundManager = new SoundManager(this);
    this.soundManager.initSounds();
    this.soundManager.playMusic("music_menu");
    
    // 💾 Guardamos el SoundManager en el registro para usarlo luego
    this.registry.set("soundManager", this.soundManager);

    // Background
    const olas = this.add.sprite(160, 112, 'olas').setDepth(1);
    olas.play("olas-idle", true)

    this.nube = this.add.tileSprite(x * 0.5, y * 0.1, 0, 0, "nube").setDepth(1);
    this.parallax = [{
      speed: 0.2,
      sprite: this.nube
    }]

    this.player = this.add.sprite(x * 0.5, y * 0.5, "rabbit");
    this.player.play("rabbit_right", true)

    this.tittle = this.add.sprite(x * 0.5, y * 0.28, "tittle").setOrigin(0.5)
    this.tittle.play("tittle_idle", true)

    // this.add.text(x * 0.5, y * 0.26, "TRANSITINI CONEJINNI",  {
    //   fontSize: "12px",
    //   fontFamily: "'Press Start 2P'",
    //   color: "#ffffff",
    //   letterSpacing: 3, // Espaciado entre letras en píxeles
    // }).setOrigin(0.5)

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
      this.soundManager.stop("music_menu");
    }

    this.moveParallax();
  }

  moveParallax() {
    this.parallax.forEach((layer) => {
      layer.sprite.tilePositionX += layer.speed;
    });
  }
}
