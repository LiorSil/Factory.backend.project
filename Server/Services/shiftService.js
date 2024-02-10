const shiftRepo = require('../Repositories/shiftRepo');

const getShifts = async () => {
    const shifts = await shiftRepo.getShifts();
    return shifts;
}  

const getShiftByID = async (id) => {
    const shift = await shiftRepo.getShift(id);
    return shift;
}



module.exports = {
    getShifts,
    getShiftByID
}   