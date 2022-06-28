const TimerMessagesController = require('../models/TimerMessages/TimerMessagesController');
const { permission } = require('../permissons');
const { MessageEmbed } = require('discord.js');
const { colorEmbed } = require('../config');

module.exports = {
    name: 'yesornot',
    category: 'Голосования',
    ownerOnly: true,
    description: 'Создание быстрого голосования с двумя вариантами ответа.',
    slash: true,
    options: [
        {
            name: 'текст',
            description: 'Текст голосования к которому добавяться реакции "Да" или "Нет"',
            required: true,
            type: 'STRING'
        },
    ],
    callback: async ({ interaction }) => {
        const param = interaction?.options?._hoistedOptions?.find(option => option.type === 'STRING')?.value || 'NaN';

        interaction.reply({
            embeds: [new MessageEmbed()
                .setColor(colorEmbed)
                .setDescription(param)
            ]
        })
            .then((message) => {
                message.react('👍');
                message.react('👎');
            })
            .catch(error => console.log(error));
    }
};