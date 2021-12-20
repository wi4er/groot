const mongoose = require("mongoose");
const Image = require("./Image");
const Status = require("./Status");
const  DirectoryValue = require("./Value");

const SectionImageSchema = new mongoose.Schema({
    url: String,
    image: {
        type: String,
        ref: Image
    },
});

const SectionDirectorySchema = new mongoose.Schema({
    value: {
        type: String,
        ref: DirectoryValue,
    },
});

const SectionSchema = new mongoose.Schema({
    slug: String,
    timestamp: Date,
    property: {
        type: Map,
        of: {
            type: Map,
            of: [String],
        },
    },
    description: {
        type: Map,
        of: {
            type: Map,
            of: [String],
        },
    },
    image: [SectionImageSchema],
    directory: [SectionDirectorySchema],
    status: [{
        type: String,
        ref: Status,
    }],
});

SectionSchema.pre("save", require("../cleaner/propertyCleaner"));
SectionSchema.pre("save", require("../cleaner/descriptionCleaner"));
SectionSchema.pre("save", require("../cleaner/statusCleaner"));
SectionSchema.pre("save", require("../cleaner/imageCleaner"));
SectionSchema.pre("save", require("../cleaner/directoryCleaner"));
SectionSchema.pre("save", function (next) {
    this.timestamp = new Date();

    next();
});

module.exports = mongoose.model('section', SectionSchema);
