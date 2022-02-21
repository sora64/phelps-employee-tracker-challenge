// mysql2 module import
const mysql = require('mysql2');

// allows app to connect to MySQL functionality without having to manually log in and run the associated prompts each time
const connection = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'C@RCR][D5x_7Bm#-',
        database: 'employees'
    },
    console.log('Connected to the employee database.')
);

// error handling
connection.connect(function (err) {
    if (err) throw err;
});

// exports functionality
module.exports = connection;