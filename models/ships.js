const mongoose = require('mongoose')


const shipSchema = mongoose.Schema({
    name: {type: String, required: true},
    id: {type: Number, required:true},
    nation: {type: String, required:true},
    tier: {type: String, required:true},
    type:{type:String, required:true}





})







module.exports = mongoose.model('ship',shipSchema)
