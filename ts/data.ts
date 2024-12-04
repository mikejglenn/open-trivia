/* exported data */
interface TriviaQuestion {
  category: string;
  correct_answer: string;
  difficulty: string;
  incorrect_answers: string[];
  question: string;
  type: string;
}

interface TriviaResponse {
  response_code: number;
  results: TriviaQuestion[];
}

interface Game {
  view: string;
  entries: TriviaResponse[];
  currentQuestion: TriviaQuestion | null;
  currentAnswers: string[] | null;
  submittedAnswer: string;
  score: number;
  category: string;
  difficulty: string;
  type: string;
  nextEntryId: number;
}

function readGame(): Game {
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

function writeGame(): void {
  const gameJSON = JSON.stringify(game);
  localStorage.setItem('game-storage', gameJSON);
}

const game: Game = readGame();
writeGame();
