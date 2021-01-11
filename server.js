const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex');

const db = knex({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
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
        .returning('id')
        .then(id => {
            return trx('plskills')
                .returning('*')
                .insert({
                    plid: id[0],
                    power: 35,
                    speed: 53,
                    skill: 44,
                    gskill: 45,
                    hskill: 59,
                    cskill: 31,
                    iskill: 38,
                })
        })
        .then(trx.commit)
        .catch(trx.rollback)
})
    .catch(err => console.log(err));

app.listen(3000, ()=> {
    console.log('app is running on port 3000');
})