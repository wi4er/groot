const mongoose = require("mongoose");
const Status = require("./Status");

const DescriptionSchema = new mongoose.Schema({
    _id: {
        type: String,
        validate: v => v.length > 0,
    },
    timestamp: Date,
    status: [{
        type: String,
        ref: Status,
    }],
    property:  {
        type: Map,
        of: {
            type: Map,
            of: [String],
        },
    },
});

DescriptionSchema.pre("save", require("../cleaner/propertyCleaner"));
DescriptionSchema.pre("save", require("../cleaner/statusCleaner"));
DescriptionSchema.pre("save", function (next) {
    this.timestamp = new Date();

    next();
});

module.exports = mongoose.model("description", DescriptionSchema);
