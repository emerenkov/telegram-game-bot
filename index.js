import TelegramApi from 'node-telegram-bot-api' ;
import { againOptions, gameOptions }  from './options.js'
import sequelize from './db.js'
import { User as UserModel } from "./models.js";


const token = '8065104727:AAGs5sZFJgY3g5BPaGiGEATJPVOqDX-sqGE'

const bot = new TelegramApi(token, {polling: true})

const chats = {}

const startGame = async (chatId) => {
  await bot.sendMessage(chatId, `guess the number from 0 to 9`);
  const randomNumber = Math.floor(Math.random() * 10)
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, 'guess...', gameOptions)
}


const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
  } catch (e) {
    console.log('connect DB wrong')
  }


  await bot.setMyCommands([
    {command: '/start' , description: 'welcome, start session'},
    {command: '/info' , description: 'information about you'},
    {command: '/game' , description: 'fun game'}
  ])

  bot.on('message', async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;

    try {
      if (text === '/start') {
        await UserModel.create({ chatId })
        await bot.sendSticker(chatId, `https://tlgrm.eu/_/stickers/b0d/85f/b0d85fbf-de1b-4aaf-836c-1cddaa16e002/11.webp`)
        return bot.sendMessage(chatId, `WELCOME to the bot chat`);
      }

      if (text === '/info') {
        const user = await UserModel.findOne({ chatId })
        return bot.sendMessage(chatId, `your name ${msg.from.first_name} ${msg.from.last_name}, you have ${user.right} correct and ${user.wrong} wrong answer`);
      }
      if (text === '/game') {
        return startGame(chatId)
      }

      return bot.sendMessage(chatId, `you wrote me ${text}, I don't know this command`);

    } catch (e) {
      return bot.sendMessage(chatId, 'There is some error')
    }

  })

  bot.on('callback_query', async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;

    if (data === '/again') {
      return startGame(chatId)
    }
    const user = await UserModel.findOne({ chatId })
    if(data === chats[chatId] + '') {
      user.right += 1;
      await bot.sendMessage(chatId, `you guessed it right. The data is ${chats[chatId]}`, againOptions)
    } else {
      user.wrong += 1;
      await bot.sendMessage(chatId, `Sorry, you guessed wrong. The data is ${chats[chatId]}`, againOptions)
    }
    await user.save();
  })

}

await start();
