<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Авто кредитный калькулятор</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f0f0f0;
        }

        .container {
            max-width: 100%;
            margin: 0 auto;
            padding: 10px;
            box-sizing: border-box;
        }

        .calculator-block {
            background-color: #e0f7fa; /* светло-зеленый */
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            margin-bottom: 20px;
        }

        .calculator-block h2 {
            margin: 0;
            font-size: 18px;
            color: #333;
        }

        .calculator-block .monthly-payment {
            font-size: 30px;
            font-weight: bold;
            margin-top: 10px;
            color: #009688;
        }

        .calculator-block input {
            padding: 10px;
            font-size: 16px;
            margin-top: 10px;
            width: 80%;
            max-width: 200px;
            border-radius: 5px;
            border: 1px solid #ccc;
            margin-bottom: 10px;
        }

        .calculator-block button {
            padding: 10px 20px;
            font-size: 16px;
            background-color: #009688;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            margin: 5px;
        }

        .calculator-block button:hover {
            background-color: #00796b;
        }

        .calculator-block .calc-options {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-top: 10px;
        }

        .calculator-block .calc-options button {
            width: 40px;
            font-size: 14px;
        }

        .input-group {
            margin-bottom: 10px;
        }

        .input-group label {
            display: block;
            font-size: 14px;
            margin-bottom: 5px;
        }

        .input-group input {
            width: 100%;
            padding: 10px;
            font-size: 16px;
            border-radius: 5px;
            border: 1px solid #ccc;
        }

        /* Отключение увеличения изображений при двойном тапе */
        * {
            touch-action: none;
        }
    </style>
</head>
<body>

    <div class="container">
        <div class="calculator-block">
            <h2>Ежемесячный платеж</h2>
            <div class="monthly-payment">0</div>
            <h2>Ставка</h2>
            <input type="number" id="interest-rate" placeholder="Введите ставку (%)">
            <div class="calc-options">
                <button id="calculate-btn">Рассчитать кредит</button>
                <button id="payment-schedule-btn">График платежей</button>
            </div>
        </div>

        <div class="input-group">
            <label for="car-price">Стоимость автомобиля</label>
            <input type="number" id="car-price" placeholder="Введите стоимость автомобиля">
        </div>

        <div class="input-group">
            <label for="down-payment">Первоначальный взнос</label>
            <input type="number" id="down-payment" placeholder="Введите первоначальный взнос">
        </div>

        <div class="input-group">
            <label for="loan-term">Срок кредита</label>
            <input type="number" id="loan-term" placeholder="Введите срок кредита">
            <div class="calc-options">
                <button class="loan-term-btn" data-term="12">12</button>
                <button class="loan-term-btn" data-term="24">24</button>
                <button class="loan-term-btn" data-term="36">36</button>
                <button class="loan-term-btn" data-term="48">48</button>
                <button class="loan-term-btn" data-term="60">60</button>
                <button class="loan-term-btn" data-term="72">72</button>
                <button class="loan-term-btn" data-term="84">84</button>
                <button class="loan-term-btn" data-term="96">96</button>
            </div>
        </div>

        <div class="input-group">
            <label for="insurance">КАСКО</label>
            <input type="number" id="insurance" placeholder="Введите стоимость КАСКО">
            <label><input type="checkbox" id="insurance-loan"> В кредит</label>
        </div>

        <div class="input-group">
            <label for="service-fees">Фин. сервисы</label>
            <input type="number" id="service-fees" placeholder="Введите стоимость Фин. сервисов">
            <label><input type="checkbox" id="service-fees-loan"> В кредит</label>
        </div>
    </div>

    <script>
        // Скрытие клавиатуры при касании любой части экрана
        document.body.addEventListener("touchstart", function(event) {
            // Если касание произошло не на поле ввода, скрыть клавиатуру
            if (event.target.tagName !== "INPUT" && event.target.tagName !== "TEXTAREA") {
                setTimeout(() => {
                    document.activeElement.blur(); // Убираем фокус с активного поля ввода
                }, 100); // Немного задерживаем для надёжности
            }
        });

        // Скрытие клавиатуры при нажатии клавиши "Enter" или "Return"
        document.addEventListener("keydown", function(event) {
            // Проверяем, нажата ли клавиша Enter или Return
            if (event.key === "Enter" || event.key === "Return") {
                setTimeout(() => {
                    document.activeElement.blur(); // Убираем фокус с поля ввода
                }, 100); // Задержка для лучшего срабатывания
            }
        });

        // Дополнительно: скрытие клавиатуры при клике вне поля ввода
        document.body.addEventListener("click", function(event) {
            if (event.target.tagName !== "INPUT" && event.target.tagName !== "TEXTAREA") {
                setTimeout(() => {
                    document.activeElement.blur(); // Убираем фокус с активного поля ввода
                }, 100); // Добавлена задержка
            }
        });

        // Блокируем стандартное поведение увеличения изображения при двойном тапе
        document.body.addEventListener('touchstart', (e) => {
            if (e.target.tagName === 'IMG') {
                e.preventDefault(); // Отключаем увеличение
            }
        });

        // Обработчики событий для кнопок срока кредита
        const loanTermButtons = document.querySelectorAll('.loan-term-btn');
        loanTermButtons.forEach(button => {
            button.addEventListener('click', function() {
                const loanTermInput = document.getElementById('loan-term');
                loanTermInput.value = button.getAttribute('data-term');
            });
        });

        // Пример обработки нажатия кнопки "Рассчитать кредит"
        document.getElementById("calculate-btn").addEventListener("click", function() {
            // Здесь будет логика для расчета кредита
            alert("Рассчитать кредит");
        });

        // Пример обработки нажатия кнопки "График платежей"
        document.getElementById("payment-schedule-btn").addEventListener("click", function() {
            // Здесь будет логика для отображения графика платежей
            alert("График платежей");
        });
    </script>
</body>
</html>
