import express from 'express';
import ejsMate from 'ejs-mate';
import path from 'path';
import ejs from 'ejs';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

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

app.post('/register',(req,res)=>{
    res.send(`${otp}`)
})

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



import { Resend } from 'resend';

const resend = new Resend('re_AuAM5t1g_FqBfWZKj92DFDF1C5GjkByLp');

function generateOtp(length = 6) {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
  }


  const otp=generateOtp();

(async function () {
  const { data, error } = await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to: ['ananya110011@gmail.com'],
    subject: 'Hello World',
    html: `<strong>${otp}</strong>`,
  });

  if (error) {
    return console.error({ error });
  }

  console.log({ data });
})();
