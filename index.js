const sqlite3 = require("sqlite3").verbose();
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const helpers = require("./helpers.js");
//const fs = require("fs");

const db = new sqlite3.Database("updates.db");
db.serialize(function() {
  db.run(
    "CREATE TABLE IF NOT EXISTS [file] (\
      [sha1] TEXT PRIMARY KEY NOT NULL,\
      [size] INTEGER NOT NULL,\
      [name] TEXT NOT NULL,\
      [appName] TEXT,\
      [appVersion] TEXT,\
      [osType] TEXT,\
      [osVersion] TEXT,\
      [osLocale] TEXT,\
      [updateChannel] TEXT);");
});

const app = express();
app.use(express.static("public"));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'html');
app.engine('html', require('hbs').__express);

app.get("/", function(req, res) {
  db.all("SELECT *, rowid AS [id] FROM [file];", function(err, rows) {
    const json = {
      files: rows
    };
    res.render("index", json);
  });
});

app.post("/", function(req, res) {
  const file = req.body;
  console.log(file);
  res.redirect("/");
});

app.get("/api/files", function(req, res) {
  db.all("SELECT * FROM [file];", function(err, rows) {
    const json = JSON.stringify(rows);
    res.send(json);
  });
});

app.put("/api/files", function(req, res) {
  const sql = helpers.json2insert("file", req.body);
  db.run(sql, function(err) {
    if (err)
      res.status(400).send(err.message);
    else
      res.end();
  });
});

let port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Example app listening on port 3000!");
});


