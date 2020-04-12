/* eslint-disable no-undef */
process.env.NODE_ENV = 'test'

// Libraries to be tested
// let mongoose = require('mongoose')
let user = require('../models/user')
let server = require('../app')

// Libraries to test
let chai = require('chai')
let chaiHttp = require('chai-http')

// eslint-disable-next-line no-unused-vars
let should = chai.should()

chai.use(chaiHttp)

server.listen(process.env.PORT || 3001)

// Actual tests
describe('User', () => {
	before((done) => {
		user.deleteMany({}, () => {
			done()
		})
	})

	describe('/POST signup', () => {
		it('should not create a new user with invalid mail syntax', (done) => {
			let body = {
				username: 'test_user',
				password: 'test_password',
				mail: 'invalid',
				diplayName: 'Testi Test',
			}

			chai
				.request(server)
				.post('/user/signup')
				.send(body)
				.end((err, res) => {
					res.should.have.status(500)
					res.body.should.be.a('object')
					res.body.payload.should.have.a.property('message')
					res.body.payload.message.should.be.a('string')
					done()
				})
		})

		it('should create a new user with valid syntax', (done) => {
			let body = {
				username: 'test_user',
				password: 'test_password',
				mail: 'test@test.de',
				diplayName: 'Testi Test',
			}

			chai
				.request(server)
				.post('/user/signup')
				.send(body)
				.end((err, res) => {
					res.should.have.status(200)
					res.body.should.be.a('object')
					res.body.payload.should.have.a.property('user')
					res.body.payload.should.have.a.property('token')
					res.body.payload.user.should.be.a('object')
					res.body.payload.token.should.be.a('string')
					done()
				})
		})
	})

	describe('/POST signup with ID', () => {
		it('should refuse an invalid ID', (done) => {
			let id = 'totallywrongid'
			let body = {
				username: 'test_user',
				password: 'test_password',
				mail: 'test@test.de',
				diplayName: 'Testi Test',
			}

			chai
				.request(server)
				.post(`/user/signup/${id}`)
				.send(body)
				.end((err, res) => {
					res.should.have.status(200)
					// res.body.should.be.a('object')
					// res.body.payload.should.have.a.property('message')
					// res.body.payload.message.should.be.a('string')
					done()
				})
		})

		it('should refuse an invalid body', (done) => {
			let id = 'totallywrongid'
			let body = {
				username: 'test_user',
				diplayName: 'Testi Test',
			}

			chai
				.request(server)
				.post(`/user/signup/${id}`)
				.send(body)
				.end((err, res) => {
					res.should.have.status(200)
					// res.body.should.be.a('object')
					// res.body.payload.should.have.a.property('message')
					// res.body.payload.message.should.be.a('string')
					done()
				})
		})
	})

	describe('/POST login', () => {
		it('should not login without password or username', (done) => {
			let body = {
				username: 'test_user',
			}

			chai
				.request(server)
				.post('/user/login')
				.send(body)
				.end((err, res) => {
					res.should.have.status(401)
					res.body.should.be.a('object')
					res.body.payload.should.have.a.property('message')
					res.body.payload.message.should.be.a('string')
				})

			body = {
				password: 'test_password',
			}

			chai
				.request(server)
				.post('/user/login')
				.send(body)
				.end((err, res) => {
					res.should.have.status(401)
					res.body.should.be.a('object')
					res.body.payload.should.have.a.property('message')
					res.body.payload.message.should.be.a('string')
				})

			done()
		})

		it('should not login with wrong credentials', (done) => {
			body = { username: 'wrong_name', password: 'test_password' }

			chai
				.request(server)
				.post('/user/login')
				.send(body)
				.end((err, res) => {
					res.should.have.status(401)
					res.body.should.be.a('object')
					res.body.payload.should.have.a.property('message')
					res.body.payload.message.should.be.a('string')
					done()
				})
		})

		it('should login with correct credentials', (done) => {
			body = { username: 'test_user', password: 'test_password' }

			chai
				.request(server)
				.post('/user/login')
				.send(body)
				.end((err, res) => {
					res.should.have.status(200)
					res.body.should.be.a('object')
					res.body.payload.should.have.a.property('user')
					res.body.payload.should.have.a.property('token')
					res.body.payload.user.should.be.a('object')
					res.body.payload.token.should.be.a('string')
					done()
				})
		})
	})
})
