import express from 'express';
const app = express()

app.get('/test', (req,res) => {
    res.json('test okk')
});

app.post('/register', (req,res) =>{

});

app.listen(4040);