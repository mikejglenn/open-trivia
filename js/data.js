'use strict';
function readGame() {
  const gameJSON = localStorage.getItem('game-storage');
  if (gameJSON !== null) {
    return JSON.parse(gameJSON);
  } else {
    return {
      view: 'new-game',
      entries: [],
      currentQuestion: null,
      currentAnswers: null,
      submittedAnswer: '',
      score: 0,
      category: '',
      difficulty: '',
      type: '',
      nextEntryId: 0,
    };
  }
}
function writeGame() {
  const gameJSON = JSON.stringify(game);
  localStorage.setItem('game-storage', gameJSON);
}
const game = readGame();
writeGame();
