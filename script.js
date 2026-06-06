// Элементы интерфейса
const startBtn = document.getElementById('start-btn');
const infoBtn = document.getElementById('info-btn');
const tokenInput = document.getElementById('token-input');
const statusMessage = document.getElementById('status-message');
const modal = document.getElementById('modal');
const closeBtn = document.querySelector('.close-btn');

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

// Логика отправки запросов
startBtn.addEventListener('click', () => {
    const token = tokenInput.value.trim();

    if (!token) {
        alert('Пожалуйста, введите токен!');
        return;
    }

    // Если фарм уже запущен, предотвращаем повторные интервалы
    if (farmInterval) {
        clearInterval(farmInterval);
    }

    statusMessage.textContent = 'Фарм запущен. Запросы отправляются каждые 10 секунд...';
    startBtn.disabled = true;
    startBtn.textContent = 'Процесс идет...';

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
