const mongoose = require('mongoose')

// Create noteSchema - data we are going to store in the database
const noteSchema = new mongoose.Schema({
    notesubject: {
        type: String,
        required: true
    },
    notecontent: {
        type: String,
        required: true
    },
    noteauthor: {
        type: String,
        required: true
    },
    datecreated: {
        type: Date,
        default: () => {
            const now = new Date();
            const options = {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,  // 24-hour format
                timeZone: 'America/Vancouver'  // Vancouver time
            };
            return new Intl.DateTimeFormat('en-CA', options).format(now)
        }
    }
}, {
    versionKey: false
})

// Create userSchema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    versionKey: false
})

const NoteTaking = mongoose.model('NoteTaking', noteSchema)
const User = mongoose.model('User', userSchema)

module.exports = { NoteTaking, User }