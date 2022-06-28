const NewMessages = require('./NewMessages');
const TimerMessages = require('../TimerMessages/TimerMessages');
const { colorEmbed } = require('../../config');
const { MessageEmbed } = require('discord.js');

class MessageNewService {
    async start({ guildID, userID }) {
        if (!guildID || !userID) {
            throw new Error('MessageNewService > start > Не переданы значения userID и/или guildID');
        }

        const allNewMessages = await NewMessages.find({ guildID });
        const allTimerMessages = await TimerMessages.find({ guildID });
        let messageID = allNewMessages.length + allTimerMessages.length;
        let idCheck = true;
        while (idCheck) {
            const checkNewMessage = await TimerMessages.findOne({ messageID });
            if (checkNewMessage) {
                messageID = allNewMessages.length + allTimerMessages.length + Math.floor(Math.random() * 1000);
            }
            else {
                idCheck = false;
            }
        }
        const commandDate = new Date();
        const stage = 0;

        await NewMessages.create({
            messageID,
            guildID,
            userID,
            commandDate,
            stage
        });

        return new MessageEmbed()
            .setColor(colorEmbed)
            .setTitle('Напишите заголовок сообщения')
            .setDescription(`Если вы не хотите указывать заголовок - напишите: "нет".`)
            .setFooter({ text: 'Для отмены создания сообщения напишите: "отмена".' });

    }

    async findNewMessage({ guildID, userID }) {
        const newMessage = await NewMessages.findOne({ guildID, userID });

        return newMessage;
    }

    async deleteNewMessage({ guildID, userID }) {
        await NewMessages.deleteOne({ guildID, userID });

        return new MessageEmbed()
            .setColor(colorEmbed)
            .setDescription(`Вы отменили создание сообщения.`)
    }

    async addStage({ guildID, userID, title, description, imageUrl, sendDate, timerTime, channelID, editStage, editMessageID, reactions }) {
        const newMessage = await this.findNewMessage({ guildID, userID });

        let stage = ++newMessage.stage;

        if (editStage >= 0) {
            stage = editStage;
        }
        else if (newMessage.editStage >= 0) {
            stage = 8;
            editStage = -1;
        }
        const commandDate = new Date();

        await NewMessages.updateOne({ guildID, userID }, { title, description, imageUrl, sendDate, timerTime, channelID, stage, commandDate, editStage, editMessageID, reactions });
    }
}

module.exports = new MessageNewService();