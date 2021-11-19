const mongoose = require("mongoose");
const Image = require("./Image");
const Property = require("./Property");
const Section = require("./Section");
const Description = require("./Description");
const Status = require("./Status");
const Lang = require("./Lang");
const DirectoryValue = require("./DirectoryValue");
const Directory = require("./Directory");

const ContentPropertySchema = new mongoose.Schema({
    value: [String],
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

const ContentDescriptionSchema = new mongoose.Schema({
    value: [String],
    description: {
        type: String,
        ref: Description,
        required: true,
    },
});

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
        ref: DirectoryValue,
    }],
});

const ContentSchema = new mongoose.Schema({
    slug: String,
    timestamp: Date,
    property: [ContentPropertySchema],
    description: [ContentDescriptionSchema],
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
