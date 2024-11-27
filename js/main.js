'use strict';
// interface FormElements extends HTMLFormControlsCollection {
//   answer: HTMLInputElement;
// }
const $newGameButton = document.querySelector('#new-game-button');
const $newGameView = document.querySelector('[data-view="new-game"]');
const $triviaQuestionView = document.querySelector(
  '[data-view="trivia-question"]',
);
const $correctAnswerView = document.querySelector(
  '[data-view="correct-answer"]',
);
const $incorrectAnswerView = document.querySelector(
  '[data-view="incorrect-answer"]',
);
const $settingsView = document.querySelector('[data-view="settings"]');
if (
  !$newGameButton ||
  !$newGameView ||
  !$triviaQuestionView ||
  !$correctAnswerView ||
  !$incorrectAnswerView ||
  !$settingsView
) {
  throw new Error(`The $newGame or $newGameView or $triviaQuestionView or
    $correctAnswerView or $incorrectAnswerView or $settingsView query failed`);
}
const views = [
  $newGameView,
  $triviaQuestionView,
  $correctAnswerView,
  $incorrectAnswerView,
  $settingsView,
];
function viewSwap(viewName) {
  views.forEach((_, i) => {
    if (viewName === views[i].getAttribute('data-view')) {
      views[i].classList.remove('hidden');
    } else {
      views[i].classList.add('hidden');
    }
  });
  data.view = viewName;
  writeData();
}
function renderTriviaQuestion(fetchedTriviaData) {
  const $domTreeForm = document.createElement('form');
  const $divQuestion = document.createElement('div');
  $divQuestion.innerHTML = fetchedTriviaData?.question;
  $domTreeForm.appendChild($divQuestion);
  return $domTreeForm;
}
async function fetchTriviaData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}
const testRequest = {
  category: 'Entertainment: Film',
  correct_answer: 'Stewjon',
  difficulty: 'hard',
  incorrect_answers: ['Naboo', 'Alderaan', 'Tatooine'],
  question:
    'According to "Star Wars" lore, which planet does Obi-Wan Kenobi come from?',
  type: 'multiple',
};
$newGameButton.addEventListener('click', async () => {
  console.log(testRequest.correct_answer);
  const fetchedTriviaData = await fetchTriviaData(
    'https://opentdb.com/api.php?amount=1',
  );
  console.log(fetchedTriviaData);
  if (fetchedTriviaData) {
    $triviaQuestionView.appendChild(
      renderTriviaQuestion(fetchedTriviaData.results[0]),
    );
  }
  viewSwap('trivia-question');
  writeData();
});
