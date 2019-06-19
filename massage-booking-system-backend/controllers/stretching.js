const stretchingRouter = require('express').Router()
const bodyParser = require('body-parser')
stretchingRouter.use(bodyParser.json())
const Stretching = require('../models/stretching')

const formatStretchingSession = input => {
    return {
        _id: input._id,
        day: input.day,
        time: input.time,
        users: input.users
    }
}


stretchingRouter.get('/current', async (req, res, next) => {
    try {

        // Returns single stretching session by sorting with days
        const latesStretchingSession =
            await Stretching
                .find({})
                .populate('users')
                .sort({ day: -1 })
                .limit(1)

        res.send(latesStretchingSession.map(formatStretchingSession))

    } catch (exception) {
        next(exception)
    }

})

stretchingRouter.post('/current', async (req, res, next) => {
    try {
        const body = req.body

        const stretchingSession = new Stretching({
            day: body.day
        })

        const savedStretchingSession = await stretchingSession.save()
        res.json(savedStretchingSession.toJSON())
    } catch (exception) {
        next(exception)
    }
})

stretchingRouter.put('/current', async (req, res, next) => {
    try {
        // 1. Selvitä nykyinen käyttäjä
        // 2. Lisää käyttäjä mukaan viimeisimpään stretchingtapahtumaan
    } catch (exception) {
        next(exception)
    }
})





module.exports = stretchingRouter