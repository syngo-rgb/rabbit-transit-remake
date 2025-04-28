// scenes/WinScene.js
import { Scene } from 'phaser';

export class WinScene extends Scene {
  constructor() {
    super('WinScene');
    // Tiempo inicial por nivel (en segundos)
    this.initialTime = 180;

    // Colores estilo Atari 2600
    this.colors = {
      background: 0x000000,      // Negro
      border:     0x3030FF,      // Azul Atari
      text:       0xFFFFFF,      // Blanco
      highlight:  0x48E0E0,      // Cian
      accent:     0xE050E0       // Magenta/Púrpura
    };
  }

  init(data) {
    // Datos que vienen de la escena anterior
    this.lives       = data.lives       || 0;
    this.score       = data.score       || 0;
    this.currentTime = data.currentTime || 0;
  }

  create() {
    // Detiene cualquier audio restante y lanza la victoria
    this.sound.stopAll();
    this.sound.play('win_game');

    // Calcula cuánto tardó el jugador
    const timeTaken = this.initialTime - this.currentTime;

    // Dibuja fondo y decoraciones retro
    this.createRetroBackground();
    this.createRetroTitle();

    // Muestra puntaje y tiempo dentro de un panel
    this.createRetroStats(timeTaken);

    // Botón para volver a jugar, reseteando todo a valores por defecto
    this.createRetroButton(
      this.scale.width / 2,
      this.scale.height - 80,
      'JUGAR DE NUEVO',
      () => {
        // Resetear registry por si UIScene lo utiliza
        this.registry.set('lives',       3);
        this.registry.set('score',       0);
        this.registry.set('currentTime', this.initialTime);

        // Arrancar Level-One con valores iniciales
        this.scene.start('Level-One', {
          level:       'level1',
          phase:       'phase1',
          lives:       3,
          score:       0,
          currentTime: this.initialTime
        });
      }
    );

    // Efecto de líneas de escaneo estilo CRT
    this.createScanlines();
  }

  createRetroBackground() {
    const { width, height } = this.scale;
    const bcol = this.colors.background;
    const bord = this.colors.border;

    // Fondo negro
    this.add.rectangle(0, 0, width, height, bcol).setOrigin(0);

    // Bordes exteriores
    const bw = 4;
    this.add.rectangle(0, 0, width, bw, bord).setOrigin(0);             // superior
    this.add.rectangle(0, height - bw, width, bw, bord).setOrigin(0);   // inferior
    this.add.rectangle(0, 0, bw, height, bord).setOrigin(0);            // izquierdo
    this.add.rectangle(width - bw, 0, bw, height, bord).setOrigin(0);    // derecho

    // Líneas decorativas horizontales
    for (let y = 40; y < height - 40; y += 40) {
      if (y < 80 || y > height - 80) {
        this.add.rectangle(20, y, width - 40, 2, bord).setOrigin(0);
      }
    }
  }

  createRetroTitle() {
    const { width } = this.scale;
    const hl = this.colors.highlight;

    // Texto principal parpadeante
    const title = this.add.text(
      width / 2, 40,
      'VICTORIA',
      { fontSize: '32px', fontFamily: 'Courier', color: '#FFFFFF', align: 'center' }
    ).setOrigin(0.5);

    this.time.addEvent({
      delay: 500,
      loop: true,
      callback: () => { title.visible = !title.visible; }
    });

    // Subrayado animado
    const underline = this.add.rectangle(width / 2 - 70, 60, 140, 3, hl);
    this.tweens.add({
      targets: underline,
      width: 100,
      duration: 1000,
      yoyo: true,
      repeat: -1
    });
  }

  createRetroStats(timeTaken) {
    const { width } = this.scale;
    const hl = this.colors.highlight;

    // Panel semitransparente
    this.add.rectangle(width / 2, 150, width - 40, 80, 0x000060, 0.3).setOrigin(0.5);

    // Texto de puntos
    const scoreText = this.add.text(
      width / 2, 130,
      `PUNTOS: ${this.score}`,
      { fontSize: '24px', fontFamily: 'Courier', color: `#${hl.toString(16)}`, align: 'center' }
    ).setOrigin(0.5);

    // Texto de tiempo
    this.add.text(
      width / 2, 170,
      `TIEMPO: ${timeTaken} s`,
      { fontSize: '24px', fontFamily: 'Courier', color: `#${hl.toString(16)}`, align: 'center' }
    ).setOrigin(0.5);

    // Animación de contador mecánico
    let displayScore = 0;
    const step = Math.max(1, Math.floor(this.score / 20));
    const interval = setInterval(() => {
      if (displayScore < this.score) {
        displayScore = Math.min(this.score, displayScore + step);
        scoreText.setText(`PUNTOS: ${displayScore}`);
      } else {
        clearInterval(interval);
      }
    }, 100);
  }

  createRetroButton(x, y, text, callback) {
    const { border, highlight, accent } = this.colors;
    const buttonWidth = text.length * 12;

    // Fondo del botón
    const btn = this.add.rectangle(x, y, buttonWidth, 30, border, 1)
      .setInteractive({ useHandCursor: true });

    // Texto encima
    const txt = this.add.text(x, y, text,
      { fontSize: '20px', fontFamily: 'Courier', color: '#FFFFFF', align: 'center' }
    ).setOrigin(0.5);

    // Estados hover/click
    btn.on('pointerover',  () => { btn.fillColor = highlight; txt.setColor('#000000'); });
    btn.on('pointerout',   () => { btn.fillColor = border;    txt.setColor('#FFFFFF'); });
    btn.on('pointerdown',  () => { btn.fillColor = accent;    });
    btn.on('pointerup',    () => { callback();               });

    // Parpadeo ocasional
    this.time.addEvent({
      delay: 2000,
      loop: true,
      startAt: Math.random() * 2000,
      callback: () => {
        this.tweens.add({
          targets: [btn, txt],
          alpha: 0.5,
          duration: 100,
          yoyo: true,
          repeat: 3
        });
      }
    });
  }

  createScanlines() {
    const { width, height } = this.scale;
    // Líneas finas
    for (let y = 0; y < height; y += 4) {
      this.add.rectangle(0, y, width, 1, 0x000000, 0.3).setOrigin(0);
    }
    // Destello aleatorio
    this.time.addEvent({
      delay: 5000,
      loop: true,
      callback: () => {
        const flicker = this.add.rectangle(0, 0, width, height, 0xFFFFFF, 0.1).setOrigin(0);
        this.tweens.add({
          targets: flicker,
          alpha: 0,
          duration: 100,
          onComplete: () => flicker.destroy()
        });
      }
    });
  }

  update() {
    // No es necesaria lógica per-frame aquí
  }
}
