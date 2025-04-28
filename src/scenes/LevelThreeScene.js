// scenes/LevelThreeScene.js
import { Scene } from 'phaser'
import { InputManager } from '../components/InputManager'
import { levelData } from '../data/levelData'
import { initialAnimations } from '../anims/anims'
import { ScoreManager } from '../managers/ScoreManager'

export class LevelThreeScene extends Scene {
  constructor() {
    super('Level-Three')
  }

  init(data) {
    // Fallback a level2/phase1 si no me lo pasan
    this.level = data.level || 'level2'
    this.phase = data.phase || 'phase1'

    const score = data.score || 0
    const lives = data.lives || 3
    const currentTime = data.currentTime || 100

    // Guarda en registry para que UIScene lo muestre
    this.registry.set('score', score)
    this.registry.set('lives', lives)
    this.registry.set('currentTime', currentTime)

    // Variables internas de tiempo
    this.currentTime = currentTime
    this.initialTime = currentTime
  }

  create() {
    console.log('LevelThreeScene created')
    initialAnimations(this)

    // Managers
    this.scoreManager = new ScoreManager()
    this.scoreManager.score = this.registry.get('score')
    this.soundManager = this.registry.get('soundManager')

    // Música de nivel 3
    if (this.soundManager) {
      this.soundManager.stop()
      this.soundManager.playMusic('music_level1')
    }

    // Fondo específico de Level 3
    this.add.image(160, 112, 'background2').setDepth(1)

    // Parallax nubes
    this.nube = this.add.tileSprite(
      this.scale.width * 0.5,
      this.scale.height * 0.1,
      0, 0,
      'nube'
    ).setDepth(0)
    this.parallax = [{ speed: 0.2, sprite: this.nube }]

    // Olas animadas
    const olas = this.add.sprite(160, 112, 'olas').setDepth(1)
    olas.play('olas-idle', true)

    // Configuración de la grilla
    this.gridCols = 16
    this.gridRows = 11
    this.tileSize = 20
    this.limitTopRow = Math.floor(this.gridRows * 0.25)
    this.limitBottomRow = Math.floor(this.gridRows * 0.85)

    // Carga del mapa transitable y posición inicial
    const current = levelData[this.level][this.phase]
    this.walkableMap = current.walkableMap
    this.playerPos = { ...current.start }

    // Creación del jugador
    this.player = this.physics.add.sprite(
      this.playerPos.x * this.tileSize,
      this.playerPos.y * this.tileSize,
      'rabbit_sprite'
    ).setOrigin(0.5)
    this.player.play('rabbit_right_idle', true)
    this.player.body.setSize(0.22, 0.1)
    this.player.body.setAllowGravity(false)
    this.player.setDepth(3)

    // Input
    this.cursors = this.input.keyboard.createCursorKeys()
    this.inputManager = new InputManager(this)
    this.inputManager.setup()

    // Enemigos (mariposas)
    this.butterflies = this.physics.add.group({ allowGravity: false })
    this.createButterfly({ row: 4, direction: 'right', speed: 40, amplitude: 5, frequency: 0.005 })
    this.createButterfly({ row: 6, direction: 'left',  speed: 40, amplitude: 5, frequency: 0.005 })
    this.physics.add.overlap(this.player, this.butterflies, this.handleCollision, null, this)

    // Timer HUD
    this.timer = this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        if (this.currentTime > 0) {
          this.currentTime--
          this.registry.set('currentTime', this.currentTime)
        }
        if (this.currentTime <= 0) {
          let lives = this.registry.get('lives') - 1
          this.registry.set('lives', lives)
          if (this.soundManager) this.soundManager.play('lose_life')

          if (lives <= 0) {
            this.scene.start('Boot')
            return
          }

          // Reinicia Level-Three con datos actualizados
          this.timer.paused = true
          const score = this.registry.get('score')
          this.scene.start('Level-Three', {
            level: this.level,
            phase: this.phase,
            lives,
            score,
            currentTime: this.initialTime
          })
        }
      }
    })

    // HUD (UI)
    this.scene.launch('UIScene')

    // Variables internas para el movimiento
    this.lastMoveTime = 0
    this.moveDelay = 180
    this.isJumping = false
  }

  update(time) {
    // Parallax
    this.moveParallax()
    // Input
    this.inputManager.update()

    // Sin vidas → menú
    if (this.registry.get('lives') <= 0) {
      if (this.soundManager) this.soundManager.stop()
      this.scene.start('main-menu')
      return
    }

    // Victoria: coord de meta (ajusta si cambian)
    // Dentro del bloque de victoria en update():
if (this.playerPos.x === 8 && this.playerPos.y === 9) {
  // Detiene SOLO la música de fondo de nivel
  this.sound.stopByKey('music_level1');

  // Reproduce el efecto/música de victoria
  this.sound.play('win_game');

  // Pausa el timer y calcula bonificaciones
  this.timer.paused = true;
  // … resto de tu lógica de puntuación …

  // Transición a Level-Four
  const lives = this.registry.get('lives');
  const score = this.registry.get('score');
  this.scene.start('Level-Four', { lives, score, currentTime: this.currentTime });
  return;
}


    // Actualiza mariposas
    this.butterflies.children.iterate(b => {
      const dir = b.direction === 'right' ? 1 : -1
      b.x += dir * b.speed * this.game.loop.delta / 1000
      b.y = b.baseY + Math.sin(this.time.now * b.frequency) * b.amplitude
      if (dir === 1 && b.x > this.sys.game.config.width) b.x = -this.tileSize
      if (dir === -1 && b.x < -this.tileSize) b.x = this.sys.game.config.width
    })

    // Movimiento diagonal del jugador
    if (!this.isJumping) {
      let moveX = 0, moveY = 0
      if (this.cursors.up.isDown    && this.cursors.left.isDown)  { moveY = -1; moveX = -1 }
      if (this.cursors.up.isDown    && this.cursors.right.isDown) { moveY = -1; moveX =  1 }
      if (this.cursors.down.isDown  && this.cursors.left.isDown)  { moveY =  1; moveX = -1 }
      if (this.cursors.down.isDown  && this.cursors.right.isDown) { moveY =  1; moveX =  1 }

      if (moveX || moveY) {
        this.processMovement(moveX, moveY, time)
      } else {
        const m = this.inputManager.getMovement()
        if (Math.abs(m.x) > 0.5 && Math.abs(m.y) > 0.5) {
          this.processMovement(m.x > 0 ? 1 : -1, m.y > 0 ? 1 : -1, time)
        }
      }
    }
  }

  handleCollision(player, butterfly) {
    let lives = this.registry.get('lives') - 1
    this.registry.set('lives', lives)
    if (this.soundManager) this.soundManager.play('lose_life')

    if (lives <= 0) {
      this.scene.start('main-menu')
    } else {
      this.timer.paused = true
      const score = this.registry.get('score')
      this.scene.start('Level-Three', {
        level: this.level,
        phase: this.phase,
        lives,
        score,
        currentTime: this.currentTime
      })
    }
  }

  createButterfly({ row, direction, speed, amplitude, frequency }) {
    const y = row * this.tileSize
    const startX = direction === 'right'
      ? -this.tileSize
      : this.sys.game.config.width

    const b = this.add.sprite(startX, y, 'mariposa_sprite').setOrigin(0.5).setDepth(3)
    b.play('butterfly')
    b.baseY = y
    b.direction = direction
    b.speed = speed
    b.amplitude = amplitude
    b.frequency = frequency
    this.butterflies.add(b)
  }

  processMovement(moveX, moveY, time) {
    if (time < this.lastMoveTime + this.moveDelay) return

    const newX = this.playerPos.x + moveX
    const newY = this.playerPos.y + moveY

    if (!this.canMoveTo(newX, newY)) return

    this.isJumping = true
    this.player.anims.play(
      `rabbit_${ moveY === -1 ? 'up'   : 'down'  }_${ moveX === -1 ? 'left' : 'right' }`,
      true
    )

    this.player.once('animationcomplete', () => {
      this.playerPos.x = newX
      this.playerPos.y = newY
      this.player.setPosition(
        newX * this.tileSize,
        newY * this.tileSize
      )
      this.player.anims.play(
        `rabbit_${ moveX === -1 ? 'left' : 'right' }_idle`,
        true
      )
      this.isJumping = false
    })

    this.lastMoveTime = time
  }

  canMoveTo(x, y) {
    const inGrid =
      x >= 0 && x < this.gridCols &&
      y >= this.limitTopRow && y <= this.limitBottomRow
    return inGrid && (this.walkableMap[y]?.[x] ?? true)
  }

  moveParallax() {
    this.parallax.forEach(layer => {
      layer.sprite.tilePositionX += layer.speed
    })
  }
}
