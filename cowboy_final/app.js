
const dotenv = require("dotenv")
dotenv.config({path: './config.env'})

const express = require('express')
const path = require("path")
const mongoose = require('mongoose')
const multer = require('multer');
const exphbs = require('express-handlebars');
const app = express()

const cowboym = require('./models/cowboym')
const postModel = require('./models/post')
const { Console } = require('console')
const { json } = require('body-parser')

const nodemailer = require('nodemailer')



const tempelatePath = path.join(__dirname, './views')
const publicPath = path.join(__dirname, './public')

const { MongoClient, ServerApiVersion } = require('mongodb');
const { connect } = require('http2')




//Configure multer for file uploads
const storage = multer.diskStorage({
   destination: './public/uploads/',
   filename: (req, file, cb) =>{
     cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
   }
  })
  
  const upload = multer({ storage: storage })

  
  
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
 global.loginEmail = ""
 global.userData = ""

 


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

async function  loadPost(req, res){
    const allPost = await postModel.find().sort({postCreationDateTime: -1})
    let postArray = []

    for (let i = 0; i < allPost.length; i++) {
        const post = allPost[i];
        const postEmail = post.postCreatorEmail
        const postUserData = await cowboym.findOne({ email: postEmail }).lean()
        const datNow = Date.now()
        const postCrDate = post.postCreationDateTime
        const dateDiff = datNow - postCrDate
        
        let duration = Math.round(dateDiff / (60*1000)) + " minute"

        if(dateDiff < 1000){
            duration = dateDiff + " milliseconds"
        }
        else if(dateDiff > 1000 & dateDiff <= (60*1000)){
            duration = Math.round(dateDiff / 1000) + " seconds"
        }
        else if(dateDiff > (60*1000) & dateDiff <= (3600*1000)){
                    duration = Math.round(dateDiff / (60*1000)) + " minute"
        }
        else if(dateDiff > (3600*1000) & dateDiff <= (1000 * 3600 * 24)){
            duration = Math.round(dateDiff / (3600*1000)) + " hour"
        
        }
        else if(dateDiff > (1000 * 3600 * 24) & dateDiff <= (1000 * 3600 * 24 * 30)){
            duration = Math.round(dateDiff / (1000 * 3600 * 24)) + " day"
        
        }
        else{
            duration = Math.round(dateDiff / (1000 * 3600 * 24 * 30 )) + " month" 
               
        }

        console.log(duration)

        const post_user_data = {
            postContent: post.postContent,
            postImage: post.postImage,
            postCreatorFisrName: postUserData.firstName,
            postCreatorLastName: postUserData.lastName,
            postCreatorCompany: postUserData.companyName,
            postCreatorPosition: postUserData.position,
            postCreatorProfilePicture: postUserData.profilePicture,
            postCreationDateTime: duration,
            postLikeCount: post.postLikeCount
            
        } 
        postArray.push(post_user_data)          
                
     }   // For loop close here
     
     return postArray
} // loadPost method close here


// router signup

app.post('/signup', upload.single('profilePicture'), async (req, res) => {

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
        hint: "12345",    
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
            loginEmail = email
            userData = check
            
            let postArray = await loadPost(req, res)

            console.log(postArray)

           // res.status(201).render("home", { Uname: name, title: title} );
            //res.status(201).render("home", { user: userData } )
            res.status(201).render("home", { user: userData, post: postArray} )
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
// Create post with image createPostWithImage

app.get('/createPostWithImage', async(req, res) => {
    

   res.render('createPostWithImage')
 })


 app.post('/createPostWithImage', upload.single('postImage'), async (req, res) => {
    const email  = loginEmail
    const userData = await cowboym.findOne({ email: email }).lean()
//postImage
    const postData = {
        postContent: req.body.postContent,
        postCreatorEmail: loginEmail,
        postCreationDateTime: Date.now(),
        postLikeCount: 0,
        postImage: req.file.filename

    }
console.log("...creating post")

console.log([postData])

//console.log(req.body.postContent)

await postModel.insertMany([postData])

console.log("Post created with IMAGE")

let postArray = await loadPost(req, res)

//console.log([userData])
res.status(201).render("home", { user: userData, post: postArray} )
   
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

    app.get('/upload', async(req, res) => {
        pemail = loginEmail
   
       res.render('upload', { email: pemail})
     })
   

   
   
     // Handle the file upload
   app.post('/upload', upload.single('profilePicture'), async (req, res) => {
       const email  = loginEmail
       const check = await cowboym.findOne({ email: email }).lean()
   
       console.log("uploading picture for user data for email ")
       console.log(email)
       console.log({check})

       let postArray = await loadPost(req, res)
     
       // Save the file name to the user in the database
       await cowboym.findOneAndUpdate(
           { email: email }, 
           {$set: { profilePicture: req.file.filename }}, 
           {new: true, runValidators: true})
   
           console.log("Picture Uploaded....")
   
           res.status(201).render("home", { user: check, post: postArray } )
      
     })

     app.get('/home', async(req, res) => {
        pemail = loginEmail
        const check = await cowboym.findOne({ email: pemail }).lean()
        let postArray = await loadPost(req, res)
        res.status(201).render("home", { user: check, post: postArray } )
    
       })


     // createPost

    app.post('/createPost',  async (req, res) => {
    const postData = {
        postContent: req.body.postContent,
        postCreatorEmail: loginEmail,
        postCreationDateTime: Date.now(),
        postLikeCount: 0

    }
    console.log("...creating post")

    //console.log(req.body.postContent)
    
    await postModel.insertMany([postData])

    console.log("Post created with data")

    let postArray = await loadPost(req, res)

    //console.log([userData])
    res.status(201).render("home", { user: userData, post: postArray} )

    })


   
     // Display user profiles
   app.get('/cowboy', async (req, res) => {
       const email  = loginEmail
       const cowboy = await cowboym.findOne({ email: email }).lean()
       
       res.render('profile', { user: cowboy });
     })
   

    const port = process.env.PORT || 9000

app.listen(port, () =>{
    console.log('*********  server started **********')
})
