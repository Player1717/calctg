// Открытие и закрытие модального окна
const modal = document.getElementById('payment-schedule-modal');
const scheduleButton = document.querySelector('.payment-schedule-button');
const closeButton = document.querySelector('.close-modal');

scheduleButton.addEventListener('click', () => {
    modal.style.display = 'flex'; // Показываем модальное окно
});

closeButton.addEventListener('click', () => {
    modal.style.display = 'none'; // Скрываем модальное окно
});
