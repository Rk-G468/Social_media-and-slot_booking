import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import express from "express";
import mongoose from 'mongoose';
// import path from "path"
import { readPosts, readUser, insertPost, insertUser, likeFun,  shareFun, deleteFun } from './operation.js';
import hbs from 'hbs';
import bodyParser from "body-parser";
import pkg from 'jsonwebtoken';

import cookieParser from "cookie-parser";


mongoose.connect("mongodb://127.0.0.1:27017/cinema", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});





// ... (previous imports)

const screen1Model = mongoose.model('screen1', {
    seatno: { type: Number },
    status: { type: String }
});

const screen2Model = mongoose.model('screen2', {
    seatno: { type: Number },
    status: { type: String }
});

const screen3Model = mongoose.model('screen3', {
    seatno: { type: Number },
    status: { type: String }
});

const moviesModel = mongoose.model('movies', {
    name: { type: String },
    rate: { type: Number },
    screen: { type: String }
});

// ... (rest of your code)


var screen1Res

screen1Model.find()
.then(function(output){
    screen1Res = output
    console.log(screen1Res)
    
})


.catch(function (err){
    console.log(err)

})



var screen2Res

screen2Model.find()
.then(function(output){
    screen2Res = output

})


.catch(function (err){
    console.log(err)

})


var screen3Res

screen3Model.find()
.then(function(output){
    screen3Res = output

})


.catch(function (err){
    console.log(err)

})



var moviesRes

moviesModel.find()
.then(function(output){
    moviesRes = output
    // console.log(moviesRes)

})


.catch(function (err){
    console.log(err)

})



const { sign, verify } = pkg;

const app = express();

app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname,"public")))

app.get('/', (req, res) => {
    res.render("login");
});

app.post('/login', async (req, res) => {
    console.log(req.body.profile);
    console.log(req.body.password);
    try {
        const output = await readUser(req.body.profile);
        const password = output[0].password;
        if (password === req.body.password) {
            const secret = "abcalskdjf3oiuaisuflakjsdflsdkjflaksjfdlkjsfljk"; // Replace with your actual secret key
            const payload = { "profile": output[0].profile, "name": output[0].name, "headline": output[0].headline };
            const token = sign(payload, secret);
            res.cookie("token", token);
            res.redirect("/posts");
        } else {
            res.send("Incorrect UserName or Password");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});
app.get('/cinema', (req, res) =>{
    res.render("cinema",{
        movies:moviesRes,
        screen1:screen1Res,
        screen2:screen2Res,
        screen3:screen3Res
    });
})

app.get('/posts', verifyLogin, async(req, res) => {
    const output = await readPosts()
    res.render("posts", { 
        data: output,
        user: req.payload }); // Pass user information to the posts view
        console.log(output)
});

function verifyLogin(req, res, next) {
    const secret = "abcalskdjf3oiuaisuflakjsdflsdkjflaksjfdlkjsfljk"; // Replace with your actual secret key
    const token = req.cookies.token;
    if (!token) {
        return res.sendStatus(403);
    }

    verify(token, secret, (err, payload) => {
        if (err) {
            console.error(err);
            return res.sendStatus(403);
        }
        req.payload = payload;
        next();
    });
}

app.post('/addusers', async(req, res)=>{
    if(req.body.password === req.body.cnfpassword)
    {
        await insertUser(req.body.name,req.body.profile,req.body.password,req.body.headline)
        res.redirect('/')
    }
    else
    {
        res.send("Password and confirm Password Did not match")
    }
})

app.get('/register', (req, res) => {
    res.render("register");
});
app.post('/like', async (req, res) => {
    try {
      await likeFun(req.body.content);
      res.redirect('/posts');
    } catch (error) {
      console.error('Error while processing like:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  

app.post('/share', async(req, res) =>{
    try {
        await shareFun(req.body.content);
        res.redirect('/posts');
      } catch (error) {
        console.error('Error while processing like:', error);
        res.status(500).send('Internal Server Error');
      }
 
})

app.post('/addpost', async(req, res) =>{
    await insertPost(req.body.profile, req.body.content)
    res.redirect('/posts')
})

app.post('/delete', async(req, res) =>{
    try {
        await deleteFun(req.body.content);
        res.redirect('/posts');
      } catch (error) {
        console.error('Error while processing like:', error);
        res.status(500).send('Internal Server Error');
      }
 
})


app.listen(3000, () => {
    console.log("Listening....");
});
