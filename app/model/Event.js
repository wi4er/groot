const mongoose = require("mongoose");
const Flag = require("./Flag");

const EventSchema = new mongoose.Schema({
    _id: {
        type: String,
        validate: v => v?.length > 0,
    },
    timestamp: Date,
    created: {
        type: Date,
        immutable: true,
    },
    flag: require("./schema/FlagSchema"),
    property: require("./schema/PropertySchema"),
});

EventSchema.pre("save", require("../cleaner/propertyCleaner"));
EventSchema.pre("save", require("../cleaner/flagCleaner"));
EventSchema.pre("save", function (next) {
    this.timestamp = new Date();

    if (this.isNew) {
        this.created = new Date();
    }

    next();
});

module.exports = mongoose.model("event", EventSchema);
