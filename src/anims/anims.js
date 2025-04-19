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
        key: "rabbit_right",
        frames: scene.anims.generateFrameNumbers("rabbit", {
          start: 0,
          end: 1,
        }),
        repeat: -1,
        frameRate: 3,
      });

      scene.anims.create({
        key: "rabbit_left",
        frames: scene.anims.generateFrameNumbers("rabbit", {
          start: 2,
          end: 3,
        }),
        repeat: -1,
        frameRate: 3,
      });

      scene.anims.create({
        key: "tittle_idle",
        frames: scene.anims.generateFrameNumbers("tittle", {
          start: 0,
          end: 1,
        }),
        repeat: -1,
        frameRate: 3,
      });
  
    //   scene.anims.create({
    //     key: "",
    //     frames: scene.anims.generateFrameNumbers("", {
    //       start: 10,
    //       end: 10,
    //     }),
    //     frameRate: 10,
    //   });
  }
}