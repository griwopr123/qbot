const mineflayer = require('mineflayer');
const collectBlock = require('mineflayer-collectblock').plugin;
const minecraftData = require('minecraft-data');
const {plugin: autoeat} = require("mineflayer-auto-eat");
const { Bot, Vec3 } = require('mineflayer');

const bot = mineflayer.createBot({
    host: 'localhost',
    username: 'inokenti_lesorub',
    port: 61814
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
let lastCoords = bot.entity.position; // Последние сохраненные координаты

bot.on('spawn', () => {
    console.log(`Спаун: ${bot.entity.position}`);
    lastCoords = bot.entity.position;
});

bot.on('move', () => {
    const newCoords = bot.entity.position;
    if (newCoords.x !== lastCoords.x || newCoords.y !== lastCoords.y || newCoords.z !== lastCoords.z) {
        console.log(`Перемещение: ${newCoords}`);
        lastCoords = newCoords;
    }
});