module.exports = async function(next) {
    const Section = require("../model/Section");
    const set = new Set(this.section);

    for (const key of set) {
        await Section.findById(key) ?? set.delete(key);
    }

    if (set.size) {
        this.section = [...set];
    } else {
        this.section = undefined;
    }

    next();
}
