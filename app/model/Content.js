const mongoose = require("mongoose");
const Image = require("./Image");
const Section = require("./Section");
const Status = require("./Status");
const Value = require("./Value");
const Directory = require("./Directory");

const ContentImageSchema = new mongoose.Schema({
    url: [String],
    image: {
        type: String,
        ref: Image,
        required: true,
    },
});

const ContentDirectorySchema = new mongoose.Schema({
    directory: {
        type: String,
        ref: Directory,
        required: true,
    },
    value: [{
        type: [String],
        ref: Value,
    }],
});

const ContentSchema = new mongoose.Schema({
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
    image: [ContentImageSchema],
    directory: [ContentDirectorySchema],
    status: [{
        type: String,
        ref: Status,
    }],
    section: [{
        type: String,
        ref: Section,
    }],
});

ContentSchema.pre("save", require("../cleaner/propertyCleaner"));
ContentSchema.pre("save", require("../cleaner/descriptionCleaner"));
ContentSchema.pre("save", require("../cleaner/statusCleaner"));
ContentSchema.pre("save", require("../cleaner/imageCleaner"));
ContentSchema.pre("save", require("../cleaner/directoryCleaner"));
ContentSchema.pre("save", function (next) {
    this.timestamp = new Date();

    next();
});

module.exports = mongoose.model('content', ContentSchema);
