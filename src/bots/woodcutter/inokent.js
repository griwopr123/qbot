const mineflayer = require('mineflayer');
const collectBlock = require('mineflayer-collectblock').plugin;
const minecraftData = require('minecraft-data');
const {plugin: autoeat} = require("mineflayer-auto-eat");
const { Bot, Vec3 } = require('mineflayer');

const bot = mineflayer.createBot({
    host: 'localhost',
    username: 'inokenti_lesorub',
    port: 61098
});
bot.loadPlugin(require('mineflayer-collectblock').plugin)
bot.loadPlugin(autoeat);
let collectedWood = 0;

function countOakLogs(bot) {
    var oakLogsCount = 0;
    var items = bot.inventory.items();

    for (var i = 0; i < items.length; i++) {
        if (items[i].name === 'oak_log' || items[i].name === 'dark_oak_log' || items[i].name === 'acacia_log') {
            oakLogsCount += items[i].count;
        }
    }
    return oakLogsCount;
}
async function collectoak(amount) {
    const oakLogId = mcData.blocksByName.oak_log.id;
    const darkOakLogId = mcData.blocksByName.dark_oak_log.id;
    const acaciaLogId = mcData.blocksByName.acacia_log.id;
    const array = [oakLogId,darkOakLogId,acaciaLogId]
    const block = bot.findBlock({
        matching: array,
        maxDistance: 128 // Увеличиваем максимальное расстояние поиска
    })

    if (block) {
        try {
            await bot.collectBlock.collect(block);

            if (countOakLogs(bot) >= amount) {
                console.log(`Добыто ${amount} блоков дерева!`);
                return; // Останавливаем функцию
            }

            collectoak(amount);
        } catch (err) {
            if (countOakLogs(bot) <= amount){
                collectoak(amount)
            }
            console.log(err);
        }
    } else {
        console.log("Блок дерева не найден");
    }
}
let botPosition;
bot.on('spawn', () => {

});
bot.once('spawn', () => {

    mcData = require('minecraft-data')(bot.version)
})


bot.on("chat", (username, message) => {
    const args = message.split(' ');
    if (args[0] === "добудь" && args[1] === "мне" && args[2] === "дерева") {
        const amount = parseInt(args[3]);
        if (isNaN(amount)) {
            console.log("Неверный формат команды. Укажите количество дерева после команды.");
            return;
        }

        collectedWood = 0;
        collectoak(amount);
    }
    if(message === 'корды'){
        let botPosition = bot.entity.position;
        console.log(botPosition);
        if(botPosition !== bot.entity.position){
            botPosition = bot.entity.position
            console.log(botPosition);
        }
    }
});
bot.on('spawn', () => {
    if (bot.autoEat) {
        bot.autoEat.options = {
            priority: 'foodPoints',
            startAt: 16,
            bannedFood: [],
        };
    } else {
        console.error('mineflayer-auto-eat plugin is not loaded');
    }
});
bot.on('death', (username, message) => {
    let words = ['ну хватит але', 'ну за что', 'ты чо ахуел сука', 'у меня папа админ извиняйся'];
    let randomWord = words[Math.floor(Math.random() * words.length)];
    bot.chat(randomWord);
})
bot.on('login', () => {
    botPosition = {
        x: Math.floor(bot.entity.position.x),
        y: Math.floor(bot.entity.position.y),
        z: Math.floor(bot.entity.position.z)
    };
});

bot.on('move', () => {
    let newPosition = {
        x: Math.floor(bot.entity.position.x),
        y: Math.floor(bot.entity.position.y),
        z: Math.floor(bot.entity.position.z)
    };
    if (botPosition.x !== newPosition.x || botPosition.y !== newPosition.y || botPosition.z !== newPosition.z) {
        botPosition = newPosition;
        console.log(botPosition);
    }
});

bot.on("chat", (username, message) => {
    if(message === 'корды'){
        console.log(botPosition);
    }
});
