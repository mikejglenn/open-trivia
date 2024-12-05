interface TriviaForm {
  answer: RadioNodeList;
}

interface FormElements extends HTMLFormControlsCollection {
  category: HTMLSelectElement;
  difficulty: HTMLSelectElement;
  type: HTMLSelectElement;
}

interface Category {
  id: number;
  name: string;
}

interface Categories {
  trivia_categories: Category[];
}

interface GoogleImage {
  link: string;
}

interface GoogleImageSearch {
  items: GoogleImage[];
}

let apiCallBlockTimer = false;

const $mobileNavMenu = document.querySelector('.nav-mobile-items');
const $hamburgerMenu = document.querySelector('.nav-mobile i');
const $settingsButtons = document.querySelectorAll('.settings-button');
const $scoreCorrectSpan = document.querySelector('.score-correct');
const $scoreTotalSpan = document.querySelector('.score-total');
const $newGameButtons = document.querySelectorAll('.new-game-button');
const $nextButtons = document.querySelectorAll('.next-question');
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
const $correctAnswerForm = document.querySelector(
  '[data-view="correct-answer"] form',
);
const $incorrectAnswerView = document.querySelector(
  '[data-view="incorrect-answer"]',
);
const $incorrectAnswerForm = document.querySelector(
  '[data-view="incorrect-answer"] form',
);
const $settingsView = document.querySelector('[data-view="settings"]');
const $settingsForm = document.querySelector('[data-view="settings"] form');
const $settingsCategories = document.querySelector('.categories');
const $settingsCategoriesLabel = document.querySelector('.categories-label');
const $selectDifficulty = document.querySelector(
  '#difficulty',
) as HTMLSelectElement;
const $selectType = document.querySelector('#type') as HTMLSelectElement;
const $dialog = document.querySelector('dialog');
const $dismissModal = document.querySelector('.dismiss-modal');

if (
  !$mobileNavMenu ||
  !$hamburgerMenu ||
  !$settingsButtons ||
  !$scoreCorrectSpan ||
  !$scoreTotalSpan ||
  !$newGameButtons ||
  !$nextButtons ||
  !$newGameView ||
  !$triviaQuestionView ||
  !$triviaQuestionForm ||
  !$correctAnswerView ||
  !$correctAnswerForm ||
  !$incorrectAnswerView ||
  !$incorrectAnswerForm ||
  !$settingsView ||
  !$settingsForm ||
  !$settingsCategories ||
  !$settingsCategoriesLabel ||
  !$selectDifficulty ||
  !$selectType ||
  !$dialog ||
  !$dismissModal
) {
  throw new Error(`The $mobileNavMenu or $hamburgerMenu or $settingsButtons or
    $scoreCorrectSpan or $scoreTotalSpan or $newGameButtons or $nextButtons or
    $newGameView or $triviaQuestionView or $triviaQuestionForm or
    $correctAnswerView or $correctAnswerForm or $incorrectAnswerView or
    $incorrectAnswerForm or $settingsView or $settingsForm or
    $settingsCategories or $settingsCategoriesLabel or $selectDifficulty or
    $selectType or $dialog or $dismissModal query failed`);
}

const views = [
  $newGameView,
  $triviaQuestionView,
  $correctAnswerView,
  $incorrectAnswerView,
  $settingsView,
];

function viewSwapAndUpdateScore(viewName: string): void {
  if ($scoreCorrectSpan) $scoreCorrectSpan.innerHTML = `${game.score}`;
  if ($scoreTotalSpan) $scoreTotalSpan.innerHTML = `${game.entries.length}`;
  views.forEach((_, i) => {
    if (viewName === views[i].getAttribute('data-view')) {
      views[i].classList.remove('hidden');
    } else {
      views[i].classList.add('hidden');
    }
  });
  game.view = viewName;
  writeGame();
}

function apiCallBlock(alertMessage: string): boolean {
  if (apiCallBlockTimer) {
    alert(alertMessage);
    return true;
  }
  apiCallBlockTimer = true;
  setTimeout(() => {
    apiCallBlockTimer = false;
  }, 5000);
  return false;
}

async function fetchTriviaData(
  url: string,
): Promise<TriviaResponse | undefined> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const triviaData = (await response.json()) as TriviaResponse;
    return triviaData;
  } catch (error) {
    alert('Error:' + error);
  }
}

const zepA0 = 'p8s2xENx6I';
const zepB1 = '9LrI8val72';
const zepC2 = 'zyqH4ZWmmY';
const zepD3 = 'AIzaSyAqp';
const r2d2c3po = `${zepD3}${zepC2}${zepB1}${zepA0}`;
const cx = 'e48567ec4e85d4636';

async function fetchImageData(url: string): Promise<string | undefined> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const imageData = (await response.json()) as GoogleImageSearch;
    return imageData.items[0].link;
  } catch (error) {
    alert('Error:' + error);
  }
}

function decodeHtml(html: string): string {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}

