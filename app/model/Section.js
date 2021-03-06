const mongoose = require("mongoose");
const Value = require("./Value");

const SectionSchema = new mongoose.Schema({
    timestamp: Date,
    created: {
        type: Date,
        immutable: true,
    },
    section: {
        type: mongoose.Types.ObjectId,
    },
    uniq: require("./schema/UniqSchema"),
    flag: require("./schema/FlagSchema"),
    property: require("./schema/PropertySchema"),
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
        }]
    },
    directory: {
        type: Map,
        of: {
            type: [String],
            ref: Value,
        },
    },
    event: {
        type: Map,
        of: Date,
    },
});

SectionSchema.pre("save", require("./cleaner/propertyCleaner"));
SectionSchema.pre("save", require("./cleaner/descriptionCleaner"));
SectionSchema.pre("save", require("./cleaner/flagCleaner"));
SectionSchema.pre("save", require("./cleaner/imageCleaner"));
SectionSchema.pre("save", require("./cleaner/directoryCleaner"));
SectionSchema.pre("save", require("./cleaner/eventCleaner"));
SectionSchema.pre("save", require("./cleaner/uniqCleaner"));
SectionSchema.pre("save", function (next) {
    this.timestamp = new Date();

    if (this.isNew) {
        this.created = new Date();
    }

    next();
});

SectionSchema.index(
    {"uniq.value": 1},
    {
        unique: true,
        partialFilterExpression: {"uniq.value": {$exists: true}},
    }
);

module.exports = mongoose.model('section', SectionSchema);
