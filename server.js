const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const game = require('./controllers/game.js')

const app = express();

app.use(cors())
app.use(bodyParser.json());



app.listen(5000, ()=> {
    console.log('app is running on port 5000');
})