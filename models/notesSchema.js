const mongoose = require('mongoose')
const notesSchema = new mongoose.Schema({
    title : String,
    subtitle : String,
    description : String
});

module.exports = mongoose.model('notes',notesSchema);
