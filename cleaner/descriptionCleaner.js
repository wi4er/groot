module.exports = async function(next) {
    const Description = require("../model/Description");

    for (const key in this.description) {
        const res = await Description.findById(this.description[key].description);

        if (!res) {
            delete this.description[key];
        }
    }

    this.description = this.description.filter(item => item);

    next();
}
