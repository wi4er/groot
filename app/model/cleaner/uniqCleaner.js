module.exports = async function(next) {
    const Uniq = require("../Uniq");

    for (const index in this.uniq) {
        const inst = await Uniq.findById(this.uniq[index].uniq);

        if (!inst) {
            this.uniq.splice(index, 1);
        }
    }

    next();
}
