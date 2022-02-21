const { prompt } = require('inquirer');
const logo = require('asciiart-logo');
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
                    name: 'View Employee By ID',
                    value: 'VIEW_EMPLOYEE_BY_ID'
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
            case 'VIEW_EMPLOYEE_BY_ID':
                viewEmployeeById();
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
            case 'VIEW_DEPARTMENTS':
                viewDepartments();
                break;
            case 'ADD_DEPARTMENT':
                addDepartment();
                break;
            case 'REMOVE_DEPARTMENT':
                removeDepartment();
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
            case 'QUIT':
                quit();
                break;
        }
    })
}

function timerOuter() {
    let timeout;
    function myTimeout() { timeout = setTimeout(primaryPrompts, 800); };
    myTimeout();
}

function viewEmployees() {
    db.findAllEmployees();
    timerOuter();
}

function viewEmployeeById() {
    prompt({
        type: 'number',
        name: 'employeeId',
        message: "Please input the requested employee's ID.",
        validate: employeeIdInput => {
            if (employeeIdInput) {
                return true;
            } else {
                console.log('Invalid entry. To restart the application and return to the main menu, press Ctrl+C on your keyboard to exit the application, then input "node index" into the terminal.');
                return false;
            }
        }
    }).then(res => {
        const employeeId = res.employeeId;
        console.log('===============================================================================');
        db.findEmployeeByID(employeeId);
        timerOuter();
    })
}

