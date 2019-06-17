import React from 'react'

const SimpleAppointment = ({ app }) => {
  const date = new Date(app.start_date)

  const weekdays = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
  }

  const months = {
    0: 'January',
    1: 'February',
    2: 'March',
    3: 'April',
    4: 'May',
    5: 'June',
    6: 'July',
    7: 'August',
    8: 'September',
    9: 'October',
    10: 'November',
    11: 'December',
  }

  return (
    <div className="nextappoitnment_wrapper">
      <p>
        Your next appointment is on {weekdays[date.getDay()]} {date.getDate()}th
        of {months[date.getMonth()]} {date.getHours()}:{date.getMinutes()}
      </p>
    </div>
  )
}

const NextAppointment = ({ user, appointments }) => {
  let ownAppointments = appointments.filter(app => app.user_id === user._id)

  ownAppointments.sort(function(a, b) {
    let dateA = new Date(a.start_date),
      dateB = new Date(b.start_date)
    return dateA - dateB
  })

  if (ownAppointments[0] === undefined) {
    return null
  }

  return <SimpleAppointment app={ownAppointments[0]} />
}

export default NextAppointment
