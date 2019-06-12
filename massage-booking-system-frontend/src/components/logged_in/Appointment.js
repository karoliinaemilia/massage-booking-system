import React, { useContext } from 'react'
import Display from './Display'
import CreateAppointment from './CreateAppointment'
import { AppointmentContext, UserContext } from '../../App'
import { OWN_APPOINTMENTS } from '../../types/logged_in'

const CreateAppointment = props => {
  const { id, start_date } = props
  const { user, users } = useContext(UserContext)
  const { appointments, appointmentService, setErrorMessage } = useContext(
    AppointmentContext
  )

  const handleAppointmentCreation = () => {
    // Using user found from original state as it updates on appointment updates
    const foundUser = user
    // const foundUser = users.find(u => user._id === u._id)
    let appointmentStartDate = appointments.find(app => app._id === id)
      .start_date
    console.log('voiko varata?', reservationRuleCheck(foundUser.appointments, appointmentStartDate))
    // console.log(
    //   'reservation rule check result ',
    //   reservationRuleCheck(foundUser.appointments, appointmentStartDate)
    // )
    // console.log('tämän hetkisen käyttäjän ajat ', foundUser.appointments)
    // console.log(
    //   'tietokannasta tämän hetkisen käyttäjän idllä haetun käyttäjän ajat ',
    //   foundUser.appointments
    // )
    if (reservationRuleCheck(foundUser.appointments, appointmentStartDate)) {
      let setMessage = setErrorMessage
      appointmentService.update(id, {
        type_of_reservation: 1,
        user_id: foundUser._id,
      })
      setMessage('Appointment reserved successfully')
      setTimeout(() => {
        setMessage(null)
      }, 8000)
    } else {
      window.alert('You have already booked an appointment this week')
    }
  }

  return (
    <button onClick={() => handleAppointmentCreation()}>
      <Display dateobject={start_date} />
    </button>
  )
}

const Appointments = props => {
  const { user, users } = useContext(UserContext)
  console.log('user', user)
  const { type } = props
  // console.log('type', type)
  if (type === OWN_APPOINTMENTS) {
    return <AppointmentsList />
  }
  return <AllAppointments />
}

const AllAppointments = () => {
  const { appointments, selectedDate } = useContext(AppointmentContext)
  const { users, user } = useContext(UserContext)
  const givenDate = new Date(selectedDate)
  let selectedDay = givenDate.getDate()
  let selectedMonth = givenDate.getMonth() + 1
  let selectedYear = givenDate.getFullYear()
  // console.log('appointments in allappointments', appointments)
  const allButOwnAppointments = appointments.filter(
    app => app.user_id !== user._id
  )
  // compares appointment time to selected date on calendar, filtering to only include selected days appointments
  const todaysAppointments = appointments.filter(appointment => {
    let appointmentsDate = new Date(appointment.start_date)
    let appointmentsDay = appointmentsDate.getDate()
    let appointmentsMonth = appointmentsDate.getMonth() + 1
    let appointmentsYear = appointmentsDate.getFullYear()

    return (
      appointmentsMonth === selectedMonth &&
      appointmentsDay === selectedDay &&
      appointmentsYear === selectedYear
    )
  })

  todaysAppointments.sort((a, b) => {
    let dateA = new Date(a.start_date)
    let dateB = new Date(b.start_date)

    if (dateA < dateB) {
      return -1
    }

    if (dateA > dateB) {
      return 1
    }

    return 0
  })

  return (
    <ul className="appointmentListWrapper">
      {todaysAppointments.map(app => {
        return (
          <Appointment
            key={app._id}
            id={app._id}
            start_date={app.start_date}
            type_of_reservation={app.type_of_reservation}
            appUser={users.find(u => u._id === app.user_id)}
          />
        )
      })}
    </ul>
  )
}

const AppointmentsList = () => {
  const { appointments } = useContext(AppointmentContext)
  const { user, users } = useContext(UserContext)
  //console.log("tämän hetkisen käyttäjän ajat ", user.appointments)
  const foundUser = users.find(u => user._id === u._id)
  //console.log("tietokannasta tämän hetkisen käyttäjän idllä haetun käyttäjän ajat ", foundUser.appointments)
  const ownAppointments = appointments.filter(
    app => app.user_id === foundUser._id
  )
  return (
    <ul className="appointmentListWrapper">
      {ownAppointments.map(app => {
        return (
          <Appointment
            key={app._id}
            id={app._id}
            start_date={app.start_date}
            type_of_reservation={app.type_of_reservation}
            appUser={foundUser}
          />
        )
      })}
    </ul>
  )
}

const Display = ({ dateobject, user, own }) => {
  let date = new Date(dateobject)

  let dateDisplay
  let day = date.getDate()
  let month = date.getMonth() + 1
  if (date.getDate() < 10) {
    day = `0${date.getDate()}`
  }
  if (date.getMonth() + 1 < 10) {
    month = `0${date.getMonth() + 1}`
  }

  if (own) {
    dateDisplay = `${day}.${month}.${date.getFullYear()}`
  }

  const userDisplay = user ? user.name : null

  if (date.getMinutes() < 10) {
    return (
      <h4>
        {dateDisplay} {`${date.getHours()}:0${date.getMinutes()}`} {userDisplay}{' '}
      </h4>
    )
  }
  return (
    <h4>
      {dateDisplay} {`${date.getHours()}:${date.getMinutes()}`} {userDisplay}
    </h4>
  )
}

const Appointment = props => {
  const { appointmentService } = useContext(AppointmentContext)
  const { user } = useContext(UserContext)
  const { id, start_date, type_of_reservation, appUser } = props

  return (
    <div>
      {type_of_reservation === 1 ? (
        appUser ? (
          user._id === appUser._id ? (
            <button
              id="reservedOwn"
              onClick={() =>
                appointmentService.update(id, {
                  type_of_reservation: 0,
                  user_id: user._id,
                })
              }
            >
              <Display dateobject={start_date} own={true} />
            </button>
          ) : (
            <button
              id="reserved"
              onClick={() => {
                window.alert('You cannot book this slot')
              }}
            >
              <Display dateobject={start_date} user={appUser} />
            </button>
          )
        ) : null
      ) : (
        <CreateAppointment id={id} start_date={start_date} />
      )}
    </div>
  )
}

export default Appointment
