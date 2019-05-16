const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')

describe('with existing USERS', () => {

  beforeEach(async () => {
    await User.deleteMany({})
    const userObjects = helper.initialHelperUsers.map(userData => new User(userData))
    const promiseArray = userObjects.map(user => user.save())
    await Promise.all(promiseArray)
  })

  it('displays correct user amount', async () => {
    const response = await api.get('/api/users')
    expect(response.body.length).toBe(helper.initialHelperUsers.length)
  })

  it('displays correct data from FETCHED DATA to INITIAL DATA', async () => {
    const response = await api.get('/api/users')
    const body = response.body

    const names = body.map(item => item.name)
    const emails = body.map(item => item.email)
    const numbers = body.map(item => item.number)

    expect(names).toContain(helper.initialHelperUsers[0].name)
    expect(names).toContain(helper.initialHelperUsers[1].name)

    expect(emails).toContain(helper.initialHelperUsers[0].email)
    expect(emails).toContain(helper.initialHelperUsers[1].email)

    expect(numbers).toContain(helper.initialHelperUsers[0].number)
    expect(numbers).toContain(helper.initialHelperUsers[1].number)

  })

  it('returns 500 status code if a non-existing user is fetched', async () => {
    const removedId = await helper.fakeId()
    // console.log('removed id', removedId)
    const response = await api.get(`/api/users/${removedId}`)
    expect(response.status).toBe(500)
  })

  it('fails to fetch a user with INVALID id', async () => {
    let badIdvalue = "5a3d5da59070081a82a3445"
    const response = await api
      .get(`/api/users/${badIdvalue}`)
      .expect(400)

    const message = response.body.error
    expect(message).toEqual('malformatted id')
  })

})


describe('addition of a new user', () => {

  beforeEach(async () => {
    await User.deleteMany({})


  })

  test('succeeds with valid data', async () => {
    const user = {
      name: "Ville Veiko",
      number: "052-1231231",
      email: "ville@kayttaja.fi",
      admin: false,
      password: "hdkjashdkjsadh"
    }

    await api
      .post('/api/users')
      .send(user)
      .expect(200)
    const usersInTheEnd = await helper.usersFromDb()

  })

  test('fails with invalid data', async () => {
    const newUser = {
      email: "email@email.com",
      admin: false,
      password: "moikka"
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

  })

  test('if multiple valid users are added, all are returned', async () => {
    let newUser = {
      name: "Ville Veiko",
      number: "052-1231231",
      email: "ville@kayttaja.fi",
      admin: false,
      password: "hdkjashdkjsadh"
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)

    newUser = {
      name: "Ville Matti",
      number: "052-1231231",
      email: "ville@kayttaja.fi",
      admin: false,
      password: "hdkjashdkjsadh"
    }

    await api
    .post('/api/users')
    .send(newUser)
    .expect(200)

    const response = await api.get('/api/users')

    expect(response.body.length).toBe(2)
  })

})



afterAll(() => {
  mongoose.connection.close()
})

