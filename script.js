// Инициализация переменных
const calculateButton = document.getElementById("calculate");
const showScheduleButton = document.getElementById("showSchedule");
const closeScheduleButton = document.getElementById("closeSchedule");

const monthlyPaymentDisplay = document.getElementById("monthlyPayment");
const rateInput = document.getElementById("rate");
const carPriceInput = document.getElementById("carPrice");
const initialPaymentInput = document.getElementById("initialPayment");
const loanTermInput = document.getElementById("loanTerm");
const cascoInput = document.getElementById("casco");
const cascoIncludedCheckbox = document.getElementById("cascoIncluded");
const finServicesInput = document.getElementById("finServices");
const finServicesIncludedCheckbox = document.getElementById("finServicesIncluded");
const scheduleModal = document.getElementById("scheduleModal");
const scheduleContent = document.getElementById("scheduleContent");
// Закрытие клавиатуры при нажатии на любую часть экрана
document.addEventListener("click", (event) => {
    if (!event.target.closest("input") && document.activeElement.tagName === "INPUT") {
        document.activeElement.blur(); // Снять фокус с активного элемента
    }
});

// Закрытие клавиатуры при нажатии на Enter
document.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && document.activeElement.tagName === "INPUT") {
        document.activeElement.blur(); // Снять фокус с активного элемента
    }
});

// Отключаем увеличение изображения при двойном тапе
document.body.addEventListener('touchstart', (e) => {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
    }
});

// Скрытие клавиатуры при касании любой части экрана
document.body.addEventListener("touchstart", function(event) {
    // Если касание произошло не на поле ввода, скрыть клавиатуру
    if (event.target.tagName !== "INPUT" && event.target.tagName !== "TEXTAREA") {
        document.activeElement.blur(); // Убираем фокус с поля ввода, закрывая клавиатуру
    }
});

// Скрытие клавиатуры при нажатии клавиши "Enter" или "Return"
document.addEventListener("keydown", function(event) {
    // Проверяем, нажата ли клавиша Enter или Return
    if (event.key === "Enter" || event.key === "Return") {
        document.activeElement.blur(); // Убираем фокус с поля ввода, закрывая клавиатуру
    }
});


// Функция расчета кредита
function calculateLoan() {
    const carPrice = parseFloat(carPriceInput.value) || 0;
    const initialPayment = parseFloat(initialPaymentInput.value) || 0;
    const loanTerm = parseInt(loanTermInput.value) || 0;
    const interestRate = parseFloat(rateInput.value) || 0;
    let casco = parseFloat(cascoInput.value) || 0;
    let finServices = parseFloat(finServicesInput.value) || 0;

    // Учитываем КАСКО и фин. сервисы в кредит, если включены
    if (!cascoIncludedCheckbox.checked) casco = 0;
    if (!finServicesIncludedCheckbox.checked) finServices = 0;

    const loanAmount = carPrice - initialPayment + casco + finServices;

    if (loanAmount <= 0 || loanTerm <= 0 || interestRate <= 0) {
        monthlyPaymentDisplay.textContent = "Некорректные данные";
        return;
    }

    const monthlyRate = interestRate / 100 / 12;
    const monthlyPayment =
        (loanAmount * monthlyRate) /
        (1 - Math.pow(1 + monthlyRate, -loanTerm));

    // Обновляем отображение ежемесячного платежа
    monthlyPaymentDisplay.textContent = `${monthlyPayment.toFixed(2)} ₽`;

    // Возвращаем данные для графика
    return { loanAmount, monthlyRate, monthlyPayment, loanTerm };
}

// Генерация графика платежей
function generateSchedule({ loanAmount, monthlyRate, monthlyPayment, loanTerm }) {
    let balance = loanAmount;
    let totalOverpayment = 0;
    let scheduleHTML = `
        <p>Сумма кредита: ${loanAmount.toFixed(2)} ₽</p>
        <p>Ставка: ${(monthlyRate * 12 * 100).toFixed(2)}%</p>
        <p>Переплата: </p>
        <table class="w-full text-left mt-3 border-collapse">
            <thead>
                <tr>
                    <th class="border-b py-2">#</th>
                    <th class="border-b py-2">Платеж</th>
                    <th class="border-b py-2">Основной долг</th>
                    <th class="border-b py-2">Проценты</th>
                    <th class="border-b py-2">Остаток</th>
                </tr>
            </thead>
            <tbody>
    `;

    for (let i = 1; i <= loanTerm; i++) {
        const interestPayment = balance * monthlyRate;
        const principalPayment = monthlyPayment - interestPayment;
        balance -= principalPayment;
        totalOverpayment += interestPayment;

        scheduleHTML += `
            <tr>
                <td class="border-t py-2">${i}</td>
                <td class="border-t py-2">${monthlyPayment.toFixed(2)} ₽</td>
                <td class="border-t py-2">${principalPayment.toFixed(2)} ₽</td>
                <td class="border-t py-2">${interestPayment.toFixed(2)} ₽</td>
                <td class="border-t py-2">${Math.max(balance, 0).toFixed(2)} ₽</td>
            </tr>
        `;
    }

    scheduleHTML += `
            </tbody>
        </table>
        <p class="mt-3">Общая переплата: ${totalOverpayment.toFixed(2)} ₽</p>
    `;

    return scheduleHTML;
}

// Обработчик нажатия кнопки "Рассчитать кредит"
calculateButton.addEventListener("click", () => {
    const data = calculateLoan();
    if (!data) return;
});

// Обработчик нажатия кнопки "График платежей"
showScheduleButton.addEventListener("click", () => {
    const data = calculateLoan();
    if (!data) return;

    const scheduleHTML = generateSchedule(data);
    scheduleContent.innerHTML = scheduleHTML;
    scheduleModal.classList.remove("hidden");
});

// Закрытие модального окна графика платежей
closeScheduleButton.addEventListener("click", () => {
    scheduleModal.classList.add("hidden");
});
