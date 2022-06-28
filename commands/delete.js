const { permission } = require('../permissons');
const TimerMessagesController = require('../models/TimerMessages/TimerMessagesController');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'delete',
    category: 'Delete message',
    description: 'Delete messages',
    callback: async ({ message, member, args, guild }) => {
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
        const messageID = args[0];
        const timerMessage = await TimerMessagesController.findOne({ guildID, messageID });
        if (!timerMessage) {
            message.reply({
                embeds: [new MessageEmbed()
                    .setColor('RED')
                    .setTitle('Ошибка!')
                    .setDescription('Сообщение с таким ID не найдено.')
                ]
            }).catch(error => console.log(error));
        }

        const deleteEmbed = await TimerMessagesController.deleteOne({ guildID, messageID });
        message.reply({ embeds: [deleteEmbed] }).catch(error => console.log(error));
    }
};