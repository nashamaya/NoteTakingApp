const express = require('express')
const router = express.Router()

const { NoteTaking, User } = require('../models')

// Search route

router.get('/', async (req, res) => {
    // console.log('Search route was hit')
    const searchTerm = req.query.searchTerm || ''
    // console.log('searchTerm:', searchTerm)

    try {
        let dateCriteria = {}
        const yearOnlyRegex = /^\d{4}$/
        const yearMonthRegex = /^\d{4}-\d{2}$/

        if (yearOnlyRegex.test(searchTerm)) {
            const startDate = new Date(`${searchTerm}-01-01T00:00:00`)
            const endDate = new Date(`${searchTerm}-12-31T23:59:59`)
            dateCriteria = {
                datecreated: {
                    $gte: startDate,
                    $lt: endDate
                }
            }
        } else if (yearMonthRegex.test(searchTerm)) {
            const startDate = new Date(`${searchTerm}-01T00:00:00`)
            const endDate = new Date(`${searchTerm}-31T23:59:59`)
            dateCriteria = {
                datecreated: {
                    $gte: startDate,
                    $lt: endDate
                }
            }
        } const queryConditions = [
            { notesubject: { $regex: searchTerm, $options: 'i' } },
            { notecontent: { $regex: searchTerm, $options: 'i' } },
            { noteauthor: { $regex: searchTerm, $options: 'i' } }
        ]
        if (Object.keys(dateCriteria).length > 0) {
            queryConditions.push(dateCriteria);
        }

        const searchResults = await NoteTaking.find({
            $or: queryConditions
        })
        // console.log('searchResults:', searchResults)
        return res.status(200).json(searchResults)
    } catch (error) {
        console.error('Error fetching search results:', error)
        return res.status(500).json({ error: 'Internal Server Error' })
    }
})

module.exports = router