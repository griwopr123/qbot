const mineflayer = require('mineflayer');
const minecraftData = require('minecraft-data');

const bot = mineflayer.createBot({
    host: 'localhost',
    username: 'Alice',
    port: 53885
});

bot.loadPlugin(require('mineflayer-collectblock').plugin)
let mcData;

bot.once('spawn', () => {
    mcData = minecraftData(bot.version);
});

bot.on('chat', (username, message) => {
    if (message === 'займись сельским хозяйством') {
        bot.chat('Ща');
    }
});
