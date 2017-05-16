const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const utils = require('./utils.js');
//const fs = require('fs');

const db = new sqlite3.Database('updates.db');
db.serialize(function() {
  db.run(
    'CREATE TABLE IF NOT EXISTS [file] (\
      [name] TEXT NOT NULL,\
      [size] INTEGER NOT NULL,\
      [sha1] TEXT NOT NULL,\
      [appName] TEXT,\
      [appVersion] TEXT,\
      [osType] TEXT,\
      [osVersion] TEXT,\
      [osLocale] TEXT,\
      [updateChannel] TEXT);');
});

const app = express();
app.use(express.static('public'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'html');
app.engine('html', require('hbs').__express);

app.get('/', function(req, res) {
  db.all('SELECT *, rowid AS [id] FROM [file];', function(err, rows) {
    const json = {
      files: rows
    };
    res.render('index', json);
  });
});

//
// List all files
//
app.get('/api/files', function(req, res) {
  db.all('SELECT * FROM [file];', function(err, rows) {
    const json = JSON.stringify(rows);
    res.send(json);
  });
});

//
// Add new file
//
app.put('/api/files', function(req, res) {
  const sql = utils.json2insert('file', req.body);
  db.run(sql, function(err) {
    if (err)
      res.status(400).send(err.message);
    else
       res.end();
  });
});

//
// Get file by id
//
app.get('/api/files/:id', function(req, res) {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
      res.status(400).send('Parameter is not a number!');
      return;
  }
  const sql = `SELECT * FROM [file] WHERE rowid == ${id};`;
  db.all(sql, function(err, rows) {
    if (err)
      res.status(400).send(err.message);
    else if (rows.length === 0)
      res.status(404).send(`File with id: ${id} is not found!`);
    else
      res.send(JSON.stringify(rows[0]));
  });
});

//
// Update file by id
//
app.put('/api/files/:id', function(req, res) {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
      res.status(400).send('Parameter is not a number!');
      return;
  }
  const sql = utils.json2update('file', id, req.body);
  db.run(sql, function(err) {
    if (err)
      res.status(400).send(err.message);
    else
      res.end();
  });
});

//
// Delete file by id
//
app.delete('/api/files/:id', function(req, res) {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
      res.status(400).send('Parameter is not a number!');
      return;
  }
  const sql = `DELETE FROM [file] WHERE rowid == ${id};`;
  db.run(sql, function(err) {
    if (err)
      res.status(400).send(err.message);
    else
      res.end();
  });
});

let port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('Example app listening on port 3000!');
});


