// src/data/levelData.js

export const levelData = {
    level1: {
      phase1: {
        start: { x: 5, y: 2 },
        walkableMap: [
          [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
          [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
          [false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false],
          [false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false],
          [false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false],
          [false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false],
          [false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false],
          [false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false],
          [false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false],
          [false, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false],
          [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
        ]
      },
      phase2: {
        start: { x: 8, y: 5 },
        walkableMap: [
          // otra grilla editable
        ]
      }
    },
    level2: {
      phase1: {
        start: { x: 2, y: 3 },
        walkableMap: [
          // otra grilla editable
        ]
      },
      phase2: {
        start: { x: 1, y: 9 },
        walkableMap: [
          // otra grilla editable
        ]
      }
    }
  }
  