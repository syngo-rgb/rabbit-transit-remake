// anims/anims.js
export function initialAnimations(scene) {
  if (!scene.anims.exists("olas-idle")) {  // ✅ Ahora revisa animaciones correctas

    // Olas
    scene.anims.create({
      key: "olas-idle",
      frames: scene.anims.generateFrameNumbers("olas", { start: 0, end: 14 }),
      frameRate: 4,
      repeat: -1,
    });

    // Conejo idle derecha
    scene.anims.create({
      key: "rabbit_right_idle",
      frames: scene.anims.generateFrameNumbers("rabbit", { start: 0, end: 1 }),
      frameRate: 3,
      repeat: -1,
    });

    // Conejo idle izquierda
    scene.anims.create({
      key: "rabbit_left_idle",
      frames: scene.anims.generateFrameNumbers("rabbit", { start: 2, end: 3 }),
      frameRate: 3,
      repeat: -1,
    });

    // Saltos
    scene.anims.create({
      key: "rabbit_up_right",
      frames: scene.anims.generateFrameNumbers("rabbit_jump", { start: 0, end: 3 }),
      frameRate: 15,
      repeat: 0,
    });

    scene.anims.create({
      key: "rabbit_up_left",
      frames: scene.anims.generateFrameNumbers("rabbit_jump", { start: 4, end: 7 }),
      frameRate: 15,
      repeat: 0,
    });

    scene.anims.create({
      key: "rabbit_down_right",
      frames: scene.anims.generateFrameNumbers("rabbit_jump", { start: 8, end: 11 }),
      frameRate: 15,
      repeat: 0,
    });

    scene.anims.create({
      key: "rabbit_down_left",
      frames: scene.anims.generateFrameNumbers("rabbit_jump", { start: 12, end: 15 }),
      frameRate: 15,
      repeat: 0,
    });

    // Título animado
    scene.anims.create({
      key: "tittle_idle",
      frames: scene.anims.generateFrameNumbers("tittle", { start: 0, end: 1 }),
      frameRate: 2.5,
      repeat: -1,
    });

    // Mariposa
    scene.anims.create({
      key: "butterfly",
      frames: scene.anims.generateFrameNumbers("mariposa", { start: 0, end: 1 }),
      frameRate: 20,
      repeat: -1,
    });
  }
}
