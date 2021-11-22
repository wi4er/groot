const mongoose = require("mongoose");
const Image = require("./Image");
const Property = require("./Property");
const Description = require("./Description");
const Status = require("./Status");
const Lang = require("./Lang");
const  DirectoryValue = require("./Value");

const SectionPropertySchema = new mongoose.Schema({
    value: {
        type: [String],
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

const SectionDescriptionSchema = new mongoose.Schema({
    value: [String],
    description: {
        type: String,
        ref: Description
    },
});

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
    property: [SectionPropertySchema],
    description: [SectionDescriptionSchema],
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