async function processTriviaQuestion(): Promise<void> {
  if ($triviaQuestionForm) $triviaQuestionForm.innerHTML = '';
  viewSwapAndUpdateScore('trivia-question');

  let triviaUrl = 'https://opentdb.com/api.php?amount=1';
  if (game.category !== '') triviaUrl += `&category=${game.category}`;
  if (game.difficulty !== '') triviaUrl += `&difficulty=${game.difficulty}`;
  if (game.type !== '') triviaUrl += `&type=${game.type}`;

  const fetchedTriviaData = await fetchTriviaData(triviaUrl);

  if (fetchedTriviaData) {
    game.currentQuestion = fetchedTriviaData.results[0];
    if (game.currentQuestion.type === 'boolean') {
      game.currentAnswers = ['True', 'False'];
    } else {
      const randomCorrectIndex = Math.floor(Math.random() * 4);
      const answers = [...game.currentQuestion.incorrect_answers];
      answers.splice(
        randomCorrectIndex,
        0,
        game.currentQuestion.correct_answer,
      );
      game.currentAnswers = answers;
    }
    $triviaQuestionForm?.appendChild(
      renderTriviaQuestionAnswers(game.currentQuestion),
    );
  }

  game.entries.push(fetchedTriviaData as TriviaResponse);

  let imageUrl = 'https://www.googleapis.com/customsearch/v1';
  imageUrl += `?key=${r2d2c3po}`;
  imageUrl += `&cx=${cx}`;
  imageUrl += '&searchType=image';
  imageUrl += '&safe=active';
  imageUrl += '&num=1';
  let searchQuery;
  if (game.currentQuestion) {
    searchQuery = decodeHtml(game.currentQuestion.question);
  }
  if (game.currentQuestion?.type === 'multiple') {
    searchQuery =
      decodeHtml(game.currentQuestion.correct_answer) + ' ' + searchQuery;
  }
  searchQuery = encodeURIComponent(`${searchQuery}`);
  imageUrl += `&q=${searchQuery}`;

  const fetchedImageData = await fetchImageData(imageUrl);
  if (game.currentQuestion) {
    game.currentQuestion.searchStr = searchQuery;
    game.currentQuestion.image = fetchedImageData;
  }
  game.entries[game.nextEntryId].results[0].searchStr = searchQuery;
  game.entries[game.nextEntryId].results[0].image = fetchedImageData;

  game.nextEntryId++;

  writeGame();
}

function renderTriviaQuestionAnswers(
  fetchedTriviaData: TriviaQuestion,
): HTMLElement {
  const $domTreeDiv = document.createElement('div');
  $domTreeDiv.classList.add('row');

  const $divQuestion = document.createElement('div');
  $divQuestion.innerHTML = fetchedTriviaData.question;
  $divQuestion.classList.add('question');
  $divQuestion.classList.add('row');
  $divQuestion.classList.add('column-full');

  const $divRadioGroup = document.createElement('div');

  if (game.currentAnswers) {
    game.currentAnswers.forEach((answer, i) => {
      const $divAnswer = document.createElement('div');
      const $inputAnswer = document.createElement('input');
      const $labelAnswer = document.createElement('label');

      let answerIndex;
      $labelAnswer.innerHTML = answer;

      if (answer === game.currentQuestion?.correct_answer) {
        answerIndex = i + 'c';
      } else {
        answerIndex = i;
      }

      if (game.view === 'correct-answer') {
        $inputAnswer.disabled = true;
        if (answer === game.submittedAnswer) {
          $inputAnswer.classList.add('correct-radio');
          $inputAnswer.checked = true;
          $labelAnswer.classList.add('correct-label');
        }
      }

      if (game.view === 'incorrect-answer') {
        $inputAnswer.disabled = true;
        if (answer === game.submittedAnswer) {
          $inputAnswer.classList.add('incorrect-radio');
          $inputAnswer.checked = true;
          $labelAnswer.classList.add('incorrect-label');
        }
        if (answer === game.currentQuestion?.correct_answer) {
          $labelAnswer.classList.add('correct-label');
        }
      }

      $inputAnswer.type = 'radio';
      $inputAnswer.name = 'answer';
      $inputAnswer.value = answer;
      $inputAnswer.id = 'answerChoice' + answerIndex;
      $inputAnswer.required = true;
      $labelAnswer.setAttribute('for', 'answerChoice' + answerIndex);

      $divAnswer.appendChild($inputAnswer);
      $divAnswer.appendChild($labelAnswer);

      $divRadioGroup.appendChild($divAnswer);
    });
  }

  $domTreeDiv.appendChild($divQuestion);
  $domTreeDiv.appendChild($divRadioGroup);

  if (game.view === 'trivia-question') {
    const $divButtonWrap = document.createElement('div');
    $divButtonWrap.classList.add('row');
    $divButtonWrap.classList.add('column-full');
    const $buttonSubmit = document.createElement('button');
    $buttonSubmit.type = 'submit';
    $buttonSubmit.textContent = 'Submit';
    $divButtonWrap.appendChild($buttonSubmit);
    $domTreeDiv.appendChild($divButtonWrap);
    return $domTreeDiv;
  }

  const $divImgWrap = document.createElement('div');
  $divImgWrap.classList.add('row');
  $divImgWrap.classList.add('column-full');
  $divImgWrap.classList.add('answer-image');
  const $divImgText = document.createElement('div');
  $divImgText.classList.add('column-full');
  $divImgText.textContent = 'First Google Image result for the question:';
  const $divShowImgWrap = document.createElement('div');
  $divShowImgWrap.classList.add('column-full');
  const $buttonShowImage = document.createElement('button');
  $buttonShowImage.type = 'button';
  $buttonShowImage.classList.add('show-image');
  $buttonShowImage.textContent = 'Show image';
  const $imgGoogleSearch = document.createElement('img');
  if (game.currentQuestion?.image)
    $imgGoogleSearch.src = game.currentQuestion.image;
  $imgGoogleSearch.classList.add('hidden');
  $divShowImgWrap.appendChild($buttonShowImage);

  $divImgWrap.appendChild($divImgText);
  $divImgWrap.appendChild($divShowImgWrap);
  $divImgWrap.appendChild($imgGoogleSearch);
  $domTreeDiv.appendChild($divImgWrap);

  $buttonShowImage.addEventListener('click', () => {
    $imgGoogleSearch.classList.remove('hidden');
  });

  return $domTreeDiv;
}

