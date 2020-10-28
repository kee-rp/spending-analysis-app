const express = require('express');
const app = express();
const mysql = require('mysql');

const dotenv = require('dotenv');
dotenv.config();

const host = process.env.DB_HOST;
const user = process.env.DB_USER;
const password = process.env.DB_PASS;
const database = process.env.DB_DATABASE;

// Create connection
const con = mysql.createConnection({
    host,
    user,
    password,
    database
});

const query = 'SELECT * FROM transactions';

// Make connection to the database.
con.connect(function(err) {
    if (err) throw err;

    // if connection is successful
    con.query(query, (err, result, fields) => {
        // if any error while executing above query, throw error
        if (err) throw err;

        // if there is no error, you have the result
        console.log(result);
    });
});

app.listen(process.env.PORT, () => console.log('app is running'));
