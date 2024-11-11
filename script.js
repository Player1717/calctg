function updateLoanAmount(value) {
    document.getElementById('loan-amount').value = value;
    document.getElementById('loan-amount-result').textContent = `${parseInt(value).toLocaleString()} ₽`;
    document.getElementById('loan-amount-right').textContent = `${parseInt(value).toLocaleString()} ₽`;
    calculateLoan();  // Пересчитываем кредит при изменении суммы кредита
}

function updateLoanTerm(months) {
    document.getElementById('loan-term-input').value = months;
    document.getElementById('loan-term-range').value = months;
}

function updateLoanTermInput(value) {
    document.getElementById('loan-term-range').value = value;
}

function updateInterestRate(value) {
    document.getElementById('interest-rate').value = value;
    calculateLoan();  // Пересчитываем кредит при изменении процентной ставки
}

function calculateLoan() {
    const loanAmount = parseFloat(document.getElementById('loan-amount').value);
    const loanTerm = parseFloat(document.getElementById('loan-term-input').value);
    const interestRate = parseFloat(document.getElementById('interest-rate').value);

    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm;
    const monthlyPayment = loanAmount * monthlyRate / (1 - Math.pow(1 + monthlyRate, -numberOfPayments));
    const totalOverpayment = (monthlyPayment * numberOfPayments - loanAmount).toFixed(2);

    document.getElementById('monthly-payment').textContent = `${monthlyPayment.toFixed(2)} ₽`;
    document.getElementById('loan-amount-right').textContent = `${loanAmount.toLocaleString()} ₽`;
    document.getElementById('modal-loan-amount').textContent = `${loanAmount.toLocaleString()} ₽`;
    document.getElementById('modal-interest-rate').textContent = interestRate.toFixed(2);
    document.getElementById('modal-total-overpayment').textContent = `${totalOverpayment} ₽`;

    const schedule = document.getElementById('payment-schedule');
    schedule.innerHTML = '';

    let remainingBalance = loanAmount;
    for (let i = 1; i <= numberOfPayments; i++) {
        const interestPayment = remainingBalance * monthlyRate;
        const principalPayment = monthlyPayment - interestPayment;
        remainingBalance -= principalPayment;
        const row = schedule.insertRow();
        row.insertCell(0).textContent = i;
        row.insertCell(1).textContent = `${monthlyPayment.toFixed(2)} ₽`;
        row.insertCell(2).textContent = `${principalPayment.toFixed(2)} ₽`;
        row.insertCell(3).textContent = `${interestPayment.toFixed(2)} ₽`;
    }
}

function updateCarPrice(value) {
    document.getElementById('car-price').value = value;
}

function updateCarLoanTerm(months) {
    document.getElementById('car-loan-term').value = months;
}

function updateCarCascoCredit() {
    calculateCarLoan();
}

function updateCarServicesCredit() {
    calculateCarLoan();
}

function calculateCarLoan() {
    const carPrice = parseFloat(document.getElementById('car-price').value);
    const initialPayment = parseFloat(document.getElementById('initial-payment').value);
    const loanTerm = parseFloat(document.getElementById('car-loan-term').value);
    const interestRate = parseFloat(document.getElementById('car-interest-rate').value);
    const casco = parseFloat(document.getElementById('car-casco').value);
    const services = parseFloat(document.getElementById('car-services').value);

    let totalLoanAmount = carPrice - initialPayment;
    if (document.getElementById('car-casco-credit').checked) {
        totalLoanAmount += casco;
    }
    if (document.getElementById('car-services-credit').checked) {
        totalLoanAmount += services;
    }

    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm;
    const monthlyPayment = totalLoanAmount * monthlyRate / (1 - Math.pow(1 + monthlyRate, -numberOfPayments));
    const totalOverpayment = (monthlyPayment * numberOfPayments - totalLoanAmount).toFixed(2);

    document.getElementById('car-monthly-payment').textContent = `${monthlyPayment.toFixed(2)} ₽`;
    document.getElementById('car-loan-amount-result').textContent = `${totalLoanAmount.toLocaleString()} ₽`;
    document.getElementById('modal-loan-amount').textContent = `${totalLoanAmount.toLocaleString()} ₽`;
    document.getElementById('modal-interest-rate').textContent = interestRate.toFixed(2);
    document.getElementById('modal-total-overpayment').textContent = `${totalOverpayment} ₽`;

    const schedule = document.getElementById('payment-schedule');
    schedule.innerHTML = '';

    let remainingBalance = totalLoanAmount;
    for (let i = 1; i <= numberOfPayments; i++) {
        const interestPayment = remainingBalance * monthlyRate;
        const principalPayment = monthlyPayment - interestPayment;
        remainingBalance -= principalPayment;
        const row = schedule.insertRow();
        row.insertCell(0).textContent = i;
        row.insertCell(1).textContent = `${monthlyPayment.toFixed(2)} ₽`;
        row.insertCell(2).textContent = `${principalPayment.toFixed(2)} ₽`;
        row.insertCell(3).textContent = `${interestPayment.toFixed(2)} ₽`;
    }
}

