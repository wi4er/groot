const mongoose = require("mongoose");
const Status = require("./Status");

const EventSchema = new mongoose.Schema({
    _id: {
        type: String,
        validate: v => v.length > 0,
    },
    timestamp: Date,
    status: [{
        type: String,
        ref: Status,
    }],
    property: {
        type: Map,
        of: {
            type: Map,
            of: [String],
        },
    },
});

EventSchema.pre("save", require("../cleaner/propertyCleaner"));
EventSchema.pre("save", require("../cleaner/statusCleaner"));
EventSchema.pre("save", function (next) {
    this.timestamp = new Date();

    next();
});

module.exports = mongoose.model("event", EventSchema);
