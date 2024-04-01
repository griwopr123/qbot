const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const GoalFollow = goals.GoalFollow;

let bot = mineflayer.createBot({
    host: 'localhost',
    port: 50150,
    username: 'bot',
});

bot.loadPlugin(pathfinder);

bot.once('spawn', () => {
    const mcData = require('minecraft-data')(bot.version);
    const defaultMove = new Movements(bot, mcData);
    bot.pathfinder.setMovements(defaultMove);
});

bot.on('chat', (username, message) => {
    if (username === bot.username) return;
    let target = bot.players[username]?.entity;
    if (message === 'follow' && target) {
        bot.pathfinder.setGoal(new GoalFollow(target, 1), true);
    } else if (message === 'stop') {
        bot.pathfinder.setGoal(null);
    }
});
