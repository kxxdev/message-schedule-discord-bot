const MessageNewController = require('../models/NewMessage/MessageNewController');
const TimerMessagesController = require('../models/TimerMessages/TimerMessagesController');
const { MessageEmbed } = require('discord.js');
const { colorEmbed } = require('../config');

module.exports = (client) => {
    client.on('interactionCreate', async (interaction) => {
        if (!interaction.isButton()) {
            return;
        }
        if (interaction.user.bot) {
            return;
        }

        const guildID = interaction.message.guild.id;
        const userID = interaction.user.id;
        const newMessage = await MessageNewController.findNewMessage({ guildID, userID });
        if (!newMessage || newMessage.stage < 7) {
            return;
        }
        let messageAnswer;
        let editStage;

        switch (interaction.customId) {
            case `title-${userID}`:
                messageAnswer = ['Напишите заголовок сообщения', 'Если вы не хотите указывать заголовок - напишите: "нет".']
                editStage = 0;
                break;
            case `description-${userID}`:
                messageAnswer = ['Напишите текст сообщения', 'Если вы не хотите указывать текст - напишите: "нет"']
                editStage = 1;
                break;
            case `time-${userID}`:
                messageAnswer = ['Когда отправить первый раз?', 'Напишите дату и время (МСК) первой отправки в формате: ДД.ММ.ГГГГ ЧЧ:ММ\n Для отправки сообщения мнгновенно напишите: "сейчас" или старую дату.']
                editStage = 2;
                break;
            case `interval-${userID}`:
                messageAnswer = ['Как часто повторять?', 'Введите частоту повторения в формате: Числоd/h/m/s.\nНапример: \`5d 1h 30m\`\nДля разовой отправки напишите: "никогда".']
                editStage = 3;
                break;
            case `image-${userID}`:
                messageAnswer = ['Нужна картинка?', 'Отправьте изображение.\nДля пропуска изображения напишите: "нет".']
                editStage = 4;
                break;
            case `channel-${userID}`:
                messageAnswer = ['Куда отправить сообщение?', `Отметьте канал в который должно отправляться сообщение.\nУчтите, что при удалении канала - сообщение с таймером остается, но не будет никуда отправлено.`]
                editStage = 5;
                break;
            case `accept-${userID}`:
                const acceptEmbed = await TimerMessagesController.create({ guildID, userID });
                await interaction.update({
                    embeds: [acceptEmbed],
                    components: []
                }).catch(error => console.log(error));

                return;
            case `cancel-${userID}`:
                const cancelEmbed = await MessageNewController.deleteNewMessage({ guildID, userID });
                await interaction.update({
                    embeds: [cancelEmbed],
                    components: []
                }).catch(error => console.log(error));

                return;
            default:
                return;
        };

        addStageCheck = await MessageNewController.addStage({ guildID, userID, editStage });
        if (addStageCheck) {
            message.reply({
                embeds: [addStageCheck]
            }).catch(error => console.log(error));

            return;
        }

        if (messageAnswer) {
            await interaction.update({
                embeds: [new MessageEmbed()
                    .setColor(colorEmbed)
                    .setTitle(messageAnswer[0])
                    .setDescription(messageAnswer[1])
                    .setFooter({ text: 'Для отмены создания сообщения напишите: "отмена".' })
                ],
                components: []
            }).catch(error => console.log(error));
        }
    });
};