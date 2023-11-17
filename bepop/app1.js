
const dotenv = require("dotenv")
dotenv.config({path: './config.env'})

const express = require('express')
const path = require("path")
const mongoose = require('mongoose')
const app = express()

const cowboym = require('./models/cowboym')
const { Console } = require('console')
const { json } = require('body-parser')

const nodemailer = require('nodemailer')

app.use(express.json())

app.use(express.urlencoded({ extended: false }))

const tempelatePath = path.join(__dirname, './views')
const publicPath = path.join(__dirname, './public')

const { MongoClient, ServerApiVersion } = require('mongodb');
const { connect } = require('http2')
console.log(publicPath);

app.set('view engine', 'hbs')
app.set('views', tempelatePath)
app.use(express.static(publicPath))


const myemail = process.env.USEREMAIL
const mypass = process.env.PASSWORD

const mongouser = process.env.MONGOUSER
const mongopass = process.env.MONGOPASSWORD


const url = process.env.MONGOURI

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

    const vEmail = req.body.email
    const vpass = req.body.password
    const vRpass = req.body.confirmPassword

    const data = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        hint: "1234",    
        country: req.body.country,
        city: req.body.city,
        userType: req.body.userType,
        collegeName: req.body.collegeName,
        startingYear: req.body.startingYear,
        endingYear: req.body.endingYear,
        skills: req.body.skills,
        projects: req.body.projects,
        companyName: req.body.companyName,
        position: req.body.position,
        profStartingYear: req.body.profStartingYear,
        experience: req.body.experience

    }
    console.log([data])

    try{
        let findEmail = await cowboym.exists({email: req.body.email})

    if(findEmail){
        console.log("user details already exists")
        res.send("user with emailid " + vEmail + "is already exists")
        

    }else{
         
        if (vpass === vRpass){
            
            console.log("user details not  exists")
            await cowboym.insertMany([data])
            console.log("user details not already exists")
           
            res.status(201).render("login", { data: data})

        }else{

            res.send("Password doen't match.")
        }
     }

    }catch{
        res.send("Error in fetching data......")
    }

    
    //const checking = await cowboym.findOne({ name: req.body.name }).exec()

       
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

var randomstring = require("randomstring");
const rstr = randomstring.generate(7);
Vcode = rstr

try{

    const query = { email: Uemail }

        const updateHint = await cowboym.findOneAndUpdate(query, { $set: { hint: Vcode }}, {new: true, runValidators: true})

   }catch{
    res.send("error in update")
}

try{
    // send email logic

             
    
    let testAccount = await nodemailer.createTestAccount()

  
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
       //host: "smtp.ethereal.email",
       host: "smtp-mail.outlook.com",
        port: 587,
       secure: false, // true for 465, false for other ports
       //service: 'gmail',
        auth: {
            //user: testAccount.user, // generated ethereal user
            //pass: testAccount.pass // generated ethereal password
           
            user: myemail, // generated ethereal user
            pass: mypass // generated ethereal password
        },
        tls:{
            rejectUnauthorized:false
          }
    })

   

    let mailOptions = {
        from: 'cowboymnnit@outlook.com', // sender address
        to: Uemail, // list of receivers
        subject: "Verification code for your reset password", // Subject line
        text: "Verification code for your reset password request is . " + Vcode, // plain text body
        //html: "<b>Verification code for your reset password request is .</b>  ${Vcode}" // html body
        htmlContent : "<b>Verification code for your password reset is: ${verificationCode}</b>"
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


// router Reset Password

app.post('/resetPassword', async (req, res) => {
    
    console.log(Uemail)
    console.log(Vcode)
    const Bpass = req.body.password
    const BRpass = req.body.Rpassword
    const Bvcode = req.body.vcode
        
        
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
               
    
    }catch{
        res.send("wrong inputs")
    }
    
    
    })

    const port = process.env.PORT || 9000

app.listen(port, () =>{
    console.log('*********  server started **********')
})
