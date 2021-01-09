const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex');

const db = knex({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: true
    }
});

const app = express();

app.use(cors())
app.use(bodyParser.json());

db.transaction(trx => {
    trx.insert({
        name: 'John Brown',
        country: 'USA',
        age: 23,
    })
        .into('players')
        .then(trx.commit)
        .catch(trx.rollback)
})
    .catch(err => console.log(err))


app.listen(3000, ()=> {
    console.log('app is running on port 3000');
})

