import {adminUserNames} from "../config/config";

export function isAdmin(userName: string) {
    return adminUserNames
        && adminUserNames.includes(userName)
}