// scenes/CutScene.js

import Phaser from 'phaser';

export class CutScene extends Phaser.Scene {
  constructor() {
    super({ key: 'CutScene' });
  }

  init(data) {
    // Podés recibir datos de otras escenas si querés
    this.level = data.level || 1; // Por ejemplo, nivel actual
    this.phase = data.phase || 1; // Fase actual del nivel
  }

  preload() {
    // Cargá acá assets si necesitás (imágenes, audios, etc.)
  }

  create() {
    // Cinemática simple: texto de ejemplo
    this.add.text(100, 100, `Cinemática Nivel ${this.level} - Fase ${this.phase}`, {
      fontFamily: 'Pixellari',
      fontSize: '24px',
      color: '#ffffff'
    });

    // Salto manual a la siguiente escena con click, tecla o temporizador
    this.input.keyboard.once('keydown-SPACE', () => {
      this.startNextScene();
    });
  }

  startNextScene() {
    // Cambiá esto según la lógica de tu juego
    // Por ejemplo, podrías tener reglas para decidir a qué fase o nivel ir
    this.scene.start('GameScene', { level: this.level, phase: this.phase });
  }
}
