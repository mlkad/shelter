async function fetchPets() {
  try {
    const response = await fetch("http://localhost:8081/api/pets");
    const pets = await response.json();
    return pets;
  } catch (error) {
    console.error("Ошибка загрузки данных:", error);
    return [];
  }
}

let numCardsToShow = getNumCardsToShow();
let slider = document.querySelector(".cards");
let currentIndex = 0;
let history = [];
let lastDirection = null;

function getNumCardsToShow() {
  if (window.innerWidth >= 1280) return 3;
  if (window.innerWidth >= 768) return 2;
  return 1;
}

async function showPetInfo(petID) {
  const pets = await fetchPets();
  const pet = pets.find((p) => p.ID === petID);
  if (pet) {
    alert(
      `Имя: ${pet.Name}\nОписание: ${pet.Description}\n${
        pet.is_booked ? "Уже забронирован" : "Доступен для брони"
      }`
    );
  } else {
    alert("Животное не найдено.");
  }
}

function attachCardClickHandlers() {
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", () => {
      const petName = card.getAttribute("data-pet");
      showPopup(petName);
    });
  });
}

function updateHistory(direction, petsToDisplay) {
  if (direction === "forward") {
    history.push(petsToDisplay);
    if (history.length > 2) history.shift();
  } else if (direction === "backward") {
    history.unshift(petsToDisplay);
    if (history.length > 2) history.pop();
  }
}

function handleArrowClick(direction) {
  let newPets;
  let excludedPets = [];

  if (direction === "forward") {
    if (currentIndex < history.length - 1) {
      currentIndex++;
      newPets = history[currentIndex];
    } else {
      let lastSlide = history[history.length - 1] || [];
      excludedPets = lastSlide.flat();
      newPets = getUniquePets(excludedPets);
      updateHistory("forward", newPets);
      currentIndex = history.length - 1;
    }
  } else if (direction === "backward") {
    if (currentIndex > 0) {
      currentIndex--;
      newPets = history[currentIndex];
    } else {
      let firstSlide = history[0] || [];
      excludedPets = firstSlide.flat();
      newPets = getUniquePets(excludedPets);
      updateHistory("backward", newPets);
      currentIndex = 0;
    }
  }

  showPetInfo(newPets);
}

function handleResize() {
  const newNumCardsToShow = getNumCardsToShow();
  if (newNumCardsToShow !== numCardsToShow) {
    numCardsToShow = newNumCardsToShow;

    let excludedPets = history.flat().flat();
    let newPets = getUniquePets(excludedPets);
    history = [newPets];
    currentIndex = 0;
    showPetInfo(newPets);
  }
}

function showPopup(petName) {
  popup.innerHTML = petsToDisplay
    .map(
      (pet) => `
  <div class="card" data-pet="${pet.name.toLowerCase()}">
    <img src="${pet.img}" alt="${pet.name}">
    <p class="name">${pet.name}</p>
    <button>Learn more</button>
  </div>
`
    )
    .join("");

  const overlayslider = document.createElement("div");
  overlayslider.className = "overlayslider";
  document.body.appendChild(overlayslider);

  const popup = document.getElementById("popup");
  if (popup) {
    overlayslider.style.display = "block";
    popup.style.display = "block";
    document.body.style.overflow = "hidden";

    overlayslider.addEventListener("click", () => {
      closePopup(popup, overlayslider);
    });
    popup.querySelector(".popup-close button").addEventListener("click", () => {
      closePopup(popup, overlayslider);
    });
  }
}

function closePopup(popup, overlayslider) {
  document.body.style.overflow = "";
  popup.style.display = "none";
  overlayslider.style.display = "none";
  document.body.removeChild(overlayslider);
}

document.querySelectorAll(".arrow1").forEach((arrow) => {
  arrow.addEventListener("click", () => {
    lastDirection = "backward";
    handleArrowClick("backward");
  });
});

document.querySelectorAll(".arrow2").forEach((arrow) => {
  arrow.addEventListener("click", () => {
    lastDirection = "forward";
    handleArrowClick("forward");
  });
});

window.addEventListener("resize", handleResize);

document.addEventListener("DOMContentLoaded", () => {
  let initialPets = getUniquePets([]);
  history.push(initialPets);
  showPetInfo(initialPets);
});
