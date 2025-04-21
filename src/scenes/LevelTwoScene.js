// scenes/LevelTwoScene.js
import { Scene } from "phaser";
import { levelData } from "../data/levelData";
import { InputManager } from "../components/InputManager";

export class LevelTwoScene extends Scene {
  constructor() {
    super("Level-Two");

    this.paintedPlatform = new Array()
    this.colors = [0xff004d, 0xffa300, 0xffec27, 0x00e436, 0x954adf]; // rojo, amarillo, Verde
    this.colorIndex = 0;
    this.playerUnmove = false
  }

  create(data) {
    console.log("LevelTwoScene created")
    this.soundManager = this.registry.get("soundManager");
    this.soundManager.playMusic("music_level2");

    const { level = 'level1', phase = 'phase2' } = data || {}
    const current = levelData[level][phase]

    this.add.image(160, 112, 'fase2background').setDepth(1)
    const olas = this.add.sprite(160, 112, '')
    olas.setDepth(10)
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
    this.player.setOrigin(0.5)
    this.player.setDepth(20)
    this.player.lives = data.lives || 3;

    this.player.anims.play("rabbit_right_idle", true).setOrigin(0.5)

    this.plataformas = this.physics.add.staticGroup()

    // Añadimos plataformas en la grilla
    for (let y = 0; y < this.gridRows; y++) {
      for (let x = 0; x < this.gridCols; x++) {
        const plataforma = this.add.sprite(
          x * this.tileSize,
          y * this.tileSize + this.tileSize, "platforma"
        );
        plataforma.setOrigin(0.5, 2.1);
        plataforma.setAlpha(0);
        plataforma.setDepth(2)
        this.plataformas.add(plataforma);

        // Si coincide con la posición del conejo, pintamos la plataforma de verde
        if (x === this.playerPos.x && y === this.playerPos.y) {
          plataforma.setTint(0x00ff00);
        } else {
          for (let i = 0; i <= this.walkableMap.length; i ++) {
            if (this.walkableMap[y][x] === true) {
              break;
            }
            if (i === this.walkableMap.length) {
              plataforma.setTint(0x808080);
            }

            plataforma.setTint(0x808080); // Color gris para el resto
          }
          
        }
      }
    }

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

    if (this.paintedPlatform.length === 42) 
    {
      this.physics.pause();
      this.playerUnmove = true

    this.plataformas.getChildren().forEach((plataforma) => { 
      // Por cada plataforma
      this.time.addEvent({
        delay: 1100,
        loop: true,
        callback: () => {
          this.colorIndex = (this.colorIndex + 1) % this.colors.length;
          plataforma.setTint(this.colors[this.colorIndex]);
        }
      })
    })

      // Puntaje
      // this.scene.start("cut-scene") 
    }

    if (this.playerUnmove === true) {
      return
    }

    if (this.isJumping) return;

    const movement = this.inputManager.getMovement()
    if (Math.abs(movement.x) > 0.5 && Math.abs(movement.y) > 0.5) {
      moveX = movement.x > 0 ? 1 : -1
      moveY = movement.y > 0 ? 1 : -1
      if ( moveY === -1 && moveX === -1) {
        this.jump_rabbit("up", "left", moveX, moveY, time) 

      } else if ( moveY === -1 && moveX === 1) {
        this.jump_rabbit("up", "right", moveX, moveY, time) 

      } else if ( moveY === 1 && moveX === -1) {
        this.jump_rabbit("down", "left", moveX, moveY, time) 

      } else if ( moveY === 1 && moveX === 1) {
        this.jump_rabbit("down", "right", moveX, moveY, time)
      }
    }

    if (this.cursors.up.isDown && this.cursors.left.isDown) {
      // Arriba izquierda
      moveY = -1
      moveX = -1
      this.jump_rabbit("up", "left", moveX, moveY, time)
    } else if (this.cursors.up.isDown && this.cursors.right.isDown) {
      // Arriba derecha
      moveY = -1
      moveX = 1
      this.jump_rabbit("up", "right", moveX, moveY, time)
    } else if (this.cursors.down.isDown && this.cursors.left.isDown) {
      // Abajo izquierda
      moveY = 1
      moveX = -1
      this.jump_rabbit("down", "left", moveX, moveY, time)
    } else if (this.cursors.down.isDown && this.cursors.right.isDown) {
      // Abajo derecha
      moveY = 1
      moveX = 1
      this.jump_rabbit("down", "right", moveX, moveY, time)
    }
  }

  canMoveTo (x, y) {
    const fallback = x >= 0 && x < this.gridCols && y >= this.limitTopRow && y <= this.limitBottomRow
    if (this.walkableMap?.[y]?.[x] !== undefined) {
      return this.walkableMap[y][x] === true
    }

    return fallback
  }

  jump_rabbit(alt, dir, moveX, moveY, time) {
    if ((moveX || moveY) && time > this.lastMoveTime + this.moveDelay) {
      const newX = this.playerPos.x + moveX
      const newY = this.playerPos.y + moveY 

      if (this.canMoveTo(newX, newY)) {
        this.isJumping = true;
        this.player.anims.play(`rabbit_${alt}_${dir}`).setOrigin(0.5)
        this.soundManager.play(`jump_${alt}`)

        // Eliminar listeners anteriores
        this.player.off("animationcomplete")

        this.player.once("animationcomplete", () => {
          this.playerPos.x = newX
            this.playerPos.y = newY
            this.player.setPosition(
            this.playerPos.x * this.tileSize,
            this.playerPos.y * this.tileSize
          )
          this.player.anims.play(`rabbit_${dir}_idle`).setOffset(0.5)
          this.isJumping = false;

          // Actualizamos el color de las plataformas en cada movimiento
          this.plataformas.getChildren().forEach((plataforma) => {
            const plataformaX = plataforma.x / this.tileSize;
            const plataformaY = (plataforma.y - this.tileSize) / this.tileSize;
          
            if (plataformaX === this.playerPos.x && plataformaY === this.playerPos.y && this.playerPos.y != 9) {
              plataforma.setAlpha(1)
              plataforma.setTint(0x00ff00); // Pintar verde si coincide

              if (!this.paintedPlatform.includes(plataforma)) {
                // Añadir puntos por plataforma pintada
                this.paintedPlatform.push(plataforma)
              }
            } 
            // else {
            //   plataforma.setTint(0x808080); // Pintar gris para el resto
            // }
          });
        })

        // // Voltear el sprite en el eje X según la dirección
        // if (moveX !== 0) {
        //   this.player.flipX = moveX < 0; // Voltea si va a la izquierda
        // }
        this.lastMoveTime = time
      }
    }
  }
}

