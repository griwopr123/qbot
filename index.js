const mineflayer = require('mineflayer');
const autoeat = require('mineflayer-auto-eat').plugin
const toolPlugin = require('mineflayer-tool').plugin
const collectBlock = require('mineflayer-collectblock').plugin;
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const Vec3 = require('vec3').Vec3;
const {player} = require("mcdata");
const GoalFollow = goals.GoalFollow;
const GoalNear = goals.GoalNear;

const bot = mineflayer.createBot({
    host: 'localhost',
    port: 52540,
    username: 'nikita'
});
bot.loadPlugin(pathfinder);
bot.loadPlugin(autoeat);
bot.loadPlugin(collectBlock);
bot.loadPlugin(toolPlugin);
let hasReportedHunger = false;
let mcData;

bot.once('spawn', () => {
    mcData = require('minecraft-data')(bot.version);
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
        let target = bot.players[username]?.entity;
        const p = target.position;
        bot.pathfinder.setGoal(new GoalNear(p.x, p.y, p.z, 1), true);
        const checkIfStopped = setInterval(async () => {
            if (!bot.pathfinder.isMoving()) {
                clearInterval(checkIfStopped);
                if (!player) {
                    bot.chat("Я не вижу вас!");
                    return;
                }
                let referencePoint = player.entity.position.offset(0, 0, 0);
                await buildHouse(referencePoint);
                bot.pathfinder.setGoal(null); // Останавливаем бота после постройки
            }
        }, 250);
    }
});


async function buildHouse(referencePoint) {
    let blocksToPlace = [
        [referencePoint.x + 1, referencePoint.y, referencePoint.z],
        [referencePoint.x + 2, referencePoint.y, referencePoint.z],
        [referencePoint.x + 3, referencePoint.y, referencePoint.z],
        [referencePoint.x + 3, referencePoint.y, referencePoint.z + 1],
        [referencePoint.x + 3, referencePoint.y, referencePoint.z + 2],
        [referencePoint.x - 1, referencePoint.y, referencePoint.z],
        [referencePoint.x - 2, referencePoint.y, referencePoint.z],
        [referencePoint.x - 3, referencePoint.y, referencePoint.z],
        [referencePoint.x - 3, referencePoint.y, referencePoint.z - 1],
        [referencePoint.x - 3, referencePoint.y, referencePoint.z - 2],
        [referencePoint.x, referencePoint.y, referencePoint.z + 1],
        [referencePoint.x, referencePoint.y, referencePoint.z + 2],
        [referencePoint.x, referencePoint.y, referencePoint.z + 3],
        [referencePoint.x - 1, referencePoint.y, referencePoint.z + 3],
        [referencePoint.x - 2, referencePoint.y, referencePoint.z + 3],
        [referencePoint.x, referencePoint.y, referencePoint.z - 1],
        [referencePoint.x, referencePoint.y, referencePoint.z - 2],
        [referencePoint.x, referencePoint.y, referencePoint.z - 3],
        [referencePoint.x + 1, referencePoint.y, referencePoint.z - 3],
        [referencePoint.x + 2, referencePoint.y, referencePoint.z - 3],
        // Ваши старые координаты здесь
    ];
    let placeBlocks = async () => {
        for (let block of blocksToPlace) {
            let blockPosition = new Vec3(...block);
            let blockToPlace = bot.blockAt(blockPosition);
            if (blockToPlace && blockToPlace.type !== 0) {
                await bot.dig(blockToPlace);
            }
            bot.setControlState('jump', true);
            let success = false;
            while (!success) {
                try {
                    // Проверяем, есть ли блок на месте, куда бот собирается идти
                    let nextPosition = new Vec3(blockPosition.x, blockPosition.y, blockPosition.z);
                    let nextBlock = bot.blockAt(nextPosition);
                    if (nextBlock && nextBlock.type !== 0) {
                        await bot.dig(nextBlock);
                        nextBlock = bot.blockAt(nextPosition);
                        if (nextBlock && nextBlock.type !== 0) {
                            continue;
                        }
                    }
                    if (bot.entity.position.distanceTo(blockPosition) < 1) {
                        bot.setControlState('back', true);
                        bot.setControlState('jump', true);
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        bot.setControlState('jump', false);
                        bot.setControlState('back', false);
                    }
                    bot.pathfinder.setGoal(new GoalNear(blockPosition.x, blockPosition.y, blockPosition.z, 2));
                    while (bot.pathfinder.isMoving()) {
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                    if (bot.canSeeBlock(bot.blockAt(blockPosition.offset(0, -1, 0)))) {
                        await bot.lookAt(blockPosition, true);
                        await bot.placeBlock(bot.blockAt(blockPosition.offset(0, -1, 0)), new Vec3(0, 1, 0));
                        success = true;
                    } else {
                        await bot.lookAt(blockPosition, true);
                        await bot.placeBlock(bot.blockAt(blockPosition.offset(0, -1, 0)), new Vec3(0, 1, 0));
                        success = true;
                    }
                } catch (error) {
                    bot.chat(`Не могу поставить блок на ${blockPosition}, попробую снова...`);
                }
            }
            bot.setControlState('jump', false);
        }
    };

    placeBlocks().then(() => bot.chat('Дом построен!'));
}

bot.on('chat', (username, message) => {
   if(message === 'кто лучшая женщина?'){
       bot.chat('очевидно торамана')
   }
});
bot.on('chat', (username, message) => {
    if(message === 'путин хуйло?'){
        bot.chat('конечно')
    }
});
bot.on('chat', (username, message) => {
    if (username === bot.username) return;
    const targetBlockType = bot.findBlock({
        matching: ['minecraft:oak_log', 'minecraft:spruce_log', 'minecraft:birch_log', 'minecraft:jungle_log', 'minecraft:acacia_log', 'minecraft:dark_oak_log'].map(name => mcData.blocksByName[name].id),
        maxDistance: 64,
    });
    if (targetBlockType) {
        bot.collectBlock.collect(targetBlockType, err => {
            if (err) bot.chat(`Не удалось собрать блок: ${err.message}`);
            else bot.chat('Блок успешно собран!');
        });
    } else {
        bot.chat('Блоки древесины поблизости не найдены');
    }
});
