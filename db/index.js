const { last } = require('lodash');
const connection = require('./connection');

class DB {
    findAllEmployees() {
        return connection.promise().query(
            'SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary AS salary, employee.manager_id FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id'
        ).then(res => {
            console.log('Employees:');
            console.table(res[0]);
        });
    }

    findEmployeeByID(employeeId) {
        return connection.promise().query(
            'SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary AS salary, employee.manager_id FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id WHERE employee.id = ?', employeeId
        ).then(res => console.table(res[0]));
    }

    findEmployeeByDepartment(department) {
        return connection.promise().query(
            'SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary AS salary, employee.manager_id FROM department JOIN role ON department.id = role.department_id JOIN employee ON role.id = employee.role_id WHERE department.name = ?', department
        ).then(res => console.table(res[0]));
    }

    addNewEmployee(firstName, lastName, role, managerId) {
        return connection.promise().query(
            'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [firstName, lastName, role, managerId]
        ).then(res => connection.promise().query(
            'SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary AS salary, employee.manager_id FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id'
        )).then(result => console.table(result[0]));
    }

    findAllRoles() {
        return connection.promise().query(
            'SELECT id, title FROM role'
        ).then(res => {
            console.log('Roles:')
            console.table(res[0]);
        });
    }

    findAllManagers() {
        return connection.promise().query(
            'SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id WHERE manager_id IS NULL'
        ).then(res => {
            console.log('Managers:')
            console.table(res[0]);
        });
    }

    deleteEmployeeRecord(employeeId) {
        return connection.promise().query(
            'DELETE FROM employee WHERE id = ?', employeeId
        ).then(res => connection.promise().query(
            'SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary AS salary, employee.manager_id FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id'
        )).then(result => console.table(result[0]));
    }

    findAllRoles() {
        return connection.promise().query(
            'SELECT id, title AS role FROM role'
        ).then(res => {
            console.log('Roles:')
            console.table(res[0]);
        });
    }

    updateRoles(id, role) {
        return connection.promise().query(
            'UPDATE employee SET role_id = ? WHERE id = ?', [role, id]
        ).then(res => connection.promise().query(
            'SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary AS salary, employee.manager_id FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id'
        )).then(result => console.table(result[0]));
    }

    updateManager(id, manager) {
        return connection.promise().query(
            'UPDATE employee SET manager_id = ? WHERE id = ?', [manager, id]
        ).then(res => connection.promise().query(
            'SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary AS salary, employee.manager_id FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id'
        )).then(result => console.table(result[0]));
    }

    findAllDepartments() {
        return connection.promise().query(
            'SELECT id, name AS department FROM department'
        ).then(res => {
            console.log('Departments:')
            console.table(res[0]);
        });
    }

    addNewDepartment(name) {
        return connection.promise().query(
            'INSERT INTO department (name) VALUES (?)', name
        ).then(res => connection.promise().query(
            'SELECT id, name AS department FROM department'
        )).then(result => console.table(result[0]));
    }

    deleteDepartmentRecord(departmentID) {
        return connection.promise().query(
            'DELETE FROM department WHERE id = ?', departmentID
        ).then(res => connection.promise().query(
            'SELECT id, name AS department FROM department'
        )).then(result => console.table(result[0]));
    }

    addNewRole(title, salary, departmentId) {
        return connection.promise().query(
            'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [title, salary, departmentId]
        ).then(res => connection.promise().query(
            'SELECT id, title AS role, salary, department_id AS department FROM role'
        )).then(result => console.table(result[0]));
    }

    deleteRoleRecord(roleId) {
        return connection.promise().query(
            'DELETE FROM role WHERE id = ?', roleId
        ).then(res => connection.promise().query(
            'SELECT role.id, role.title AS role, salary, department_id AS department FROM role'
        )).then(result => console.table(result[0]));
    }
}

const db = new DB;

module.exports = db;