import 'reflect-metadata'

import * as bodyParser from 'body-parser'
import * as express from 'express'
import * as logger from 'morgan'
import * as path from 'path'
import * as session from 'express-session'
import * as store from 'express-mysql-session'

import { createConnection } from 'typeorm'
import router from './router'

createConnection()
  .then(async connection => {
    console.log('Successfully connected to MySQL')
    // create express app
    const app = express()
    const MySQLStore = store(session)
    const sessionStore = new MySQLStore({
      user: 'root',
      database: 'pe2_ttn',
      password: 'admin',
    })
    app.use(
      session({
        secret: 'random secret',
        store: sessionStore,
        resave: false,
        saveUninitialized: false,
      })
    )
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))

    app.use(logger('dev'))

    app.use('/api', router)

    app.use('/', express.static(path.join(__dirname, 'build')))

    const port = process.env.PORT || 3001
    app.listen(port, () => {
      console.log(`Server listening to port: ${port}`)
    })
  })
  .catch(error => console.log(error))
