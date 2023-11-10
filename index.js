const express = require('express');
const mysql = require('mysql2');
const productRoutes = require('./routes/shoes_routing');

require('dotenv').config()
const app = express()

app.use(express.static("publics"))
app.set("view engine", "ejs")

const db = mysql.createConnection(
    {
        connectionLimit : 10,
        host            : process.env.DB_HOST,
        user            : process.env.DB_USERNAME,
        password        : process.env.DB_PASSWORD,
        port            : process.env.DB_PORT,
        database        : process.env.DB_DBNAME,
    });

db.connect((error) => {
    if (error) 
        throw error;
    console.log('Connected to database successfully');
});

app.use('/', productRoutes(db));

const port = process.env.APP_PORT || 3000;
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})