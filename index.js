const mineflayer = require('mineflayer');
const bots = [];
function createBotWithProxy(username, password) {

    const bot = mineflayer.createBot({
        username: username,
        password: password,
        host: 'localhost',
        port: 25565,
        // Передача агента прокси в опции "agent" бота
        agent: '50.175.212.79:80'
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
createBotWithProxy('bot1', 'password1');
createBotWithProxy('bot2', 'password2');