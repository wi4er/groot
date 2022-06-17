const mongoose = require("mongoose");
const Flag = require("./Flag");

const PropertySchema = new mongoose.Schema({
    _id: {
        type: String,
        validate: v => v.length > 0,
    },
    timestamp: Date,
    created: {
        type: Date,
        immutable: true,
    },
    flag: [{
        type: String,
        ref: Flag,
    }],
    property: require("./PropertyItem"),
});

PropertySchema.pre("save", require("../cleaner/propertyCleaner"));
PropertySchema.pre("save", require("../cleaner/flagCleaner"));
PropertySchema.pre("save", function (next) {
    this.timestamp = new Date();

    if (this.isNew) {
        this.created = new Date();
    }

    next();
});

module.exports = mongoose.model("property", PropertySchema);
