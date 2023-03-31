let images = [];

function getRandomImages(imageUrls, count) {
  const shuffledUrls = imageUrls.sort(() => 0.5 - Math.random());
  return shuffledUrls.slice(0, count).map(url => {
    const answer = url.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.'));
    return { url, answer };
  });
}

async function fetchImageData() {
  try {
    const response = await fetch('/images');
    const imageUrls = await response.json();
    images = getRandomImages(imageUrls, 250);
    init();
  } catch (error) {
    console.error('Error fetching image data:', error);
  }
}

fetchImageData();

let currentIndex = 0;
let correctAnswers = 0;
let timer;
let timeRemaining = 300;

const currentImage = document.getElementById("currentImage");
const prevImage = document.getElementById("prevImage");
const nextImage = document.getElementById("nextImage");
const guessInput = document.getElementById("guessInput");
const submitGuess = document.getElementById("submitGuess");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const gameOver = document.getElementById("gameOver");
const finalScore = document.getElementById("finalScore");
const nameInput = document.getElementById("nameInput");
const submitName = document.getElementById("submitName");
const leaderboardList = document.getElementById("leaderboardList");
const imageCounter = document.getElementById("imageCounter");
const correctAnswer = document.getElementById("correctAnswer");
const startNewGameButton = document.getElementById("startNewGameButton");
const guessForm = document.getElementById("guessForm");



function showNewGameButton() {
  startNewGameButton.style.display = "block";
}

function hideNewGameButton() {
  startNewGameButton.style.display = "none";
}

function getFileNameFromUrl(url) {
  return url.split('/').pop().split('.')[0];
}

function showCorrectAnswer() {
  const imageName = getFileNameFromUrl(images[currentIndex].url).replace("_", " ");
  correctAnswer.textContent = `Answer: ${imageName}`;
  correctAnswer.style.display = "block";

}

function hideCorrectAnswer() {
  correctAnswer.style.display = "none";
}

function updateImageCounter() {
  imageCounter.textContent = `${currentIndex + 1}/${images.length}`;
}

function updateImage() {
  currentImage.src = images[currentIndex].url;
  imageCounter.textContent = `${currentIndex + 1}/${images.length}`;

  if (timeRemaining <= 0) {
    showCorrectAnswer();
  }
}


function updateScore() {
  scoreDisplay.textContent = `Score: ${correctAnswers}`;
}

function updateTimer() {
  timerDisplay.textContent = `Time left: ${timeRemaining}s`;
}

function showGameOver() {
  gameOver.classList.remove("hidden");
  finalScore.textContent = correctAnswers;
}

// function startNewGame() {
//   // Reset the timer
//   timeLeft = 30;
//   timer.textContent = timeLeft;


//   // Hide the correct answer and the new game button
//   hideCorrectAnswer();
//   hideNewGameButton();

//   // Reset the score
//   correctGuesses = 0;
//   score.textContent = correctGuesses;

//   // Reset the images
//   images = getRandomImages(50);
//   currentIndex = 0;
//   updateImage();


//   // Restart the timer
//   startTimer();
// }

function startTimer() {
  timer = setInterval(() => {
    timeRemaining--;
    updateTimer();
    if (timeRemaining <= 0) {
      clearInterval(timer);
      showGameOver();
      submitGuess.disabled = true;
      timer.textContent = "Time's up!";


      // Show the correct answer
      showCorrectAnswer();
      showNewGameButton();
    }
  }, 1000);
}

function submitCurrentGuess() {
  const inputWords = guessInput.value.trim().toLowerCase().split(" ");
  const answerWords = images[currentIndex].answer.toLowerCase().split("_");

  const isAnswerCorrect = inputWords.length === 2 &&
    answerWords.includes(inputWords[0]) &&
    answerWords.includes(inputWords[1]);

  if (isAnswerCorrect) {
    correctAnswers++;
    updateScore();
    images.splice(currentIndex, 1); // Remove the correctly guessed image

    if (images.length === 0) {
      clearInterval(timer);
      showGameOver();
      return;
    }

    currentIndex = currentIndex % images.length; // Update the current index to avoid out-of-bound indices
  }
  updateImage();
  guessInput.value = "";
}

function init() {
  updateImage();
  updateScore();
  updateTimer();
  startTimer();
}

prevImage.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  updateImage();
  // if (currentIndex < images.length - 1) {
  //   currentIndex++;
  //   updateImage();
  //   if (timeLeft <= 0) {
  //     showCorrectAnswer();
  //   }
  // }
});

nextImage.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % images.length;
  updateImage();
  // if (currentIndex > 0) {
  //   currentIndex--;
  //   updateImage();
  //   if (timeLeft <= 0) {
  //     showCorrectAnswer();
  //   }
  // }
});

submitGuess.addEventListener("click", submitCurrentGuess);

guessForm.addEventListener("submit", function(event) {
  event.preventDefault();
  submitCurrentGuess();
});



submitName.addEventListener("click", () => {
  const name = nameInput.value.trim();
  if (name) {
    const listItem = document.createElement("li");
    listItem.textContent = `${name} - ${correctAnswers}`;
    leaderboardList.appendChild(listItem);
    nameInput.value = "";

    // Disable the submit button and input field
    submitName.disabled = true;
    document.getElementById("name").disabled = true;
  }
});

init();

updateImage();