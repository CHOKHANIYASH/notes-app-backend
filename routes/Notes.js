const express = require('express')
const router = express.Router()
const Notes= require('../models/notesSchema')
const mongoose = require('mongoose')
const Users= require('../models/userSchema')
const {isLoggedIn} = require('../middleware')
const { Session } = require('express-session')

  router.get('/home',isLoggedIn ,async(req,res) => {
    const user = await Users.findOne({username:res.locals.currentUser.username}).populate('notes');
    const notes = user.notes
    const starred = user.starred
    res.send({notes:notes,starred:starred});
    })

  router.get('/:id/edit',async(req,res) => {
      const id= req.params.id
      const notes = await Notes.findById(id)
      res.send({notes:notes})
  })
  
  router.post('/new',isLoggedIn,async(req,res) => { 
      const newNote = new Notes(req.body.notes);
      const user = await Users.findOne({username:res.locals.currentUser.username}) 
      user.notes.push(newNote)
      await user.save()
      await  newNote.save()
      res.send(JSON.stringify({
        message:"Created a new Note"
      }))
  })
  
  
  router.get('/:id/home',isLoggedIn,async(req,res) => {
      const id= req.params.id
      const notes = await Notes.findById(id)
      res.send({notes:notes})
  })
  
  
  router.put('/:id/edit',isLoggedIn,async(req,res) => {
    const updateNote = await Notes.findByIdAndUpdate(req.params.id,{...req.body.notes}) ;
    res.send(JSON.stringify({
      message:"Edited the Note"
    }))
  })
  
  router.delete('/:id/delete',isLoggedIn,async(req,res) => {
      const id = req.params.id
      const user = await Users.findOne({username:res.locals.currentUser.username});
      await user.update({ $pull: { starred: id } });
      await user.update({ $pull: { notes: id } });
      user.save()
      await Notes.findByIdAndDelete(req.params.id)
      res.send(JSON.stringify({
       message:"Deleted the Note"
    }))
  })

  router.get('/starred',isLoggedIn,async(req,res)=>{
    const user = await Users.findOne({username:res.locals.currentUser.username}).populate('starred');
    const notes = user.starred
    res.send({starred:notes})
  })
  
  router.post('/:id/starred',isLoggedIn,async(req,res)=>{
    const id = req.params.id
    const user = await Users.findOne({username:res.locals.currentUser.username});
    const starred = user.starred
    if(!starred.includes(id)){
        user.starred.push(id)
        await user.save()
        }
    else{
    await user.update({ $pull: { starred: id } });
    await user.save()
    }
    const redirectUrl =req.query.url || '/notes/home'
    res.redirect(redirectUrl)
  })
module.exports = router