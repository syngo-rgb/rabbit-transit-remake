import { Scene } from "phaser";
import { levelData } from "../data/levelData";
import { ScoreManager } from "../managers/ScoreManager";
import { InputManager } from "../components/InputManager";

export class LevelFourScene extends Scene {
  constructor() {
    super("Level-Four");
    this.paintedPlatform = [];
    this.colors = [0xff004d, 0xffa300, 0xffec27, 0x00e436, 0x954adf];
    this.colorIndex = 0;
    this.playerUnmove = false;
  }

  init(data) {
    this.lifes = data.lives
    this.score = data.score
    this.currentTime =  data.currentTime
  }

  create(data) {
    console.log("LevelTFourScene created");

    this.soundManager = this.registry.get("soundManager");

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
            this.timer.paused = true;
            
            this.scene.start("Boot");
            return;
          }
      
          // const score = this.registry.get("score");
          // this.scene.start("Level-four", { lives: lives, score: score, currentTime: 10 });
          while (!this.isJumping) {
            this.playerPos.x = 8
            this.playerPos.y = 9
            if (!this.tileSize) {
              this.tileSize = 20
            }
            this.player.setPosition(
              this.playerPos.x * this.tileSize,
              this.playerPos.y * this.tileSize
            );
  
            this.registry.set('currentTime', 10);
            this.currentTime = this.currentTime += 100
            return
          }
        }
      }
    });

    const { score = 0 } = data || {};
    this.registry.set("lives", data.lives || 3);

    this.scoreManager = new ScoreManager();
    this.scoreManager.score = score;

    this.soundManager.playMusic("music_level2");

    const { level = 'level1', phase = 'phase2' } = data || {};
    const current = levelData[level][phase];

    this.add.image(160, 112, 'fase2background').setDepth(1);
    this.add.image(160, 112, 'grafo').setDepth(1);
    const olas = this.add.sprite(160, 112, '')
    olas.setDepth(10);
    olas.play("olas-idle", true);

    this.gridCols = 16;
    this.gridRows = 11;
    this.tileSize = 20;

    this.limitTopRow = Math.floor(this.gridRows * 0.25);
    this.limitBottomRow = Math.floor(this.gridRows * 0.85);

    this.walkableMap = current.walkableMap;
    this.playerPos = { ...current.start };

    this.player = this.physics.add.sprite(
      this.playerPos.x * this.tileSize,
      this.playerPos.y * this.tileSize,
      'rabbit'
    ).setScale(1);
    this.player.body.setAllowGravity(false).setSize(6, 10);
    this.player.setOrigin(0.3, 0.7);
    this.player.setDepth(20);
    this.player.lives = data.lives || 3;

    this.player.anims.play("rabbit_right_idle", true).setOrigin(0.5);

    this.plataformas = this.physics.add.staticGroup();

    for (let y = 0; y < this.gridRows; y++) {
      for (let x = 0; x < this.gridCols; x++) {
        const plataforma = this.add.sprite(
          x * this.tileSize,
          y * this.tileSize + this.tileSize, "platforma"
        );
        plataforma.setOrigin(0.5, 2.1);
        plataforma.setAlpha(0);
        plataforma.setDepth(2);
        this.plataformas.add(plataforma);

        if (x === this.playerPos.x && y === this.playerPos.y) {
          plataforma.setTint(0x00ff00);
        } else {
          if (this.walkableMap?.[y]?.[x] !== true) {
            plataforma.setTint(0x808080);
          }
        }
      }
    }

    this.appearBird = this.time.addEvent({
      delay: 1200,
      loop: true,
      callback: () => {

        if (this.birdActive) return; // Si ya hay uno activo, no spawnea otro
    
        const fromLeft = Phaser.Math.Between(0, 1) === 0; // 50% chance
        const y = (this.sys.game.config.height / 8); // 1/5 parte de la altura de pantalla
        const x = fromLeft ? -20 : this.sys.game.config.width + 20; // Fuera de pantalla inicial
    
        this.bird = this.physics.add.sprite(x, y, "bird"); 
        this.bird.setDepth(15);
        this.bird.body.setAllowGravity(false);
        this.bird.speed = fromLeft ? 86 : -86; // velocidad hacia adentro
        this.bird.play(fromLeft ? "bird_idle_right" : "bird_idle_left");
    
        this.birdActive = true;

      }
    })

    this.cursors = this.input.keyboard.createCursorKeys();
    this.inputManager = new InputManager(this);
    this.inputManager.setup();

    this.lastMoveTime = 0;
    this.moveDelay = 180;
  }

  update(time) {
    this.inputManager.update();

    if (this.paintedPlatform.length >= 42) {
      // this.physics.pause();
      this.playerUnmove = true;

      this.plataformas.getChildren().forEach((plataforma) => {
        this.time.addEvent({
          delay: 1100,
          loop: true,
          callback: () => {
            this.colorIndex = (this.colorIndex + 1) % this.colors.length;
            plataforma.setTint(this.colors[this.colorIndex]);
          }
        });
      });
    }

    if (this.birdActive && this.bird) {
      if (!this.bird.isDropping) {
        this.bird.x += this.bird.speed * (this.game.loop.delta / 1000); // movimiento horizontal
      }

      // Checar si está alineado con el jugador
      const playerY = this.player.x;
      if (Math.abs(this.bird.x - playerY) < 10 && !this.bird.isDropping) { // tolerancia de 10px
        this.bird.isDropping = true;
        this.bird.body.setAllowGravity(false); // activa gravedad
        this.bird.setVelocityX(0); // velocidad hacia abajo
        this.bird.setVelocityY(140); // velocidad hacia abajo
        this.bird.anims.play("bird_down", true).setOrigin(0.5).setSize(10, 15);
    
        // Opcional: reproducir sonido de ataque
        // this.soundManager.play("bird_attack");
      }
    
      // Colisión simple con jugador
      if (this.physics.overlap(this.bird, this.player)) {
        this.bird.destroy();
        this.birdActive = false;
        this.player.lives -= 1; // baja una vida
        this.registry.set("lives", this.player.lives);
        this.soundManager.play("hurt");
    
        if (this.player.lives <= 0) {
          this.sound.stopByKey('music_level2');
          this.scene.start("Boot");
        }
      }
    
      // Si el bird cae debajo de la pantalla
      if (this.bird.y > this.sys.game.config.height + 20) {
        this.bird.destroy();
        this.birdActive = false;
      }
      // Si el bird pasa la pantalla
      if (this.bird.x > this.sys.game.config.width + 50 || this.bird.x < -50) {
        this.bird.destroy();
        this.birdActive = false;
      }

      this.paintedPlatform.forEach((plataforma, index) => {
        if (this.physics.overlap(this.bird, plataforma)) {
          plataforma.clearTint(); // Saca el color
          plataforma.setAlpha(0); // Opcional: invisible
          this.paintedPlatform.splice(index, 1); // Eliminar del array paintedPlatform
        }
      })
    }

    if (this.playerUnmove) {
        // Calcula el tiempo restante y aplica bonificaciones
        const timeRemaining = this.currentTime;
        this.scoreManager.addLevelCompleteBonus();
        this.scoreManager.addTimeBonus(timeRemaining);
      
        // Actualiza el registry para UIScene u otras escenas
        const finalScore = this.scoreManager.getScore();
        const finalLives = this.registry.get('lives');
        this.registry.set('score', finalScore);
        this.registry.set('lives', finalLives);
        this.registry.set('currentTime', timeRemaining);
      
        // Detiene sólo la música de fondo del nivel (sin afectar efectos cortos)
        this.sound.stopByKey('music_level2');
        // Reproduce el efecto/música de victoria
        this.sound.play('win_game');
      
        // Pasa a la escena de victoria con los datos
        this.scene.start('WinScene', {
          lives:  finalLives,
          score:  finalScore,
          currentTime: timeRemaining
        });
      
        return;
      }

    let moveX = 0
    let moveY = 0

    if (this.isJumping) return;

    if (this.cursors.up.isDown && this.cursors.left.isDown) {
      moveY = -1
      moveX = -1
      this.jump_rabbit(moveX, moveY, time);
    } else if (this.cursors.up.isDown && this.cursors.right.isDown) {
      moveY = -1
      moveX = 1
      this.jump_rabbit(moveX, moveY, time);
    } else if (this.cursors.down.isDown && this.cursors.left.isDown) {
      moveY = 1
      moveX = -1
      this.jump_rabbit(moveX, moveY, time);
    } else if (this.cursors.down.isDown && this.cursors.right.isDown) {
      moveY = 1
      moveX = 1
      this.jump_rabbit(moveX, moveY, time);
    }

    const movement = this.inputManager.getMovement();
    if (Math.abs(movement.x) > 0.5 && Math.abs(movement.y) > 0.5) {
      let moveX = movement.x > 0 ? 1 : -1;
      let moveY = movement.y > 0 ? 1 : -1;
      this.jump_rabbit(moveX, moveY, time);
    }
  }

  canMoveTo(x, y) {
    const fallback = x >= 0 && x < this.gridCols && y >= this.limitTopRow && y <= this.limitBottomRow;
    if (this.walkableMap?.[y]?.[x] !== undefined) {
      return this.walkableMap[y][x] === true;
    }
    return fallback;
  }

  jump_rabbit(moveX, moveY, time) {
    if ((moveX || moveY) && time > this.lastMoveTime + this.moveDelay) {
      const newX = this.playerPos.x + moveX;
      const newY = this.playerPos.y + moveY;

      if (this.canMoveTo(newX, newY)) {
        this.isJumping = true;
        const dir = moveX > 0 ? 'right' : 'left';
        const alt = moveY > 0 ? 'down' : 'up';
        this.player.anims.play(`rabbit_${alt}_${dir}`);
        this.soundManager.play(`jump_${alt}`);

        this.player.off("animationcomplete");
        this.player.once("animationcomplete", () => {
          this.playerPos.x = newX;
          this.playerPos.y = newY;
          this.player.setPosition(
            this.playerPos.x * this.tileSize,
            this.playerPos.y * this.tileSize
          );
          this.player.anims.play(`rabbit_${dir}_idle`);
          this.isJumping = false;

          this.plataformas.getChildren().forEach((plataforma) => {
            const plataformaX = plataforma.x / this.tileSize;
            const plataformaY = (plataforma.y - this.tileSize) / this.tileSize;

            if (plataformaX === this.playerPos.x && plataformaY === this.playerPos.y && this.playerPos.y != 9) {
              plataforma.setAlpha(1);
              plataforma.setTint(0x00ff00);

              if (!this.paintedPlatform.includes(plataforma)) {
                this.paintedPlatform.push(plataforma);
                this.scoreManager.addJumpPoints();
                this.registry.set("score", this.scoreManager.getScore());
              }
            }
          });
        });
        this.lastMoveTime = time;
      }
    }
  }
}
