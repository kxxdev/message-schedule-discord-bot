const { permission } = require('../permissons');
const { colorEmbed } = require('../config');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'help',
    category: 'help message',
    ownerOnly: true,
    description: 'help messages',
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

        message.reply({
            embeds: [new MessageEmbed()
                .setColor(colorEmbed)
                .setTitle('Помощь по командам')
                .setDescription(`\`!new\ - Создать новое сообщение\`
\`!edit [ID сообщения]\` - Редактировать сообщение
\`!list\` - Посмотреть все сообщения
\`!delete [ID сообщения]\` - Удалить сообщения
\`/flip\` - Подбросить монетку
\`/poll\` - Создать быстрое голосование
\`/roll [Число]\` - Зарандомить случайное число
\`/yesornot\` - Быстрое голосование с вариантами ответа "Да" или "Нет"`)
            ]
        }).catch(error => console.log(error));

    }
};