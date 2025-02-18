document.addEventListener("DOMContentLoaded", () => {
  const loginPopup = document.querySelector(".popup");
  const openLoginBtn = document.querySelector(".login");
  const closeLoginBtn = document.querySelector(".popup .popup-close");
  const closeProfileBtn = document.querySelector(".popup-profile .popup-close");
  const tabs = document.querySelectorAll(".tab");
  const forms = document.querySelectorAll(".form");
  const profileBtn = document.querySelector("#profile");
  const registerForm = document.getElementById("registerForm");
  const loginForm = document.getElementById("loginForm");
  const logOut = document.querySelector(".log-out");
  const popupProfile = document.querySelector(".popup-profile");
  const updatePasswordForm = document.getElementById("updatePasswordForm");

  function checkAuthStatus() {
    const token = localStorage.getItem("token");

    if (token) {
      openLoginBtn.style.display = "none";
      profileBtn.style.display = "block";
    } else {
      openLoginBtn.style.display = "block";
      profileBtn.style.display = "none";
    }
  }

  openLoginBtn.addEventListener("click", () => {
    loginPopup.classList.add("active");
  });

  closeLoginBtn.addEventListener("click", () => {
    loginPopup.classList.remove("active");
  });

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      forms.forEach((form) => form.classList.remove("active"));
      document.getElementById(`${tab.dataset.tab}Form`).classList.add("active");
    });
  });

  async function sendData(url, data, method = "POST", withAuth = false) {
    try {
      const headers = { "Content-Type": "application/json" };
      if (withAuth) {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Вы не авторизованы!");
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(data),
      });

      const text = await response.text();
      let result;
      try {
        result = JSON.parse(text);
      } catch {
        result = text;
      }

      if (!response.ok) {
        throw new Error(result.message || result || "Ошибка на сервере");
      }

      return result;
    } catch (error) {
      alert(error.message);
    }
  }

  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = registerForm.querySelector("input[type='email']").value;
    const password = registerForm.querySelector("input[type='password']").value;

    const result = await sendData("http://localhost:8081/register", { email, password });

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
  
    const result = await sendData("http://localhost:8081/login", { email, password });
  
    if (result) {
      localStorage.setItem("token", result.token);
      localStorage.setItem("email", email); // Сохраняем email
      alert("Вход выполнен успешно!");
      loginPopup.classList.remove("active");
      checkAuthStatus();
      updateProfile(); // Обновляем профиль сразу после успешного входа
    }
  });  
  

  profileBtn.addEventListener("click", () => {
    popupProfile.style.display = "block";
  });

  closeProfileBtn.addEventListener("click", () => {
    popupProfile.style.display = "none";
  });

  logOut.addEventListener("click", () => {
    localStorage.removeItem("token");
    popupProfile.style.display = "none";
    checkAuthStatus();
  });

  function updateProfile() {
    const email = localStorage.getItem("email");
    const profileEmail = document.querySelector(".profile-email");
  
    if (profileEmail && email) {
      profileEmail.textContent = email;
    }
  }
  updateProfile();

  checkAuthStatus();

});
