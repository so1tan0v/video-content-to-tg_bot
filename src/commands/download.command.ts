import TelegramBot from "node-telegram-bot-api";
import {ContentService} from "../services/content.service";
import {bot} from "../bot";

export async function downloadCommand(msg: TelegramBot.Message, isLocal: boolean = false) {
    const textMessage = msg.text;
    if(!textMessage)
        return;

    const chatId = msg?.chat?.id;
    const userName = msg.from?.username ?? 'НЕИЗВЕСТНО'
    const messageId = msg.message_id;

    let url = '';
    let message = '';
    textMessage.split(' ').forEach((item, index) => {
        if(index === 0)
            url = item
        else
            message += ' ' + item
    })

    if(!ContentService.isUrl(url)) {
        return;
    }

    const startMessage = await bot.sendMessage(chatId, 'Начал скачивать видео...', {
        parse_mode: 'Markdown',
        disable_notification: true
    });
    const downloadedVideo = await ContentService.getVideoFileByUrl(url);
    if(downloadedVideo.success && downloadedVideo.file) {
        await bot.sendVideo(chatId, downloadedVideo.file, {caption: `От пользователя @${userName}${message ? `\n${message}` : ''}`})
        if (messageId) {
            try {
                await bot.deleteMessage(chatId, messageId)
            } catch (e) {
            }
        }
    }

    let messageFromDownload = downloadedVideo.message
    if(!downloadedVideo.success) {
        const defaultMessageOnError = 'Ошибка при запросе видео. Скорее всего не получилось скачать видео, пиши @so1tan0v';
        await bot.sendMessage(chatId, messageFromDownload ?? defaultMessageOnError, {parse_mode: 'Markdown'});
    } else if(messageFromDownload) {
        await bot.sendMessage(chatId, messageFromDownload, {parse_mode: 'Markdown'});
    }

    if(startMessage && startMessage.message_id) {
        try {
            await bot.deleteMessage(chatId, startMessage.message_id)
        } catch (e) {}
    }
}