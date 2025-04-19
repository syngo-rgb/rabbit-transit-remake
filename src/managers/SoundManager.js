// ✅ SoundManager.js mejorado
export class SoundManager {
  constructor(scene) {
    this.scene = scene;
    this.sounds = {};
    this.musicTween = null;
    this.muted = false;
  }

  initSounds() {
    this.sounds = {
      music_menu: this.scene.sound.add("music_menu", { loop: true, volume: 0.2 }),
      music_level1: this.scene.sound.add("music_level1", { loop: true, volume: 0.2 }),
      music_level2: this.scene.sound.add("music_level2", { loop: true, volume: 0.2 }),
      cut_scene: this.scene.sound.add("cut_scene", { loop: true, volume: 0 }),
      win_game: this.scene.sound.add("win_game", { loop: false, volume: 0.6 }),
      lose_game: this.scene.sound.add("lose_game", { loop: false, volume: 0.6 }),
      jump_up: this.scene.sound.add("jump_up", { volume: 1 }),
      jump_down: this.scene.sound.add("jump_down", { volume: 1 }),
      no_move: this.scene.sound.add("no_move", { volume: 1 }),
      lose_life: this.scene.sound.add("lose_life", { volume: 1 }),
      tortoise1: this.scene.sound.add("tortoise1", { volume: 1 }),
      tortoise2: this.scene.sound.add("tortoise2", { volume: 1 }),
    };
  }

  play(key) {
    if (this.sounds[key] && !this.muted) {
      this.sounds[key].play();
    }
  }

  playMusic(key) {
    if (this.currentMusic && this.currentMusic !== this.sounds[key]) {
      this.fadeOutCurrentMusic();
    }

    const newMusic = this.sounds[key];
    if (newMusic && !newMusic.isPlaying) {
      newMusic.play();
    }

    this.scene.tweens.add({
      targets: newMusic,
      volume: 0.5,
      duration: 1000,
      ease: "Linear"
    });

    this.currentMusic = newMusic;
  }

  fadeOutCurrentMusic() {
    if (this.currentMusic) {
      this.scene.tweens.add({
        targets: this.currentMusic,
        volume: 0,
        duration: 800,
        onComplete: () => {
          this.currentMusic.stop();
        }
      });
    }
  }

  stop(key) {
    if (this.sounds[key]) {
      this.sounds[key].stop();
    }
  }

  muteAll(muted = true) {
    this.muted = muted;
    this.scene.sound.mute = muted;
  }
}