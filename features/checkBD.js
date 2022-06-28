const NewMessageController = require('../models/NewMessage/MessageNewController');
const { isPast, addMinutes } = require('date-fns');

module.exports = async (client) => {
    setInterval(async () => {
        const newMessages = await NewMessageController.findAll();

        newMessages.forEach(newMessage => {
            if (isPast(addMinutes(newMessage.commandDate, 1))) {
                NewMessageController.deleteNewMessage({ guildID: newMessage.guildID, userID: newMessage.userID });
            }
        }).catch(error => console.log(error));
    }, 1000 * 60);
};

module.exports.config = {
    displayName: 'checkBD',
    dbName: 'checkBD'
};