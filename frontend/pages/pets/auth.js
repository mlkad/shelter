document.addEventListener("DOMContentLoaded", () => {
  const popup = document.getElementById("popup");
  const openPopupBtn = document.querySelector(".login");
  const closePopupBtn = document.querySelector(".popup-close");
  const tabs = document.querySelectorAll(".tab");
  const forms = document.querySelectorAll(".form");

  const registerForm = document.getElementById("registerForm");
  const loginForm = document.getElementById("loginForm");

  openPopupBtn.addEventListener("click", () => {
    popup.classList.add("active");
  });

  closePopupBtn.addEventListener("click", () => {
    popup.classList.remove("active");
  });

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      forms.forEach((form) => form.classList.remove("active"));
      document.getElementById(`${tab.dataset.tab}Form`).classList.add("active");
    });
  });

  async function sendData(url, data) {
    try {
      console.log("Отправляем данные:", data);
  
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      const text = await response.text();
      console.log("Ответ сервера (текст):", text);
  
      let result;
      try {
        result = JSON.parse(text); // Парсим JSON
      } catch (e) {
        console.warn("Ответ не является JSON:", text);
        result = text; // Если не JSON, возвращаем как есть
      }
  
      if (!response.ok) {
        throw new Error(result.message || "Ошибка на сервере");
      }
  
      return result;
    } catch (error) {
      alert(`Ошибка: ${error.message}`);
      console.error("Ошибка при запросе:", error);
    }
  }
  
  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();
  
    const username = registerForm.querySelector("input[type='text']").value.trim();
    const email = registerForm.querySelector("input[type='email']").value.trim();
    const password = registerForm.querySelector("input[type='password']").value.trim();
  
    if (!username || !email || !password) {
      alert("Все поля должны быть заполнены!");
      return;
    }
  
    const userData = { username, email, password };
    const result = await sendData("http://localhost:8081/register", userData);
  
    if (result) {
      alert("Регистрация успешна! Войдите в систему.");
      registerForm.reset();
      document.querySelector("[data-tab='login']").click();
    }
  });
  

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = loginForm.querySelector("input[type='email']").value;
    const password = loginForm.querySelector("input[type='password']").value;

    const userData = { email, password };
    const result = await sendData("http://localhost:8081/login", userData);

    if (result) {
      authToken = result.token; 
      console.log("Токен:", authToken); 

      alert("Вход выполнен успешно!");
      localStorage.setItem("token", authToken);
      popup.classList.remove("active");
    }
  });
});