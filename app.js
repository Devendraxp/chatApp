import express from 'express';
import ejsMate from 'ejs-mate';
import path from 'path';
import ejs from 'ejs';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Resend } from 'resend';

const resend = new Resend('re_AuAM5t1g_FqBfWZKj92DFDF1C5GjkByLp');

dotenv.config();  
const app = express();
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
        
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: '🔐 Your OTP for Registration',
            html: `
            <div style="background-color: #f6f6f6; padding: 20px; font-family: Arial, sans-serif;">
                <div style="background-color: white; padding: 30px; border-radius: 10px; text-align: center;">
                <h1 style="color: #2c3e50;">Welcome! 👋</h1>
                <div style="font-size: 24px; margin: 20px 0;">
                    Your OTP is: <strong style="color: #3498db; padding: 10px; background-color: #f8f9fa; border-radius: 5px;">${otp}</strong>
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
    res.render("user/registerOtp");
});
app.get('/register_u', (req, res) => {
    res.render("user/registerUsername");
});


app.get('/login',(req,res)=>{
    res.render("user/userLogin.ejs");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

async function connectToDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to DB");
    } catch (err) {
        console.log("Error connecting to DB:", err);
    }
}

connectToDatabase();

