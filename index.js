const mineflayer = require('mineflayer');
const bots = [];
const { pathfinder, Movements , goals } = require ('mineflayer-pathfinder');
const GoalFollow = goals.GoalFollow
function createBot(username, password) {

    const bot = mineflayer.createBot({
        username: username,
        password: password,
        host: 'localhost',
        port: 25565,
    });
    bot.loadPlugin(pathfinder);
    bot.once('spawn', followPlayer)
}
function followPlayer (){
    const playerC = bot.players['Kaufmoo']
    if(!playerC){
        bot.chat("не вижу")
        return
    }
    const mcData = require('minecraft-data')(bot.version);
    const movements = new Movements(bot, mcData);
    bot.pathfinder.setMovements(movements)
    const goal = new GoalFollow(playerC.entity);
    bot.pathfinder.setGoal(goal,true)
}
createBot('bot', 'password');