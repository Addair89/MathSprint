// Pages
const gamePage = document.getElementById('game-page');
const scorePage = document.getElementById('score-page');
const splashPage = document.getElementById('splash-page');
const countdownPage = document.getElementById('countdown-page');
// Splash Page
const startForm = document.getElementById('start-form');
const radioContainers = document.querySelectorAll('.radio-container');
const radioInputs = document.querySelectorAll('input');
const bestScores = document.querySelectorAll('.best-score-value');
// Countdown Page
const countdown = document.querySelector('.countdown');
// Game Page
const itemContainer = document.querySelector('.item-container');
// Score Page
const finalTimeEl = document.querySelector('.final-time');
const baseTimeEl = document.querySelector('.base-time');
const penaltyTimeEl = document.querySelector('.penalty-time');
const playAgainBtn = document.querySelector('.play-again');

// Equations 
let questionAmount = 0;
let equationsArray = [];
let playerGuessArray = [];
let bestScoreArray = [];

// Game Page
let firstNumber = 0;
let secondNumber = 0;
let equationObject = {};
const wrongFormat = [];

// Time
let timer;
let timePLayed = 0;
let baseTime = 0;
let penaltyTime = 0;
let finalTime = 0;
let finalTimeDisplay = '0.0';


// Scroll
let valueY = 0;

//Refresh splash page best scores

function bestScoresToDOM(){
  bestScores.forEach((item, index) => {
    const bestScoreEl = item;
    bestScoreEl.textContent = `${bestScoreArray[index].bestScore}s`;
  })
}

//Check local storage for best scores

function getSaveBestScores() {
  if(localStorage.getItem('bestScores')){
    bestScoreArray = JSON.parse(localStorage.bestScores);
  } else {
    bestScoreArray = [
      { questions: 10, bestScore: finalTimeDisplay },
      { questions: 20, bestScore: finalTimeDisplay },
      { questions: 50, bestScore: finalTimeDisplay },
      { questions: 99, bestScore: finalTimeDisplay },
    ];
    localStorage.setItem('bestScores', JSON.stringify(bestScoreArray));
  }
  bestScoresToDOM();
}

//Update Best score array
function updateBestScore() {
  bestScoreArray.forEach((score, index) => {
    //select correct best score to update
    if(questionAmount == score.questions){
      //return the best score as a number with 1 decimal
      const savedBestScore = parseInt(bestScoreArray[index].bestScore)
      //update if the new final score is higher or replacing zero
      if (savedBestScore === 0 || savedBestScore > finalTime){
        bestScoreArray[index].bestScore = finalTimeDisplay;
      }
    }
  });
  //Update splash page
  bestScoresToDOM();
  //Save loacl storgae
  localStorage.setItem('bestScores', JSON.stringify(bestScoreArray));
}

//Reset game
function playAgain(){
  gamePage.addEventListener('click', startTimer);
  scorePage.hidden = true;
  splashPage.hidden = false;
  equationsArray = [];
  playerGuessArray =[];
  valueY = 0;
  playAgainBtn.hidden = true;
}

//show score page
function showScorePage(){
  //show play again button after 1s
  setTimeout(() => {
    playAgainBtn.hidden = false;
  }, 2000);
  gamePage.hidden = true;
  scorePage.hidden = false;
}

//Format and display time in DOM
function scoresToDOM(){
  finalTimeDisplay = finalTime.toFixed(1);
  baseTime = timePLayed.toFixed(1);
  penaltyTime = penaltyTime.toFixed(1);
  baseTimeEl.textContent = `Base Time: ${baseTime}s`;
  penaltyTimeEl.textContent = `Penalty: +${penaltyTime}s`;
  finalTimeEl.textContent = `${finalTimeDisplay}s`;
  updateBestScore()
  //Scroll to top and go to scores page
  itemContainer.scrollTo({ top: 0, behavior: 'instant'});
  showScorePage();
}



//Stop Time, Proccess Results, got to score page
function checkTime(){
  console.log(timePLayed);
  if (playerGuessArray.length == questionAmount){
    clearInterval(timer);
    // check for wrong guesse and add penalty time
    equationsArray.forEach((equation, index) =>{
      if (equation.evaluated === playerGuessArray[index]){
        //Correct guess, no penalty
      }else {
        //Incorrect guess, penalty
        penaltyTime += 0.5;
      }
    })
    //Calculate times
    finalTime = timePLayed + penaltyTime;
    console.log('TimePLayed: ', timePLayed, 'penalty: ', penaltyTime, 'Final Time: ', finalTime);
    scoresToDOM();
  }
}

//Add a 10th of a second to timeplayed
function addTime(){
  timePLayed += 0.1;
  checkTime();
}

