var pg = require('pg');
//return false;
var config = {
  user: 'akib', //env var: PGUSER
  database: 'akib', //env var: PGDATABASE
  password: 'inventoryps', //env var: PGPASSWORD
  host: '127.0.0.1', // Server hosting the postgres database
  port: 5432, //env var: PGPORT
  //max: 10, // max number of clients in the pool
  //idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};
var pool = new pg.Pool(config);


//var pool = new pg.Pool(config);

pool.connect(function(err, client, done) {
  if(err) {
    return console.error('error fetching client from pool', err);
  }
  client.query('select * from books', function(err, result) {
    //call `done()` to release the client back to the pool
    done();

    if(err) {
      return console.error('error running query', err);
    }
    console.log(result.rows);
    //output: 1
  });
});

pool.on('error', function (err, client) {
  // if an error is encountered by a client while it sits idle in the pool
  // the pool itself will emit an error event with both the error and
  // the client which emitted the original error
  // this is a rare occurrence but can happen if there is a network partition
  // between your application and the database, the database restarts, etc.
  // and so you might want to handle it and at least log it out
  console.error('idle client error', err.message, err.stack)
})
/*
var connection = mysql.createConnection({
  host : '127.0.0.1',
  user : 'akib',
  password : 'inventoryps',
  database : 'akib'
});
*/
/*
connection.connect();

connection.query('SELECT * from book', function(err, rows, fields) {
  if (!err) {
    var a = JSON.stringify(rows);
    //console.log(a);
    console.log('The solution is: ', a);
  } else {
    console.log('Error while performing Query.');
  }
});

connection.end();

*/
