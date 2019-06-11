const http = require('http')
const app = require('./app')
const config = require('./utils/config')
const server = http.createServer(app)
//const timer = require('./utils/timer')

//everyDay = every week at given times this method is scheduled to check the database and populate it with appointments when necissary
server.listen(config.PORT,  () => {
  //timer.everyDay(new Date)
  console.log(`Server running on port ${config.PORT}`)

})

