const express = require('express')
const Appointment = require('../models/appointment')
const appointmentsRouter = express.Router()
const bodyParser = require('body-parser')
appointmentsRouter.use(bodyParser.json())
const bcrypt = require('bcrypt')
const jsonWebToken = require('jsonwebtoken')
const User = require('../models/user')
const Masseusse = require('../models/masseusse')

const formatAppointment = (input) => {
  return {
    _id: input._id,
    masseusse_id: input.masseusse_id,
    user_id: input.user_id,
    start_date: input.start_date,
    end_date: input.end_date,
    type_of_reservation: input.type_of_reservation
  }
}

appointmentsRouter.get('/', async (req, res, next) => {
  try {
    const appointments = await Appointment.find({})
    res.json(appointments.map(formatAppointment))
  } catch (exception) {
    next(exception)
  }
})

appointmentsRouter.get('/:id', async (req, res, next) => {
  try {
    // console.log('req params id', req.params.id)
    const appointment = await Appointment.findById({ _id: req.params.id })
    // console.log('appointment', appointment)
    res.json(appointment)
  } catch (exception) {
    next(exception)
  }
})

appointmentsRouter.post('/', async (req, res, next) => {
  try {

    const body = req.body
    const user = await User.findById(body.user_id)

    // TODO -- ADD Own appointments for Masseusse as well??
    // TODO -- ADD Own appointments for Masseusse as well??
    // TODO -- ADD Own appointments for Masseusse as well??
    const masseusse = await Masseusse.findById(body.masseusse_id)

    // No error is given if either of searched items is null. 
    // Have to create an explicit if-statement
    if (!(user && masseusse)) {
      res.status(400).end()
      return
    }

    const appointment = new Appointment({
      masseusse_id: body.masseusse_id,
      user_id: body.user_id,
    })

    try {
      // Create appointment
      const savedAppointment = await appointment.save()
      user.appointments = user.appointments.concat(savedAppointment._id)
      // Add previously created appointment to user as well
      await user.save()
      res.json(savedAppointment)
    } catch (exception) {
      next(exception)
    }
  } catch (exception) {
    next(exception)
  }

})

appointmentsRouter.put('/:id', async (req, res, next) => {
  try {
    const body = req.body
    const appointment = {
      user_id: body.user_id || null,
      type_of_reservation: body.type_of_reservation
    }
    const updatedAppointment = await Appointment.findByIdAndUpdate(req.params.id, appointment, { new: true })
    res.json(updatedAppointment)
  } catch (exception) {
    next(exception)
  }

})

appointmentsRouter.delete('/:id', async (req, res, next) => {
  try {
    const appointment = await Appointment.findById({ _id: req.params.id })
    await appointment.remove()
    res.status(204).end()
  } catch (exception) {
    next(exception)
  }

})

module.exports = appointmentsRouter