const express = require('express')
const router = express.Router()

const { NoteTaking } = require('../models')

// Get logged-in user's notes
router.get('/', async (req, res) => {
    if (req.isAuthenticated()) {
        try {
            const userNotes = await NoteTaking.find({ noteauthor: req.user.username })
            res.status(200).json(userNotes)
        } catch (error) {
            res.status(500).send('internal server error')
        }
    } else {
        res.status(401).send('Unauthorized')
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

// Update a note
router.patch('/:id', async (req, res) => {
    try {
        await NoteTaking.updateOne({
            _id: req.params.id
        },
            {
                notesubject: req.body.notesubject,
                notecontent: req.body.notecontent,
                noteauthor: req.body.noteauthor
            })

        const mynotes = await NoteTaking.findOne({ _id: req.params.id })
        if (!mynotes) {
            return res.status(404).json({ message: 'Note not found' })
        }
        return res.status(200).json(mynotes)
    }
    catch (error) {
        return res.status(400).send('error updating note:')
    }
})

// Delete a note
router.delete('/:id', async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ message: 'Please provide the note ID' })
    }
    await NoteTaking.deleteOne({
        _id: req.params.id
    })
    return res.status(200).json({ message: 'Note deleted successfully' })

})

module.exports = router