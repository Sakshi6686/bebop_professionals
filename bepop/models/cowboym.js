const mongoose = require('mongoose')


const cowboySchema = new mongoose.Schema({

firstName: {
    type: String,
    required: true
},
lastName: {
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
country: { 
    type: String,
    required: true
},
city: { 
    type: String,
    required: true
},
userType: { 
    type: String,
    required: false
},
collegeName: { 
    type: String,
    required: true
},
startingYear: { 
    type: String,
    required: false
},
endingYear: { 
    type: String,
    required: false
},
skills: { 
    type: String,
    required: false
},
projects: { 
    type: String,
    required: false
},
companyName: { 
    type: String,
    required: false
},
position: { 
    type: String,
    required: false
},
profStartingYear: { 
    type: String,
    required: false
},
profEndingYear: { 
    type: String,
    required: false
},
experience: { 
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