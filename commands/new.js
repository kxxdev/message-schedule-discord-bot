const { MessageEmbed } = require('discord.js');
const { permission } = require('../permissons');
const { colorEmbed } = require('../config');
const { start, findNewMessage } = require('../models/NewMessage/MessageNewController');

module.exports = {
    name: 'new',
    category: 'Create message',
    description: 'Create messages',
    callback: async ({ guild, message, member, channel }) => {
        if (!member.permissions.has(permission)) {
            message.reply({
                embeds: [new MessageEmbed()
                    .setColor(colorEmbed)
                    .setDescription('У вас недостаточно прав для использования этой команды.')
                ]
            }).catch(error => console.log(error));
            return;
        }

        const guildID = guild?.id;
        const userID = member?.id;

        const newMessage = await findNewMessage({ guildID, userID });
        if (newMessage) {
            return;
        }

        const replyEmbed = await start({ guildID, userID });

        message.reply({ embeds: [replyEmbed] }).catch(error => console.log(error));
    }
};