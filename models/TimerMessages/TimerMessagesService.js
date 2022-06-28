const TimerMessages = require('./TimerMessages');
const moment = require('moment-timezone');
const NewMessagesController = require('../NewMessage/MessageNewController');
const { addMinutes, addHours } = require('date-fns');

function shorten(text, len) {
    if (typeof text !== "string") return "";
    if (text.length < len) return text;
    return text.substr(0, len).trim() + `..`;
}

const convertMsToDays = (milliseconds) => {
    const days = parseInt(milliseconds / (1000 * 60 * 60 * 24));
    const hours = parseInt((milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = parseInt((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = (milliseconds % (1000 * 60)) / 1000;

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};

const convertDate = (date) => {

    const offSetMsc = moment.tz.zone("Europe/Moscow").utcOffset(date);
    const offSetServer = new Date().getTimezoneOffset();
    const offSet = offSetServer - offSetMsc;
    date = addMinutes(date, offSet);

    const day = date.getDate();
    let month = date.getMonth() + 1;
    const year = date.getFullYear();
    let hour = date.getHours();
    let minute = date.getMinutes();

    if (month < 10) {
        month = `0${month}`
    }
    if (hour < 10) {
        hour = `0${hour}`
    }
    if (minute < 10) {
        minute = `0${minute}`
    }

    return `${day}.${month}.${year} ${hour}:${minute}`;
};

class TimerMessagesService {
    async create({ guildID, userID }) {
        const newMessage = await NewMessagesController.findNewMessage({ guildID, userID });
        if (!newMessage) {
            throw new Error('TimerMessagesService > create > Не найдено newMessage.');
        }

        const messageID = newMessage.messageID;
        const sendCheck = false;
        const title = newMessage.title;
        const description = newMessage.description;
        const imageUrl = newMessage.imageUrl;
        const sendDate = newMessage.sendDate;
        const timerTime = newMessage.timerTime;
        const channelID = newMessage.channelID;
        const editMessageID = newMessage.editMessageID;

        await TimerMessages.deleteOne({ guildID, messageID: editMessageID });

        await TimerMessages.create({
            messageID,
            guildID,
            userID,
            sendCheck,
            title,
            description,
            imageUrl,
            sendDate,
            timerTime,
            channelID,
        });

        await NewMessagesController.deleteNewMessage({ guildID, userID });
    }

    async findAll({ guildID }) {
        const allMessages = await TimerMessages.find({ guildID });

        const result = [];
        for (const message of allMessages) {
            const title = message.title != 'none' ? message.title : 'Без заголовка';
            const description = message.description != 'none' ? shorten(message.description, 15) : 'Без контента';
            const repeat = message.timerTime != '0' ? convertMsToDays(Number(message.timerTime)) : 'Без повторения';
            const sendDate = convertDate(message.sendDate);
            result.push(`\`${message.messageID}\` - <#${message.channelID}>\n"**${title}**"\n"*${description}*"\nПовторение каждые \`${repeat}\`\nСледующая отправка: \`${sendDate}\`\n`);
        }

        return result;
    }

    async findOne({ guildID, messageID }) {
        const message = await TimerMessages.findOne({ guildID, messageID });
        return message;
    }

    async deleteOne({ guildID, messageID }) {
        await TimerMessages.deleteOne({ guildID, messageID });
    }

    async findAllGuilds() { 
        const allGuilds = await TimerMessages.find();
        return allGuilds;
    }

    async edit({ guildID, messageID, sendCheck, sendDate }) {
        if (!guildID || !messageID) {
            throw new Error('Не указано guildID или messageID');
        }
        await TimerMessages.updateOne({ guildID, messageID }, { sendCheck, sendDate });
    }
};

module.exports = new TimerMessagesService();