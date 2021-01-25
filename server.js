const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const game = require('./controllers/game.js')
const knex = require('knex');

const app = express();

const db = knex({
    client: 'pg',
    connection: {
        connectionString: "postgres://wrbetfiymlulha:fc7970280bff58a139b9b8da6bbacff6de4c4e231784715c63f248f50fc08019@ec2-79-125-86-58.eu-west-1.compute.amazonaws.com:5432/da1dgcsikfl2ud",
        ssl: {
            rejectUnauthorized: false
        }
    }
});

app.use(cors())
app.use(bodyParser.json());

app.get('/play', (req, res)=> { game.play(req,res,db) })

app.listen(5000, ()=> {
    console.log('app is running on port 5000');
})