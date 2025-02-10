document.addEventListener("DOMContentLoaded", () => {
  const pets = [
    { name: "Katrine", img: "../../assets/images/pets-katrine.png", id: "katrine" },
    { name: "Jennifer", img: "../../assets/images/pets-jennifer.png", id: "jennifer" },
    { name: "Woody", img: "../../assets/images/pets-woody.png", id: "woody" },
    { name: "Sophia", img: "../../assets/images/pets-sophia.png", id: "sophia" },
    { name: "Timmy", img: "../../assets/images/pets-timmy.png", id: "timmy" },
    { name: "Charly", img: "../../assets/images/pets-charly.png", id: "charly" },
    { name: "Scarlett", img: "../../assets/images/pets-scarlet.png", id: "scarlett" },
    { name: "Freddie", img: "../../assets/images/pets-freddie.png", id: "freddie" }
  ];

  let shuffledPets = shufflePets();
  let currentPage = 1;
  let cardsPerPage;
  let totalPages;
  let lastWindowSize = window.innerWidth;

  function shufflePets() {
    const shuffled = [];
    const tempPets = [...pets];
    for (let i = 0; i < 6; i++) {
      shuffled.push(...tempPets.sort(() => 0.5 - Math.random()));
    }
    return shuffled;
  }

  function updatePagination() {
    const container = document.querySelector(".cards-container");
    container.innerHTML = "";
    calculateCardsPerPage();
    totalPages = Math.ceil(shuffledPets.length / cardsPerPage);
    
    // Ensure currentPage is within the new range after resizing
    if (currentPage > totalPages) {
      currentPage = totalPages;
    }

    const startIndex = (currentPage - 1) * cardsPerPage;
    const endIndex = startIndex + cardsPerPage;
    const currentPets = shuffledPets.slice(startIndex, endIndex);

    currentPets.forEach(pet => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `
        <img src="${pet.img}" alt="${pet.name}">
        <h4 class="name">${pet.name}</h4>
        <button>Learn more</button>
      `;
      card.addEventListener("click", () => openPopup(pet.id));
      container.appendChild(card);
    });

    updateButtons();
  }

  function updateButtons() {
    const firstBtn = document.querySelector(".navigation button:first-child");
    const prevBtn = firstBtn.nextElementSibling;
    const pageBtn = prevBtn.nextElementSibling;
    const nextBtn = pageBtn.nextElementSibling;
    const lastBtn = nextBtn.nextElementSibling;

    pageBtn.textContent = currentPage;

    firstBtn.disabled = currentPage === 1;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
    lastBtn.disabled = currentPage === totalPages;

    firstBtn.className = currentPage === 1 ? "disabled-arrow" : "able-arrow";
    prevBtn.className = currentPage === 1 ? "disabled-arrow" : "able-arrow";
    nextBtn.className = currentPage === totalPages ? "disabled-arrow" : "able-arrow";
    lastBtn.className = currentPage === totalPages ? "disabled-arrow" : "able-arrow";
    pageBtn.className = "page-number";
  }

  function calculateCardsPerPage() {
    const windowWidth = window.innerWidth;
    if (windowWidth >= 1280) {
      cardsPerPage = 8;
    } else if (windowWidth >= 768) {
      cardsPerPage = 6;
    } else {
      cardsPerPage = 3;
    }
  }

  function changePage(page) {
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    updatePagination();
  }

  function openPopup(petId) {
    // Create and add overlay to the body
    const overlaypagination = document.createElement('div');
    overlaypagination.className = 'overlaypagination';
    document.body.appendChild(overlaypagination);

    const popup = document.getElementById(petId);
    if (popup) {
      overlaypagination.style.display = 'block'; // Show overlay
      popup.style.display = 'block'; // Show popup
      document.body.style.overflow = 'hidden'; // Disable vertical scroll
    }

    // Add event listener to close the popup when the overlay is clicked
    overlaypagination.addEventListener('click', () => closePopup(petId, overlaypagination));
    document.querySelectorAll('.popup-close').forEach(button => {
      button.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent the click event from closing the popup
        closePopup(petId, overlaypagination);
      });
    });
  }

  function closePopup(petId, overlaypagination) {
    const popup = document.getElementById(petId);
    if (popup) {
      popup.style.display = 'none'; // Hide popup
    }
    
    if (overlaypagination) {
      overlaypagination.style.display = 'none'; // Hide overlay
      overlaypagination.remove(); // Remove overlay from DOM
    }

    document.body.style.overflow = 'auto'; // Enable vertical scroll
  }

  window.addEventListener("resize", () => {
    if (window.innerWidth === lastWindowSize) return;
    lastWindowSize = window.innerWidth;
    updatePagination();
  });

  document.querySelector(".navigation").addEventListener("click", (e) => {
    const target = e.target;
    if (target.tagName !== "BUTTON") return;

    if (target.textContent === "<<") {
      changePage(1);
    } else if (target.textContent === "<") {
      changePage(currentPage - 1);
    } else if (target.textContent === ">") {
      changePage(currentPage + 1);
    } else if (target.textContent === ">>") {
      changePage(totalPages);
    }
  });

  // Initialize the page
  updatePagination();
});