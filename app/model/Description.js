const mongoose = require("mongoose");
const Status = require("./Status");
const Lang = require("./Lang");
const Property = require("./Property");

const DescriptionPropertySchema = new mongoose.Schema({
    value: {
        type: [String],
        required: true,
        validate: v => v.length > 0,
    },
    property: {
        type: String,
        ref: Property,
        required: true,
    },
    lang: {
        type: String,
        ref: Lang,
    },
});

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
    property: [DescriptionPropertySchema]
});

DescriptionSchema.pre("save", require("../cleaner/propertyCleaner"));
DescriptionSchema.pre("save", require("../cleaner/statusCleaner"));
DescriptionSchema.pre("save", function (next) {
    this.timestamp = new Date();

    next();
});

module.exports = mongoose.model("description", DescriptionSchema);
