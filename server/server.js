const express = require('express');
const app = express();

const dotenv = require('dotenv');
dotenv.config();

const connenction = require('./utils/connection');
const query = require('./utils/query');

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE
};

app.get('/', (req, res) => res.send('default page'));

app.get('/list', async (req, res) => {
    const conn = await connenction(dbConfig).catch(e => {});
    const results = await query(conn, 'SELECT * FROM transactions').catch(
        console.log
    );
    res.json({ results });
});

app.listen(process.env.PORT, () => console.log('app is running'));
