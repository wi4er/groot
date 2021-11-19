const mongoose = require("mongoose");
const Status = require("./Status");
const Property = require("./Property");
const Lang = require("./Lang");

const DirectoryPropertySchema = new mongoose.Schema({
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

const DirectorySchema = new mongoose.Schema({
    _id: String,
    timestamp: Date,
    status: [{
        type: String,
        ref: Status,
    }],
    property: [DirectoryPropertySchema],
});

DirectorySchema.pre("save", require("../cleaner/propertyCleaner"));
DirectorySchema.pre("save", require("../cleaner/statusCleaner"));
DirectorySchema.pre("save", function(next) {
    this.timestamp = new Date();

    next();
});

module.exports = mongoose.model("directory", DirectorySchema);
