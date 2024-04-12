function countLogs(bot) {
    var logsCount = 0;
    var items = bot.inventory.items();

    for (var i = 0; i < items.length; i++) {
        if (items[i].name === 'oak_log' || items[i].name === 'dark_oak_log' || items[i].name === 'acacia_log') {
            logsCount += items[i].count;
        }
    }
    return logsCount;
}

async function collectLogs(amount) {
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
        console.log("Блок дерева не найден в радиусе 128 блоков.");
    }
}

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
