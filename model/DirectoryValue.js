const mongoose = require("mongoose");
const Status = require("./Status");
const Directory = require("./Directory");
const Property = require("./Property");
const Lang = require("./Lang");
const WrongRefError = require("../exception/WrongRefError");

const DirectoryValuePropertySchema = new mongoose.Schema({
    value: [String],
    property: {
        type: String,
        ref: Property,
    },
    lang: {
        type: String,
        ref: Lang,
    },
});

const DirectoryValueSchema = new mongoose.Schema({
    _id: String,
    timestamp: Date,
    status: [{
        type: String,
        ref: Status,
    }],
    directory: {
        type: String,
        ref: Directory,
    },
    property: [DirectoryValuePropertySchema],
});

DirectoryValueSchema.pre("save", require("../cleaner/propertyCleaner"));
DirectoryValueSchema.pre("save", require("../cleaner/statusCleaner"));
DirectoryValueSchema.pre("save", function (next) {
    this.timestamp = new Date();

    next();
});

DirectoryValueSchema.post("validate", async function (doc) {
    WrongRefError.assert(
        await Directory.findById(doc.directory),
        "Wrong Directory type!",
    );
});

module.exports = mongoose.model("directoryValue", DirectoryValueSchema);
