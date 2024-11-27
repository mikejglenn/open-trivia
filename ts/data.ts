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

interface Data {
  view: string;
  entries: TriviaResponse[];
  nextEntryId: number;
}

function readData(): Data {
  const dataJSON = localStorage.getItem('data-storage');
  if (dataJSON !== null) {
    return JSON.parse(dataJSON);
  } else {
    return {
      view: 'new-game',
      entries: [],
      nextEntryId: 1,
    };
  }
}

function writeData(): void {
  const dataJSON = JSON.stringify(data);
  localStorage.setItem('data-storage', dataJSON);
}

const data: Data = readData();
writeData();
