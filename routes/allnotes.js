const express = require('express')
const router = express.Router()

const { NoteTaking } = require('../models')

// Get all notes from the database
router.get('/', async (req, res) => {
    try {
        const allNotes = await NoteTaking.find()
        // console.log(allNotes)
        return res.status(200).json(allNotes)
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' })
    }
})

// Create a new note
router.put('/', async (req, res) => {
    if (!req.body.notesubject || !req.body.notecontent || !req.body.noteauthor) {
        return res.status(400).send('Please fill in all fields')
    }
    const newNote = await NoteTaking.create({
        notesubject: req.body.notesubject,
        notecontent: req.body.notecontent,
        noteauthor: req.body.noteauthor
    })

    return res.status(201).json(newNote)
})


module.exports = router