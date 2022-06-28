const MessageNewController = require('../models/NewMessage/MessageNewController');
const moment = require('moment-timezone');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { colorEmbed } = require('../config');
const ms = require('ms');
const { addMinutes, addHours } = require('date-fns');

const pattern = /\p{Emoji}/u;

const convertMsToDays = (milliseconds) => {
    const days = parseInt(milliseconds / (1000 * 60 * 60 * 24));
    const hours = parseInt((milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = parseInt((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = (milliseconds % (1000 * 60)) / 1000;

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};

const convertDate = (date) => {

    const offSetMsc = moment.tz.zone("Europe/Moscow").utcOffset(date);
    const offSetServer = new Date().getTimezoneOffset();
    const offSet = offSetServer - offSetMsc;
    date = addMinutes(date, offSet);

    const day = date.getDate();
    let month = date.getMonth() + 1;
    const year = date.getFullYear();
    let hour = date.getHours();
    let minute = date.getMinutes();

    if (month < 10) {
        month = `0${month}`
    }
    if (hour < 10) {
        hour = `0${hour}`
    }
    if (minute < 10) {
        minute = `0${minute}`
    }

    return `${day}.${month}.${year} ${hour}:${minute}`;
};

module.exports = (client) => {
    client.on('messageCreate', async (message) => {
        const guildID = message.guild?.id;
        const userID = message.member?.id;
        const args = message.content.split(' ');
        let messageAnswer;
        let addStageCheck;
        const messageNew = await MessageNewController.findNewMessage({ guildID, userID });

        if (!messageNew) {
            return;
        }

        if (message.content?.toLowerCase() === 'отмена') {
            const replyCancelEmbed = await MessageNewController.deleteNewMessage({ guildID, userID });
            message.reply({ embeds: [replyCancelEmbed] }).catch(error => console.log(error));

            return;
        }

        const getEmoji = async (argument) => {
            const subStr = argument.substring(
                argument.indexOf(':') + 1,
                argument.lastIndexOf('>')
            );
            const emojiID = subStr.substring(
                subStr.indexOf(':') + 1
            );

            const emoji = await message.guild.emojis.cache.find(emoji => emoji.id === emojiID);
            if (emoji) {
                return argument;
            }

            return null;
        };

        const sendEndMessage = async () => {
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
                    new MessageButton()
                        .setCustomId(`reactions-${userID}`)
                        .setEmoji('👍')
                        .setLabel('Реакции')
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

            const createdNewMessage = await MessageNewController.findNewMessage({ guildID, userID })
            const reactions = createdNewMessage.reactions;
            const newMessageEmbed = new MessageEmbed().setColor(colorEmbed);
            const channel = message.guild.channels.cache.find(channel => channel.id === createdNewMessage.channelID);
            if (createdNewMessage.title != `none`) {
                newMessageEmbed.setTitle(createdNewMessage.title);
            }
            if (createdNewMessage.description != `none`) {
                newMessageEmbed.setDescription(createdNewMessage.description);
            }
            if (createdNewMessage.imageUrl != `none`) {
                newMessageEmbed.setImage(createdNewMessage.imageUrl);
            }

            await message.reply({
                embeds: [
                    newMessageEmbed,
                    new MessageEmbed()
                        .setColor(colorEmbed)
                        .setTitle('⬆ Ваше сообщение ⬆')
                        .setDescription(`Оно будет отправлено в канал ${channel} \`${convertDate(createdNewMessage.sendDate)}\`\nИнтервал: \`${convertMsToDays(messageNew.timerTime)}\`\nРеакции: ${reactions.join(', ')}`)
                ],
                components: [buttons1, buttons2, buttons3]
            }).catch(error => console.log(error));

            addStageCheck = await MessageNewController.addStage({ guildID, userID });
            if (addStageCheck) {
                message.reply({
                    embeds: [addStageCheck]
                }).catch(error => console.log(error));

                return;
            }
        };

        switch (messageNew.stage) {
            case 0:
                const title = message.content?.toLowerCase() === 'нет' ? 'none' : message.content;
                addStageCheck = await MessageNewController.addStage({ guildID, userID, title });
                if (addStageCheck) {
                    message.reply({
                        embeds: [addStageCheck]
                    }).catch(error => console.log(error));

                    return;
                }

                if (messageNew.editStage >= 0) {
                    await sendEndMessage();
                    return
                }

                messageAnswer = ['Напишите текст сообщения', 'Если вы не хотите указывать текст - напишите: "нет".']

                break;
            case 1:
                const description = message.content?.toLowerCase() === 'нет' ? 'none' : message.content;
                if (messageNew.title === 'none' && description === 'none') {
                    message.reply({
                        embeds: [new MessageEmbed()
                            .setColor('RED')
                            .setTitle('Ошибка!')
                            .setDescription('Нельзя отправлять пустые сообщения, обязательно должен быть указан заголовок и/или текст.')
                            .setFooter({ text: 'Для отмены создания сообщения напишите: "отмена".' })
                        ]
                    }).catch(error => console.log(error));
                    return;
                }
                addStageCheck = await MessageNewController.addStage({ guildID, userID, description });
                if (addStageCheck) {
                    message.reply({
                        embeds: [addStageCheck]
                    }).catch(error => console.log(error));

                    return;
                }

                if (messageNew.editStage >= 0) {
                    await sendEndMessage();
                    return
                }

                messageAnswer = ['Когда отправить первый раз?', 'Напишите дату и время (МСК) первой отправки в формате: ДД.ММ.ГГГГ ЧЧ:ММ\n Для отправки сообщения мнгновенно напишите: "сейчас" или старую дату.']

                break;
            case 2:
                const dateNowUtcMilliseconds = Date.now(Date.UTC());
                let sendDate = new Date(dateNowUtcMilliseconds);
                const offSet = moment.tz.zone("Europe/Moscow").utcOffset(sendDate);
                if (message.content.toLowerCase() === 'сейчас') {
                    sendDate = addMinutes(sendDate, offSet);
                } else {
                    const date = args[0]?.split('.');
                    date[1] -= 1;
                    const time = args[1]?.split(':');
                    if (!time || !date || !time[0] || !time[1]) {
                        message.reply({
                            embeds: [new MessageEmbed()
                                .setColor('RED')
                                .setTitle('Ошибка!')
                                .setDescription('Введена некоректная дата.')
                                .setFooter({ text: 'Для отмены создания сообщения напишите: "отмена".' })
                            ]
                        }).catch(error => console.log(error));
                        return;
                    }
                    if (time && time[0]?.split('')[0] == '0') {
                        time[0] = time[0].split('')[1];
                    }
                    if (time && time[1]?.split('')[0] == '0') {
                        time[1] = time[1].split('')[1];
                    }

                    sendDate = new Date(Date.UTC(date[2], date[1], date[0], time[0], time[1]));
                    sendDate = addMinutes(sendDate, offSet);
                    if ((sendDate.getFullYear() != date[2] && sendDate.getMonth() != date[1] && sendDate.getDate() != date[0]) || time[0] < 0 || time[1] < 0 || time[0] > 23 || time[1] > 59) {
                        message.reply({
                            embeds: [new MessageEmbed()
                                .setColor('RED')
                                .setTitle('Ошибка!')
                                .setDescription('Введена некоректная дата.')
                                .setFooter({ text: 'Для отмены создания сообщения напишите: "отмена".' })
                            ]
                        }).catch(error => console.log(error));
                        return;
                    }
                }

                addStageCheck = await MessageNewController.addStage({ guildID, userID, sendDate });
                if (addStageCheck) {
                    message.reply({
                        embeds: [addStageCheck]
                    }).catch(error => console.log(error));

                    return;
                }

                if (messageNew.editStage >= 0) {
                    await sendEndMessage();
                    return
                }

                messageAnswer = ['Как часто повторять?', 'Введите частоту повторения в формате: Числоd/h/m/s.\nНапример: \`5d 1h 30m\`\nДля разовой отправки напишите: "никогда".']

                break;
            case 3:
                if (!args[0]) {
                    message.reply({
                        embeds: [new MessageEmbed()
                            .setColor('RED')
                            .setTitle('Ошибка!')
                            .setDescription('Введено некоректное время.')
                        ]
                    }).catch(error => console.log(error));
                    return;
                }
                let timerTime = 0;
                if (args[0]?.toLowerCase() != 'никогда') {
                    for (let index = 0; index < args.length; index++) {
                        const ml = ms(args[index]);
                        if (ml) {
                            timerTime += ml;
                        }
                    }
                }

                if ((!timerTime || timerTime < 1000) && args[0]?.toLowerCase() != 'никогда') {
                    message.reply({
                        embeds: [new MessageEmbed()
                            .setColor('RED')
                            .setTitle('Ошибка!')
                            .setDescription('Слишком маленький интервал. Минимум 1 секунда.')
                            .setFooter({ text: 'Для отмены создания сообщения напишите: "отмена".' })

                        ]
                    }).catch(error => console.log(error));
                    return;
                }

                addStageCheck = await MessageNewController.addStage({ guildID, userID, timerTime });
                if (addStageCheck) {
                    message.reply({
                        embeds: [addStageCheck]
                    }).catch(error => console.log(error));

                    return;
                }

                if (messageNew.editStage >= 0) {
                    await sendEndMessage();
                    return
                }

                messageAnswer = ['Нужна картинка?', 'Отправьте изображение.\nДля пропуска изображения напишите: "нет".']
                break;
            case 4:
                const file = message.attachments.first()
                const imageUrl = message.content?.toLowerCase() === 'нет' ? 'none' : file?.url || undefined;
                if (!imageUrl) {
                    message.reply({
                        embeds: [new MessageEmbed()
                            .setColor('RED')
                            .setTitle('Ошибка!')
                            .setDescription('Вы не отправили изображение.')
                            .setFooter({ text: 'Для отмены создания сообщения напишите: "отмена".' })

                        ]
                    }).catch(error => console.log(error));
                    return;
                }
                addStageCheck = await MessageNewController.addStage({ guildID, userID, imageUrl });
                if (addStageCheck) {
                    message.reply({
                        embeds: [addStageCheck]
                    }).catch(error => console.log(error));

                    return;
                }

                if (messageNew.editStage >= 0) {
                    await sendEndMessage();
                    return
                }

                messageAnswer = ['Добавить реакции?', 'Пришлите смайлики одним сообщением разделяя их пробелом, для пропуска реакций отправьте любой текст.']
                break;
            case 5:
                const reactions = [];

                for (const arg of args) {
                    const match = pattern.test(arg) || await getEmoji(arg);
                    if (match != null) {
                        reactions.push(arg);
                    }
                }

                addStageCheck = await MessageNewController.addStage({ guildID, userID, reactions });
                if (addStageCheck) {
                    message.reply({
                        embeds: [addStageCheck]
                    }).catch(error => console.log(error));

                    return;
                }

                if (messageNew.editStage >= 0) {
                    await sendEndMessage();
                    return
                }

                messageAnswer = ['Куда отправить сообщение?', `Отметьте канал в который должно отправляться сообщение. Например: ${message.channel}\nУчтите, что при удалении канала - сообщение с таймером остается, но не будет никуда отправлено.`]
                break;
            case 6:
                const channel = message.mentions.channels.first();
                if (!channel) {
                    message.reply({
                        embeds: [new MessageEmbed()
                            .setColor('RED')
                            .setTitle('Ошибка!')
                            .setDescription('Вы не указали канал.')
                            .setFooter({ text: 'Для отмены создания сообщения напишите: "отмена".' })

                        ]
                    }).catch(error => console.log(error));
                    return;
                }
                const channelID = channel.id;

                addStageCheck = await MessageNewController.addStage({ guildID, userID, channelID });
                if (addStageCheck) {
                    message.reply({
                        embeds: [addStageCheck]
                    }).catch(error => console.log(error));

                    return;
                }

                await sendEndMessage();

                return;
            default:
                return;
        }

        if (messageAnswer) {
            message.reply({
                embeds: [new MessageEmbed()
                    .setColor(colorEmbed)
                    .setTitle(messageAnswer[0])
                    .setDescription(messageAnswer[1])
                    .setFooter({ text: 'Для отмены создания сообщения напишите: "отмена".' })
                ]
            }).catch(error => console.log(error));
        }
    });
};

module.exports.config = {
    displayName: 'newMessage',
    dbName: 'newMessage'
};