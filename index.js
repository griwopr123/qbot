const mineflayer = require('mineflayer')
const bot = mineflayer.createBot({
    host: 'localhost',
    port: 25565,
    username: 'Nikita',
})
const options = {
    host: 'localhost',
    port: 25565
}
const zahod = () => {
    bot.chat('всем привет меня зовут никита мне 13 лет, я очень жду этот сервер потому что летом мне нечем занятся потому что у меня нету друзей единственный мой друг анатолий погиб на СВО 2 недели назад, мне хотелось бы получить проходку бесплатно потому что я живу в питере и все свои карманные деньги трачу на соль, мне очень понравилась задумка этого сервера и основной мод который будет на сервере, потому что повторюсь у меня никого нету из друзей и я смогу найти друзей среди нпс которые будут умирать за мои цели, я хочу устроить на сервере полномаштабное СВО и как свой любымий президент резать хохлов, мне кажется что это единственное чем стоит заниматся в этой жизни, надеюсь я найду на этом сервере хохлов.')
}

bot.once('spawn', zahod)