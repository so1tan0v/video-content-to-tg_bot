import {UsersService} from "../users/users.service";
import TelegramBot from "node-telegram-bot-api";
import {bot} from "../bot/bot";
import {start, stats} from "../bot/bot-callbacks.commands";
import {ContentService} from "../content/content.service";

export async function messageController(msg: TelegramBot.Message) {
    const text   = msg.text;
    const chatId = msg?.from?.id;
    const messageId = msg.message_id;

    if(!chatId)
        return;

    let user = await UsersService.getByChatId(chatId),
        userName = user?.data?.dataValues?.username ? user.data.dataValues.username : (msg?.chat?.username ?? 'НЕИЗВЕСТНЫЙ ПОЛЬЗОВАТЕЛЬ');

    if(!user) {
        await UsersService.create({
            chatId: chatId,
            username: msg.chat.username ?? 'Отсутствует',
            lastName: msg.chat.last_name ?? 'Отсутствует',
            firstName: msg.chat.first_name ?? 'Отсутствует',
        });
    }
    try {
        switch (text) {
            case '/start':
                await start(bot, chatId);
                return;
            case '/stats':
                await stats(bot, chatId);
                return;
            default:
                const allUsers = await UsersService.getAllUsers();
                let startMessage
                if(text && text.indexOf('http') === 0) {
                    startMessage = await bot.sendMessage(chatId, 'Начинаю скачивания видео...', {parse_mode: 'Markdown'});
                    let url = '';
                    let message = '';
                    text.split(' ').forEach((item, index) => {
                        if(index === 0)
                            url = item
                        else
                            message += ' ' + item
                    })
                    const downloadedVideo = await ContentService.getVideoFileByUrl(url);
                    if(downloadedVideo.success && downloadedVideo.file) {
                        for (let user of allUsers) {
                            const userChatId = user?.dataValues?.chatId;
                            if(userChatId) {
                                try {
                                    await bot.sendVideo(userChatId, downloadedVideo.file, {caption: `От пользователя @${userName} ${message ? `\n${message}` : ''}`})
                                } catch (e) {}
                            }
                        }
                        if(messageId) {
                            try {
                                await bot.deleteMessage(chatId, messageId)
                            } catch (e) {}
                        }
                    } else {
                        const defaultMessage = 'Ошибка при запросе видео. Скорее всего не получилось скачать видео, пиши @so1tan0v'
                        await bot.sendMessage(chatId, downloadedVideo.message ?? defaultMessage, {parse_mode: 'Markdown'});
                    }
                } else {
                    for (let user of allUsers) {
                        const userChatId = user?.dataValues?.chatId;
                        if(userChatId && +chatId !== +userChatId) {
                            await bot.sendMessage(userChatId, `*От пользователя @${userName}*: \n\n${text}`, {parse_mode: 'Markdown'});
                        }
                    }
                }
                if(startMessage && startMessage.message_id) {
                    try {
                        await bot.deleteMessage(chatId, startMessage.message_id)
                    } catch (e) {}
                }
                return;
        }
    } catch (e) {
        await bot.sendMessage(chatId, 'Произошел отвал, пиши @so1tan0v ``` ' + JSON.stringify(e) + ' ```', {parse_mode: 'Markdown'});
    }
}