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
  
    //   scene.anims.create({
    //     key: "",
    //     frames: scene.anims.generateFrameNumbers("", {
    //       start: 10,
    //       end: 10,
    //     }),
    //     frameRate: 10,
    //   });
  
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