function viewEmployeesByDepartment() {
    prompt({
        type: 'list',
        name: 'department',
        message: 'Please choose a department to see employees from that department.',
        choices: ['Sales', 'Engineering', 'Finance', 'Legal']
    }).then(res => {
        const department = res.department;
        console.log('===============================================================================');
        db.findEmployeeByDepartment(department);
        timerOuter();
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
                    console.log('Invalid entry. To restart the application and return to the main menu, press Ctrl+C on your keyboard to exit the application, then input "node index" into the terminal.');
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
            when: ({ confirmManager }) => {
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
        timerOuter();
    });
}

function removeEmployee() {
    db.findAllEmployees();
    console.log('=============================================================================');
    return prompt([
        {
            type: 'number',
            name: 'removeEmployee',
            message: "Please input the ID of the employee you would like to remove.",
            validate: removeEmployeeInput => {
                if (removeEmployeeInput) {
                    return true;
                } else {
                    console.log('Invalid entry. To restart the application and return to the main menu, press Ctrl+C on your keyboard to exit the application, then input "node index" into the terminal.');
                    return false;
                }
            }
        }
    ]).then(res => {
        const removedEmployeeId = res.removeEmployee;
        console.log('=============================================================================');
        console.log('Employee removed!');
        console.log('=============================================================================');
        db.deleteEmployeeRecord(removedEmployeeId);
        timerOuter();
    });
}

function viewRoles() {
    db.findAllRoles();
    timerOuter();
}

function updateEmployeeRole() {
    db.findAllEmployees();
    console.log('=============================================================================');
    db.findAllRoles();
    let timeout;
    function myTimeout() { timeout = setTimeout(updateEmployeeRolePrompts, 800); };
    myTimeout();

    function updateEmployeeRolePrompts() {
        return prompt([
            {
                type: 'number',
                name: 'updatedEmployeeId',
                message: "Please input the ID of the employee whose role you wish to update.",
                validate: updatedEmployeeIdInput => {
                    if (updatedEmployeeIdInput) {
                        return true;
                    } else {
                        console.log('Invalid entry. To restart the application and return to the main menu, press Ctrl+C on your keyboard to exit the application, then input "node index" into the terminal.');
                        return false;
                    }
                }
            },
            {
                type: 'number',
                name: 'updatedEmployeeRole',
                message: "Please input the ID of the new role for the selected employee.",
                validate: updatedEmployeeIdInput => {
                    if (updatedEmployeeIdInput) {
                        return true;
                    } else {
                        console.log('Please enter a role ID!');
                        return false;
                    }
                }
            }
        ]).then(res => {
            const employeeId = res.updatedEmployeeId;
            const employeeRole = res.updatedEmployeeRole;
            console.log('=============================================================================');
            console.log('Employee role updated!');
            console.log('=============================================================================');
            db.updateRoles(employeeId, employeeRole);
            timerOuter();
        });
    }
}

function updateEmployeeManager() {
    db.findAllEmployees();
    console.log('=============================================================================');
    db.findAllManagers();
    let timeout;
    function myTimeout() { timeout = setTimeout(updateEmployeeManagerPrompts, 800); };
    myTimeout();

    function updateEmployeeManagerPrompts() {
        return prompt([
            {
                type: 'number',
                name: 'updatedEmployeeId',
                message: "Please input the ID of the employee whose manager you'd like to update.",
                validate: updatedEmployeeIdInput => {
                    if (updatedEmployeeIdInput) {
                        return true;
                    } else {
                        console.log('Invalid entry. To restart the application and return to the main menu, press Ctrl+C on your keyboard to exit the application, then input "node index" into the terminal.');
                        return false;
                    }
                }
            },
            {
                type: 'number',
                name: 'updatedEmployeeManager',
                message: "Please input the ID of the new manager for the selected employee.",
                validate: updatedEmployeeIdInput => {
                    if (updatedEmployeeIdInput) {
                        return true;
                    } else {
                        console.log('Please enter a manager ID!');
                        return false;
                    }
                }
            }
        ]).then(res => {
            const employeeId = res.updatedEmployeeId;
            const employeeManager = res.updatedEmployeeManager;
            console.log('=============================================================================');
            console.log('Employee manager updated!');
            console.log('=============================================================================');
            db.updateManager(employeeId, employeeManager);
            timerOuter();
        });
    }
}

function viewDepartments() {
    db.findAllDepartments();
    timerOuter();
}

function addRole() {
    return prompt([
        {
            type: 'input',
            name: 'title',
            message: 'Please input a title for the new role.',
            validate: titleInput => {
                if (titleInput) {
                    return true;
                } else {
                    console.log('Invalid entry. To restart the application and return to the main menu, press Ctrl+C on your keyboard to exit the application, then input "node index" into the terminal.');
                    return false;
                }
            }
        },
        {
            type: 'number',
            name: 'salary',
            message: 'Please input a salary amount for the new role.',
            validate: salaryInput => {
                if (salaryInput) {
                    db.findAllDepartments();
                    return true;
                } else {
                    console.log('Please enter a salary amount!');
                    return false;
                }
            }
        },
        {
            type: 'number',
            name: 'departmentId',
            message: 'Please enter a department ID for the new role.',
            validate: departmentInput => {
                if (departmentInput) {
                    return true;
                } else {
                    console.log('Please enter a department ID!');
                    return false;
                }
            }
        }
    ]).then(res => {
        // console.log(res);
        const title = res.title;
        const salary = res.salary;
        const departmentId = res.departmentId;
        console.log('=============================================================================');
        console.log('Role added!');
        console.log('=============================================================================');
        db.addNewRole(title, salary, departmentId);
        timerOuter();
    });
}

function removeRole() {
    db.findAllRoles();
    console.log('=============================================================================');
    return prompt([
        {
            type: 'number',
            name: 'removeRole',
            message: "Please input the ID of the role you would like to remove.",
            validate: removeRoleInput => {
                if (removeRoleInput) {
                    return true;
                } else {
                    console.log('Invalid entry. To restart the application and return to the main menu, press Ctrl+C on your keyboard to exit the application, then input "node index" into the terminal.');
                    return false;
                }
            }
        }
    ]).then(res => {
        const removedRoleId = res.removeRole;
        console.log('=============================================================================');
        console.log('Role removed!');
        console.log('=============================================================================');
        db.deleteRoleRecord(removedRoleId);
        timerOuter();
    });
}

function quit() {
    return prompt(
        {
            type: 'confirm',
            name: 'quitConfirm',
            message: 'Would like to quit the application?',
            default: false
        }
    ).then(res => {
        if (res.quitConfirm === true) {
            process.exit();
        } else {
            console.log('Returning to main menu.');
            timerOuter();
        }
    });
}