$hamburgerMenu.addEventListener('click', () => {
  if ($mobileNavMenu.classList.contains('hidden')) {
    $mobileNavMenu.classList.remove('hidden');
  } else {
    $mobileNavMenu.classList.add('hidden');
  }
});

$newGameButtons.forEach(($newGameButton) => {
  $newGameButton.addEventListener('click', () => {
    if (apiCallBlock('Please wait 5 seconds before clicking new game.')) return;

    game.entries = [];
    game.currentQuestion = null;
    game.currentAnswers = null;
    game.submittedAnswer = '';
    game.score = 0;
    game.nextEntryId = 0;

    processTriviaQuestion();
  });
});

$triviaQuestionForm.addEventListener('submit', (event: Event) => {
  event.preventDefault();
  const $triviaFormRadioAnswers = $triviaQuestionForm as unknown as TriviaForm;
  game.submittedAnswer = $triviaFormRadioAnswers.answer.value;
  if (game.submittedAnswer === game.currentQuestion?.correct_answer) {
    game.score++;
    $correctAnswerForm.innerHTML = '';
    viewSwapAndUpdateScore('correct-answer');
    $correctAnswerForm.appendChild(
      renderTriviaQuestionAnswers(game.currentQuestion),
    );
  } else if (game.currentQuestion) {
    $incorrectAnswerForm.innerHTML = '';
    viewSwapAndUpdateScore('incorrect-answer');
    $incorrectAnswerForm.appendChild(
      renderTriviaQuestionAnswers(game.currentQuestion),
    );
  }
  writeGame();
});

$nextButtons.forEach(($nextButton) => {
  $nextButton.addEventListener('click', () => {
    if (apiCallBlock('Please wait 5 seconds before clicking next question.'))
      return;
    processTriviaQuestion();
  });
});

$settingsButtons.forEach(($settingsButton) => {
  $settingsButton.addEventListener('click', async () => {
    if (apiCallBlock('Please wait 5 seconds before clicking settings.')) return;
    let categories;
    try {
      const response = await fetch('https://opentdb.com/api_category.php');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      categories = (await response.json()) as Categories;
    } catch (error) {
      alert('Error:' + error);
    }
    const $labelCategory = document.createElement('label');
    $labelCategory.setAttribute('for', 'category');
    $labelCategory.textContent = 'Select Category:';
    const $selectCategory = document.createElement('select');
    $selectCategory.id = 'category';
    $selectCategory.name = 'category';
    const $optionSelectEmpty = document.createElement('option');
    $optionSelectEmpty.value = '';
    $optionSelectEmpty.textContent = 'Any Category';
    $selectCategory.appendChild($optionSelectEmpty);
    categories?.trivia_categories.forEach((category) => {
      const $optionSelectCategory = document.createElement('option');
      $optionSelectCategory.value = `${category.id}`;
      $optionSelectCategory.textContent = category.name;
      $selectCategory.appendChild($optionSelectCategory);
    });
    $settingsCategories.innerHTML = '';
    $settingsCategories.appendChild($selectCategory);
    $settingsCategoriesLabel.innerHTML = '';
    $settingsCategoriesLabel.appendChild($labelCategory);

    $selectCategory.value = game.category;
    $selectDifficulty.value = game.difficulty;
    $selectType.value = game.type;

    viewSwapAndUpdateScore('settings');
  });
});

$settingsForm.addEventListener('submit', (event: Event) => {
  event.preventDefault();
  const $formElements = $settingsForm as unknown as FormElements;
  game.category = $formElements.category.value;
  game.difficulty = $formElements.difficulty.value;
  game.type = $formElements.type.value;
  $dialog.showModal();
  writeGame();
});

$dismissModal.addEventListener('click', () => {
  $dialog.close();
});

// @ts-expect-error: Unreachable code error
gsap.to('button.new-game-button', {
  duration: 2,
  rotation: 360,
});
