module.exports = async function(next) {
    const Status = require("../model/Status");

    for (const key in this.status) {
        const res = await Status.findById(this.status[key]);

        if (!res) {
            delete this.status[key];
        }
    }

    this.status = this.status.filter(item => item);

    next();
}
