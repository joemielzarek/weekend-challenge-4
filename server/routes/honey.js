var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/muthree';

router.get('/', function (req, res) {

  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      res.sendStatus(500);
    }

    client.query('SELECT * FROM honey ', function(err, result) {
      done();

      console.log(result.rows);

      res.send(result.rows);

    });
  });
});

module.exports = router;
