if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate')
const NotesRoutes = require('./routes/Notes')
const UsersRoutes = require('./routes/User')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const localStrategy = require('passport-local')
const User = require('./models/userSchema')
const MongoDBStore = require('connect-mongo');
const { json } = require('express');
const cors = require("cors")
app.use(cors({
    origin:process.env.CLIENT,
    credentials:true,
}))

app.engine('ejs', ejsMate)

app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))

app.use(express.static(path.join(__dirname,'public')))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

const dbUrl = process.env.DB_URL 
// const dbUrl='mongodb://localhost:27017/to-do'
mongoose.connect(dbUrl).then(() =>{
    console.log('DATABASE CONNECTED')
})   
.catch ((e) =>{
    console.log(e)
})

const store = new MongoDBStore({
    mongoUrl:dbUrl,
    secret:"asdfghjkl",
    touchAfter:24*3600,
})

store.on("error",function(e){
    console.log("session store error",e)
})

const sessionConfig = {
    store,
    secret:"asdfghjklsss",
    resave:false,
    // saveUninitialized:true,   changed for multiple session issue
    saveUninitialized: false,
    cookie:{
        httpOnly:true,
        expires: Date.now() + 1000*60*60*24*7,
        maxAge:1000*60*60*24*7,
        
    }
}

app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next)=>{
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})
app.get('/',(req,res)=>{
  res.redirect('/notes/home')
})
app.use('/notes',NotesRoutes)
app.use('/',UsersRoutes)


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serving on port ${port}`)
})