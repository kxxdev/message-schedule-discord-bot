const TimerMessagesService = require('./TimerMessagesService');
const { MessageEmbed } = require('discord.js');
const { colorEmbed } = require('../../config');

class TimerMessagesController {
    async create({ guildID, userID }) {
        try {
            await TimerMessagesService.create({ guildID, userID });
            return new MessageEmbed()
                .setColor(colorEmbed)
                .setTitle('Сообщение создано!');
        } catch (error) {
            console.log(error);
            return new MessageEmbed()
                .setColor('RED')
                .setTitle('Ошибка')
                .setDescription(`Необработанное исключение: \`TimerMessagesController > create\`:
\`\`\`${error}\`\`\``)
                .setFooter({ text: 'Обратитесь к разработчику: kxx#6715 | Прикрепите скрин ошибки к сообщению.' });
        }
    }

    async findAll({ guildID }) {
        try {
            const result = await TimerMessagesService.findAll({ guildID });
            return result;
        } catch (error) {
            console.log(error);
        }
    }

    async findOne({ guildID, messageID }) {
        try {
            const result = await TimerMessagesService.findOne({ guildID, messageID });
            return result;
        } catch (error) {
            console.log(error);
        }
    }

    async deleteOne({ guildID, messageID }) {
        try {
            await TimerMessagesService.deleteOne({ guildID, messageID });
            return new MessageEmbed()
                .setColor(colorEmbed)
                .setTitle('Сообщение удалено!');
        } catch (error) {
            console.log(error);
            return new MessageEmbed()
                .setColor('RED')
                .setTitle('Ошибка')
                .setDescription(`Необработанное исключение: \`TimerMessagesController > deleteOne\`:
\`\`\`${error}\`\`\``)
                .setFooter({ text: 'Обратитесь к разработчику: kxx#6715 | Прикрепите скрин ошибки к сообщению.' });
        }
    }

    async findAllGuilds() { 
        try {
            const allGuilds = await TimerMessagesService.findAllGuilds();
            return allGuilds;
        } catch (error) {
            console.log(error);
        }
    }

    async edit({ guildID, messageID, sendCheck, sendDate }) {
        try {
            await TimerMessagesService.edit({ guildID, messageID, sendCheck, sendDate });
        } catch (error) {
            console.log(error => console.log(error));
        }
    }
};

module.exports = new TimerMessagesController();