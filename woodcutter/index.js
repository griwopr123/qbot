const mineflayer = require('mineflayer');
const collectBlock = require('mineflayer-collectblock').plugin;
const minecraftData = require('minecraft-data');

const bot = mineflayer.createBot({
    host: 'localhost',
    username: 'inokenti_lesorub',
    port:55111
});
bot.loadPlugin(require('mineflayer-collectblock').plugin)
async function collectoak() {
    const oakLogId = mcData.blocksByName.oak_log.id;
    const block = bot.findBlock({
        matching: oakLogId,
        maxDistance: 64
    })

    if (block && block.type === oakLogId) {
        try {
            await bot.collectBlock.collect(block)
            collectoak()
        } catch (err) {
            console.log(err)
        }
    }
}

bot.once('spawn', () => {
    mcData = require('minecraft-data')(bot.version)
})


bot.on("chat", (username, message) => {
  if(message === 'добудь мне дерева'){
      collectoak()
  }
})