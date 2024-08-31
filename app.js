
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const bodyParser = require('body-parser')

const { User } = require('./models')

const initializePassport = require('./passport-config')
initializePassport(
    passport,
    async username => await User.findOne({ username: username }),
    async id => await User.findById(id)
)

const app = express()

app.use(cors())
app.use(express.json())

app.use(express.static('frontend'))
app.use(express.urlencoded({ extended: true }))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 1 day i
        secure: false, 
        httpOnly: true, 
    }
}))
app.use(bodyParser.json())
app.use(passport.initialize())
app.use(passport.session())

// checking if user is authenticated
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}

// API routes
const allNotesRouter = require('./routes/allnotes')
const myNotesRouter = require('./routes/mynotes')
const userRouter = require('./routes/users')
const searchRouter = require('./routes/search')

app.use('/api/allnotes', checkAuthenticated, allNotesRouter)
app.use('/api/mynotes', checkAuthenticated, myNotesRouter)
app.use('/', userRouter)
app.use('/api/search', checkAuthenticated, searchRouter)

// PORT
const PORT = process.env.PORT || 3080
app.get('/config', (req, res) => {
    res.json({ apiUrl: process.env.API_URL || 'http://localhost:3080' });
})

// Start the server
const start = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/notetakingDB')

        app.listen(PORT, () => {
            console.log(`Notetaking app listening on port ${PORT}`)
        })

    } catch (error) {
        console.error('Error connecting to the database:',error)
    }
}

start()