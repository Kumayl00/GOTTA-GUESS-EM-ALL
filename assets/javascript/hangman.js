const wordElement = document.getElementById('word');
const alphabetContainer = document.getElementById('alphabet-container');
const wrongLettersElement = document.getElementById('wrong-letters-list');
const guessesLeftElement = document.getElementById('guesses-left');
const pokemonImage = document.getElementById('pokemon-image');
const messageElement = document.getElementById('message');
const playAgainButton = document.getElementById('play-again');
const pokemonStats = document.getElementById('pokemon-stats');

let randomId;
let randomWord = '';
let randomImage = '';
let correctLetters = [];
let wrongLetters = [];
let guessesLeft = 10;

//pokemon stat variables
let pokemonName = '';
let pokemonType = '';
let pokemonHeight = '';
let pokemonWeight = '';
let pokemonAbility1 = '';
let pokemonAbility2 = '';

// Fetch a random Pokémon from the API
function fetchPokemon() {
  randomId = Math.floor(Math.random() * 150) + 1; // First 150 Pokémon

  fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}/`)
    .then(response => response.json())
    .then(data => {
      //override names for "nidoran-f" and "nidoran-m and mr-mime"
      if (data.name.toLowerCase() ==="nidoran-f" || data.name.toLowerCase() === "nidoran-m") {
        randomWord = "nidoran";
      } else if (data.name.toLowerCase() === "mr-mime") { 
        randomWord = "mrmime"
      } else{
      randomWord = data.name.toLowerCase();
      }
      randomImage = data.sprites.front_default;

      //pokemon stats
      pokemonName = data.name;
      pokemonType = data.types[0].type.name;
      pokemonHeight = data.height;
      pokemonWeight = data.weight;
      pokemonAbility1 = data.abilities[0].ability.name;
      pokemonAbility2 = data.abilities[1].ability.name;

      //for testing
      console.log(data.name);
      console.log(data.types[0].type.name);
      console.log(data.height);
      console.log(data.weight);
      console.log(data.abilities[0].ability.name);
      console.log(data.abilities[1].ability.name);
      initializeGame();
    })
    .catch(error => console.error('Error fetching Pokémon:', error));
}

// Initialize the game
function initializeGame() {
  correctLetters = [];
  wrongLetters = [];
  guessesLeft = 10;
  pokemonImage.src = '/assets/images/pokeball.png';
  // pokemonImage.style.display = 'none';
  messageElement.innerText = '';
  playAgainButton.style.display = 'none';
  guessesLeftElement.innerText = guessesLeft;
  wrongLettersElement.innerText = '';
  pokemonStats.innerHTML = '';
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
    pokemonStats.innerHTML = `
      <h3>${pokemonName}</h3>
      <p>Type: ${pokemonType}</p>
      <p>Height: ${pokemonHeight} dm</p>
      <p>Weight: ${pokemonWeight} hg</p>
      <p>Abilities: ${pokemonAbility1}, ${pokemonAbility2}</p>
    `;
    // pokemonImage.style.display = 'block';
    // Play Pokémon cry this uses the pokemoncries website and the randomId to get the cry
    const audio = new Audio(`https://pokemoncries.com/cries-old/${randomId}.mp3`);
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
    button.classList.add('letter-button');
    button.addEventListener('click', () => handleGuess(letter, button));
    alphabetContainer.appendChild(button);
  });
}

// Handle a letter guess
function handleGuess(letter, button) {
  button.disabled = true;
  if (randomWord.includes(letter)) {
    correctLetters.push(letter);
    displayWord();
  } else {
    wrongLetters.push(letter);
    guessesLeft--;
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
  playAgainButton.style.display = 'inline';
}

// Add event listener for Play Again button
playAgainButton.addEventListener('click', () => {
  fetchPokemon();
});

// Start the game
fetchPokemon();


