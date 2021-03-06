const TimerMessagesController = require('../models/TimerMessages/TimerMessagesController');
const { isPast, addMilliseconds } = require('date-fns');
const { MessageEmbed } = require('discord.js');
const { colorEmbed } = require('../config');

const createEmbed = (message) => {
    const embed = new MessageEmbed().setColor(colorEmbed);
    if (message.title != `none`) {
        embed.setTitle(message.title);
    }
    if (message.description != `none`) {
        embed.setDescription(message.description);
    }
    if (message.imageUrl != `none`) {
        embed.setImage(message.imageUrl);
    }

    return embed;
};

const sendMessage = (channel, embed, reactions) => {
    channel.send({
        embeds: [embed]
    })
        .then((message) => {
            for (let i = 0; i < reactions.length; i++) {
                message.react(reactions[i]).catch(error => console.log(error));
            }
        })
        .catch(error => console.log(error));
}

module.exports = async (client) => {
    setInterval(async () => {
        const allGuildsMessages = await TimerMessagesController.findAllGuilds();

        allGuildsMessages.forEach(async message => {
            const sendDateMsk = message.sendDate;
            if ((!message.sendCheck && isPast(sendDateMsk))
                || (isPast(sendDateMsk, Number(message.timerTime)))) {
                const guild = await client.guilds.cache.find(guild => guild.id === message.guildID);
                if (!guild) {
                    return;
                }
                const channel = await guild.channels.cache.find(channel => channel.id === message.channelID);
                if (!channel) {
                    return;
                }
                const reactions = message.reactions || []
                sendMessage(channel, createEmbed(message), reactions);

                if (message.timerTime == '0') {
                    await TimerMessagesController.deleteOne({ guildID: message.guildID, messageID: message.messageID });
                    return;
                }

                const sendDate = addMilliseconds(new Date(), Number(message.timerTime));
                const sendCheck = true;
                const guildID = message.guildID;
                const messageID = message.messageID;

                await TimerMessagesController.edit({
                    guildID,
                    messageID,
                    sendCheck,
                    sendDate
                });
                return;
            }
        });
    }, 1000 * 10);
};

module.exports.config = {
    displayName: 'sendMessages',
    dbName: 'sendMessages'
};