const questionNumberBtns = document.querySelectorAll('.question-number');
const homeBtn = document.querySelector('.home-button');
const answerBtns = document.querySelectorAll('.answer-button');
const welcomePage = document.querySelectorAll('.welcome-page');
const game = document.querySelectorAll('.game');
const resultPage = document.querySelector('.result');
const timeCounter = document.querySelector('.time');
const playAgainBtn = document.querySelector('.play-again');
const question = document.querySelector('.question');
const allQuestionNumber = document.querySelectorAll('.number-of-questions');
const currentAnswer = document.querySelector('.current-answer');
const correctAnswer = document.querySelector('.correct-answers');
const winnerPicture = document.querySelector('.winner-img');

let questionsArray;
let numberOfQuestions;
let currentQuestionNumber = 0;
let intervalCounter;
let answers = [];
let correctAnswersCounter = 0;
let timeCounterValue = 15;

// ***** Question number button function *****

questionNumberBtns.forEach((element) => {
  element.addEventListener('click', function (e) {
    // ** Disable click again **

    questionNumberBtns.forEach((element) => {
      element.classList.add('disable-click');
    });

    numberOfQuestions = e.currentTarget.value;
    currentAnswer.textContent = currentQuestionNumber + 1;

    // ** Start time counter **
    timeCounterValue = 15;
    startCounter();

    // ** Fetch quiz api with the selected number of questions **

    fetch('https://opentdb.com/api.php?amount=' + numberOfQuestions + '&type=multiple')
      .then((response) => response.json())
      .then((data) => {
        questionsArray = data;

        pushAnswersIntoArray();
        addQuestion(currentQuestionNumber);
        showGame();
        addAnswers();
      });
  });
});

// ***** 15s Time Counter *****

function startCounter() {
  timeCounter.textContent = timeCounterValue;

  intervalCounter = setInterval(timer, 1000);

  function timer() {
    if (timeCounterValue > 0) {
      --timeCounterValue;
      timeCounter.textContent = timeCounterValue;
    } else {
      showResult();
    }
  }
}

// ***** Hide the welcome page and show the game and home button *****

function showTheGameComponents() {
  welcomePage.forEach((elem) => {
    elem.classList.add('hide');
  });
  game.forEach((elem) => {
    elem.classList.remove('hide');
  });
}

// ***** Add the question *****

function addQuestion(questionNumber) {
  question.innerHTML = questionsArray.results[questionNumber].question;
}

// ***** Push the answers into an array ******

function pushAnswersIntoArray() {
  answers = [];
  answers.push(questionsArray.results[currentQuestionNumber].correct_answer);
  for (let i = 0; i < questionsArray.results[currentQuestionNumber].incorrect_answers.length; i++) {
    answers.push(questionsArray.results[currentQuestionNumber].incorrect_answers[i]);
  }
}

// ***** Add the answers *****

function addAnswers() {
  let randomNumber;

  function generateRandomNumber() {
    randomNumber = Math.floor(Math.random() * answers.length);
  }

  for (let i = 0; i < 4; i++) {
    generateRandomNumber();
    console.log(randomNumber);
    console.log(answers[randomNumber] + 'place');
    answerBtns[i].innerHTML = answers[randomNumber];
    answers.splice(randomNumber, 1);
  }
}

// ***** Reset the game *****

function resetAnswers() {
  answerBtns.forEach((element) => {
    element.classList.remove('selected-answer');
    element.classList.remove('correct-answer');
    element.classList.remove('incorrect-answer');
    element.classList.remove('disable-click');
    winnerPicture.classList.add('hide');
  });
  timeCounterValue = 15;
  clearInterval(intervalCounter);
}

function resetGame() {
  timeCounterValue = 15;
  resetAnswers();
  currentQuestionNumber = 0;
  correctAnswersCounter = 0;
}

// ***** Welcome page visibility *****

function showWelcomePage() {
  welcomePage.forEach((elem) => {
    elem.classList.remove('hide');
  });
  game.forEach((elem) => {
    elem.classList.add('hide');
  });
  resultPage.classList.add('hide');

  questionNumberBtns.forEach((element) => {
    element.classList.remove('disable-click');
  });
}

// ***** Game visibility *****

function showGame() {
  game.forEach((elem) => {
    elem.classList.remove('hide');
  });
  welcomePage.forEach((elem) => {
    elem.classList.add('hide');
  });
  resultPage.classList.add('hide');

  allQuestionNumber.forEach((element) => {
    element.textContent = numberOfQuestions;
  });
}

// ***** Result visibility *****

function showResult() {
  resultPage.classList.remove('hide');
  game.forEach((elem) => {
    elem.classList.add('hide');
  });
  welcomePage.forEach((elem) => {
    elem.classList.add('hide');
  });
  resetGame();
}

// ***** Home button function *****

homeBtn.addEventListener('click', function () {
  showWelcomePage();
  resetGame();
});

// ***** Answer button function ******

answerBtns.forEach((element) => {
  element.addEventListener('click', function (e) {
    // ** Select the answer **

    let target = e.currentTarget;
    e.currentTarget.classList.add('selected-answer');

    // ** Stop the counter **
    clearInterval(intervalCounter);

    // ** Disable the click for other buttons **

    answerBtns.forEach((element) => {
      element.classList.add('disable-click');
    });

    // ** Check the answer correctness **

    setTimeout(function () {
      if (target.textContent === questionsArray.results[currentQuestionNumber].correct_answer) {
        target.classList.remove('selected-answer');
        target.classList.add('correct-answer');

        // ** If the answer is correct **
        setTimeout(function answerIsCorrect() {
          resetAnswers();
          ++currentQuestionNumber;
          ++correctAnswersCounter;
          currentAnswer.textContent = currentQuestionNumber + 1;
          correctAnswer.textContent = correctAnswersCounter;

          if (currentQuestionNumber < numberOfQuestions) {
            pushAnswersIntoArray();
            addQuestion(currentQuestionNumber);
            addAnswers();
            startCounter();
          } else {
            showResult();
            winnerPicture.classList.remove('hide');
          }
        }, 1500);
      } else {
        target.classList.remove('selected-answer');
        target.classList.add('incorrect-answer');

        // ** Show the correct answer **

        answerBtns.forEach((element) => {
          for (let i = 0; i < answerBtns.length; i++) {
            if (element.textContent === questionsArray.results[currentQuestionNumber].correct_answer) {
              element.classList.add('correct-answer');
            }
          }
        });

        // ** Result page **

        setTimeout(function () {
          showResult();
        }, 2000);
      }
    }, 2000);
  });
});

// ***** If the answer is correct *****
function answerIsCorrect() {
  resetAnswers();
  ++currentQuestionNumber;
  pushAnswersIntoArray();
  addQuestion(currentQuestionNumber);
  addAnswers();
}

// ***** Play again button function *****

playAgainBtn.addEventListener('click', function () {
  showWelcomePage();
  resetGame();
});
