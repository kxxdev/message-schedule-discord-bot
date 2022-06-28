const { permission } = require('../permissons');
const moment = require('moment-timezone');
const TimerMessagesController = require('../models/TimerMessages/TimerMessagesController');
const { addMinutes, addHours } = require('date-fns');
const emojiRegex = require('emoji-regex');
const re = emojiRegex();


module.exports = {
    name: 'test',
    category: 'Test message',
    description: 'Test messages',
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
        const emojis = [];
        for (const arg of args) {
            const match = re.exec(arg) || await getEmoji(arg);

            if (match != null) {
                emojis.push(arg);
            }
        }


        message.channel.send('test')
            .then((message) => {
                for (let index = 0; index < emojis.length; index++) {
                    message.react(emojis[index]).catch(error => console.log(error));
                }
            }).catch(error => console.log(error));
    }
};