const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { permission } = require('../permissons');
const { colorEmbed } = require('../config');
const TimerMessagesController = require('../models/TimerMessages/TimerMessagesController');
const MessageNewController = require('../models/NewMessage/MessageNewController');

const convertMsToDays = (milliseconds) => {
    const days = parseInt(milliseconds / (1000 * 60 * 60 * 24));
    const hours = parseInt((milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = parseInt((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = (milliseconds % (1000 * 60)) / 1000;

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};

module.exports = {
    name: 'edit',
    category: 'Edit message',
    description: 'Edit messages',
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

        const messageID = args[0];
        const guildID = guild.id;
        const userID = member.id;
        const newMessageCheck = await MessageNewController.findNewMessage({ guildID, userID });
        if (newMessageCheck) {
            return;
        }
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

        const buttons1 = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId(`title-${userID}`)
                    .setEmoji('📌')
                    .setLabel('Заголовок')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId(`description-${userID}`)
                    .setEmoji('📝')
                    .setLabel('Описание')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId(`channel-${userID}`)
                    .setEmoji('📨')
                    .setLabel('Канал')
                    .setStyle('PRIMARY'),
            );

        const buttons2 = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId(`time-${userID}`)
                    .setEmoji('📅')
                    .setLabel('Дата отправки')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId(`interval-${userID}`)
                    .setEmoji('🔃')
                    .setLabel('Интервал')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId(`image-${userID}`)
                    .setEmoji('🌄')
                    .setLabel('Изображение')
                    .setStyle('PRIMARY'),
            );

        const buttons3 = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId(`accept-${userID}`)
                    .setEmoji('✅')
                    .setLabel('Принять')
                    .setStyle('SUCCESS'),
                new MessageButton()
                    .setCustomId(`cancel-${userID}`)
                    .setEmoji('✖')
                    .setLabel('Отмена')
                    .setStyle('DANGER'),
            );

        const newMessageEmbed = new MessageEmbed().setColor(colorEmbed);
        const channel = message.guild.channels.cache.find(channel => channel.id === timerMessage.channelID);
        if (timerMessage.title != `none`) {
            newMessageEmbed.setTitle(timerMessage.title);
        }
        if (timerMessage.description != `none`) {
            newMessageEmbed.setDescription(timerMessage.description);
        }
        if (timerMessage.imageUrl != `none`) {
            newMessageEmbed.setImage(timerMessage.imageUrl);
        }

        await message.reply({
            embeds: [
                newMessageEmbed,
                new MessageEmbed()
                    .setColor(colorEmbed)
                    .setTitle('⬆ Ваше сообщение ⬆')
                    .setDescription(`Оно будет отправлено в канал ${channel} \`${timerMessage.sendDate}\`\nИнтервал: \`${convertMsToDays(timerMessage.timerTime)}\``)
            ],
            components: [buttons1, buttons2, buttons3]
        }).catch(error => console.log(error));

        await MessageNewController.start({ guildID, userID });

        addStageCheck = await MessageNewController.addStage({
            guildID,
            userID,
            title: timerMessage.title,
            description: timerMessage.description,
            imageUrl: timerMessage.imageUrl,
            sendDate: timerMessage.sendDate,
            timerTime: timerMessage.timerTime,
            channelID: timerMessage.channelID,
            editMessageID: timerMessage.messageID,
            editStage: 7
        });
        if (addStageCheck) {
            message.reply({
                embeds: [addStageCheck]
            }).catch(error => console.log(error));

            return;
        }
    }
};