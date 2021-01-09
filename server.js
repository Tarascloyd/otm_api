const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex');

const { Client } = require('pg');

const app = express();

app.use(cors())
app.use(bodyParser.json());


const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

client.connect();

client.query('INSERT INTO players (name, country, age) VALUES ("John", "USA", 23);', (err, res) => {
    if (err) throw err;
    for (let row of res.rows) {
        console.log(JSON.stringify(row));
    }
    client.end();
});


app.listen(3000, ()=> {
    console.log('app is running on port 3000');
})






