const express = require('express');
const app = express();

const csv = require('csv-parser');
const fs = require('fs');

const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config();

const chalk = require('chalk');

const TransactionFormatter = require('./transaction-formatter');
const formatterInstance = new TransactionFormatter();

// ASSUMPTION: table has already been created

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE
};

const pool = mysql.createPool(dbConfig);

// TODO: REFACTOR
// Load data manually for now
const transactions = [];
fs.createReadStream('data/accountactivity.csv')
    .pipe(csv(['date', 'description', 'debit', 'credit', 'balance']))
    .on('data', data => transactions.push(formatterInstance.format(data)))
    .on('end', () => {
        console.log(transactions);
    });

pool.getConnection((err, connection) => {
    if (err) throw err; // not connected

    let insertQuery =
        'INSERT INTO transactions (transaction_date, transaction_description, ' +
        'debit, credit, balance) VALUES ';

    transactions.forEach(t => {
        insertQuery += `(${t.date},${t.description},${t.debit},${t.credit},${t.balance}),`;
    });

    insertQuery = insertQuery.replace(/,\s*$/, '') + ';';

    console.log(chalk.blue(insertQuery));

    // Use the connection
    connection.query(insertQuery, (error, results, fields) => {
        // When done with the connection, release it
        connection.release();

        // Handle error after the release
        if (error) throw error;
    });

    console.log(chalk.greenBright('SQL data populated!!!'));
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

app.get('/category', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err; // not connected

        // Use the connection
        connection.query(
            'SELECT transaction_description, SUM(debit) FROM transactions ' +
                'GROUP BY transaction_description ' +
                'ORDER BY SUM(debit) DESC;',
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
