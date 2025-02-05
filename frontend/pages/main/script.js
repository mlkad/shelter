document.addEventListener("DOMContentLoaded", function() {
  const burger = document.getElementById("burger");
  const menu = document.getElementById("menu");
  const headerTop = document.querySelector(".header-top");
  const body = document.body;
  const links = document.querySelectorAll(".menu-item a");
  const overlay = document.getElementById("overlay");

  burger.addEventListener("click", function(event) {
    event.stopPropagation();
    headerTop.classList.toggle("open");

    if (headerTop.classList.contains("open")) {
      body.classList.add("no-scroll");
      overlay.style.opacity = "1";
      overlay.style.visibility = "visible";
    } else {
      body.classList.remove("no-scroll");
      overlay.style.opacity = "0";
      overlay.style.visibility = "hidden";
    }
  });

  menu.addEventListener("click", function(event) {
    event.stopPropagation();
  });

  links.forEach(function(link) {
    link.addEventListener("click", function(event) {
      event.preventDefault(); 

      headerTop.classList.remove("open");
      body.classList.remove("no-scroll");
      overlay.style.opacity = "0";
      overlay.style.visibility = "hidden";

      setTimeout(function() {
        window.location.href = link.getAttribute("href"); 
      }, 300); 
    });
  });

  overlay.addEventListener("click", function() {
    headerTop.classList.remove("open");
    body.classList.remove("no-scroll");
    overlay.style.opacity = "0";
    overlay.style.visibility = "hidden";
  });

  document.body.addEventListener("click", function() {
    headerTop.classList.remove("open");
    body.classList.remove("no-scroll");
    overlay.style.opacity = "0";
    overlay.style.visibility = "hidden";
  });
});




const pets = [
  { name: "Katrine", img: "../../assets/images/pets-katrine.png" },
  { name: "Jennifer", img: "../../assets/images/pets-jennifer.png" },
  { name: "Woody", img: "../../assets/images/pets-woody.png" },
  { name: "Sophia", img: "../../assets/images/pets-sophia.png" },
  { name: "Timmy", img: "../../assets/images/pets-timmy.png" },
  { name: "Charly", img: "../../assets/images/pets-charly.png" },
  { name: "Scarlett", img: "../../assets/images/pets-scarlet.png" },
  { name: "Freddie", img: "../../assets/images/pets-freddie.png" }
];

let numCardsToShow = getNumCardsToShow();
let slider = document.querySelector(".cards");
let currentIndex = 0;
let history = [];
let lastDirection = null;

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function getNumCardsToShow() {
  if (window.innerWidth >= 1280) return 3;
  if (window.innerWidth >= 768) return 2;
  return 1;
}

function getUniquePets(excludedPets) {
  let availablePets = pets.filter(pet => !excludedPets.includes(pet));
  shuffleArray(availablePets);
  return availablePets.slice(0, numCardsToShow);
}

function displayPets(petsToDisplay) {
  slider.innerHTML = petsToDisplay.map(pet => `
    <div class="card" data-pet="${pet.name.toLowerCase()}">
      <img src="${pet.img}" alt="${pet.name}">
      <p class="name">${pet.name}</p>
      <button>Learn more</button>
    </div>
  `).join('');
  attachCardClickHandlers();
}

function attachCardClickHandlers() {
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
      const petName = card.getAttribute('data-pet');
      showPopup(petName);
    });
  });
}

function updateHistory(direction, petsToDisplay) {
  if (direction === 'forward') {
    history.push(petsToDisplay);
    if (history.length > 2) history.shift();
  } else if (direction === 'backward') {
    history.unshift(petsToDisplay);
    if (history.length > 2) history.pop(); 
  }
}

function handleArrowClick(direction) {
  let newPets;
  let excludedPets = [];

  if (direction === 'forward') {
    if (currentIndex < history.length - 1) {
      currentIndex++;
      newPets = history[currentIndex];
    } else {
      let lastSlide = history[history.length - 1] || [];
      excludedPets = lastSlide.flat();
      newPets = getUniquePets(excludedPets);
      updateHistory('forward', newPets);
      currentIndex = history.length - 1;
    }
  } else if (direction === 'backward') {
    if (currentIndex > 0) {
      currentIndex--;
      newPets = history[currentIndex];
    } else {
      let firstSlide = history[0] || [];
      excludedPets = firstSlide.flat();
      newPets = getUniquePets(excludedPets);
      updateHistory('backward', newPets);
      currentIndex = 0; 
    }
  }

  displayPets(newPets);
}

function handleResize() {
  const newNumCardsToShow = getNumCardsToShow();
  if (newNumCardsToShow !== numCardsToShow) {
    numCardsToShow = newNumCardsToShow;
  
    let excludedPets = history.flat().flat(); 
    let newPets = getUniquePets(excludedPets);
    history = [newPets];
    currentIndex = 0;
    displayPets(newPets);
  }
}

function showPopup(petName) {
  const overlayslider = document.createElement('div');
  overlayslider.className = 'overlayslider';
  document.body.appendChild(overlayslider);

  const popup = document.getElementById(petName);
  if (popup) {
    overlayslider.style.display = 'block';
    popup.style.display = 'block';
    document.body.style.overflow = 'hidden'; 

    overlayslider.addEventListener('click', () => {
      closePopup(popup, overlayslider);
    });
    popup.querySelector('.popup-close button').addEventListener('click', () => {
      closePopup(popup, overlayslider);
    });
  }
}

function closePopup(popup, overlayslider) {
  document.body.style.overflow = ''; 
  popup.style.display = 'none';
  overlayslider.style.display = 'none';
  document.body.removeChild(overlayslider); 
}

document.querySelectorAll('.arrow1').forEach(arrow => {
  arrow.addEventListener('click', () => {
    lastDirection = 'backward';
    handleArrowClick('backward');
  });
});

document.querySelectorAll('.arrow2').forEach(arrow => {
  arrow.addEventListener('click', () => {
    lastDirection = 'forward';
    handleArrowClick('forward');
  });
});

window.addEventListener('resize', handleResize);

document.addEventListener('DOMContentLoaded', () => {
  let initialPets = getUniquePets([]);
  history.push(initialPets);
  displayPets(initialPets);
});