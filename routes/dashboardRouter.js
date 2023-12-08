//importing modules
const express = require('express')
// const userController = require('../Controllers/userController')
// const { signup, login, allUser } = userController
// const userAuth = require('../middleware/userMiddleware')

const router = express.Router()

//view dashboard
router.get('/accueil', (req, res) => {
    res.render("dashboard/index")
})

//view dashboard
router.get('/analytics', (req, res) => {
    res.render("dashboard/analytics")
})

//view dashboard
router.get('/crm', (req, res) => {
    res.render("dashboard/crm")
})

//view dashboard
router.get('/e-commerce', (req, res) => {
    res.render("dashboard/e-commerce")
})

//view dashboard
router.get('/lms', (req, res) => {
    res.render("dashboard/lms")
})

//view dashboard
router.get('/project-management', (req, res) => {
    res.render("dashboard/project-management")
})

//view dashboard
router.get('/saas', (req, res) => {
    res.render("dashboard/saas")
})

//view dashboard
router.get('/support-desk', (req, res) => {
    res.render("dashboard/support-desk")
})


module.exports = router