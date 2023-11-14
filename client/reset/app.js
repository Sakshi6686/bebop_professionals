
const dotenv = require("dotenv").config()

const express = require('express')
const path = require("path")
const mongoose = require('mongoose')
const app = express()

const cowboym = require('./models/cowboym')
const { Console } = require('console')
const { json } = require('body-parser')

const nodemailer = require('nodemailer')
//const exphbs = require('essexpr-handlebars')

app.use(express.json())

app.use(express.urlencoded({ extended: false }))

const tempelatePath = path.join(__dirname, './views')
const publicPath = path.join(__dirname, './public')

const { MongoClient, ServerApiVersion } = require('mongodb');
const { connect } = require('http2')
console.log(publicPath);

//app.engine('hbs', exphbs({ extname: 'hbs' }))
app.set('view engine', 'hbs')
app.set('views', tempelatePath)
app.use(express.static(publicPath))

//console.log(process.env.email)
//console.log(process.env.pass)




//const url = 'mongodb://localhost:27017/cowboy'

const pass = process.env.MONGOPASS

console.log(pass)



//const url = 'mongodb+srv://shreyarakesh009:process.env.MONGOPASS@cluster0.3lnzq8t.mongodb.net/cowboy'

//const url = process.env.uri



const url = 'mongodb+srv://shreyarakesh009:PPasworD010@cluster0.3lnzq8t.mongodb.net/cowboy'

mongoose.connect(url)
const con = mongoose.connection

 global.Uemail = ""
 global.Vcode = ""


con.on('open', ()=>{
   console.log('connected ...') 
})

app.get('/signup', (req, res) => {
    res.render('signup')
})
app.get('/', (req, res) => {
    res.render('login')
})
app.get('/forgotPassword', (req, res) => {
    res.render('forgotPassword')
})
app.get('/resetPassword', (req, res) => {
    res.render('resetPassword')
})


// router signup

app.post('/signup', async (req, res) => {

    const data = {
        name: "Rakesh",
        email: req.body.email,
        password: req.body.password,
        hint: "1234"
    }
    console.log([data])
    const checking = await cowboym.findOne({ name: req.body.name }).exec()
    if(checking.$isEmpty){
        console.log("checking is empty")
            res.send("checking is empty")

    }else{
        if (checking.name === req.body.name && checking.email===req.body.email) {
            console.log("user details already exists")
            res.send("user details already exists")
    
        }else{
            console.log("user details not  exists")
            res.send("user details not exists")
    
        }

    }
    
    

})


app.post('/signup', async (req, res) => {
    
    const data = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        hint: "1234"
   
    }

console.log(json(data))

const checking = await cowboym.findOne({ name: req.body.name })

console.log(json(checking))

try{
if (checking.name === req.body.name && checking.email===req.body.email) {
    console.log("user details already exists")
    res.send("user details already exists")
}
else{
    await cowboym.insertMany([data])
    console.log("user details nnot already exists")
    res.status(201).render("login", { Uemail: Uemail, Vcode: Vcode})
}
}
catch{
res.send("wrong inputs")
}

//res.status(201).render("login")
})


// router login

app.post('/login', async (req, res) => {

    

    try {
        const check = await cowboym.findOne({ email: req.body.email })

        if (check.password === req.body.password) {
            const username = req.body.email
            res.status(201).render("home", { 
                username: username
            } );
        }

        else {
            res.send("incorrect password")
        }
    } 
    
    catch (e) {

        res.send("wrong details") 
    }

})

// router Forgot password

app.post('/forgotPassword', async (req, res) => {

    Uemail = req.body.email

    //console.log(Uemail)
//const Udata = await cowboym.findOne({ email: Uemail })    
var randomstring = require("randomstring");
const rstr = randomstring.generate(7);
Vcode = rstr
//const checking = await cowboym.findOneAndUpdate({ email: req.body.email }, { $inc: { "hint" : rstr } })

try{

    const query = { email: Uemail }

    //console.log(query)

   // console.log(Vcode)

    //console.log(json(cowboym))

    const updateHint = await cowboym.findOneAndUpdate(query, { $set: { hint: Vcode }}, {new: true, runValidators: true})

   //console.log(updateHint)
     //const result = await cowboym.findOneAndUpdate({ email: req.body.email }, { $inc: { "name" : "Rakesh Kumar" } })
     //Console.log(result)
        

}catch{
    res.send("error in update")
}

try{
    // send email logic

      /** testing account */

         
    
    let testAccount = await nodemailer.createTestAccount()

  
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
       host: "smtp.ethereal.email",
        port: 587,
       secure: false, // true for 465, false for other ports
       //service: 'gmail',
        auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass // generated ethereal password
        },
        tls:{
            rejectUnauthorized:false
          }
    })

   

    let mailOptions = {
        from: 'admin@cowboy.com', // sender address
        to: Uemail, // list of receivers
        subject: "verification code for reset password", // Subject line
        text: "Varification code for your reset password reueset is " + Vcode, // plain text body
        html: "<b>Sarification code for your reset password reueset is.</b>", // html body
      }

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);   
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        res.status(201).render("resetPassword", { Uemail: Uemail, Vcode: Vcode})

        


      })
      
      
}catch{
    res.send("wrong inputs")
}


})

//const cowboyRouter = require('./routes/cowboy')
//app.use('/cowboy', cowboyRouter)

// router Reset Password

app.post('/resetPassword', async (req, res) => {
    
    console.log(Uemail)
    console.log(Vcode)
    const Bpass = req.body.password
    const BRpass = req.body.Rpassword
    const Bvcode = req.body.vcode
        
    
    //const checking = await cowboym.findOneAndUpdate({ email: req.body.email }, { $inc: { "hint" : rstr } })
    
    try{
        if (Bvcode === Vcode){
            if (Bpass === BRpass){
                const query = { email: Uemail }
                const updatePassword = await cowboym.findOneAndUpdate(query, { $set: { password: Bpass }}, {new: true, runValidators: true})
                res.status(201).render("login", { Uemail: Uemail, Vcode: Vcode})

            }else{

                res.send("Password doen't match.")
            }



        }else{
            res.send("Verification code doen't match.")
        }
        // send email logic
        
    
    }catch{
        res.send("wrong inputs")
    }
    
    
    })

app.listen(9000, () =>{
    console.log('*********  server started **********')
})
