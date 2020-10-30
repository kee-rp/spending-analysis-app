const express = require('express');
const app = express();

const csv = require('csv-parser');
const fs = require('fs');

const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE
};

const pool = mysql.createPool(dbConfig);

const results = [];

// Load data manually for now     TODO: REFACTOR
fs.createReadStream('data/accountactivity.csv')
    .pipe(csv(['date', 'description', 'debit', 'credit', 'balance']))
    .on('data', data => results.push(data))
    .on('end', () => {
        console.log(results);
    });

app.get('/', (req, res) => res.send('default page'));

app.get('/list', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err; // not connected

        // Use the connection
        connection.query(
            'SELECT * FROM transactions;',
            (error, results, fields) => {
                // When done with the connection, release it
                connection.release();

                // Handle error after the release
                if (error) throw error;

                // Don't use the connection here, it has been returned to the pool
                res.send(results);
            }
        );
    });
});

app.listen(process.env.PORT, () => console.log('app is running'));
