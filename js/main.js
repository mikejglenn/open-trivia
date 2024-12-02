'use strict';
const $newGameButton = document.querySelector('#new-game-button');
const $newGameView = document.querySelector('[data-view="new-game"]');
const $triviaQuestionView = document.querySelector(
  '[data-view="trivia-question"]',
);
const $triviaQuestionForm = document.querySelector(
  '[data-view="trivia-question"] form',
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
  !$triviaQuestionForm ||
  !$correctAnswerView ||
  !$incorrectAnswerView ||
  !$settingsView
) {
  throw new Error(`The $newGame or $newGameView or $triviaQuestionView or
    $triviaQuestionForm or $correctAnswerView or $incorrectAnswerView or
    $settingsView query failed`);
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
  const $domTreeDiv = document.createElement('div');
  const $divQuestion = document.createElement('div');
  $divQuestion.innerHTML = fetchedTriviaData.question;
  const $divRadioGroup = document.createElement('div');
  const randomCorrectIndex = Math.floor(Math.random() * 4);
  const answers = [...fetchedTriviaData.incorrect_answers];
  answers.splice(randomCorrectIndex, 0, fetchedTriviaData.correct_answer);
  answers.forEach((_, i) => {
    const $divAnswer = document.createElement('div');
    const $inputAnswer = document.createElement('input');
    const $labelAnswer = document.createElement('label');
    let answerIndex;
    $labelAnswer.innerHTML = answers[i];
    if (randomCorrectIndex === i) {
      answerIndex = i + 'c';
    } else {
      answerIndex = i;
    }
    $inputAnswer.type = 'radio';
    $inputAnswer.name = 'answer';
    $inputAnswer.value = answers[i];
    $inputAnswer.id = 'answerChoice' + answerIndex;
    $inputAnswer.required = true;
    $labelAnswer.setAttribute('for', 'answerChoice' + answerIndex);
    $divAnswer.appendChild($inputAnswer);
    $divAnswer.appendChild($labelAnswer);
    $divRadioGroup.appendChild($divAnswer);
  });
  const $buttonSubmit = document.createElement('button');
  $buttonSubmit.type = 'submit';
  $buttonSubmit.textContent = 'Submit';
  $domTreeDiv.appendChild($divQuestion);
  $domTreeDiv.appendChild($divRadioGroup);
  $domTreeDiv.appendChild($buttonSubmit);
  return $domTreeDiv;
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
const testResponse = {
  category: 'Entertainment: Film',
  correct_answer: 'Stewjon',
  difficulty: 'hard',
  incorrect_answers: ['Naboo', 'Alderaan', 'Tatooine'],
  question:
    'According to "Star Wars" lore, which planet does Obi-Wan Kenobi come from?',
  type: 'multiple',
};
$newGameButton.addEventListener('click', async () => {
  console.log(testResponse.correct_answer); //
  data.entries = [];
  data.currentQuestion = null;
  data.nextEntryId = 1;
  const fetchedTriviaData = await fetchTriviaData(
    'https://opentdb.com/api.php?amount=1&type=multiple',
  );
  console.log(fetchedTriviaData); //
  if (fetchedTriviaData) {
    data.currentQuestion = fetchedTriviaData.results[0];
    $triviaQuestionForm.appendChild(
      renderTriviaQuestion(fetchedTriviaData.results[0]),
    );
  }
  data.entries.push(fetchedTriviaData);
  viewSwap('trivia-question');
  writeData();
});
$triviaQuestionForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const $formElements = $triviaQuestionForm;
  const $triviaFormRadioAnswers = $formElements;
  const $triviaAnswerValue = $triviaFormRadioAnswers.answer.value;
  if ($triviaAnswerValue === data.currentQuestion?.correct_answer) {
    viewSwap('correct-answer');
  } else {
    viewSwap('incorrect-answer');
  }
});
