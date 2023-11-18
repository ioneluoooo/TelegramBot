const TelegramApi = require('node-telegram-bot-api')
const { gameOptions, againOptions} = require('./options.js')
const token = '6875973374:AAH-dTJN07mpAzFqZasJ_3-fd1_CzapGVRM'

const bot = new TelegramApi(token, { polling: true })

const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'I will pick a number between 0 and 9 and you should guess it!!!')
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber
    await bot.sendMessage(chatId, 'Good luck :)', gameOptions)
}

const start = () => {
    bot.setMyCommands([
        { command: '/start', description: 'Start' },
        { command: '/info', description: 'Get info' },
        { command: '/game', description: 'Play a game' },
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/7a0/e2e/7a0e2ef1-ff94-4317-a188-4bead80d1756/3.webp')
            return bot.sendMessage(chatId, 'Welcome on my telegram bot dawg')
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `Your name is ${msg.from.first_name}`)
        }
        if (text === '/game') {
            return startGame(chatId)
        }
        return bot.sendMessage(chatId, 'Invalid command')
    })

    bot.on('callback_query', async msg => {
        const data = msg.data
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatId)
        }
        if (data === chats[chatId]) {
            return await bot.sendMessage(chatId, 'Correct! Congratulations.', againOptions)
        } else {
            return bot.sendMessage(chatId, `You were close! Try another one. I picked the number ${chats[chatId]}`, againOptions)
        }

    })
}

start()