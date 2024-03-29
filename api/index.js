import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import bcrypt from 'bcrypt';
import UserModel from './models/User.js';
import ws, { WebSocketServer } from 'ws';


dotenv.config();
mongoose.connect(process.env.Mongo_URL);

const jwtSecret = process.env.JWT_SECRET;
const bcryptSalt = bcrypt.genSaltSync(10);

const app = express()
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
}));


app.get('/test', (req,res) => {
    res.json('test okk')
});

app.get('/profile', (req,res) => {
    const token = req.cookies?.token;
    if (token) {
        jwt.verify(token, jwtSecret, {}, (err, userData)=>{
        if (err) throw err;
        res.json(userData);
    });
    } else {
        res.status(401).json('no token')
    }

});

app.post('/login', async (req,res) =>{
    const {username, password} = req.body;
    const foundUser = await UserModel.findOne({username});
    if (foundUser) {
        const passOk = bcrypt.compareSync(password, foundUser.password);
        if (passOk) {
            jwt.sign({userId:foundUser._id, username}, jwtSecret, {}, (err, token) => {
                res.cookie('token', token, {sameSite:'none', secure:true}).status(201).json({
                    id: foundUser._id,
                });
            });
        }
    }


});

app.post('/register', async(req,res) =>{
    const {username, password} = req.body;

    try {
        const hashedPassword = bcrypt.hashSync(password, bcryptSalt)
        const createdUser = await UserModel.create({
            username:username,
            password:hashedPassword
        });
    jwt.sign({userId:createdUser._id, username}, jwtSecret, {}, (err, token)=>{
        if (err) throw err;
        res.cookie('token', token, {sameSite:'none', secure:true}).status(201).json({
            id: createdUser._id,
        });
    });
    } catch (err) {
        if (err) throw err;
        res.status(500).json('error');
    }


});

const server = app.listen(3000);

const wss = new WebSocketServer({server}); // Web socket server

wss.on('connection', (connection, req) => {
    const cookies = req.headers.cookie;
    if (cookies) {
        const tokenCookieString = cookies.split(';').find(str => str.startsWith('token='));
        if (tokenCookieString){
            const token = tokenCookieString.split('=')[1];
            if (token) {
                jwt.verify(token, jwtSecret)
            }
        }
    }
});