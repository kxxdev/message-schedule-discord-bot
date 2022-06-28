const TimerMessagesController = require('../models/TimerMessages/TimerMessagesController');
const { MessageEmbed } = require('discord.js');
const { colorEmbed } = require('../config');

module.exports = {
    name: 'roll',
    category: 'Пользовательские команды',
    description: 'Генерирует случайно число от 0 до введенного значения.',
    slash: true,
    options: [
        {
            name: 'число',
            description: 'До какого числа рандомить',
            required: true,
            type: 'NUMBER'
        },
    ],
    callback: async ({ interaction }) => {
        const param = interaction?.options?._hoistedOptions?.find(option => option.type === 'NUMBER')?.value || 100;

        if (isNaN(param) || param < 1 || param > 1000000000) {
            interaction.reply({
                embeds: [new MessageEmbed()
                    .setColor('RED')
                    .setDescription('Необходимо написать число от 1 до 1.000.000.000')
                ]
            }).catch(error => console.log(error));
        }

        const ran = Math.floor(Math.random() * param);

        interaction.reply({
            embeds: [new MessageEmbed()
                .setColor(colorEmbed)
                .setDescription(`Случайное число: **${ran}**`)
            ]
        })
    }
};