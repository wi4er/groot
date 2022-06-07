const mongoose = require("mongoose");
const Section = require("./Section");
const Status = require("./Status");
const Value = require("./Value");
const Directory = require("./Directory");
const {Schema} = require("mongoose");

const ContentImageSchema = new mongoose.Schema({
    url: String,
});

const ContentUniqSchema = new mongoose.Schema({
    uniq: String,
    value: String,
});

const ContentSchema = new mongoose.Schema({
    slug: String,
    timestamp: Date,
    uniq: [ContentUniqSchema],
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
        of: [ContentImageSchema],
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

model.once('index', err => {});

module.exports = model;
