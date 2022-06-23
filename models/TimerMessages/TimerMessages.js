const mongoose = require('mongoose');

const Schema = mongoose.Schema({
    messageID: { type: String },
    guildID: { type: String }, 
    userID: { type: String, },
    sendCheck: { type: Boolean },
    title: { type: String },
    description: { type: String },
    imageUrl: { type: String },
    sendDate: { type: Date },
    timerTime: { type: String },
    channelID: { type: String }
})

module.exports = mongoose.model('timer-messages', Schema)