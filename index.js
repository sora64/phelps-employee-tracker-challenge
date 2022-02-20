const { prompt } = require('inquirer');
const logo = require ('asciiart-logo');
const db = require('./db');
require('console.table');

init();

function init() {
    const logoText = logo({ name: 'Employee Tracker', font: 'Rounded', logoColor: 'bold-green' }).render();

    console.log(logoText);

    primaryPrompts();
}

function primaryPrompts() {
    prompt([
        {
            type: 'list',
            name: 'choice',
            message: 'What would you like to do?',
            choices: [
                {
                    name: 'View All Employees',
                    value: 'VIEW_EMPLOYEES'
                },
                {
                    name: 'View All Employees By Department',
                    value: 'VIEW_EMPLOYEES_BY_DEPARTMENT'
                },
                {
                    name: 'Add Employee',
                    value: 'ADD_EMPLOYEE'
                },
                {
                    name: 'Remove Employee',
                    value: 'REMOVE_EMPLOYEE'
                },
                {
                    name: 'Update Employee Role',
                    value: 'UPDATE_EMPLOYEE_ROLE'
                },
                {
                    name: 'Update Employee Manager',
                    value: 'UPDATE_EMPLOYEE_MANAGER'
                },
                {
                    name: 'View All Roles',
                    value: 'VIEW_ROLES'
                },
                {
                    name: 'Add Role',
                    value: 'ADD_ROLE'
                },
                {
                    name: 'Remove Role',
                    value: 'REMOVE_ROLE'
                },
                {
                    name: 'View All Departments',
                    value: 'VIEW_DEPARTMENTS'
                },
                {
                    name: 'Add Department',
                    value: 'ADD_DEPARTMENT'
                },
                {
                    name: 'Remove Department',
                    value: 'REMOVE_DEPARTMENT'
                },
                {
                    name: 'Quit',
                    value: 'QUIT'
                }                
            ]
        }
    ]).then(res => {
        let choice = res.choice;
        // Call a function based on user choice
        switch (choice) {
            case 'VIEW_EMPLOYEES':
                viewEmployees();
                break;
            case 'VIEW_EMPLOYEES_BY_DEPARTMENT':
                viewEmployeesByDepartment();
                break;
            case 'ADD_EMPLOYEE':
                addEmployee();
                break;
            case 'REMOVE_EMPLOYEE':
                removeEmployee();
                break;
            case 'UPDATE_EMPLOYEE_ROLE':
                updateEmployeeRole();
                break;
            case 'UPDATE_EMPLOYEE_MANAGER':
                updateEmployeeManager();
                break;
            case 'VIEW_ROLES':
                viewRoles();
                break;
            case 'ADD_ROLE':
                addRole();
                break;
            case 'REMOVE_ROLE':
                removeRole();
                break;
            case 'VIEW_DEPARTMENTS':
                viewDepartments();
                break;
            case 'ADD_DEPARTMENT':
                addDepartment();
                break;
            case 'REMOVE_DEPARTMENT':
                removeDepartment();
                break;
            case 'QUIT':
                quit();
                break;
        }
    })
}

function viewEmployees() {
    db.findAllEmployees();
    let timeout;
    function myTimeout() {timeout = setTimeout(primaryPrompts, 1000);};
    myTimeout();
}

function viewEmployeesByDepartment() {
    prompt({
        type: 'list',
        name: 'department',
        message: 'Please choose a department to see employees from that department.',
        choices: ['Sales', 'Engineering', 'Finance', 'Legal']
    }).then(result => {
        const department = result.department;
        console.log('===============================================================================');
        db.findEmployeeByDepartment(department);
        let timeout;
        function myTimeout() {timeout = setTimeout(primaryPrompts, 1000);};
        myTimeout();
    });
    return;
}

function addEmployee() {
    prompt([
        {
            type: 'input',
            name: 'firstName',
            message: "Please input your new employee's first name.",
            validate: firstNameInput => {
                if (firstNameInput) {
                    return true;
                } else {
                    console.log('Please enter a first name!');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'lastName',
            message: "Please input your new employee's last name.",
            validate: lastNameInput => {
                if (lastNameInput) {
                    db.findAllRoles();
                    return true;
                } else {
                    console.log('Please enter a last name!');
                    return false;
                }
            }
        },
        {
            type: 'number',
            name: 'role',
            message: "Please input your new employee's role ID.",
            validate: roleIdInput => {
                if (roleIdInput) {
                    db.findAllManagers();
                    return true;
                } else {
                    console.log('Please enter a role ID!');
                    return false;
                }
            }
        },
        {
            type: 'confirm',
            name: 'confirmManager',
            message: 'Will this employee have a manager?',
            default: true
        },
        {
            type: 'number',
            name: 'manager',
            message: "Please input your new employee's manager's ID.",
            validate: managerIdInput => {
                if (managerIdInput) {
                    return true;
                } else {
                    console.log("Please enter a manager's ID!");
                    return false;
                }
            },
            when: ({confirmManager}) => {
                if (confirmManager) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    ]).then(result => {
        const firstName = result.firstName;
        const lastName = result.lastName;
        const roleId = result.role;
        let managerId = 0;
        if (result.manager) {
            managerId = result.manager;
        } else {
            managerId = null;
        };
        console.log('=============================================================================');
        console.log('Employee added!');
        console.log('=============================================================================');
        db.addNewEmployee(firstName, lastName, roleId, managerId);
        let timeout;
        function myTimeout() {timeout = setTimeout(primaryPrompts, 1000);};
        myTimeout();
    });
}

function quit() {
    return prompt(
        {
            type: 'confirm',
            name: 'quitConfirm',
            message: 'Are you sure you would like to quit the application?',
            default: false
        }
    ).then(res => {
        if (res.quitConfirm === true) {
            process.exit();
        } else {
            console.log('Returning to main menu.');
            let timeout;
            function myTimeout() {timeout = setTimeout(primaryPrompts, 1000);};
            myTimeout();
        }
    });
}