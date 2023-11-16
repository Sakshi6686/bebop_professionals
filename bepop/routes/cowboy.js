const express = require('express')
const router = express.Router()
const cowboym = require('../models/cowboym')

router.get('/signup', (req, res) => {
    res.render('signup')
})
router.get('/', (req, res) => {
    res.render('login')
})
router.get('/forgotPassword', (req, res) => {
    res.render('forgotPassword')
})
router.get('/resetPassword', (req, res) => {
    res.render('resetPassword')
})

router.get('/', async(req,res) =>{
    console.log('#####  Get Request ##### ')
    try{
const cowboym = require('../models/cowboym')
        const cowboys = await cowboym.find()
        res.json(cowboys)

    }catch(err){
        res.send('Error ' + err)
    }
})

router.post('/', async(req,res) => {
     const cowboys = new cowboym({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        hint: req.body.hint
    })
    try{
        const cb1 = await cowboys.save()
        res.json(cb1)

    }catch(err){
        res.send("Error " + err)
    }


})

module.exports = router