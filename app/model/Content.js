const mongoose = require("mongoose");
const Section = require("./Section");
const Status = require("./Status");
const Value = require("./Value");
const {Schema} = require("mongoose");

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
    property: {
        type: Map,
        of: {
            type: Map,
            of: {
                type: Schema.Types.Mixed,
            },
        },
    },
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
    status: [{
        type: String,
        ref: Status,
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
ContentSchema.pre("save", require("../cleaner/statusCleaner"));
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
