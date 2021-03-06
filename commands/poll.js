const TimerMessagesController = require('../models/TimerMessages/TimerMessagesController');
const { permission } = require('../permissons');
const { MessageEmbed } = require('discord.js');
const { colorEmbed } = require('../config');

const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'];

module.exports = {
    name: 'poll',
    category: 'Голосования',
    ownerOnly: true,
    description: 'Создание быстрого голосования с вариантами ответа.',
    slash: true,
    options: [
        {
            name: 'вопрос',
            description: 'Вопрос для голосования',
            required: true,
            type: 'STRING'
        },
        {
            name: 'вариант1',
            description: 'Первый вариант ответа',
            required: false,
            type: 'STRING'
        },
        {
            name: 'вариант2',
            description: 'Второй вариант ответа',
            required: false,
            type: 'STRING'
        },
        {
            name: 'вариант3',
            description: 'Третий вариант ответа',
            required: false,
            type: 'STRING'
        },
        {
            name: 'вариант4',
            description: 'Четвертый вариант ответа',
            required: false,
            type: 'STRING'
        },
        {
            name: 'вариант5',
            description: 'Пятый вариант ответа',
            required: false,
            type: 'STRING'
        },
    ],
    callback: async ({ interaction }) => {
        const question = interaction?.options?._hoistedOptions?.find(option => option.name === 'вопрос')?.value || 'NaN';
        const options = interaction?.options?._hoistedOptions || [];
        options.shift();
        const variants = [];
        const reactions = [];

        for (let i = 0; i < options.length; i++) {
            variants.push(`${emojis[i]}) ${options[i].value}`);
        }

        interaction.channel.send({
            embeds: [new MessageEmbed()
                .setTitle('Голосование')
                .setColor(colorEmbed)
                .setDescription(`${question}\n${variants.join('\n')}`)
            ],
            ephemeral: true
        })
            .then((message) => {
                for (let i = 0; i < options.length; i++) {
                    message.react(emojis[i]).catch(error => console.log(error));
                }
            })
            .catch(error => console.log(error));

        interaction.reply({
            embeds: [new MessageEmbed()
                .setColor(colorEmbed)
                .setDescription('Голосование создано!')
            ],
            ephemeral: true
        }).catch(error => console.log(error));
    }
};