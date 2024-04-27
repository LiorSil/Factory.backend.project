const mongoose = require('mongoose');

    console.log('Connecting to database...');
    mongoose
      .connect("mongodb://127.0.0.1:27017/FactoryDB", {})
      .then(() => console.log("Connected to database"))
      .catch((err) => console.error(err));
    

