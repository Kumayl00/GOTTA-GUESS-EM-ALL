const wordElement = document.getElementById('word');
const alphabetContainer = document.getElementById('alphabet-container');
const wrongLettersElement = document.getElementById('wrong-letters-list');
const guessesLeftElement = document.getElementById('guesses-left');
const pokemonImage = document.getElementById('pokemon-image');
const messageElement = document.getElementById('message');
const playAgainButton = document.getElementById('play-again');
const pokemonStats = document.getElementById('pokemon-stats');
const correctSound = new Audio('assets/audio/SFX_INTRO_HOP.wav'); // Correct guess sound
const wrongSound = new Audio('assets/audio/SFX_DENIED.wav');     // Wrong guess sound
const bgMusic = new Audio('assets/audio/team_rocket_background.mp3');   // Background music
const gameOverSound = new Audio('assets/audio/SFX_SS_ANNE_HORN.wav');

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
   randomId = Math.floor(Math.random() * 1010) + 1; // First 150 Pokémon
   // Start or restart background music
  bgMusic.loop = true; // Loop the background music
  bgMusic.volume = 0.3; // Set the volume to 30%
  bgMusic.play(); // Play the music
  fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}/`)
    .then(response => response.json())
    .then(data => {
      //override names for "nidoran-f" and "nidoran-m and mr-mime"
      const nameOverrides = {
        "nidoran-f": "nidoran",
        "nidoran-m": "nidoran",
        "mr-mime": "mrmime",
        "deoxys-normal": "deoxys",
        "wormadam-plant": "wormadam",
        "mime-jr": "mimejr",
        "porygon-z": "porygonz",
        "porygon2": "porygon",
        "giratina-altered": "giratina",
        "shaymin-land": "shaymin",
        "basculin-red-striped": "basculin",
        "darmanitan-standard": "darmanitan",
        "tornadus-incarnate": "tornadus",
        "thundurus-incarnate": "thundurus",
        "landorus-incarnate": "landorus",
        "keldeo-ordinary": "keldeo",
        "meloetta-aria": "meloetta",
        "meowstic-male": "meowstic",
        "pumpkaboo-average": "pumpkaboo",
        "gourgeist-average": "gourgeist",
        "zygarde-50": "zygarde",
        "oricorio-baile": "oricorio",
        "lycanroc-midday": "lycanroc",
        "wishiwashi-solo": "wishiwashi",
        "type-null": "typenull",
        "minior-red-meteor": "minior",
        "mimikyu-disguised": "mimikyu",
        "jangmo-o": "jangmoo",
        "hakamo-o": "hakamoo",
        "kommo-o": "kommoo",
        "tapu-koko": "tapukoko",
        "tapu-lele": "tapulele",
        "tapu-bulu": "tapubulu",
        "tapu-fini": "tapufini",
        "toxtricity-amped": "toxtricity",
        "sirfetchd": "sirfetchd", // Already standardized
        "mr-rime": "mrrime",
        "eiscue-ice": "eiscue",
        "indeedee-male": "indeedee",
        "morpeko-full-belly": "morpeko",
        "urshifu-single-strike": "urshifu",
        "enamorus-incarnate": "enamorus",
        "oinkologne-male": "oinkologne",
        "maushold-family-of-four": "maushold",
        "squawkabilly-green-plumage": "squawkabilly",
        "palafin-zero": "palafin",
        "tatsugiri-curly": "tatsugiri",
        "dudunsparce-two-segment": "dudunsparce",
        "great-tusk": "greattusk",
        "scream-tail": "screamtail",
        "brute-bonnet": "brutebonnet",
        "flutter-mane": "fluttermane",
        "slither-wing": "slitherwing",
        "sandy-shocks": "sandyshocks",
        "iron-treads": "irontreads",
        "iron-bundle": "ironbundle",
        "iron-hands": "ironhands",
        "iron-jugulis": "ironjugulis",
        "iron-moth": "ironmoth",
        "iron-thorns": "ironthorns",
        "wo-chien": "wochien",
        "chien-pao": "chienpao",
        "ting-lu": "tinglu",
        "chi-yu": "chiyu",
        "roaring-moon": "roaringmoon",
        "iron-valiant": "ironvaliant",
        "walking-wake": "walkingwake",
        "iron-leaves": "ironleaves"
      };
      
      if (nameOverrides[data.name.toLowerCase()]) {
        randomWord = nameOverrides[data.name.toLowerCase()];
      } else {
        randomWord = data.name.toLowerCase();
      }
      randomImage = data.sprites.front_default;

      //pokemon stats
      pokemonName = data.name;
      pokemonType = data.types[0].type.name;
      pokemonHeight = data.height;
      pokemonWeight = data.weight;
      pokemonAbility1 = data.abilities[0]?.ability.name || 'N/A';
      pokemonAbility2 = data.abilities[1]?.ability.name || 'N/A';

      //for testing
      console.log(data.id);
      console.log(data.name);
      console.log(data.types[0].type.name);
      console.log(data.height);
      console.log(data.weight);
      console.log(data.abilities[0]?.ability.name || 'N/A');
      console.log(data.abilities[1]?.ability.name || 'N/A');
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
    pokemonImage.alt = ` picture of ${randomWord}`;
    pokemonStats.innerHTML = `
      <h3>${pokemonName.toUpperCase()} No.${randomId}</h3>
      <p>Type: ${pokemonType}</p>
      <p>Height: ${pokemonHeight} dm</p>
      <p>Weight: ${pokemonWeight} hg</p>
      <p>Abilities: ${pokemonAbility1}, ${pokemonAbility2}</p>
    `;

    // Play Pokémon cry this uses the pokemoncries website and the randomId to get the cry
   // Check the value of randomId and set the appropriate URL
const audioUrl = randomId < 650 
? `https://pokemoncries.com/cries-old/${randomId}.mp3` 
: `https://pokemoncries.com/cries/${randomId}.mp3`;

