const express = require('express');
const app = express();
require('dotenv').config();
const port = 3000;

const mysql = require('mysql2');
const bodyParser = require('body-parser');

const ejs = require('ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.db_password,
    database: 'express_db_test'
});

con.connect(function(err) {
    if (err) throw err;
    console.log('mysql Connected');
});

app.get('/', (req, res) => {
    const sql = 'select * from users';
    con.query(sql, (err, result, fields) => {
        if (err) throw err;
        res.render('index', {users : result});
    });
});

app.get('/create', (req, res) => {
    res.sendFile(__dirname + '/html/form.html');
});

app.post('/', (req, res) => {
    const sql = "INSERT INTO users SET ?";
    con.query(sql, req.body, (err, result, fields) => {
        if (err) throw err;
        console.log(result);
        res.redirect('/');
    });
});

app.get('/delete/:id', (req, res) => {
    const sql = "DELETE FROM users WHERE id = ?";
    con.query(sql, [req.params.id], (err, result, fields) => {
        if (err) throw err;
        console.log(result);
        res.redirect('/');
    });
});

app.get('/edit/:id', (req, res) => {
    const sql = 'SELECT * FROM users WHERE id = ' + req.params.id;
    con.query(sql, (err, result, fields) => {
        if (err) throw err;
        res.render('edit', {user : result});
    });
});

app.post('/update/:id', (req, res) => {
    const sql = 'UPDATE users SET ? WHERE id = ' + req.params.id;
    con.query(sql, req.body, (err, result, fields) => {
        if (err) throw err;
        console.log(result);
        res.redirect('/');
    });
});

app.listen(port, () => {
    console.log(`listening on port${port}!`)
});