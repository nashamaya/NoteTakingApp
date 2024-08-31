const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const passport = require('passport')

const { User } = require('../models')

// Login page
router.post('/login', async (req, res, next) => {
    passport.authenticate('local', (error, user, info) => {
        if (error) return next(error)
        if (!user) {
            return res.status(401).json({ error: info.message })
        }
        req.logIn(user, (error) => {
            if (error) return next(error)
            return res.status(200).json({ redirectUrl: '/dashboard' })
        })
    })(req, res, next)
})

// Register new users
router.post('/register', async (req, res) => {

    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
    res.setHeader('Pragma', 'no-cache')
    res.setHeader('Expires', '0')

    try {
        const { username, password } = req.body
        if (!username || !password) {
            return res.status(400).json({ message: 'Please provide username and password' })
        }
        const existingUser = await User.findOne({ username })
        console.log(existingUser)
        if (existingUser) {
            return res.status(409).json({ message: 'username and password already exist' })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new User({
            username: username,
            password: hashedPassword
        })

        await newUser.save()
        console.log(newUser)

        //  Automatically log the user in after registration
        req.logIn(newUser, (error) => {
            if (error) return next(error)
            return res.redirect('/login')
        })

    } catch (error) {
        console.error('Error creating user:', error)
        res.status(500).json({ message: 'Error creating user' })
    }
})

// Logout page
router.post('/logout', (req, res) => {
    req.logOut(error => {
        if (error) return next(error)
        res.redirect('/login')
    })
})

// Get User Data
router.get('/userdata', async (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ username: req.user.username })
    } else {
        res.status(401).json({ error: 'Unauthorized' })
    }
})

module.exports = router