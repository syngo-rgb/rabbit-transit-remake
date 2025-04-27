// scenes/LevelOneScene.js
import { Scene } from 'phaser'
import { InputManager } from '../components/InputManager'
import { levelData } from '../data/levelData'
import { initialAnimations } from '../anims/anims'
import { ScoreManager } from '../managers/ScoreManager'

export class LevelOneScene extends Scene {
  constructor() {
    super('level-one')
  }

  create(data) {
    console.log("LevelOneScene created");
    initialAnimations(this);

    // Managers
    this.scoreManager = new ScoreManager();
    this.soundManager = this.registry.get("soundManager");

    // Data inicial
    const { level = 'level1', phase = 'phase1', score = 0, currentTime = 10, lives = 3 } = data || {};
    this.registry.set("score", score);
    this.registry.set("lives", lives);
    this.currentTime = currentTime;
    this.initialTime = 100;

    // Música
    if (this.soundManager) {
      this.soundManager.stop();
    }
    this.soundManager.playMusic("music_level1");

    // Fondo
    this.add.image(160, 112, 'background');

    // 🌥️ Nubes parallax
    this.nube1 = this.add.image(160, 5, 'nube').setScrollFactor(0.2);
    this.nube2 = this.add.image(200, 9, 'nube').setScrollFactor(0.3);

    // Olas
    const olas = this.add.sprite(160, 112, 'olas').setDepth(1);
    olas.play("olas-idle", true);

    // Grilla
    this.gridCols = 16;
    this.gridRows = 11;
    this.tileSize = 20;
    this.limitTopRow = Math.floor(this.gridRows * 0.25);
    this.limitBottomRow = Math.floor(this.gridRows * 0.85);

    // Walkable
    const current = levelData[level][phase];
    this.walkableMap = current.walkableMap;
    this.playerPos = { ...current.start };

    // Jugador
    this.player = this.physics.add.sprite(
      this.playerPos.x * this.tileSize,
      this.playerPos.y * this.tileSize,
      'rabbit_sprite'
    ).setOrigin(0.5);
    this.player.play("rabbit_right_idle", true).setOrigin(0.5).body.setSize(0.22, 0.1);
    this.player.setDepth(5);
    this.player.body.setAllowGravity(false);
    this.player.lives = lives;

    // Input
    this.cursors = this.input.keyboard.createCursorKeys();
    this.inputManager = new InputManager(this);
    this.inputManager.setup();

    // Mariposas
    this.butterflies = this.physics.add.group({ allowGravity: false });
    this.createButterfly({ row: 4, direction: 'right', speed: 40, amplitude: 5, frequency: 0.005 });
    this.createButterfly({ row: 6, direction: 'left', speed: 40, amplitude: 5, frequency: 0.005 });

    // Colisiones
    this.physics.add.overlap(this.player, this.butterflies, this.handleCollision, null, this);

    // Timer HUD
    this.timer = this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        if (this.currentTime > 0) {
          this.currentTime--;
          this.registry.set('currentTime', this.currentTime);
        }
        if (this.currentTime <= 0) {
          let lives = this.registry.get("lives") - 1;
          this.registry.set("lives", lives);
          this.soundManager.play("lose_life");
      
          if (lives <= 0) {
            this.scene.start("main-menu");
            return;
          }
      
          this.timer.paused = true;
          const score = this.registry.get("score");
          this.scene.start("level-one", { lives, score, currentTime: 10 });
        }
      }
    });

    // HUD
    this.scene.launch('UIScene');

    // Internals
    this.lastMoveTime = 0;
    this.moveDelay = 180;
    this.isJumping = false;
  }

  update(time) {
    // Parallax Nubes
    this.nube1.x += 0.02;
    this.nube2.x += 0.04;

    // Input
    this.inputManager.update();

    if (this.registry.get("lives") <= 0) {
      this.soundManager.stop("music_level1");
      this.scene.start('main-menu');
      return;
    }

    if (this.playerPos.x == 8 && this.playerPos.y == 9) {
      this.soundManager.stop("music_level1");
      this.soundManager.play("win_game");
      this.timer.paused = true;

      const remainingTime = this.currentTime;
      this.scoreManager.addLevelCompleteBonus();
      this.scoreManager.addTimeBonus(remainingTime);
      this.registry.set('remainingTime', remainingTime);

      this.registry.set('score', this.scoreManager.getScore());
      let lives = this.registry.get("lives")

      this.scene.start("Level-Two", { lives: lives, score: this.scoreManager.getScore(), currentTime: this.currentTime });
      return;
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
      } else if (dir === -1 && butterfly.x < -this.tileSize) {
        butterfly.x = this.sys.game.config.width
      }
    })

    let moveX = 0
    let moveY = 0

    if (this.isJumping) return;

    if (this.cursors.up.isDown && this.cursors.left.isDown) {
      moveY = -1
      moveX = -1
      this.processMovement(moveX, moveY, time);
    } else if (this.cursors.up.isDown && this.cursors.right.isDown) {
      moveY = -1
      moveX = 1
      this.processMovement(moveX, moveY, time);
    } else if (this.cursors.down.isDown && this.cursors.left.isDown) {
      moveY = 1
      moveX = -1
      this.processMovement(moveX, moveY, time);
    } else if (this.cursors.down.isDown && this.cursors.right.isDown) {
      moveY = 1
      moveX = 1
      this.processMovement(moveX, moveY, time);
    }

    const movement = this.inputManager.getMovement();
    if (Math.abs(movement.x) > 0.5 && Math.abs(movement.y) > 0.5) {
      let moveX = movement.x > 0 ? 1 : -1;
      let moveY = movement.y > 0 ? 1 : -1;
      this.processMovement(moveX, moveY, time);
    } 
  }

  handleCollision(player, butterfly) {
    let lives = this.registry.get("lives") - 1;
    this.registry.set("lives", lives);
    this.soundManager.play("lose_life");

    if (lives <= 0) {
      this.scene.start("main-menu");
      return;
    }

    this.timer.paused = true;
    const score = this.registry.get("score");
    this.scene.start("level-one", { lives, score, currentTime: this.currentTime });
  }

  createButterfly({ row, direction, speed, amplitude, frequency }) {
    const y = row * this.tileSize;
    const startX = direction === 'right' ? -this.tileSize : this.sys.game.config.width;

    const butterfly = this.add.sprite(startX, y, 'mariposa_sprite').setOrigin(0.5);
    butterfly.play('butterfly');
    butterfly.baseY = y;
    butterfly.direction = direction;
    butterfly.speed = speed;
    butterfly.amplitude = amplitude;
    butterfly.frequency = frequency;

    this.butterflies.add(butterfly);
  }

  processMovement(moveX, moveY, time) {
    if (time < this.lastMoveTime + this.moveDelay) return;

    const newX = this.playerPos.x + moveX;
    const newY = this.playerPos.y + moveY;

    if (this.canMoveTo(newX, newY)) {
      this.isJumping = true;
      this.player.anims.play(`rabbit_${moveY === -1 ? 'up' : 'down'}_${moveX === -1 ? 'left' : 'right'}`, true);

      this.player.once("animationcomplete", () => {
        this.playerPos.x = newX;
        this.playerPos.y = newY;
        this.player.setPosition(
          this.playerPos.x * this.tileSize,
          this.playerPos.y * this.tileSize
        );
        this.player.anims.play(`rabbit_${moveX === -1 ? 'left' : 'right'}_idle`, true);
        this.isJumping = false;
      });

      this.lastMoveTime = time;
    }
  }

  canMoveTo(x, y) {
    const fallback = x >= 0 && x < this.gridCols && y >= this.limitTopRow && y <= this.limitBottomRow;
    if (this.walkableMap?.[y]?.[x] !== undefined) {
      return this.walkableMap[y][x] === true;
    }
    return fallback;
  }
}
