const Value = require("../model/Value");
module.exports = async function (next) {
    const Directory = require("../model/Directory");
    const Value = require("../model/Value");

    for (const key of this.directory?.keys() ?? []) {
        if (!await Directory.findById(key)) {
            this.directory.delete(key);
        } else {
            let values = new Set(this.directory.get(key));

            for (const subKey of values) {
                await Value.findById(subKey) ?? values.delete(subKey);
            }

            if (values.size) {
                this.directory.set(key, [...values]);
            } else {
                this.directory.delete(key);
            }
        }
    }

    next();
}
