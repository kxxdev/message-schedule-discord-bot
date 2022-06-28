const { MessageEmbed } = require('discord.js');
const { MessageButtonPages } = require("discord-button-page");
const { permission } = require('../permissons');
const { colorEmbed } = require('../config');
const TimerMessagesController = require('../models/TimerMessages/TimerMessagesController');

module.exports = {
    name: 'list',
    category: 'List messages',
    ownerOnly: true,
    description: 'List messages',
    callback: async ({ message, member, channel, guild }) => {
        if (!member.permissions.has(permission)) {
            message.reply({
                embeds: [new MessageEmbed()
                    .setColor(colorEmbed)
                    .setDescription('У вас недостаточно прав для использования этой команды.')
                ]
            });
            return;
        }

        const guildID = guild.id; 
        const allMessages = await TimerMessagesController.findAll({ guildID });
        if (!allMessages || allMessages.length === 0) {
            message.reply({
                embeds: [new MessageEmbed()
                    .setColor('RED')
                    .setTitle('Ошибка!')
                    .setDescription('На сервере нет ни одного созданного сообщения.')
                ]
            }).catch(error => console.log(error));
            return;
        }

        const embeds = [];
        let text = '';
        for (let i = 0; i < allMessages.length; i++) {
            text += `${allMessages[i]}\n`;
            if ((i + 1) % 5 === 0 && i + 1 < allMessages.length) {
                embeds.push(new MessageEmbed().setTitle('Сообщения на таймере').setDescription(text).setColor(colorEmbed));
                text = '';
            }
        }
        embeds.push(new MessageEmbed().setTitle('Сообщения на таймере').setDescription(text).setColor(colorEmbed));

        if (embeds.length < 2) {
            message.reply({ embeds }).catch(error => console.log(error));
            return;
        }

        const embedPages = new MessageButtonPages()
            .setEmbeds(embeds)
            .setChannel("CHANNEL")
            .setDuration(1000 * 60)

        embedPages.build(message);

        //message.reply({ embeds }).catch(error => console.log(error));
    }
};