
const dotenv = require("dotenv")
dotenv.config({path: './config.env'})

const express = require('express')
const path = require("path")
const mongoose = require('mongoose')
const multer = require('multer');
const exphbs = require('express-handlebars');
const app = express()

const cowboym = require('./models/cowboym')
const { Console } = require('console')
const { json } = require('body-parser')

const nodemailer = require('nodemailer')



const tempelatePath = path.join(__dirname, './views')
const publicPath = path.join(__dirname, './public')

const { MongoClient, ServerApiVersion } = require('mongodb');
const { connect } = require('http2')

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
  
  const upload = multer({ storage: storage });
  
  // Configure handlebars as the template engine
app.engine('hbs', exphbs.engine({ extname: 'hbs',
            defaultLayout: false,
            layoutsDir: "views/layouts/"
        }));

app.set('view engine', 'hbs')
app.set('views', tempelatePath)
app.use(express.static(publicPath))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))


const myemail = process.env.USEREMAIL
const mypass = process.env.PASSWORD

const url = process.env.MONGOURI

mongoose.connect(url)

const con = mongoose.connection

 global.Uemail = ""
 global.Vcode = ""
 global.pemail = ""


con.on('open', ()=>{
   console.log('connected ...') 
})

app.get('/signup', async(req, res) => {
    res.render('signup')
})
app.get('/', (req, res) => {
    res.render('login')
})
app.get('/forgotPassword', async(req, res) => {
    res.render('forgotPassword')
})
app.get('/resetPassword', async(req, res) => {
    res.render('resetPassword')
})


// router signup

app.post('/signup', async (req, res) => {

    const vEmail = req.body.email
    const vpass = req.body.password
    const vRpass = req.body.confirmPassword

    const data1 = req.body;
    console.log([data1])
    
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
        experience: req.body.experience,
        profEndingYear: req.body.profEndingYear,
        profilePicture: req.file.filename


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
        const check = await cowboym.findOne({ email: req.body.email }).lean()
        console.log({check})
        console.log(check.email)
        const name = check.firstName + " " + check.lastName
        
        console.log(name)

        if (check.password === req.body.password) {
            const email = req.body.email
            pemail = email
           // res.status(201).render("home", { Uname: name, title: title} );
            res.status(201).render("home", { user: check } )
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

const check = await cowboym.findOne({ email: Uemail }).lean()

try{

    const query = { email: Uemail }

    if (check.email === Uemail) {

        const updateHint = await cowboym.findOneAndUpdate(query, { $set: { hint: Vcode }}, {new: true, runValidators: true})

        try{
            // send email logic
        
            //let testAccount = await nodemailer.createTestAccount()
         
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
            res.send("User with Email " +  Uemail + "not found")
        }

    }else{
        res.send("User with Email " +  Uemail + "not found")

    }

        

   }catch{
    res.send("User with Email " +  Uemail + "not found")
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

    app.get('/upload/:email', async(req, res) => {
        pemail = req.params.email
   
       res.render('upload', { email: pemail})
     })
   
     app.get('/return/:email', async(req, res) => {
       pemail = req.params.email
       const check = await cowboym.findOne({ email: pemail }).lean()
       res.status(201).render("home", { user: check } )
   
      })
   
   
     // Handle the file upload
   app.post('/upload', upload.single('profilePicture'), async (req, res) => {
       const email  = pemail
       const check = await cowboym.findOne({ email: email }).lean()
   
       console.log("uploading picture for usewr data for email ")
       console.log(email)
       console.log({check})
     
       // Save the file name to the user in the database
       await cowboym.findOneAndUpdate(
           { email: email }, 
           {$set: { profilePicture: req.file.filename }}, 
           {new: true, runValidators: true})
   
           console.log("Picture Uploaded....")
   
           res.status(201).render("home", { user: check } )
      
     })
   
     // Display user profiles
   app.get('/cowboy', async (req, res) => {
       const email  = pemail
       const cowboy = await cowboym.findOne({ email: email }).lean()
       
       res.render('profile', { user: cowboy });
     });
   

    const port = process.env.PORT || 9000

app.listen(port, () =>{
    console.log('*********  server started **********')
})
