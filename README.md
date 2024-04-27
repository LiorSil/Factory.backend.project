Link to overview project - https://drive.google.com/file/d/1n2Y26cmCG_RBuJIB84hIYJzmfTfkCWTN/view?usp=drive_link


Factory Management System
Welcome to the Factory Management System! This system is designed to help manage employees, departments, and shifts within a factory setting. Below are the details of the system architecture and the various pages it includes.

System Architecture
Server: Node.js + Express
Database: MongoDB
Frontend: HTML pages with native JavaScript
Pages
Login Page
Users must log in with their username and email.
Authentication is handled using JWT and verified against https://jsonplaceholder.typicode.com/users.
Once logged in, the user's Full Name is displayed on every page.
Includes a "Log-Out" link to redirect the user back to the Log-In Page.
Employees Page
Displays a table with all employee data, including Full Name, Department, and shifts.
Each employee's Full Name is a link that redirects to the "Edit Employee" page.
Each Department name is a link that redirects to the "Edit Department" page.
Includes a "New Employee" button to redirect to the "Add Employee" page.
Provides a dropdown to filter employees by department.
Edit Employee Page
Allows editing of selected employee data.
Includes buttons to update or delete employee data.
Displays a table with all shifts for the selected employee.
Provides an option to register the employee to an existing shift.
New Employee Page
Allows creation of a new employee, including department assignment.
Includes "Save" and "Cancel" buttons.
Departments Page
Displays a table with all department data, including Department name, Manager name, and employees.
Each Employee's Full Name is a link that redirects to the "Edit Employee" page.
Each Department name is a link that redirects to the "Edit Department" page.
Includes a "New Department" button to redirect to the "Add Department" page.
Edit Department Page
Allows editing of selected department data.
Includes buttons to update or delete department data.
Provides a dropdown to add employees to the department.
New Department Page
Allows creation of a new department.
Includes "Save" and "Cancel" buttons.
Shifts Page
Provides options for creating and modifying shifts.
Allows allocation of employees to shifts.
Shifts cannot be deleted.
Users Page
Displays a table with all user data.
Each row represents a user with their name, maximum actions allowed, and current actions allowed for the day.
User data cannot be changed or deleted.
Logging
Logs all user actions, such as viewing pages, adding departments, and deleting employees, in a JSON file on the server.
Users are logged out when they reach their maximum allowed actions for the day.
