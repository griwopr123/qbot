const mineflayer = require('mineflayer');
const autoeat = require('mineflayer-auto-eat').plugin
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const Vec3 = require('vec3').Vec3;
const {player} = require("mcdata");
const GoalFollow = goals.GoalFollow;
const GoalNear = goals.GoalNear;

const bot = mineflayer.createBot({
    host: 'localhost',
    port: 61644,
    username: 'nikita'
});
bot.loadPlugin(pathfinder);
bot.loadPlugin(autoeat);
let hasReportedHunger = false;

bot.once('spawn', () => {
    const mcData = require('minecraft-data')(bot.version);
    const defaultMove = new Movements(bot, mcData);
    bot.pathfinder.setMovements(defaultMove);
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
bot.on('spawn', () => {
    if (bot.autoEat) {
        bot.autoEat.options = {
            priority: 'foodPoints',
            startAt: 14,
            bannedFood: [],
        };
    } else {
        console.error('mineflayer-auto-eat plugin is not loaded');
    }
});

bot.on('chat', (username , message) => {
    if(message  === 'хочешь есть?'){
      if (bot.food < 19){
          bot.chat('у меня ' + bot.food + ' очков голода' )
      }
      if (bot.food === 20){
          bot.chat('я полностью сыт')
      }
    }
});
bot.on('chat', (username, message) => {
    if (username === bot.username) return;
    if (message === 'построй здесь') {
        let player = bot.players[username];
        if (!player) {
            bot.chat("Я не вижу вас!");
            return;
        }
        let referencePoint = player.entity.position.offset(0, -1, 0);
        buildHouse(referencePoint);
    }
});

function buildHouse(referencePoint) {
    let blocksToPlace = [
        [referencePoint.x, referencePoint.y - 1, referencePoint.z],
        [referencePoint.x + 2, referencePoint.y, referencePoint.z],
        [referencePoint.x + 2, referencePoint.y, referencePoint.z - 1],
        [referencePoint.x + 2, referencePoint.y, referencePoint.z - 2],
        [referencePoint.x + 2, referencePoint.y, referencePoint.z + 1],
        [referencePoint.x + 2, referencePoint.y, referencePoint.z + 2],
        [referencePoint.x - 2, referencePoint.y, referencePoint.z],
        [referencePoint.x - 2, referencePoint.y, referencePoint.z - 1],
        [referencePoint.x - 2, referencePoint.y, referencePoint.z - 2],
        [referencePoint.x - 2, referencePoint.y, referencePoint.z + 1],
        [referencePoint.x - 2, referencePoint.y, referencePoint.z + 2],
        [referencePoint.x + 1, referencePoint.y, referencePoint.z + 2],
        [referencePoint.x - 1, referencePoint.y, referencePoint.z + 2],
        [referencePoint.x, referencePoint.y, referencePoint.z - 2],
        [referencePoint.x + 1, referencePoint.y, referencePoint.z - 2],
        [referencePoint.x - 1, referencePoint.y, referencePoint.z - 2],
        [referencePoint.x + 2, referencePoint.y + 1, referencePoint.z],
        [referencePoint.x + 2, referencePoint.y + 1, referencePoint.z - 1],
        [referencePoint.x + 2, referencePoint.y + 1, referencePoint.z - 2],
        [referencePoint.x + 2, referencePoint.y + 1, referencePoint.z + 1],
        [referencePoint.x + 2, referencePoint.y + 1, referencePoint.z + 2],
        [referencePoint.x - 2, referencePoint.y + 1, referencePoint.z],
        [referencePoint.x - 2, referencePoint.y + 1, referencePoint.z - 1],
        [referencePoint.x - 2, referencePoint.y + 1, referencePoint.z - 2],
        [referencePoint.x - 2, referencePoint.y + 1, referencePoint.z + 1],
        [referencePoint.x - 2, referencePoint.y + 1, referencePoint.z + 2],
        [referencePoint.x + 1, referencePoint.y + 1, referencePoint.z + 2],
        [referencePoint.x - 1, referencePoint.y + 1, referencePoint.z + 2],
        [referencePoint.x, referencePoint.y + 1, referencePoint.z - 2],
        [referencePoint.x + 1, referencePoint.y + 1, referencePoint.z - 2],
        [referencePoint.x - 1, referencePoint.y + 1, referencePoint.z - 2],
        [referencePoint.x - 2, referencePoint.y + 1, referencePoint.z],
        [referencePoint.x + 2, referencePoint.y + 1, referencePoint.z],
        // Добавьте остальные блоки сюда
    ];

    let placeBlocks = async () => {
        for (let block of blocksToPlace) {
            await bot.placeBlock(bot.blockAt(new Vec3(...block)), new Vec3(0, 1, 0));
        }
    };

    placeBlocks().then(() => bot.chat('Дом построен!'));
}