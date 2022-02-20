const connection = require('./connection');

class DB {
    constructor(connection) {
        this.connection = connection;
    }

    findAllEmployees() {
        return this.connection.promise().query(
            'SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary AS salary'
        )
    }
}

const db = new DB;

module.exports = db;