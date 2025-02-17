
document.querySelectorAll(".pay-card").forEach((card) => {
  card.addEventListener("click", () => {
    document.querySelector(".donations-popup").classList.remove("hidden");
  });
});

document.querySelector(".close-popup").addEventListener("click", () => {
  document.querySelector(".donations-popup").classList.add("hidden");
});

document.getElementById("donationsForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const token = localStorage.getItem("token");

  if (!token) {
    alert("Вы должны быть авторизованы, чтобы совершить пожертвование.");
    return;
  }

  const amountInput = document.getElementById("donation-amount");
  const messageInput = document.getElementById("donation-message");

  if (!amountInput) {
    alert("Поле для ввода суммы не найдено.");
    return;
  }

  const amount = amountInput.value.trim();
  const message = messageInput.value.trim();

  if (!amount || Number(amount) <= 0) {
    alert("Введите корректную сумму для пожертвования.");
    return;
  }

  const donationData = {
    donation_type: `${message}`,
    amount: Number(amount),

  };

  try {
    const response = await fetch("http://localhost:8081/donate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(donationData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Ошибка при отправке пожертвования.");
    }

    alert("Пожертвование успешно отправлено!");
    document.getElementById("donationsForm").reset();
    document.querySelector(".donations-popup").classList.add("hidden");
  } catch (error) {
    console.error("Ошибка:", error.message);
    alert(error.message || "Не удалось отправить пожертвование.");
  }
});
