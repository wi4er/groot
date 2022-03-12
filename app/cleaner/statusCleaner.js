module.exports = async function(next) {
    const Status = require("../model/Status");
    const set = new Set(this.status);

    for (const key of set) {
        await Status.findById(key) ?? set.delete(key);
    }

    this.status = [...set];

    next();
}
