const mineflayer = require('mineflayer');
const SocksProxyAgent = require('socks-proxy-agent');
const bots = [];
const proxyList = [
    'socks://proxy1.example.com:1080',
    'socks://proxy2.example.com:1080',
    // Добавь другие прокси-серверы
];
const proxyAgents = proxyList.map(proxy => new SocksProxyAgent(proxy));
function createBotWithProxy(username, password) {
    const selectedProxyAgent = proxyAgents[Math.floor(Math.random() * proxyAgents.length)];

    const bot = mineflayer.createBot({
        username: username,
        password: password,
        host: 'localhost',
        port: 25565,
        // Передача агента прокси в опции "agent" бота
        agent: selectedProxyAgent
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