const path = require('path');
const { MessageEmbed } = require('discord.js');
const MessageNewService = require('./MessageNewService');

class MessageNewController {
    async start({ guildID, userID }) {
        try {
            const replyEmbed = await MessageNewService.start({ guildID, userID });
            return replyEmbed;
        } catch (error) {
            console.log(error);
            return new MessageEmbed()
                .setColor('RED')
                .setTitle('Ошибка')
                .setDescription(`Необработанное исключение: \`MessageNewController > start\`:
\`\`\`${error}\`\`\``)
                .setFooter({ text: 'Обратитесь к разработчику: kxx#6715 | Прикрепите скрин ошибки к сообщению.' });
        }
    }

    async findNewMessage({ guildID, userID }) {
        try {
            const newMessage = await MessageNewService.findNewMessage({ guildID, userID });
            return newMessage;
        } catch (error) {
            console.log(error);
        }
    }

    async findAll({ guildID }) {
        try {
            const newMessages = await MessageNewService.findAll({ guildID });
            return newMessages;
        } catch (error) {
            console.log(error);
        }
    }

    async deleteNewMessage({ guildID, userID }) {
        try {
            const replyEmbed = await MessageNewService.deleteNewMessage({ guildID, userID });
            return replyEmbed;
        } catch (error) {
            console.log(error);
            return new MessageEmbed()
                .setColor('RED')
                .setTitle('Ошибка')
                .setDescription(`Необработанное исключение: \`MessageNewController > deleteNewMessage\`:
\`\`\`${error}\`\`\``)
                .setFooter({ text: 'Обратитесь к разработчику: kxx#6715 | Прикрепите скрин ошибки к сообщению.' });
        }
    }

    async addStage({ guildID, userID, title, description, imageUrl, sendDate, timerTime, channelID, editStage, editMessageID, reactions }) {
        try {
            await MessageNewService.addStage({ guildID, userID, title, description, imageUrl, sendDate, timerTime, channelID, editStage, editMessageID, reactions });
            return false;
        } catch (error) {
            console.log(error);
            return new MessageEmbed()
                .setColor('RED')
                .setTitle('Ошибка')
                .setDescription(`Необработанное исключение: \`MessageNewController > addStage\`:
\`\`\`${error}\`\`\``)
                .setFooter({ text: 'Обратитесь к разработчику: kxx#6715 | Прикрепите скрин ошибки к сообщению.' });
        }
    }
}

module.exports = new MessageNewController();