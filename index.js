const DiscordJS = require('discord.js');
const WOKCommands = require('wokcommands');
const path = require('path');
require('dotenv').config();

const { Intents } = DiscordJS;

const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS
    ],
});

client.on('ready', () => {
    new WOKCommands(client, {
        commandsDir: path.join(__dirname, 'commands'),
        featuresDir: path.join(__dirname, 'features'),
        disabledDefaultCommands: [
            'help',
            'command',
            'language',
            'prefix',
            'requiredrole',
            'channelonly'
        ],
        mongoUri: process.env.MONGO_URI,
    })
        .setDefaultPrefix('!');
});

client.login(process.env.TOKEN)