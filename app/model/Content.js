const mongoose = require("mongoose");
const Section = require("./Section");
const Flag = require("./Flag");
const Value = require("./Value");

const ContentSchema = new mongoose.Schema({
    timestamp: Date,
    created: {
        type: Date,
        immutable: true,
    },
    uniq: [{
        uniq: String,
        value: String,
    }],
    property: require("./PropertyItem"),
    description: {
        type: Map,
        of: {
            type: Map,
            of: String,
        },
    },
    image: {
        type: Map,
        of: [{
            url: String,
        }],
    },
    directory: {
        type: Map,
        of: {
            type: [String],
            ref: Value,
        }
    },
    flag: [{
        type: String,
        ref: Flag,
    }],
    section: [{
        type: String,
        ref: Section,
    }],
    event: {
        type: Map,
        of: Date,
    },
});

ContentSchema.pre("save", require("../cleaner/propertyCleaner"));
ContentSchema.pre("save", require("../cleaner/descriptionCleaner"));
ContentSchema.pre("save", require("../cleaner/flagCleaner"));
ContentSchema.pre("save", require("../cleaner/sectionCleaner"));
ContentSchema.pre("save", require("../cleaner/imageCleaner"));
ContentSchema.pre("save", require("../cleaner/directoryCleaner"));
ContentSchema.pre("save", require("../cleaner/eventCleaner"));
ContentSchema.pre("save", require("../cleaner/uniqCleaner"));

ContentSchema.pre("save", function (next) {
    this.timestamp = new Date();

    if (this.isNew) {
        this.created = new Date();
    }

    next();
});

ContentSchema.index(
    {"uniq.value": 1},
    {
        unique: true,
        partialFilterExpression: {"uniq.value": {$exists: true}},
    }
);

const model = mongoose.model('content', ContentSchema);

module.exports = model;
