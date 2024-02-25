const express = require('express');
const cors = require('cors');
const port = 3000;
const app = express();  

 require('./Configs/database');

 app.use(express.json());
 app.use(cors());
 app.options("*", cors());


//controllers or routes
const authController = require('./Controllers/authController');
const employeeController = require('./Controllers/employeeController');
const shiftController = require('./Controllers/shiftController');
const departmentController = require('./Controllers/departmentController');

app.use('/auth', authController);
app.use('/employees', employeeController);
app.use('/shifts', shiftController);
app.use('/departments', departmentController);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});









