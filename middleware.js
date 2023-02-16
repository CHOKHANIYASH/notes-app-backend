module.exports.isLoggedIn = (req,res,next) =>{
    if(!req.isAuthenticated()){
        req.flash('error','you must sign in first')
        return res.send('Not logged in')
     }
     next()
}
