const mineflayer = require('mineflayer');
const collectBlock = require('mineflayer-collectblock').plugin;
const minecraftData = require('minecraft-data');

const bot = mineflayer.createBot({
    host: 'localhost',
    username: 'inokenti_lesorub',
    port: 55208
});
bot.loadPlugin(require('mineflayer-collectblock').plugin)

let collectedWood = 0;

function countOakLogs(bot) {
    var oakLogsCount = 0;
    var items = bot.inventory.items();

    for (var i = 0; i < items.length; i++) {
        if (items[i].name === 'oak_log') {
            oakLogsCount += items[i].count;
        }
    }

    return oakLogsCount;
}
async function collectoak(amount) {
    const oakLogId = mcData.blocksByName.oak_log.id;
    const array = [oakLogId]
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
        console.log("Блок дуба не найден в радиусе 128 блоков.");
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
        collectoak(amount);
    }
});