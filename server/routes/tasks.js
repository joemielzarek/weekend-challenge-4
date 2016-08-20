var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString;

// If we are running on Heroku, use the remote database (with SSL)
if(process.env.DATABASE_URL != undefined) {
  connectionString = 'postgres://kplwneokxaeazk:4CGjQFUaKGIUHDMME_G2DCQTej@ec2-54-225-120-137.compute-1.amazonaws.com:5432/dbhl0cvf8b6i8p';
} else {
    // running locally, use our local database instead
    connectionString = 'postgres://localhost:5432/muthree';
}

router.get('/', function (req, res) {
  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      res.sendStatus(500);
    }
    client.query('SELECT tasks.id, name, description, goal_date, complete, first_name FROM tasks ' +
	                 'JOIN honey ON honey.id = tasks.honey_id ' +
                   'ORDER BY complete, goal_date ASC' , function(err, result) {
      done();
      console.log(result.rows);
      res.send(result.rows);
    });
  });
});

router.post('/', function(req, res) {
  var task = req.body;
  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      res.sendStatus(500);
    }
    client.query('INSERT INTO tasks (name, description, goal_date, honey_id) ' +
                    'VALUES ($1, $2, $3, $4)', [task.taskName, task.taskDescription, task.goalDate, task.honeyName],
                  function(err, result) {
                    done();
                    if (err) {
                      res.sendStatus(500);
                      return;
                    }
                    res.sendStatus(201);
                  }
    );
  });
});

router.put('/:id', function (req, res) {
  var id = req.params.id;
  console.log(id);
  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      res.sendStatus(500);
    }
    client.query('UPDATE tasks ' +
                  'SET complete = true ' +
                  'WHERE id = $1', [id],
                  function(err, result) {
                    done();
                    if (err) {
                      res.sendStatus(500);
                      return;
                    }
                    res.sendStatus(200);
                  }
                );
  });
});

router.delete('/:id', function(req, res) {
  var id = req.params.id;

  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      res.sendStatus(500);
    }

    client.query('DELETE FROM tasks ' +
                  'WHERE id = $1 ' ,
                  [id],
                  function(err, result) {
                    done();

                    if (err) {
                      res.sendStatus(500);
                      return;
                    }
                    res.sendStatus(200);
                  }
    );
  });
});


module.exports = router;
