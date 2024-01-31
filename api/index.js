import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import UserModel from './models/User.js';


dotenv.config();
mongoose.connect(process.env.Mongo_URL);
const jwtSecret = process.env.JWT_SECRET;

const app = express()

app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
}));

app.use(express.json());

app.get('/test', (req,res) => {
    res.json('test okk')
});

app.post('/register', async(req,res) =>{
    const {username, password} = req.body;

    try {
        const createdUser = await UserModel.create({username,password});
    jwt.sign({userId:createdUser._id}, jwtSecret, {}, (err, token)=>{
        if (err) throw err;
        res.cookie('token', token).status(201).json({
            id: createdUser._id,
        });
    });
    } catch (err) {
        if (err) throw err;
        res.status(500).json('error');
    }


});

app.listen(3000);


