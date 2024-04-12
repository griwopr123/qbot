const mineflayer = require('mineflayer');
const collectBlock = require('mineflayer-collectblock').plugin;
const minecraftData = require('minecraft-data');

const bot = mineflayer.createBot({
    host: 'localhost',
    username: 'inokenti_lesorub',
    port: 59805
});
bot.loadPlugin(require('mineflayer-collectblock').plugin)

let collectedWood = 0;

function countLogs(bot) {
    var logsCount = 0;
    var items = bot.inventory.items();
    var logTypes = ['oak_log', 'spruce_log', 'birch_log', 'jungle_log', 'acacia_log', 'dark_oak_log'];

    for (var i = 0; i < items.length; i++) {
        if (logTypes.includes(items[i].name)) {
            logsCount += items[i].count;
        }
    }
    return logsCount;
}

async function collectLogs(amount) {
    const logIds = logTypes.map(type => mcData.blocksByName[type].id);
    const block = bot.findBlock({
        matching: logIds,
        maxDistance: 128 // Увеличиваем максимальное расстояние поиска
    })

    if (block) {
        try {
            await bot.collectBlock.collect(block);

            if (countLogs(bot) >= amount) {
                console.log(`Добыто ${amount} блоков дерева!`);
                return; // Останавливаем функцию
            }

            collectLogs(amount);
        } catch (err) {
            if (countLogs(bot) <= amount){
                collectLogs(amount)
            }
            console.log(err);
        }
    } else {
        console.log("Блоки дерева не найдены в радиусе 128 блоков.");
    }
}

bot.once('spawn', () => {
    mcData = require('minecraft-data')(bot.version)
})

bot.on("chat", (username, message) => {
    const args = message.split(' ');
    if (args[0] === "добудь" && args[1] === "мне" && args[2] === "дерева") {
        const amount = parseInt(args[3]); // Преобразование строки в число
        if (isNaN(amount)) {
            console.log("Неверный формат команды. Укажите количество дерева после команды.");
            return;
        }

        collectedWood = 0;
        collectLogs(amount);
    }
});
