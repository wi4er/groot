const mongoose = require("mongoose");
const Value = require("./Value");

const SectionSchema = new mongoose.Schema({
    timestamp: Date,
    created: {
        type: Date,
        immutable: true,
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
});

SectionSchema.pre("save", require("./cleaner/propertyCleaner"));
SectionSchema.pre("save", require("./cleaner/descriptionCleaner"));
SectionSchema.pre("save", require("./cleaner/flagCleaner"));
SectionSchema.pre("save", require("./cleaner/imageCleaner"));
SectionSchema.pre("save", require("./cleaner/directoryCleaner"));
SectionSchema.pre("save", function (next) {
    this.timestamp = new Date();

    if (this.isNew) {
        this.created = new Date();
    }

    next();
});

module.exports = mongoose.model('section', SectionSchema);
