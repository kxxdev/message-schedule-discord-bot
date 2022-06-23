const { permission } = require('../permissons');

module.exports = {
    name: 'help',
    category: 'Help',
    description: 'Help',
    callback: ({ message, member, channel }) => {
        if (!member.permissions.has(permission)) {
            message.reply({
                embeds: [new MessageEmbed()
                    .setColor(colorEmbed)
                    .setDescription('У вас недостаточно прав для использования этой команды.')
                ]
            });
            return;
        }
    }
};