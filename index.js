const mineflayer = require('mineflayer');
const bots = [];
function createBot(username, password) {

    const bot = mineflayer.createBot({
        username: username,
        password: password,
        host: 'localhost',
        port: 25565,
    });

    // Добавьте обработчики событий и другую логику здесь, если необходимо

    bot.on('login', () => {
        console.log(`${bot.username} вошел на сервер`);
    });

    bot.on('kicked', (reason) => {
        console.log(`${bot.username} был выгнан с сервера: ${reason}`);
    });

    bot.on('error', (err) => {
        console.error('Произошла ошибка:', err);
    });
}

// Создаем несколько ботов с прокси
createBot('bot', 'password');