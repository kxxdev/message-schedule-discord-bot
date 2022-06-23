const { permission } = require('../permissons');
const moment = require('moment-timezone');
const TimerMessagesController = require('../models/TimerMessages/TimerMessagesController');
const { addMinutes, addHours } = require('date-fns');

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

        console.log(`Результат должен быть: 19:00`);
        console.log(`У екб: 16:00`)
        
        const dateNowUtcMl = Date.now(Date.UTC());
        const dateNowUtc = new Date(dateNowUtcMl);
        console.log('utc:', dateNowUtc);

        
        const mskOffSet = moment.tz.zone("Europe/Moscow").utcOffset(dateNowUtc);
        console.log('mskOffSet:', mskOffSet);
        const resDate = addMinutes(dateNowUtc, -mskOffSet);
        console.log('resDate:', resDate);

        
    }
};