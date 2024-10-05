import TelegramApi from 'node-telegram-bot-api' ;

console.log(TelegramApi)
const token = '8065104727:AAGs5sZFJgY3g5BPaGiGEATJPVOqDX-sqGE'

const bot = new TelegramApi(token, {polling: true})

bot.on('message', async msg => {
  const text = msg.text;
  const chatId = msg.chat.id;
  if (text === '/start') {
    await bot.sendMessage(chatId, `WELCOME to the bot chat`);
  }
  if (text === '/info') {
    await bot.sendMessage(chatId, `you name ${msg.from.first_name} ${msg.from.last_name}`);
  }
  await bot.sendMessage(chatId, `you wrote me ${text}`);
})
