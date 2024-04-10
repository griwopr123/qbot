const mineflayer = require('mineflayer');
const collectBlock = require('mineflayer-collectblock').plugin;
const minecraftData = require('minecraft-data');

const bot = mineflayer.createBot({
    host: 'localhost',
    username: 'inokenti_lesorub',
    port:55111
});
bot.loadPlugin(require('mineflayer-collectblock').plugin)

let collectedWood = 0;

async function collectoak(amount) {
    const oakLogId = mcData.blocksByName.oak_log.id;
    const block = bot.findBlock({
        matching: oakLogId,
        maxDistance: 64
    })

    if (block && block.type === oakLogId) {
        try {
            await bot.collectBlock.collect(block);
            collectedWood++; // Увеличиваем счетчик добытых блоков

            // Проверка, достигнуто ли желаемое количество
            if (collectedWood >= amount) {
                console.log(`Добыто ${amount} блоков дерева!`);
                return; // Останавливаем функцию
            }

            collectoak(amount); // Продолжаем добычу
        } catch (err) {
            console.log(err);
        }
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

        collectedWood = 0; // Сброс счетчика
        collectoak(amount); // Запуск функции добычи
    }
});