const connection = require('./connection');

class DB {
    findAllEmployees() {
        return connection.promise().query(
            'SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary AS salary, employee.manager_id FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id'
        ).then(res => console.table(res[0]));
    }

    findEmployeeByDepartment(department) {
        return connection.promise().query(
            'SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary AS salary, employee.manager_id FROM department JOIN role ON department.id = role.department_id JOIN employee ON role.id = employee.role_id WHERE department.name = ?', department
        ).then(res => console.table(res[0]));
    }

    

    // findEmployeeByID(employeeId) {
    //     return connection.promise().query(
    //         'SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary AS salary, employee.manager_id FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id WHERE employee.id = ?', employeeId
    //     ).then(res => console.log(res[0]));
    // }
}

const db = new DB;

module.exports = db;