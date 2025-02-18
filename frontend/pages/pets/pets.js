// const token =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo3LCJ1c2VybmFtZSI6Im1hbGlrYSIsInJvbGUiOiJhZG1pbiIsImV4cCI6MTczOTI3MjMyNCwiaXNzIjoic2hlbHRlci1hcHAifQ.dBWxGA2LUayP7KRphu7oSX9h5pJmPf2m-BAFhFyjNKE";

async function fetchPets() {
  const token = localStorage.getItem("token"); 
  try { 
    const response = await fetch("http://localhost:8081/pets/view", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log("Загруженные питомцы:", data);
    return data;
  } catch (error) {
    console.error("Ошибка при загрузке данных:", error);
    return []; 
  }
}

async function bookPet(petId) {

  try {
    const response = await fetch(`http://localhost:8081/pets/book?id=${petId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Ошибка бронирования: ${response.status}`);
    }

    return true; 
  } catch (error) {
    console.error("Ошибка при бронировании питомца:", error);
    return false; 
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  let currentPage = 1;
  let totalPages;

  const pets = await fetchPets();

  const cards = document.querySelector(".cards-container");
  const prevArrow = document.querySelector("#prev");
  const nextArrow = document.querySelector("#next");

  let currentIndex = 0;
  const visibleCount = 8;

  function renderCarousel() {
    cards.innerHTML = "";

    for (let i = 0; i < visibleCount; i++) {
      const petIndex = (currentIndex + i) % pets.length;
      const pet = pets[petIndex];

      if (pet) {
        console.log(`Отображается питомец с ID: ${pet.ID}`);

        console.log(
          "Полный путь к изображению:",
          `http://localhost:8081/backend/${pet.image_url}`
        );

        const petElement = document.createElement("div");
        petElement.classList.add("card");
        petElement.innerHTML = `
          <img src="http://localhost:8081/backend/${
            pet.image_url
          }" alt="Фото питомца"></img>
          <p class="name">${pet.Name} - ${
          pet.is_booked ? "Booked" : "Available"
        }</p>
          <p class = 'card-text'>${pet.Description}</p>
          <button class="book-btn" data-id="${pet.ID}" ${
          pet.is_booked ? "disabled" : ""
        }>
            Book
          </button>
        `;

        cards.appendChild(petElement);
      }
    }

    document.querySelectorAll(".book-btn").forEach((button) => {
      button.addEventListener("click", async (event) => {
        const petId = event.target.getAttribute("data-id");

        if (await bookPet(petId)) {
          const petToUpdate = pets.find((p) => p.ID == petId);
          if (petToUpdate) {
            petToUpdate.is_booked = true;
          }

          renderCarousel();
        }
      });
    });
  }

  function changePage(page) {
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    renderCarousel();
  }

  prevArrow.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + pets.length) % pets.length;
    renderCarousel();
  });

  nextArrow.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % pets.length;
    renderCarousel();
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
  renderCarousel();
});
