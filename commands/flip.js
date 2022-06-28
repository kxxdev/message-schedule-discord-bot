const { MessageEmbed } = require('discord.js');
const TimerMessagesController = require('../models/TimerMessages/TimerMessagesController');
const { colorEmbed } = require('../config');

const array = ['⚫ Орел', '⚪ Решка'];

module.exports = {
    name: 'flip',
    category: 'Пользовательские команды',
    description: 'Подброс монетки.',
    slash: true,
    callback: async ({ interaction }) => {
        const ran = array[Math.floor(Math.random() * array.length)];

        interaction.reply({
            embeds: [new MessageEmbed()
                .setColor(colorEmbed)
                .setDescription(`Монетка упала: **« ${ran} »**`)
            ]
        }).catch(error => console.log(error));
    }
};