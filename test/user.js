process.env.NODE_ENV = 'test'

// Libraries to be tested
let mongoose = require('mongoose')
let user = require('../models/user')
let server = require('../app')

// Libraries to test
let chai = require('chai')
let chaiHttp = require('chai-http')
let should = chai.should()

server.listen(process.env.PORT || 3001)
