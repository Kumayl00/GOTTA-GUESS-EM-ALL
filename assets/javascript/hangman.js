const wordElement = document.getElementById('word');
const alphabetContainer = document.getElementById('alphabet-container');
const wrongLettersElement = document.getElementById('wrong-letters-list');
const guessesLeftElement = document.getElementById('guesses-left');
const pokemonImage = document.getElementById('pokemon-image');
const messageElement = document.getElementById('message');
const playAgainButton = document.getElementById('play-again');
const correctSound = new Audio('assets/audio/SFX_INTRO_HOP.wav'); // Correct guess sound
const wrongSound = new Audio('assets/audio/SFX_DENIED.wav');     // Wrong guess sound
const bgMusic = new Audio('assets/audio/team_rocket_background.mp3');   // Background music

let randomWord = '';
let randomImage = '';
let correctLetters = [];
let wrongLetters = [];
let guessesLeft = 10;

// Fetch a random Pokémon from the API
function fetchPokemon() {
  const randomId = Math.floor(Math.random() * 150) + 1; // First 150 Pokémon
   // Start or restart background music
  bgMusic.loop = true; // Loop the background music
  bgMusic.volume = 0.3; // Set the volume to 30%
  bgMusic.play(); // Play the music
  fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}/`)
    .then(response => response.json())
    .then(data => {
      randomWord = data.name.toLowerCase();
      randomImage = data.sprites.front_default;
      initializeGame();
    })
    .catch(error => console.error('Error fetching Pokémon:', error));
}

// Initialize the game
function initializeGame() {
  correctLetters = [];
  wrongLetters = [];
  guessesLeft = 10;
  pokemonImage.src = 'assets/images/pokeball.png';
  // pokemonImage.style.display = 'none';
  messageElement.innerText = '';
  playAgainButton.style.display = 'none';
  guessesLeftElement.innerText = guessesLeft;
  wrongLettersElement.innerText = '';
  displayWord();
  createAlphabetButtons();
}

// Display the word with guessed letters
function displayWord() {
  wordElement.innerHTML = randomWord
    .split('')
    .map(letter => (correctLetters.includes(letter) ? letter : '_'))
    .join(' ');

  if (wordElement.innerText.replace(/\s/g, '') === randomWord) {
    messageElement.innerText = 'Congratulations! You guessed the Pokémon!';
    pokemonImage.src = randomImage;
    // pokemonImage.style.display = 'block';
    // Play Pokémon cry this uses the pokemoncries website and the randomId to get the cry
    const randomSound= Math.floor(Math.random() * 150) + 1; // First 150 Pokémon
    const audio = new Audio(`https://pokemoncries.com/cries-old/${randomSound}.mp3`);
    audio.play();
    endGame();
  }
}

// Create alphabet buttons
function createAlphabetButtons() {
  alphabetContainer.innerHTML = '';
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  alphabet.split('').forEach(letter => {
    const button = document.createElement('button');
    button.innerText = letter;
    button.classList.add('nes-btn');
    button.addEventListener('click', () => handleGuess(letter, button));
    alphabetContainer.appendChild(button);
  });
}

// Handle a letter guess
function handleGuess(letter, button) {
  button.disabled = true;
  if (randomWord.includes(letter)) {
    correctLetters.push(letter);
    correctSound.currentTime = 0; // Reset the sound if played before
    correctSound.play(); // Play correct guess sound
    displayWord();
  } else {
    wrongLetters.push(letter);
    guessesLeft--;
    wrongSound.currentTime = 0; // Reset the sound if played before
    wrongSound.play(); // Play wrong guess sound
    guessesLeftElement.innerText = guessesLeft;
    wrongLettersElement.innerText = wrongLetters.join(', ');
    if (guessesLeft === 0) {
      messageElement.innerText = `Game Over! The Pokémon was "${randomWord}".`;
      endGame();
    }
  }
}

// End the game
function endGame() {
  document.querySelectorAll('.letter-button').forEach(button => {
    button.disabled = true;
  });
  bgMusic.pause(); // Pause the background music
  playAgainButton.style.display = 'inline';
}

// Add event listener for Play Again button
playAgainButton.addEventListener('click', () => {
  bgMusic.currentTime = 0; // Reset the music to the beginning
  bgMusic.play(); // Play the music again
  fetchPokemon();
});

// Start the game
fetchPokemon();