//Start time when game page is clicked
function startTimer(){
  timePLayed = 0;
  penaltyTime = 0;
  finalTime = 0;
  timer = setInterval(addTime, 100);
  gamePage.removeEventListener('click', startTimer);
}

//Scroll and store user selection in playerguess array
function select(guessedTrue){
  //scroll 80px at a time
  valueY+=80;
  itemContainer.scroll(0, valueY);
  //add guess to player guess array
  return guessedTrue ? playerGuessArray.push('true') : playerGuessArray.push('false');
}

//Display Game Page
function showGamePage(){
  countdownPage.hidden = true;
  gamePage.hidden = false;
}

//Get Random Number up to a max number
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

// Create Correct/Incorrect Random Equations
function createEquations() {
  // Randomly choose how many correct equations there should be
  const correctEquations = getRandomInt(questionAmount);
  // Set amount of wrong equations
  const wrongEquations = questionAmount - correctEquations;
  // Loop through, multiply random numbers up to 9, push to array
  for (let i = 0; i < correctEquations; i++) {
     firstNumber = getRandomInt(12);
     secondNumber = getRandomInt(12);
    const equationValue = firstNumber * secondNumber;
    const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`;
    equationObject = { value: equation, evaluated: 'true' };
    equationsArray.push(equationObject);
  }
  // Loop through, mess with the equation results, push to array
   for (let i = 0; i < wrongEquations; i++) {
    firstNumber = getRandomInt(12);
    secondNumber = getRandomInt(12);
    const equationValue = firstNumber * secondNumber;
    wrongFormat[0] = `${firstNumber} x ${secondNumber + 1} = ${equationValue}`;
    wrongFormat[1] = `${firstNumber} x ${secondNumber} = ${equationValue - 1}`;
    wrongFormat[2] = `${firstNumber + 1} x ${secondNumber} = ${equationValue}`;
    const formatChoice = getRandomInt(3);
    const equation = wrongFormat[formatChoice];
    equationObject = { value: equation, evaluated: 'false' };
    equationsArray.push(equationObject);
  
  }
  shuffle(equationsArray);
}

//Add to DOM
function equationsToDOM(){
  equationsArray.forEach((equation) => {
    
    //Item
    const item = document.createElement('div');
    item.classList.add('item');
    // ..Equation Text
    const equationText = document.createElement('h1');
    equationText.textContent = equation.value;
    //Apend
    item.appendChild(equationText);
    itemContainer.appendChild(item);
  })
}

//Dynamically adding correct/incorrect equations
function populateGamePage() {
  // Reset DOM, Set Blank Space Above
  itemContainer.textContent = '';
  // Spacer
  const topSpacer = document.createElement('div');
  topSpacer.classList.add('height-240');
  // Selected Item
  const selectedItem = document.createElement('div');
  selectedItem.classList.add('selected-item');
  // Append
  itemContainer.append(topSpacer, selectedItem);

  // Create Equations, Build Elements in DOM
  createEquations();
  equationsToDOM();
  // Set Blank Space Below
  const bottomSpacer = document.createElement('div');
  bottomSpacer.classList.add('height-500');
  itemContainer.appendChild(bottomSpacer);
}

//Get the value from the selected radio button
function getRadioValue(){
  let radioValue;
  radioInputs.forEach((radioInput) => {
    if(radioInput.checked){
      radioValue = radioInput.value;
    }
  })
  //Leave returns outside of loops or you will not return anything
  return radioValue;
}

//Countdown timer 3,2,1,go
function countdownStart() {
  countdown.textContent = '3';
  setTimeout(() =>{
    countdown.textContent = '2'
  }, 1000);
  setTimeout(() =>{
    countdown.textContent = '1'
  }, 2000);
  setTimeout(() =>{
    countdown.textContent = 'Go!'
  }, 3000);
  setTimeout(() =>{
  }, 4000);
}

//navigate from splash page to countdown
function showCountdown() {
  splashPage.hidden = true;
  countdownPage.hidden = false;
  countdownStart();
  populateGamePage();
  setTimeout(showGamePage, 4000)
}

//form that decides amount of questions
function selectQuestionAmount(e) {
  e.preventDefault();
  questionAmount = getRadioValue();
  if(questionAmount){
    showCountdown();
  }
}


startForm.addEventListener('click', () =>{
  radioContainers.forEach((radioEl) =>{
    //reset selected label styling
    radioEl.classList.remove('selected-label');
    //Add it back if radio input is checked
    if (radioEl.children[1].checked) {
      radioEl.classList.add('selected-label');
    }
  })
});

//Event Listeners
startForm.addEventListener('submit', selectQuestionAmount);
gamePage.addEventListener('click', startTimer);

//Onload Check and get best Scores
getSaveBestScores();