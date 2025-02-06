const log = (msg) => console.log(msg);

// I denna fil skriver ni all er kod

const nickRef = document.querySelector("#nick");
const ageRef = document.querySelector("#age");
const formRef = document.querySelector("#form");
const errorMsg = document.querySelector("#errorMsg");
const formWrapperRef = document.querySelector("#formWrapper");
const gameFieldRef = document.getElementById("gameField");
const audioRef = document.querySelector("audio");
const highScoreRef = document.querySelector("#highScore");
const highScoreListRef = document.querySelector("#highScoreList");
const winMsgRef = document.getElementById("winMsg");
const playAgainBtnRef = document.getElementById("playAgainBtn");

let choosenGender;
let totalPokemons = 10;

// Event listeners

formRef.addEventListener("submit", (event) => {
  event.preventDefault();
  if (validateForm()) {
    startGame();
  }
});

playAgainBtnRef.addEventListener("click", () => {
  formWrapperRef.classList.remove("d-none");
  gameFieldRef.classList.add("d-none");
  clearList(highScoreListRef);
  highScoreRef.classList.add("d-none");
  formRef.reset();
});

// Form

function validateGender() {
  const genders = document.querySelectorAll('input[name ="gender"]');
  for (const input of genders) {
    if (input.checked) {
      choosenGender = input.value;
      oGameData.trainerGender = input.value;
    }
  }
}

function validateForm() {
  validateGender();
  try {
    if (nickRef.value.trim().length < 5 || nickRef.value.trim().length > 10) {
      throw {
        message: "Name must be between 5 and 10 characters.",
        nodeRef: nickRef,
      };
    } else if (ageRef.value < 10 || ageRef.value > 15) {
      throw {
        message: "You must be between 10 and 15 years old.",
        nodeRef: ageRef,
      };
    } else if (!choosenGender) {
      throw {
        message: "Must select gender",
      };
    }
    errorMsg.textContent = "";
    oGameData.trainerName = nickRef.value;
    oGameData.trainerAge = ageRef.value;
    return true;
  } catch (error) {
    errorMsg.textContent = error.message;
    errorMsg.style.color = "red";
    if (error.nodeREf) {
      error.nodeRef.focus();
    }
  }
}

// Game

function startGame() {
  formWrapperRef.classList.add("d-none");
  gameFieldRef.classList.remove("d-none");
  audioRef.load();
  audioRef.play();
  generatePokemons();
  setInterval(movePokemons, 3000);
  oGameData.startTimeInMilliseconds();
}

function generatePokemons() {
  for (let i = 0; i < totalPokemons; i++) {
    const pokemon = document.createElement("div");
    const pokemonImg = document.createElement("img");
    const pokeBallImg = document.createElement("img");
    pokeBallImg.src = `./assets/ball.webp`;
    pokeBallImg.classList.add("d-none");
    pokemon.classList.add("pokemons");
    let randomPokemons = Math.floor(Math.random() * 151) + 1;

    if (randomPokemons < 10) {
      pokemonImg.src = `./assets/pokemons/00${randomPokemons}.png`;
    } else if (randomPokemons < 100) {
      pokemonImg.src = `./assets/pokemons/0${randomPokemons}.png`;
    } else {
      pokemonImg.src = `./assets/pokemons/${randomPokemons}.png`;
    }

    pokemon.appendChild(pokeBallImg);
    pokemon.appendChild(pokemonImg);
    gameFieldRef.appendChild(pokemon);
    pokemonPosition(pokemon);
    oGameData.pokemonNumbers.push(pokemon);
    catchPokemon(pokemon, pokemonImg, pokeBallImg);
  }
}

function pokemonPosition(pokemon) {
  pokemon.style.position = "absolute";
  pokemon.style.left = `${oGameData.getLeftPosition()}px`;
  pokemon.style.top = `${oGameData.getTopPosition()}px`;
}

function movePokemons() {
  oGameData.pokemonNumbers.forEach((pokemon) => pokemonPosition(pokemon));
}

function catchPokemon(pokemon, pokemonImg, ball) {
  pokemon.addEventListener("mouseenter", () => {
    if (ball.classList.contains("d-none")) {
      oGameData.nmbrOfCaughtPokemons++;
      log(oGameData.nmbrOfCaughtPokemons);
    } else {
      oGameData.nmbrOfCaughtPokemons--;
      log(oGameData.nmbrOfCaughtPokemons);
    }
    ball.classList.toggle("d-none");
    pokemonImg.classList.toggle("d-none");

    if (oGameData.nmbrOfCaughtPokemons === totalPokemons) {
      endGame();
    }
  });
}

// Game over

function endGame() {
  oGameData.endTimeInMilliseconds();
  const timeScore = oGameData.nmbrOfMilliseconds() / 1000; // lade som sekunder
  audioRef.pause();
  document.querySelectorAll(".pokemons").forEach((pokemon) => pokemon.remove());
  highScoreRef.classList.remove("d-none");
  let highScoreArray = updateHighScore(timeScore);
  displayHighScore(highScoreArray);
  oGameData.init();
  console.log(oGameData.nmbrOfCaughtPokemons);
  console.log(oGameData.trainerName);
}

function updateHighScore(timeScore) {
  let highScoreArray = JSON.parse(localStorage.getItem("highScoreArray")) || [];
  highScoreArray.push({
    name: oGameData.trainerName,
    time: timeScore,
  });
  highScoreArray.sort((a, b) => a.time - b.time);
  if (highScoreArray.length > 10) {
    highScoreArray.pop();
  }
  localStorage.setItem("highScoreArray", JSON.stringify(highScoreArray));
  return highScoreArray;
}

function displayHighScore(highScoreArray) {
  winMsgRef.textContent = `You caught them all ${oGameData.trainerName}!!!`;
  for (let i = 0; i < highScoreArray.length; i++) {
    const li = document.createElement("li");
    li.textContent = ` ${highScoreArray[i].name}: ${highScoreArray[i].time} s`;
    highScoreListRef.appendChild(li);
  }
}

function clearList(list) {
  let child = list.lastElementChild;
  while (child) {
    list.removeChild(child);
    child = list.lastElementChild;
  }
}
