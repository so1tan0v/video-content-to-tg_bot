import { adminUserNames } from '../config/config';export function isAdmin(userName: string) {    return adminUserNames && adminUserNames.includes(userName);}export function getFileSizeToRead(size: number): string {    const result = `${size} Б`;    if (size <= 1024) return `${size.toFixed(2)} Б`;    size = size / 1024;    if (size <= 1024) return `${size.toFixed(2)} КБ`;    size = size / 1024;    if (size <= 1024) return `${size.toFixed(2)} МБ`;    size = size / 1024;    if (size <= 1024) return `${size.toFixed(2)} ГБ`;    size = size / 1024;    if (size <= 1024) return `${size.toFixed(2)} ТБ`;    size = size / 1024;    if (size <= 1024) return `${size.toFixed(2)} ПБ`;    return result;}// export function validateMarkdown(text: string) {//     const markdownSymbols = ['*', '_', '[', ']', '(', ')'];//     for (const symbol of markdownSymbols) {//         const count = (text.match(new RegExp(`\\${symbol}`, 'g')) || []).length;//         if (count % 2 !== 0) {//             return false;//         }//     }//     return true;// }