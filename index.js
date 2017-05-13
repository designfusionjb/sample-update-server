const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const db = new sqlite3.Database('updates.db');
db.serialize(function () {
  db.run('CREATE TABLE IF NOT EXISTS [files] ([sha1] TEXT PRIMARY KEY NOT NULL, [size] INTEGER NOT NULL);');
});

const app = express();
app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/files', function (req, res) {
  db.all('SELECT * FROM [files];', function (err, rows) {
    const json = JSON.stringify(rows);
    res.send(json);
  });
});

app.post('/files', function (req, res) {
  db.serialize(function () {
    const stmt = db.prepare('INSERT INTO [files] VALUES (?, ?);');
    stmt.run(req.body.sha1, req.body.size);
    stmt.finalize();
  });
  res.end();
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});


