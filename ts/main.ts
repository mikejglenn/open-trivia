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

function viewSwap(viewName: string): void {
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

function renderTriviaQuestion(fetchedTriviaData: TriviaQuestion): HTMLElement {
  const $domTreeForm = document.createElement('form');

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

    if (randomCorrectIndex === i) {
      $labelAnswer.innerHTML = fetchedTriviaData?.correct_answer;
      answerIndex = i + 'c';
    } else {
      $labelAnswer.innerHTML = fetchedTriviaData?.incorrect_answers[i];
      answerIndex = i;
    }

    $inputAnswer.type = 'radio';
    $inputAnswer.name = 'answer';
    $inputAnswer.value = 'answer' + answerIndex;
    $inputAnswer.id = 'answerChoice' + answerIndex;
    $labelAnswer.setAttribute('for', 'answerChoice' + answerIndex);

    $divAnswer.appendChild($inputAnswer);
    $divAnswer.appendChild($labelAnswer);

    $divRadioGroup.appendChild($divAnswer);
  });

  const $buttonSubmit = document.createElement('button');
  $buttonSubmit.type = 'submit';
  $buttonSubmit.textContent = 'Submit';

  $domTreeForm.appendChild($divQuestion);
  $domTreeForm.appendChild($divRadioGroup);
  $domTreeForm.appendChild($buttonSubmit);

  return $domTreeForm;
}

async function fetchTriviaData(
  url: string,
): Promise<TriviaResponse | undefined> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = (await response.json()) as TriviaResponse;
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}

const testResponse: TriviaQuestion = {
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

  const fetchedTriviaData = await fetchTriviaData(
    'https://opentdb.com/api.php?amount=1&type=multiple',
  );
  console.log(fetchedTriviaData); //

  if (fetchedTriviaData) {
    $triviaQuestionView.prepend(
      renderTriviaQuestion(fetchedTriviaData.results[0]),
    );
  }
  viewSwap('trivia-question');
  writeData();
});
