import { Scene } from "phaser";
import { levelData } from "../data/levelData";
import { ScoreManager } from "../managers/ScoreManager";
import { InputManager } from "../components/InputManager";

export class LevelTwoScene extends Scene {
  constructor() {
    super("Level-Two");
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
    console.log("LevelTwoScene created");

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
          // this.scene.start("Level-Two", { lives: lives, score: score, currentTime: 10 });
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
    this.player.body.setAllowGravity(false);
    this.player.setOrigin(0.5);
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

    if (this.playerUnmove) {
      this.playerPos.x = 2
      this.playerPos.y = 2
      if (this.playerPos.x == 2 && this.playerPos.y == 2) {
        this.timer = this.registry.get("timer");
        console.log(this.timer)
        const timeRemaining = Math.floor(this.timer);
        this.soundManager.play("win_game"); // 🎵 sonido ganar
        this.scoreManager.addLevelCompleteBonus();
        this.registry.set("score", this.scoreManager.getScore());
        this.scoreManager.addTimeBonus(timeRemaining);
        this.registry.set("score", this.scoreManager.getScore());
        this.soundManager.stop("music_level2");
        console.log("paso?")
        this.scene.start("cut-scene");
      }
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
