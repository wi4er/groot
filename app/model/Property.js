const mongoose = require("mongoose");
const Status = require("./Status");
const Lang = require("./Lang");

const PropertyPropertySchema = new mongoose.Schema({
    value: {
        type: [String],
        validate: v => v.length > 0,
    },
    property: {
        type: String,
        ref: "property",
        required: true,
    },
    lang: {
        type: String,
        ref: Lang,
    },
});

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
    property: [PropertyPropertySchema],
});

PropertySchema.pre("save", require("../cleaner/propertyCleaner"));
PropertySchema.pre("save", require("../cleaner/statusCleaner"));
PropertySchema.pre("save", function (next) {
    this.timestamp = new Date();

    next();
});

module.exports = mongoose.model("property", PropertySchema);
