const mongoose = require("mongoose");
const Status = require("./Status");
const Lang = require("./Lang");
const Property = require("./Property");

const DescriptionPropertySchema = new mongoose.Schema({
    value: String,
    property: {
        type: String,
        ref: Property,
    },
    lang: {
        type: String,
        ref: Lang,
    },
});

const DescriptionSchema = new mongoose.Schema({
    _id: String,
    timestamp: Date,
    status: [{
        type: String,
        ref: Status,
    }],
    property: [DescriptionPropertySchema]
});

DescriptionSchema.pre("save", require("../cleaner/propertyCleaner"));
DescriptionSchema.pre("save", require("../cleaner/statusCleaner"));
DescriptionSchema.pre("save", function (next) {
    this.timestamp = new Date();

    next();
});

module.exports = mongoose.model("description", DescriptionSchema);
