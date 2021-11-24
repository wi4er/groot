const mongoose = require("mongoose");
const Status = require("./Status");
const Directory = require("./Directory");
const Property = require("./Property");
const Lang = require("./Lang");
const WrongRefError = require("../exception/WrongRefError");

const ValuePropertySchema = new mongoose.Schema({
    value: {
        type: [String],
        validate: v => v.length > 0,
    },
    property: {
        type: String,
        ref: Property,
    },
    lang: {
        type: String,
        ref: Lang,
    },
});

const ValueSchema = new mongoose.Schema({
    _id: {
        type: String,
        validate: v => v.length > 0,
    },
    timestamp: Date,
    status: [{
        type: String,
        ref: Status,
    }],
    directory: {
        type: String,
        ref: Directory,
    },
    property: [ValuePropertySchema],
});

ValueSchema.pre("save", require("../cleaner/propertyCleaner"));
ValueSchema.pre("save", require("../cleaner/statusCleaner"));
ValueSchema.pre("save", function (next) {
    this.timestamp = new Date();

    next();
});

ValueSchema.post("validate", async function (doc) {
    WrongRefError.assert(
        await Directory.findById(doc.directory),
        "Wrong Directory  type!",
    );
});

module.exports = mongoose.model("value", ValueSchema);
