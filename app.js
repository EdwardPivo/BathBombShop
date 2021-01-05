
const express = require('express')
let app = express()
const http = require('http')
const fs = require('fs')
const port = 3000
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const flash = require('express-flash')
const session = require('express-session')
const bcrypt = require('bcrypt')
const passport = require('passport')
const methodOverride = require('method-override')
const users = []

const initializePassport = require('./passport-config')
const { stringify } = require('querystring')
const { error, profile } = require('console')
const { errorMonitor } = require('stream')
const { Session } = require('inspector')
initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)
//MongoDB Shit
mongoose.connect("mongodb://localhost/MyDataBase")

let User = mongoose.model("User", new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
}))

//veiw engine
app.set('view engine', 'ejs')
//Static Files
app.use(express.json())
app.use(express.static('public'))
app.use('/css', express.static(__dirname+ 'public/css'))
app.use('/css', express.static(__dirname+ 'public/js'))
app.use('/css', express.static(__dirname+ 'public/img'))
app.use(express.urlencoded({ extended: false}))
app.use(flash())
app.use(session({
    cookieName:'session',
    secret: 'this_is_my_secret',
    duration: 30*60*1000,
    activeDuration:5* 60*1000,
    httpOnly: true,
    secure: true,
    ephemeral: true,
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))
//Smart User Middleware

app.use((req,res,next) => {
    if (!(req.session && req.session.userId)){
        return next()
    }
    User.findById(req.session.userId, (err, user) => {
        if(err){
            return next(err)
        }
        if(!user){
            return next()
        }
        user.password = undefined

        req.user = user
        res.locals.user

        next()
    })
})
function loginRequired (req,res,next){
    if (!req.user){
        return res.redirect("/login")
    }
    next()
}


//Pages


app.get('/',loginRequired,(req,res,next) => {
    res.render('home.ejs')
}) 
app.post('/',(req,res) =>{
})

app.get('/login',(req,res) => {
    res.render('login.ejs')
}) 
app.post('/login',(req,res) =>{
    User.findOne({email: req.body.email}, (err,user) => {
        if (err || !user || !bcrypt.compareSync(req.body.password, user.password)){
            return res.render('login.ejs', {
                error: "incorrect Email or Password"
            })
        }
    req.session.userId = user._id
    res.redirect('/')
    })

})


//registration page
app.get('/register',(req,res) => {
    res.render("reg.ejs")
})

app.post("/register",(req,res) =>{
    let hash =  bcrypt.hashSync(req.body.password, 14)
    req.body.password = hash
    let user = new User(req.body)

    user.save((err) => {
        if(err){
            return res.render("reg.ejs", {error: error})
        }

        res.redirect("/login")
    })
})

app.get('/products',loginRequired,(req,res) => {
    res.render("allProducts.ejs")
})

app.post('/products',(req,res)=>{

})

app.get('/socials',loginRequired,(req,res) => {
    res.render("socials.ejs")
})

app.post('/socials',(req,res)=>{

})

app.get('/help',loginRequired,(req,res) => {
    res.render("help.ejs")
})

app.post('/help',(req,res)=>{

})

app.get('/info',loginRequired,(req,res) => {
    res.render("info.ejs")
})

app.post('/info',(req,res)=>{

})

app.get('/sellers',loginRequired,(req,res) => {
    res.render("sellers.ejs")
})

app.post('/sellers',(req,res)=>{

})

app.get('/daryahomepage',loginRequired,(req,res) => {
    res.render("seller1.ejs")
})

app.post('/daryahomepage',(req,res)=>{

})

app.get('/olyahomepage',loginRequired,(req,res) => {
    res.render("seller2.ejs")
})

app.post('/olyahomepage',(req,res)=>{

})

app.get('/shoppingcart',loginRequired,(req,res) => {
    res.render("cart.ejs")
})

app.post('/shoppingcart',(req,res)=>{

})




// products

app.get('/bathbomb_e3r4w2',loginRequired,(req,res) => {
    res.render("product1.ejs")
})

app.post('/bathbomb_e3r4w2',(req,res)=>{

})

app.get('/bathbomb_qj1k23j',loginRequired,(req,res) => {
    res.render("product2.ejs")
})

app.post('/bathbomb_qj1k23j',(req,res)=>{

})

app.get('/bathbomb_t2e5gf',loginRequired,(req,res) => {
    res.render("product3.ejs")
})

app.post('/bathbomb_t2e5gf',(req,res)=>{

})

app.delete('/logout',(req,res) => {
    req.session.destroy();
    req.logOut
    res.redirect('/login')
})


// Listen to port 3000
app.listen(port, () => console.info('Listening to port 3000'))