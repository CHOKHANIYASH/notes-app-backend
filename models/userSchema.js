const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    username:{
        type:String,
        unique:true,
        partialFilterExpression: {username: {$type: "string"}},
        default:null
    },
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String
    },
    photos:{
        type:String,
    },
    notes:[
        {
            type : mongoose.Schema.Types.ObjectId,
            ref: 'notes'
        }
    ],
    starred:[
        {
            type : mongoose.Schema.Types.ObjectId,
            ref: 'notes'
        }
    ]
});

userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('users',userSchema);
