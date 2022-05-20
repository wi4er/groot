const mongoose = require("mongoose");
const Section = require("./Section");
const Status = require("./Status");
const Value = require("./Value");
const Directory = require("./Directory");
const {Schema} = require("mongoose");

const ContentImageSchema = new mongoose.Schema({
    url: String,
});

const ContentSchema = new mongoose.Schema({
    slug: String,
    timestamp: Date,
    property: {
        type: Map,
        of: {
            type: Map,
            of: [Schema.Types.Mixed],
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

ContentSchema.pre("save", function (next) {
    this.timestamp = new Date();

    next();
});

module.exports = mongoose.model('content', ContentSchema);
