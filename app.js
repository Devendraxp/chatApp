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
