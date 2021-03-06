const mongoose = require("mongoose");
const Section = require("./Section");
const Value = require("./Value");

const ContentSchema = new mongoose.Schema({
    timestamp: Date,
    created: {
        type: Date,
        immutable: true,
    },
    uniq: require("./schema/UniqSchema"),
    property: require("./schema/PropertySchema"),
    flag: require("./schema/FlagSchema"),
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
    section: {
        type: [{
            type: mongoose.Types.ObjectId,
            ref: Section,
        }],
        default: undefined,
    },
    event: {
        type: Map,
        of: Date,
    },
});

ContentSchema.pre("save", require("./cleaner/propertyCleaner"));
ContentSchema.pre("save", require("./cleaner/descriptionCleaner"));
ContentSchema.pre("save", require("./cleaner/flagCleaner"));
ContentSchema.pre("save", require("./cleaner/sectionCleaner"));
ContentSchema.pre("save", require("./cleaner/imageCleaner"));
ContentSchema.pre("save", require("./cleaner/directoryCleaner"));
ContentSchema.pre("save", require("./cleaner/eventCleaner"));
ContentSchema.pre("save", require("./cleaner/uniqCleaner"));

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

module.exports =  mongoose.model('content', ContentSchema);
