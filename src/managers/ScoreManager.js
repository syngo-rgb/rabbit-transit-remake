export class ScoreManager {
  constructor() {
    this.score = 0;
  }

  addJumpPoints() {
    this.score += 20;
  }

  addLevelCompleteBonus() {
    this.score += 500;
  }

  addTimeBonus(time) {
    this.score += time * 5;
  }

  resetPoints() {
    this.score = 0;
  }

  updateScore() {
    
  }

  getScore() {
    return this.score;
  }
}