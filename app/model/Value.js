const mongoose = require("mongoose");
const Status = require("./Status");
const Directory = require("./Directory");
const Property = require("./Property");
const Lang = require("./Lang");
const WrongRefError = require("../exception/WrongRefError");

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
    property: {
        type: Map,
        of: {
            type: Map,
            of: [String],
        },
    },
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
