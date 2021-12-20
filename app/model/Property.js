const mongoose = require("mongoose");
const Status = require("./Status");

const PropertySchema = new mongoose.Schema({
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

PropertySchema.pre("save", require("../cleaner/propertyCleaner"));
PropertySchema.pre("save", require("../cleaner/statusCleaner"));
PropertySchema.pre("save", function (next) {
    this.timestamp = new Date();

    next();
});

module.exports = mongoose.model("property", PropertySchema);
