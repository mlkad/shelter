async function fetchPets() {
  try {
    const response = await fetch("http://localhost:8081/api/pets", { mode: 'cors' });
    const pets = await response.json();
    return pets;
  } catch (error) {
    console.error("Ошибка загрузки данных:", error);
    return [];
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const pets = await fetchPets();
  const slider = document.querySelector(".slider");
  let currentIndex = 0;

  function renderCarousel() {
    slider.innerHTML = "";
    const pet = pets[currentIndex];
    if (pet) {
      const petElement = document.createElement("div");
      petElement.classList.add("card");
      petElement.innerHTML = `
              <h2>${pet.Name}</h2>
              <p>${pet.Description}</p>
              <p>${
                pet.is_booked ? "Уже забронирован" : "Доступен для брони"
              }</p>
          `;
      slider.appendChild(petElement);
    }
  }

  document.querySelector(".arrow1").addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + pets.length) % pets.length;
    renderCarousel();
  });

  document.querySelector(".arrow2").addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % pets.length;
    renderCarousel();
  });

  renderCarousel();
});
