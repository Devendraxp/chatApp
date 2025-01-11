import express from 'express';
import ejsMate from 'ejs-mate';
import path from 'path';
import ejs from 'ejs';
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
const PORT = 3000;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(path.dirname(new URL(import.meta.url).pathname), "views"));

app.get('/', (req, res) => {
    res.send('Root is working !!!');
});
app.get('/register', (req, res) => {
    res.render("user/registerEmail");
});


app.listen(PORT, () => {
    console.log('Server is running on port 3000');
    });