function openTab(tabName) {
    var i;
    var x = document.getElementsByClassName("tabcontent");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    document.getElementById(tabName).style.display = "block";
}

document.getElementById("defaultOpen").click();

function showPaymentSchedule(type) {
    if (type === 'car') {
        calculateCarLoan();
    } else {
        calculateLoan();
    }
    document.getElementById('payment-schedule-modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('payment-schedule-modal').style.display = 'none';
}

function generatePDF() {
    const loanAmount = document.getElementById('modal-loan-amount').textContent;
    const interestRate = document.getElementById('modal-interest-rate').textContent;
    const totalOverpayment = document.getElementById('modal-total-overpayment').textContent;
    const scheduleRows = Array.from(document.querySelectorAll('#payment-schedule tr')).map(row => {
        return Array.from(row.querySelectorAll('td')).map(cell => cell.textContent);
    });

    const docDefinition = {
        content: [
            { text: 'График платежей', style: 'header' },
            { text: `Сумма кредита: ${loanAmount}`, style: 'subheader' },
            { text: `Ставка: ${interestRate}%`, style: 'subheader' },
            { text: `Переплата по кредиту: ${totalOverpayment}`, style: 'subheader' },
            {
                style: 'tableExample',
                table: {
                    headerRows: 1,
                    widths: ['*', '*', '*', '*'],
                    body: [
                        [{ text: 'Месяц', style: 'tableHeader' }, { text: 'Платеж', style: 'tableHeader' }, { text: 'Основной долг', style: 'tableHeader' }, { text: 'Проценты', style: 'tableHeader' }],
                        ...scheduleRows
                    ]
                },
                layout: 'lightHorizontalLines'
            }
        ],
        styles: {
            header: {
                fontSize: 18,
                bold: true,
                margin: [0, 0, 0, 10]
            },
            subheader: {
                fontSize: 14,
                bold: true,
                margin: [0, 10, 0, 5]
            },
            tableExample: {
                margin: [0, 5, 0, 15]
            },
            tableHeader: {
                bold: true,
                fontSize: 13,
                color: 'black'
            }
        }
    };

    pdfMake.createPdf(docDefinition).download('payment-schedule.pdf');
}

function sharePDF() {
    generatePDFBlob().then(pdfBlob => {
        const dataTransfer = new DataTransfer();
        const file = new File([pdfBlob], 'payment-schedule.pdf', { type: 'application/pdf' });
        dataTransfer.items.add(file);

        if (navigator.canShare && navigator.canShare({ files: dataTransfer.files })) {
            navigator.share({
                files: dataTransfer.files,
                title: 'График платежей',
                text: 'Посмотрите мой график платежей.'
            }).catch(error => console.log('Sharing failed', error));
        } else {
            alert('Sharing not supported on this browser.');
        }
    });
}

function generatePDFBlob() {
    return new Promise((resolve, reject) => {
        const loanAmount = document.getElementById('modal-loan-amount').textContent;
        const interestRate = document.getElementById('modal-interest-rate').textContent;
        const totalOverpayment = document.getElementById('modal-total-overpayment').textContent;
        const scheduleRows = Array.from(document.querySelectorAll('#payment-schedule tr')).map(row => {
            return Array.from(row.querySelectorAll('td')).map(cell => cell.textContent);
        });

        const docDefinition = {
            content: [
                { text: 'График платежей', style: 'header' },
                { text: `Сумма кредита: ${loanAmount}`, style: 'subheader' },
                { text: `Ставка: ${interestRate}%`, style: 'subheader' },
                { text: `Переплата по кредиту: ${totalOverpayment}`, style: 'subheader' },
                {
                    style: 'tableExample',
                    table: {
                        headerRows: 1,
                        widths: ['*', '*', '*', '*'],
                        body: [
                            [{ text: 'Месяц', style: 'tableHeader' }, { text: 'Платеж', style: 'tableHeader' }, { text: 'Основной долг', style: 'tableHeader' }, { text: 'Проценты', style: 'tableHeader' }],
                            ...scheduleRows
                        ]
                    },
                    layout: 'lightHorizontalLines'
                }
            ],
        styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    margin: [0, 0, 0, 10]
                },
                subheader: {
                    fontSize: 14,
                    bold: true,
                    margin: [0, 10, 0, 5]
                },
                tableExample: {
                    margin: [0, 5, 0, 15]
                },
                tableHeader: {
                    bold: true,
                    fontSize: 13,
                    color: 'black'
                }
            }
        };

        pdfMake.createPdf(docDefinition).getBlob(resolve);
    });
}
