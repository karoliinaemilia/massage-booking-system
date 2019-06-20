const generator = require('./appointmentGenerator')
const Appointment = require('../models/appointment')
const User = require('../models/user')


/**
 *Removes appointment from user and removes user from appointment
 */
const removeAppointment = async (appointment) => {
  try {
    if (appointment.user_id !== null) {
      const user = await User.findById({ _id: appointment.user_id })
      const appointmentsToKeep = user.appointments.filter(function (appoint) {
        if (appointment._id.stringify !== appoint.stringify) {
          return appoint
        }
      })
      user.appointments = appointmentsToKeep
      await User.findByIdAndUpdate(user._id, user)
    }
    appointment.user_id = null
    appointment.type_of_reservation = 3

    await Appointment.findByIdAndUpdate(appointment._id, appointment)
  } catch (exception) {
    // console.log('E', exception)
  }
}
const removeTwoAppointments = async (date) => {
  const firstDate = new Date(date)
  console.log('DATE', firstDate)
  try {
    const firstAppointment = await Appointment.find({ start_date: firstDate })
    const secondDate = generator.increaseTime(5, new Date(firstAppointment.end_date))
    const secondAppointment = await Appointment.find({ start_date: secondDate })

    await removeAppointment(firstAppointment)
    await removeAppointment(secondAppointment)
  } catch (exception) {
    console.log('E', exception)
  }
}

const recoverTwoAppointments = async(date) => {
  const firstDate = new Date(date)
  console.log('DATE', firstDate)
  try {
    const firstAppointment = await Appointment.find({ start_date: firstDate })
    const secondDate = generator.increaseTime(5, new Date(firstAppointment.end_date))
    const secondAppointment = await Appointment.find({ start_date: secondDate })

    firstAppointment.type_of_reservation = 0
    secondAppointment.type_of_reservation = 0

    await Appointment.findByIdAndUpdate(firstAppointment._id, firstAppointment)
    await Appointment.findByIdAndUpdate(secondAppointment._id, secondAppointment)
  } catch (exception) {
    console.log('E', exception)
  }
}
const removeUserFromAppointment = async(appointment) => {
  try {
    appointment.user_id = null
    appointment.type_of_reservation = 0
    appointment = await Appointment.findByIdAndUpdate(appointment._id, appointment)
  } catch (exception) {
    console.log('E', exception)
  }
}

module.exports = { recoverTwoAppointments, removeTwoAppointments, removeAppointment, removeUserFromAppointment }