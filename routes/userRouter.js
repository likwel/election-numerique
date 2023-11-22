//importing modules
const express = require('express')
const userController = require('../Controllers/userController')
const { signup, login, allUser } = userController
const userAuth = require('../middleware/userMiddleware')

const router = express.Router()

//signup endpoint
//passing the middleware function to the signup
router.post('/signup', userAuth.saveUser, signup)

//login route
router.post('/login', login )

//view login
router.get('/login', (req, res) => {
    res.render("login")
})

//view register
router.get('/signup', (req, res) => {
    res.render("signup")
})
//get all users
router.get('/getAllUsers', allUser)

module.exports = router