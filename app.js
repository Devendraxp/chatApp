import express from 'express';
import ejsMate from 'ejs-mate';
import path from 'path';
import ejs from 'ejs';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Resend } from 'resend';
import session from 'express-session';
import flash from 'connect-flash';
import {User} from "./models/user.schema.js";
import passport from 'passport';
import passportLocal from 'passport-local';



dotenv.config();  

const resend = new Resend("re_5wscqcYX_GHuASbNXfZcUoCQAZSZZwzKc");
const app = express();

const sessionOptions=
{secret:"mysupersecret",
    resave:false,
    saveUninitialized:true}

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new passportLocal.Strategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});


app.set('view engine', 'ejs');
const PORT = 3000;

app.engine('ejs', ejsMate);

app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(path.dirname(new URL(import.meta.url).pathname), "views"));


app.get('/', (req, res) => {
    res.send('Root is working !!!');
});

app.get('/register', (req, res) => {
    res.render("user/registerEmail");
});

app.post('/register', async (req, res) => {
    try {
        console.log(req.body.email);
        const email = req.body.email;
        
        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000);
        // TODO: Add storage logic
        
        req.session.otp=otp;
        req.session.email=email;

        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: '🔐 Your OTP for Registration',
            html: `
            <div style="background-color: #f6f6f6; padding: 20px; font-family: Arial, sans-serif;">
                <div style="background-color: white; padding: 30px; border-radius: 10px; text-align: center;">
                <h1 style="color: #2c3e50;">Welcome! 👋</h1>
                <div style="font-size: 24px; margin: 20px 0;">
                    Your OTP is: <strong style=" margin-top: 40px; color: #3498db; padding: 10px; background-color: #f8f9fa; border-radius: 5px;">${otp}</strong>
                </div>
                <p style="color: #7f8c8d; margin-top: 20px;">
                    🔒 Please use this OTP to complete your registration.
                    This code will expire soon, so act quickly!
                </p>
                <p style="font-size: 12px; color: #95a5a6; margin-top: 30px;">
                    If you didn't request this OTP, please ignore this email. 🚫
                </p>
                </div>
            </div>
            `

        });

        res.redirect('/register_otp');
    } catch (error) {
        console.error('Email sending failed:', error);
        res.status(500).send('Failed to send OTP');
    }
});

app.get('/register_otp', (req, res) => {
    if(!req.session.otp || !req.session.email){
        return res.redirect('/register');
    }
    res.render("user/registerOtp", { messages: req.flash() });
    console.log(req.session);

});



app.post('/register_otp', (req, res) => {
    const userOtp = req.body.otp; 
    const sessionOtp = req.session.otp; 

    if (parseInt(userOtp) === sessionOtp) {
        req.flash('success', 'OTP verified successfully!');
        res.redirect("/register_u");
    } else {
        req.flash('error', 'Invalid OTP');
        res.redirect("/register_otp");
    }
});


app.get('/register_u', (req, res) => {
    if(!req.session.otp){
        return res.redirect('/register');
    }
    
    res.render("user/registerUsername", {email : req.session.email});
});

app.post('/register_u', async (req, res, next) => {
    try {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.session.email;

        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
          if (err) {
            return next(err);
          }
          req.flash("success", "Welcome to Chat !");
          res.redirect("/");
        });
      } catch (e) {
        req.flash("error", e.message);
        res.redirect("/register_u");
      }

});

app.get('/login',(req,res)=>{
    res.render("user/userLogin.ejs");
});

app.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),(req,res)=>{
    req.flash("success","Welcome back !");
    res.redirect("/");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

async function connectToDatabase() {
    try {
        await mongoose.connect("mongodb+srv://ananya:ananya11@cluster0.j8ym7.mongodb.net/");
        console.log("Connected to DB");
    } catch (err) {
        console.log("Error connecting to DB:", err);
    }
} 

connectToDatabase();

