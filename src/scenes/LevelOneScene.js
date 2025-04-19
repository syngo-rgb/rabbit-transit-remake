// scenes/LevelOneScene.js
import { Scene } from 'phaser'
import { InputManager } from '../components/InputManager'
import { levelData } from '../data/levelData'
import { initialAnimations } from '../anims/anims'

export class LevelOneScene extends Scene {
  constructor () {
    super('level-one')
  }

  create (data) {
    console.log("LevelOneScene created")
    initialAnimations(this)

    const { level = 'level1', phase = 'phase1' } = data || {}
    const current = levelData[level][phase]

    this.soundManager = this.registry.get("soundManager");
    this.soundManager.playMusic("music_level1");
    console.log("hola")

    // Background
    this.add.image(160, 112, 'background')
    const olas = this.add.sprite(160, 112, '')
    olas.play("olas-idle", true)


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
    this.player.play("rabbit_right", true)
    console.log(data.lives)

    this.player.lives = data.lives || 3;
    this.player.setOrigin(0)

    // Vidas Abajo
    this.arrayHP =  [];
    const HpStepsX = 10;
    let positionHP = 20;

    for (let i = 0; i < this.player.lives; i++) {
      this.arrayHP.push(
        this.add.sprite(positionHP, 210, "rabbit_life").setDepth(20)
      );
      positionHP += HpStepsX;
    }
  
    this.cursors = this.input.keyboard.createCursorKeys()

    this.inputManager = new InputManager(this)
    this.inputManager.setup()

    this.lastMoveTime = 0
    this.moveDelay = 180

    // === MARIPOSAS ===
    this.butterflies = this.physics.add.group({
      allowGravity: false,
    })

    this.createButterfly({
      row: 4,
      direction: 'right',
      speed: 40,
      amplitude: 5,
      frequency: 0.005
    })

    this.createButterfly({
      row: 6,
      direction: 'left',
      speed: 40,
      amplitude: 5,
      frequency: 0.005
    })

    // === SETUP COLLISION DETECTION ===
    // Modify the collision callback to decrease the player's lives
    this.physics.add.overlap(this.player, this.butterflies, this.handleCollision, null, this);
  }


  update (time) {
    // Joysticks Input
    this.inputManager.update();

    let moveX = 0
    let moveY = 0

    if (this.cursors.up.isDown && this.cursors.left.isDown) {
      moveY = -1
      moveX = -1
      this.player.play("rabbit_right", true)
    } else if (this.cursors.up.isDown && this.cursors.right.isDown) {
      moveY = -1
      moveX = 1
      this.player.play("rabbit_right", true)
    } else if (this.cursors.down.isDown && this.cursors.left.isDown) {
      moveY = 1
      moveX = -1
      this.player.play("rabbit_left", true)
    } else if (this.cursors.down.isDown && this.cursors.right.isDown) {
      moveY = 1
      moveX = 1
      this.player.play("rabbit_left", true)
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
        this.playerPos.x = newX
        this.playerPos.y = newY
        this.player.setPosition(
          this.playerPos.x * this.tileSize,
          this.playerPos.y * this.tileSize
        )
      }

      this.lastMoveTime = time
    }


  // === ACTUALIZAR MARIPOSAS ===
  this.butterflies.children.iterate(butterfly => {
  if (!butterfly) return
    
  const dir = butterfly.direction === 'right' ? 1 : -1
  butterfly.x += dir * butterfly.speed * this.game.loop.delta / 1000
    
  // Movimiento vertical oscilante
  butterfly.y = butterfly.baseY + Math.sin(this.time.now * butterfly.frequency) * butterfly.amplitude
    
// Reaparecer al otro lado si sale de la pantalla
  if (dir === 1 && butterfly.x > this.sys.game.config.width) {
    butterfly.x = -this.tileSize
    } else 
    if (dir === -1 && butterfly.x < -this.tileSize) {
        butterfly.x = this.sys.game.config.width
      }
    })

    if (this.player.lives <= 0) {
      this.scene.start('main-menu')
      this.soundManager.stop("music_level1");
    }

    if (this.playerPos.x == 8 && this.playerPos.y == 9) {
      this.scene.start("Level-Two")
      this.soundManager.stop("music_level1");
    }
  }

  handleCollision(player, butterfly) {
    this.player.lives -= 1;
    this.registry.set("lives", this.player.lives);
    this.scene.start("level-one", { lives: this.registry.get("lives") })
  }

  canMoveTo (x, y) {
    const fallback = x >= 0 && x < this.gridCols && y >= this.limitTopRow && y <= this.limitBottomRow
    if (this.walkableMap?.[y]?.[x] !== undefined) {
      return this.walkableMap[y][x] === true
    }

    return fallback
  }

  createButterfly ({ row, direction, speed, amplitude, frequency }) {
    const y = row * this.tileSize
    const startX = direction === 'right' ? -this.tileSize : this.sys.game.config.width

    const butterfly = this.add.sprite(startX, y, 'mariposa')
    butterfly.setOrigin(0.5)
    butterfly.setScale(1) // 🦋 Escala original, respeta tamaño nativo (5x5)

    butterfly.baseY = y
    butterfly.direction = direction
    butterfly.speed = speed
    butterfly.amplitude = amplitude
    butterfly.frequency = frequency

    this.butterflies.add(butterfly)
  }
}
