const mongoose = require('mongoose')


const cowboySchema = new mongoose.Schema({

name: {
    type: String,
    required: true
},
email: {
    type: String,
    required: true
},
password: { 
    type: String,
    required: true
},
hint: {
    type: String,
    required: false
}


})

const cowboym = mongoose.model('cowboym', cowboySchema)
module.exports = cowboym