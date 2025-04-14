// first charges
import { Scene } from "phaser";
import { levelData } from "../data/levelData";
import { InputManager } from "../components/InputManager";

export class LevelTwoScene extends Scene {
  constructor() {
    super("Level-Two");
  }

  create(data) {
    console.log("LevelTwoScene created")

    const { level = 'level1', phase = 'phase2' } = data || {}
    const current = levelData[level][phase]

    this.add.image(160, 112, 'background')

    this.gridCols = 16
    this.gridRows = 11
    this.tileSize = 20

    this.limitTopRow = Math.floor(this.gridRows * 0.25)
    this.limitBottomRow = Math.floor(this.gridRows * 0.85)

    this.walkableMap = current.walkableMap
    
    this.playerPos = { ...current.start }

    this.player = this.physics.add.sprite(
      this.playerPos.x * this.tileSize,
      this.playerPos.y * this.tileSize,
      'rabbit'
    ).setScale(1)
    this.player.body.setAllowGravity(false);
    this.player.setOrigin(0)
    this.player.lives = data.lives || 3;

    this.cursors = this.input.keyboard.createCursorKeys()

    this.inputManager = new InputManager(this)
    this.inputManager.setup()

    this.lastMoveTime = 0
    this.moveDelay = 180
  }

  update(time) {
    // Joysticks Input
    this.inputManager.update();

    let moveX = 0
    let moveY = 0

    if (this.cursors.up.isDown && this.cursors.left.isDown) {
      moveY = -1
      moveX = -1
    } else if (this.cursors.up.isDown && this.cursors.right.isDown) {
      moveY = -1
      moveX = 1
    } else if (this.cursors.down.isDown && this.cursors.left.isDown) {
      moveY = 1
      moveX = -1
    } else if (this.cursors.down.isDown && this.cursors.right.isDown) {
      moveY = 1
      moveX = 1
    }

    const movement = this.inputManager.getMovement()
    if (Math.abs(movement.x) > 0.5 && Math.abs(movement.y) > 0.5) {
      moveX = movement.x > 0 ? 1 : -1
      moveY = movement.y > 0 ? 1 : -1
    }

    if ((moveX || moveY) && time > this.lastMoveTime + this.moveDelay) {
      const newX = this.playerPos.x + moveX
      const newY = this.playerPos.y + moveY

      if (this.canMoveTo(newX, newY)) {
        console.log(newX)
        console.log(newY)
        this.playerPos.x = newX
        this.playerPos.y = newY
        this.player.setPosition(
          this.playerPos.x * this.tileSize,
          this.playerPos.y * this.tileSize
        )
      }

      this.lastMoveTime = time
    }
  }

  canMoveTo (x, y) {
    const fallback = x >= 0 && x < this.gridCols && y >= this.limitTopRow && y <= this.limitBottomRow

    if (this.walkableMap?.[y]?.[x] !== undefined) {
      return this.walkableMap[y][x] === true
    }

    return fallback
  }
}

