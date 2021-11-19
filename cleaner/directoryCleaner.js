module.exports = async function(next) {
    const Directory = require("../model/Directory");

    for (const key in this.directory) {
        const res = await Directory.findById(this.directory[key].directory);

        if (!res) {
            delete this.directory[key];
        }
    }

    this.directory = this.directory.filter(item => item);

    next();
}
