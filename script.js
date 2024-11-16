// Закрепляем приложение
Telegram.WebApp.expand();
Telegram.WebApp.disableClosingConfirmation();

// Убираем клавиатуру при клике вне поля
document.addEventListener("click", (e) => {
    const inputs = document.querySelectorAll("input");
    if (![...inputs].includes(e.target)) {
        inputs.forEach(input => input.blur());
    }
});

// Убираем клавиатуру при нажатии "Enter"
document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        document.activeElement.blur();
    }
});

// Рассчитать кредит
function calculateCredit() {
    const autoPrice = parseFloat(document.querySelector("#auto-price").value) || 0;
    const downPayment = parseFloat(document.querySelector("#down-payment").value) || 0;
    const months = parseInt(document.querySelector(".credit-term-buttons button.active")?.value) || 12;
    const rate = parseFloat(document.querySelector("#rate").value) || 0;

    const loanAmount = autoPrice - downPayment;
    const monthlyRate = rate / 100 / 12;
    const monthlyPayment = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));

    document.querySelector(".monthly-payment").textContent = `${monthlyPayment.toFixed(2)} ₽`;
}

document.querySelector("#calculate-button").addEventListener("click", calculateCredit);

// График платежей
document.querySelector("#schedule-button").addEventListener("click", () => {
    document.querySelector(".modal").style.display = "flex";
});

document.querySelector(".modal-close").addEventListener("click", () => {
    document.querySelector(".modal").style.display = "none";
});
