module.exports = async function(next) {
    const Event = require("../model/Event");

    if (this.event) {
        for (const key of this.event.keys()) {
            await Event.findById(key) ?? this.event.delete(key);
        }
    }

    next();
}
