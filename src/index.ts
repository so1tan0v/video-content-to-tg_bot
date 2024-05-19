import dotenv from 'dotenv'
dotenv.config({
    path: process.env.NODE_ENV
        ? `.${process.env.NODE_ENV}.env`
        : '.env'
})

import {sequelize} from "./database/db";
import {botCommands, token} from "./config/config";
import {bot} from "./bot";
import TelegramBot from "node-telegram-bot-api";
import {channelChatController} from "./controllers/channel-chat.controller";
import {localChatController} from "./controllers/local-chat.controller";

const start = async () => {

    try {
        await sequelize.authenticate();
        await sequelize.sync();
    } catch (e) {
        throw e;
    }

    await bot.setMyCommands(botCommands);

    bot.on('message', async (msg: TelegramBot.Message) => {
        const chatId = msg.chat.id;

        try {
            if (msg.chat.type === 'private') {
                return localChatController(msg);
            } else if (msg.chat.type === 'group' || msg.chat.type === 'supergroup' || msg.chat.type === 'channel') {
                return channelChatController(msg)
            }
        } catch (e) {
            console.error(e)
            return bot.sendMessage(chatId, 'Произошел отвал, пиши @so1tan0v: ``` ' + JSON.stringify(e) + ' ```')
        }
    })
}

start().then(() => console.log('Server starting with token ', token));


