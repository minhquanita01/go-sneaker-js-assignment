const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const productRoutes = require('./routes/shoes_routing');

const app = express()

app.use(express.static("publics"))
app.use(cors())
app.set("view engine", "ejs")

const db = mysql.createConnection(
    {
        connectionLimit : 10,
        host            : "localhost",
        user            : "root",
        password        : "19120626",
        port            : 3306,
        database        : "go_sneaker_store"
    });

db.connect((error) => {
    if (error) throw error;
    console.log('Connected to database successfully');
});

app.use('/', productRoutes(db));

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})