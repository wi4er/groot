const mongoose = require("mongoose");
const Status = require("./Status");
const Lang = require("./Lang");
const Property = require("./Property");

const PropertyPropertySchema = new mongoose.Schema({
    value: String,
    property: {
        type: String,
        ref: "property",
    },
    lang: {
        type: String,
        ref: Lang,
    },
});

const PropertySchema = new mongoose.Schema({
    _id: String,
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
