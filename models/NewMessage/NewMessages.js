const mongoose = require('mongoose');

const Schema = mongoose.Schema({
    messageID: { type: String },
    guildID: { type: String },
    userID: { type: String, },
    stage: { type: Number },
    title: { type: String },
    description: { type: String },
    imageUrl: { type: String },
    sendDate: { type: Date },
    timerTime: { type: String },
    channelID: { type: String },
    commandDate: { type: Date },
    editStage: { type: Number },
    editMessageID: { type: String },
})

module.exports = mongoose.model('new-messages', Schema)