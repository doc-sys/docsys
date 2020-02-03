const request = require('supertest')
const expect = require('chai').expect

let app = require('../app')

describe('The server', function() {
    before(function(done) {
        app.listen(function(err) {
            if(err) return done(err)
            done()
        })
    })

    it('should return NOT-AUTHORIZED when getting homepage', function(done) {
        request(app)
            .get('/')
            .expect(401, function(err, res) {
                if(err) return done(err)
                expect(res.header.path).to.equal('/user/login')
                done()
            })
    })

    it('should redirect to home when authorized', function(done) {
        request(app)
            .post('/user/login')
            .send({username: 'felix', password: 'test'})
            .expect(200, done)
    })
})