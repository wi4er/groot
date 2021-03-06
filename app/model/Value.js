const mongoose = require("mongoose");
const Directory = require("./Directory");
const WrongRefError = require("../exception/WrongRefError");

const ValueSchema = new mongoose.Schema({
    _id: {
        type: String,
        validate: v => v?.length > 0,
    },
    timestamp: Date,
    created: {
        type: Date,
        immutable: true,
    },
    directory: {
        type: String,
        ref: Directory,
    },
    flag: require("./schema/FlagSchema"),
    property: require("./schema/PropertySchema"),
});

ValueSchema.pre("save", require("./cleaner/propertyCleaner"));
ValueSchema.pre("save", require("./cleaner/flagCleaner"));
ValueSchema.pre("save", function (next) {
    this.timestamp = new Date();

    if (this.isNew) {
        this.created = new Date();
    }

    next();
});

ValueSchema.post("validate", async function (doc) {
    WrongRefError.assert(
        await Directory.findById(doc.directory),
        "Wrong Directory  type!",
    );
});

module.exports = mongoose.model("value", ValueSchema);
