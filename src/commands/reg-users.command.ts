import TelegramBot from "node-telegram-bot-api";
import {bot} from "../bot";
import {UsersService} from "../services/users.service";
import {isAdmin} from "../utils/helper";
import {it} from "node:test";

export async function regUsersCommand(msg: TelegramBot.Message) {
    const chatId = msg?.chat?.id;

    if (msg.from?.username
        && isAdmin(msg.from.username)
    ) {
        const allUsers = await UsersService.getAllUsers();
        let users: string[] = []
        allUsers.forEach(item => {
            users.push(
                `*Id чата*: ${item.chatId} ` +
                `*Пользователь*: ${item.username} ` +
                `*Фамилия*: ${item.lastName} ` +
                `*Имя*: ${item.firstName} `
            )
        });
        await bot.sendMessage(chatId, `*Пользователи:*\n\n${users.join(`\n`)}\n\n *Количество*: ${users.length}`, {parse_mode: 'Markdown'})
    } else {
        await bot.sendMessage(chatId, 'Эта команда не для вас.');
    }
}