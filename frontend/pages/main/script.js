async function fetchPets() {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozLCJ1c2VybmFtZSI6Im1sa2FkdXNtYSIsInJvbGUiOiJhZG1pbiIsImV4cCI6MTczOTEzMDkwNSwiaXNzIjoic2hlbHRlci1hcHAifQ.xrRKyYvqrViy-oUW6SK26PmvsO8odU2jwuq4riKpaSI";

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
    return []; // Возвращаем пустой массив, чтобы избежать ошибок
  }
}

async function bookPet(petId) {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozLCJ1c2VybmFtZSI6Im1sa2FkdXNtYSIsInJvbGUiOiJhZG1pbiIsImV4cCI6MTczOTEzMDkwNSwiaXNzIjoic2hlbHRlci1hcHAifQ.xrRKyYvqrViy-oUW6SK26PmvsO8odU2jwuq4riKpaSI";

  try {
    const response = await fetch(`http://localhost:8081/pets/book/${petId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Ошибка бронирования: ${response.status}`);
    }

    return true; // Успешное бронирование
  } catch (error) {
    console.error("Ошибка при бронировании питомца:", error);
    return false; // Ошибка
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const pets = await fetchPets();

  console.log("Данные перед рендером:", pets);

  if (!pets.length) {
    console.error("Нет данных для рендеринга");
    return;
  }

  const cards = document.querySelector(".cards");
  const prevArrow = document.querySelector(".arrow1");
  const nextArrow = document.querySelector(".arrow2");

  if (!cards || !prevArrow || !nextArrow) {
    console.error("Ошибка: Не найдены элементы с классами .cards, .arrow1, .arrow2");
    return;
  }

  let currentIndex = 0;
  const visibleCount = 3; // Количество отображаемых карточек

  function renderCarousel() {
    cards.innerHTML = "";

    for (let i = 0; i < visibleCount; i++) {
      const petIndex = (currentIndex + i) % pets.length;
      const pet = pets[petIndex];

      if (pet) {
        const petElement = document.createElement("div");
        petElement.classList.add("card");
        petElement.innerHTML = `
          <h2>${pet.Name}</h2>
          <p class="description">${pet.Description}</p>
          <p class="status">${pet.is_booked ? "Уже забронирован" : "Доступен для брони"}</p>
          <button class="book-btn" data-id="${pet.id}" ${pet.is_booked ? "disabled" : ""}>
            Забронировать
          </button>
        `;

        cards.appendChild(petElement);
      }
    }

    // Добавляем обработчики на кнопки бронирования
    document.querySelectorAll(".book-btn").forEach((button) => {
      button.addEventListener("click", async (event) => {
        const petId = event.target.getAttribute("data-id");

        if (await bookPet(petId)) {
          const petToUpdate = pets.find((p) => p.id == petId);
          if (petToUpdate) {
            petToUpdate.is_booked = true;
          }

          renderCarousel(); 
        }
      });
    });
  }

  prevArrow.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + pets.length) % pets.length;
    renderCarousel();
  });

  nextArrow.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % pets.length;
    renderCarousel();
  });

  renderCarousel();
});
