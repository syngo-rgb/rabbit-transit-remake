export function initialAnimations(scene) {
    if (!scene.anims.exists()) {
      scene.anims.create({
        key: "olas-idle",
        frames: scene.anims.generateFrameNumbers("olas", {
          start: 0,
          end: 14,
        }),
        repeat: -1,
        frameRate: 4,
      });
  
      scene.anims.create({
        key: "rabbit_right_idle",
        frames: scene.anims.generateFrameNumbers("rabbit", {
          start: 0,
          end: 1,
        }),
        repeat: -1,
        frameRate: 3,
      });

      scene.anims.create({
        key: "rabbit_left_idle",
        frames: scene.anims.generateFrameNumbers("rabbit", {
          start: 2,
          end: 3,
        }),
        repeat: -1,
        frameRate: 3,
      });

      scene.anims.create({
        key: "rabbit_up_right",
        frames: scene.anims.generateFrameNumbers("rabbit_jump", {
          start: 0,
          end: 4,
        }),
        frameRate: 15,
      });

      scene.anims.create({
        key: "rabbit_up_left",
        frames: scene.anims.generateFrameNumbers("rabbit_jump", {
          start: 5,
          end: 9,
        }),
        frameRate: 15,
      });

      scene.anims.create({
        key: "rabbit_down_right",
        frames: scene.anims.generateFrameNumbers("rabbit_jump", {
          start: 10,
          end: 14,
        }),
        frameRate: 15,
      });

      scene.anims.create({
        key: "rabbit_down_left",
        frames: scene.anims.generateFrameNumbers("rabbit_jump", {
          start: 15,
          end: 19,
        }),
        frameRate: 15,
      });

      scene.anims.create({
        key: "tittle_idle",
        frames: scene.anims.generateFrameNumbers("tittle", {
          start: 0,
          end: 1,
        }),
        repeat: -1,
        frameRate: 2.5,
      });
  
      scene.anims.create({
        key: "butterfly",
        frames: scene.anims.generateFrameNumbers("mariposa", {
          start: 0,
          end: 1,
        }),
          repeat: -1,
        frameRate: 20,
      });
  }
}