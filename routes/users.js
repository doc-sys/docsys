var express = require('express')
var router = express.Router()

var user = require('../models/user')

/* GET users listing. */
router.route('/login')
  .post(async (req, res) => {
    try {
      let result = await user.getAuthenticated(req.body.username, req.body.password)
      req.session.user = result
      req.session.isAuthenticated = true
      res.redirect('/documents')
    } catch (error) {
      req.flash('success', `Following error occured - ${error}`)
      res.redirect('/user/login')
    }
  })
  .get(async (req, res) => {
    if(req.session.isAuthenticated) {
      res.redirect('/documents')
    } else {
      res.render('login')
    }
  })

router.route('/signup')
  .get(async (req, res) => {
    if(req.session.isAuthenticated) {
      res.redirect('/documents')
    } else {
      res.render('signup')
    }
  })
  .post(async (req, res) => {
    let newUser = new user({
      username: req.body.username,
      password: req.body.password,
      mail: req.body.email
    })

    await newUser.save()
    req.session.user = newUser
    req.session.isAuthenticated = true

    res.redirect('/')
  })

router.get('/logout', async (req, res) => {
  await req.session.destroy()
  res.redirect('/')
})

module.exports = router
