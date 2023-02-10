const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
const userSchema = new mongoose.Schema({
    id:{
        type:Number,
        unique:true,
        partialFilterExpression: {id: {$type: "string"}}
    },
    email:{
        type:String,
        required:true,
        
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
