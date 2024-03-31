const mineflayer = require('mineflayer');
const bots = [];
const { pathfinder } = require ('mineflayer-pathfinder');
function createBot(username, password) {

    const bot = mineflayer.createBot({
        username: username,
        password: password,
        host: 'localhost',
        port: 25565,
    });
    bot.loadPlugin(pathfinder);
    bot.once('spawn', followPlayer)

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
function followPlayer (){
  const playerC = bot.players['Kaufmoo']
    if(!playerC){
        return
    }
    const mcData = require('minecraft-data')(bot.version);
}
// Создаем несколько ботов с прокси
createBot('bot', 'password');