// Create a new Audio object using the selected URL
const audio = new Audio(audioUrl);

// Play the audio
audio.play();

// Call endGame function
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
    correctSound.currentTime = 0; // Reset the sound if played before
    correctSound.volume = 0.3; // Set the volume to 30%
    correctSound.play(); // Play correct guess sound
    displayWord();
  } else {
    wrongLetters.push(letter);
    guessesLeft--;
    wrongSound.currentTime = 0; // Reset the sound if played before
    wrongSound.volume = 0.3; // Set the volume to 30%
    wrongSound.play(); // Play wrong guess sound
    guessesLeftElement.innerText = guessesLeft;
    wrongLettersElement.innerText = wrongLetters.join(', ');
    

    if (guessesLeft === 0) {
      gameOverSound.pause();
      gameOverSound.currentTime = 0;
      gameOverSound.play();
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


//                 .
//                .;;:,.
//                 ;iiii;:,.                                   .,:;.
//                 :i;iiiiii:,                            .,:;;iiii.
//                  ;iiiiiiiii;:.                    .,:;;iiiiii;i:
//                   :iiiiiiiiiii:......,,,,,.....,:;iiiiiiiiiiii;
//                    ,iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii:
//                     .:iii;iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii;,
//                       .:;;iiiiiiiiiiiiiiiiiiiiiiiiiii;;ii;,
//                        :iiii;;iiiiiiiiiiiiiii;;iiiiiii;:.
//                       ,iiii;1f:;iiiiiiiiiiii;if;:iiiiiii.
//                      .iiiii:iL..iiiiiiiiiiii;:f: iiiiiiii.
//                      ;iiiiii:.,;iiii;iiiiiiii:..:iiiiiiii:
//                     .i;;;iiiiiiiiii;,,;iiiiiiiiiiii;;iiiii.
//                     ::,,,,:iiiiiiiiiiiiiiiiiiiiii:,,,,:;ii:
//                     ;,,,,,:iiiiiiii;;;;;;;iiiiii;,,,,,,;iii.
//                     ;i;;;;iiiiiiii;:;;;;;:iiiiiii;::::;iiii:
//                     ,iiiiiiiiiiiiii;;;;;;:iiiiiiiiiiiiiiiiii.
//                      .iiiiiiiiiiiiii;;;;;iiiiiiiiiiiiiiiiiii:
//                       .;iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii;
//                        ;iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii.
//                       .;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;,
