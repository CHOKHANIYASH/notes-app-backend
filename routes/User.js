const express = require('express')
const router = express.Router()
const Users= require('../models/userSchema')
const mongoose = require('mongoose')
const passport = require('passport')

router.post('/register',async(req,res)=>{
    const {email,username,password,firstName,lastName} = req.body
    const newUser = new Users({email,username,firstName,lastName})
    const registeredUser = await Users.register(newUser,password)
    req.login(registeredUser,()=>{
        res.cookie('user',`${req.session.passport.user}` ,{ domain: process.env.CLIENT, path: '/', secure: true })   
        res.send({
            message:"Successfully Registered"
        })
    })
})

router.post('/login',passport.authenticate('local',{failureFlash:true}),(req,res)=>{
    res.cookie('user',`${req.session.passport.user}`,{ domain: process.env.CLIENT, path: '/' })
    res.send({
        message:"Welcome back🙂"
    })
})

router.get('/logout',(req,res)=>{
    req.logout(()=>{
        res.send({
            message:"Logged out"
        })
    })
})

module.exports = router