const shiftModel = require('../Models/shiftModel');

const getShifts = async () => {
    return await shiftModel.find();
}

const getShift = async (id) => {
    return await shiftModel.findById(id);
}

const createShift = async (date, startingHour, endingHour) => {    
    const newShift = new shiftModel({date, startingHour, endingHour});
    await newShift.save();
}

module.exports = {
    getShifts,
    createShift,
    getShift
}   





