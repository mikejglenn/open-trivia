'use strict';
function readData() {
  const dataJSON = localStorage.getItem('data-storage');
  if (dataJSON !== null) {
    return JSON.parse(dataJSON);
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
function writeData() {
  const dataJSON = JSON.stringify(data);
  localStorage.setItem('data-storage', dataJSON);
}
const data = readData();
writeData();
