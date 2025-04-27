// UIScene.js
import { Scene } from "phaser";

class UIScene extends Scene {
  constructor() {
    super("UIScene");
  }

  create() {
    if (!this.anims.exists("life_idle")) {
      // Rabbit life
      this.anims.create({
        key: "life_idle",
        frames: this.anims.generateFrameNumbers("rabbit_life", 
        { 
          start: 0, 
          end: 1 
        }),
        frameRate: 3,
        repeat: -1,
      });
    }

    // Texto de PUNTOS
    this.scoreText = this.add.text(this.cameras.main.width * 0.5, 20, "100", {
      fontFamily: "'Press Start 2P'",
      fontSize: "8px",
      color: "#0000ff",
      align: "left"
    }).setOrigin(0.5);

    // Texto de TIEMPO
    this.timeText = this.add.text(this.cameras.main.width - 25, this.cameras.main.height * 0.92, "100", {
      fontFamily: "'Press Start 2P'",
      fontSize: "8px",
      color: "#FFFFFF",
      align: "right"
    }).setOrigin(0.5);

    // Array para mostrar vidas (corazones/conejos)
    this.arrayHP = [];

    // Refrescamos desde el principio
    this.refreshLives();

    // Nos suscribimos a cambios
    this.registry.events.on("changedata", this.updateData, this);
  }

  updateData(parent, key, value) {
    if (key === "score") {
      this.updateScore();
    } else if (key === "lives") {
      this.refreshLives();
    } else if (key === "currentTime") {
      this.updateTimer();
    }
  }

  updateScore() {
    const score = this.registry.get("score") || 0;
    this.scoreText.setText(score.toString());
  }

  refreshLives() {
    // Limpiamos anteriores
    this.arrayHP.forEach(life => life.destroy());
    this.arrayHP = [];

    const lives = this.registry.get("lives") || 3;
    let x = 20;

    for (let i = 0; i < lives; i++) {
      const heart = this.add.sprite(x, this.cameras.main.height * 0.92, "conejiti");
      heart.setOrigin(0.5);
      this.arrayHP.push(heart);
      x += 12;
    }

    if ( this.arrayHP.length > 0) {
      this.arrayHP.forEach(life => {
        if (life.anims.isPlaying === false) {
          life.anims.play("life_idle", true);
        }
      });
    }
  }

  updateTimer() {
    const currentTime = this.registry.get("currentTime") || 0;
    this.timeText.setText(currentTime.toString());
  }

  shutdown() {
    // Eliminamos listeners cuando cambiamos de escena
    this.registry.events.off("changedata", this.updateData, this);
  }
}

export default UIScene;
