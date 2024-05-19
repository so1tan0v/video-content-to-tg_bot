import TelegramBot from "node-telegram-bot-api";
import {bot} from "../bot";
import {startCommand} from "../commands/start.command";
import {downloadCommand} from "../commands/download.command";
import {lastUpdateCommand} from "../commands/last-update.command";
import {updatesCommand} from "../commands/updates.command";
import {ALL_UPDATE_COMMAND, LAST_UPDATES_COMMAND, START_COMMAND} from "../config/config";
import {ChannelService} from "../services/channel.service";


export async function channelChatController(msg: TelegramBot.Message) {
    const text = msg.text;
    const chatId = msg?.chat?.id;

    if(!chatId)
        return;

    const channel = await ChannelService.getByChatId(chatId);
    if(!channel) {
        await ChannelService.create({
            chatId,
            roomName: msg.chat.title ?? 'Неопеределено'
        })
    }

    const firstPrefix = text?.split(' ')[0];
    switch (firstPrefix) {
        case START_COMMAND:
            await startCommand(chatId);
            return;
        case LAST_UPDATES_COMMAND:
            await lastUpdateCommand(chatId);
            return;
        case ALL_UPDATE_COMMAND:
            await updatesCommand(chatId);
            return;
        default:
            await downloadCommand(msg)
            return;
    }
}