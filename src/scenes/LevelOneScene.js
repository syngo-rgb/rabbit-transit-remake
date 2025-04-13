import { Scene } from 'phaser'
import { InputManager } from '../components/InputManager';

export class LevelOneScene extends Scene {
  constructor () {
    console.log("LevelOneScene constructor");
    super('level-one')
  }

  create () {
    console.log("LevelOneScene created");
    // Fondo centrado
    this.add.image(160, 112, 'background')

    // Grilla
    this.gridCols = 16
    this.gridRows = 11
    this.tileSize = 20

    this.limitTopRow = Math.floor(this.gridRows * 0.25);
    this.limitBottomRow = Math.floor(this.gridRows * 0.85);

    // Posición inicial
    this.playerPos = { x: 5, y: this.limitTopRow }

    // Conejo
    this.player = this.add.sprite(
      this.playerPos.x * this.tileSize,
      this.playerPos.y * this.tileSize,
      'rabbit'
    )
    this.player.setOrigin(0)

    this.cursors = this.input.keyboard.createCursorKeys()

    this.inputManager = new InputManager(this);
    this.inputManager.setup();

    this.lastMoveTime = 0
    this.moveDelay = 180
  }

  update(time) {
    // Joysticks Input
    this.inputManager.update();
  
    let moveX = 0;
    let moveY = 0;
  
    // Movimiento por teclado: Solo permite movimientos diagonales
    if (this.cursors.up.isDown && this.cursors.left.isDown) {
      moveY = -1;
      moveX = -1;
    } else if (this.cursors.up.isDown && this.cursors.right.isDown) {
      moveY = -1;
      moveX = 1;
    } else if (this.cursors.down.isDown && this.cursors.left.isDown) {
      moveY = 1;
      moveX = -1;
    } else if (this.cursors.down.isDown && this.cursors.right.isDown) {
      moveY = 1;
      moveX = 1;
    }
  
    // Movimiento por joystick: Detecta combinaciones de ejes
    const movement = this.inputManager.getMovement();
    if (Math.abs(movement.x) > 0.5 && Math.abs(movement.y) > 0.5) {
      moveX = movement.x > 0 ? 1 : -1;
      moveY = movement.y > 0 ? 1 : -1;
    }
  
    // Actualiza la posición si hay movimiento diagonal
    if ((moveX || moveY) && time > this.lastMoveTime + this.moveDelay) {
      const newX = this.playerPos.x + moveX;
      const newY = this.playerPos.y + moveY;
  
      if (this.canMoveTo(newX, newY)) {
        this.playerPos.x = newX;
        this.playerPos.y = newY;
        this.player.setPosition(
          this.playerPos.x * this.tileSize,
          this.playerPos.y * this.tileSize
        );
      }
  
      this.lastMoveTime = time;
    }
  }

  canMoveTo (x, y) {
    console.log("LevelOneScene canMoveTo x: ", x, " y: ", y);
    return x >= 0 && x < this.gridCols && y >= this.limitTopRow && y <= this.limitBottomRow;
  }
}
