const mongoose = require("mongoose");
const Image = require("./Image");
const Flag = require("./Flag");
const DirectoryValue = require("./Value");

const SectionSchema = new mongoose.Schema({
    slug: String,
    timestamp: Date,
    created: {
        type: Date,
        immutable: true,
    },
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
        }]
    },
    directory: {
        type: [{
            value: {
                type: String,
                ref: DirectoryValue,
            },
        }],
        default: undefined,
    },
    flag: {
        type: [{
            type: String,
            ref: Flag,
        }],
        default: undefined,
    },
});

SectionSchema.pre("save", require("../cleaner/propertyCleaner"));
SectionSchema.pre("save", require("../cleaner/descriptionCleaner"));
SectionSchema.pre("save", require("../cleaner/flagCleaner"));
SectionSchema.pre("save", require("../cleaner/imageCleaner"));
SectionSchema.pre("save", require("../cleaner/directoryCleaner"));
SectionSchema.pre("save", function (next) {
    this.timestamp = new Date();

    if (this.isNew) {
        this.created = new Date();
    }

    next();
});

module.exports = mongoose.model('section', SectionSchema);
