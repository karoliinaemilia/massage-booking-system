const jsonWebToken = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const express = require('express')
const bodyParser = require('body-parser')
const loginRouter = express.Router()
loginRouter.use(bodyParser.json())
const User = require('../models/user')


loginRouter.post('/', async (req, res, next) => {
  try {
    console.log('login called')
    /*
    Data from email and password fields
    */
    const body = req.body

    const foundUser = await User.findOne({ email: body.email }).populate(
      'appointments'
    )
    console.log('found user', foundUser)
    const pwMatch =
      foundUser === null
        ? false
        : await bcrypt.compare(body.password, foundUser.passwordHash)

    const invalidUserOrPw = !(foundUser && pwMatch)
    if (invalidUserOrPw) {
      return res.status(401).json({
        error: 'invalid email or password',
      })
    }

    const userCheckForTokenObject = {
      email: foundUser.email,
      name: foundUser.name,
      id: foundUser._id,
      admin: foundUser.admin,
    }

    const token = jsonWebToken.sign(userCheckForTokenObject, process.env.SECRET)

    res.status(200).send({
      token,
      _id: foundUser._id,
      email: foundUser.email,
      name: foundUser.name,
      admin: foundUser.admin,
      appointments: foundUser.appointments,
      number: foundUser.number,
    })
  } catch (exception) {
    next(exception)
  }
})

module.exports = loginRouter
