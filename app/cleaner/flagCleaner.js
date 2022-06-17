const Flag = require("../model/Flag");
module.exports = async function(next) {
    const Flag = require("../model/Flag");
    const set = new Set(this.flag);

    for (const key of set) {
        await Flag.findById(key) ?? set.delete(key);
    }

    if (set.size) {
        this.flag = [...set];
    } else {
        this.flag = undefined;
    }

    next();
}