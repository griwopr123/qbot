const mineflayer = require('mineflayer');
const autoeat = require('mineflayer-auto-eat');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const {player} = require("mcdata");
const GoalFollow = goals.GoalFollow;
const GoalNear = goals.GoalNear;

const bot = mineflayer.createBot({
    host: 'localhost',
    port: 61071,
    username: 'bot',
});

bot.loadPlugin(pathfinder);
bot.loadPlugin(autoeat);

bot.once('spawn', () => {
    const mcData = require('minecraft-data')(bot.version);
    const defaultMove = new Movements(bot, mcData);
    bot.pathfinder.setMovements(defaultMove);
    bot.autoEat.options = {
        priority: 'foodPoints',
        startAt: 14,
        bannedFood: [],
    };

});

bot.on('chat', (username, message) => {
    if (username === bot.username) return;
    let target = bot.players[username]?.entity;
    if (message === 'сюда' && target) {
        bot.pathfinder.setGoal(new GoalFollow(target, 1), true);
    } else if (message === 'стоп') {
        bot.pathfinder.setGoal(null);
    }
});
bot.on('death', (username, message) => {
    let words = ['ну хватит але', 'ну за что', 'ты чо ахуел сука', 'у меня папа админ извиняйся'];
    let randomWord = words[Math.floor(Math.random() * words.length)];
    bot.chat(randomWord);
})
bot.on('chat', (username, message) => {
    if(message === 'сделай мне слюнявый'){
        bot.chat('ща спылисосим')
        let target = bot.players[username]?.entity;
        const p = target.position;
        bot.pathfinder.setGoal(new GoalNear(p.x, p.y, p.z, 1));

        const checkIfReachedGoal = setInterval(() => {
            if (!bot.pathfinder.isMoving()) {
                const distance = bot.entity.position.distanceTo(p);
                if (distance <= 2) {
                    bot.setControlState('sneak', true);
                    intervalId = setInterval(() =>{
                        let word = ['фпфпфпфп', 'горк', 'слёрп'];
                        let randomWords = word[Math.floor(Math.random() * word.length)];
                        bot.chat(randomWords)
                    }, 1000)
                    clearInterval(checkIfReachedGoal);
                }
            }
        }, 1000);
    }

    if(message === 'харе'){
        bot.chat('ладно(((')
        clearInterval(intervalId);
        bot.setControlState('sneak', false);
    }
});