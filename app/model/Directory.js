const mongoose = require("mongoose");
const Flag = require("./Flag");

const DirectorySchema = new mongoose.Schema({
    _id: {
        type: String,
        validate: v => v?.length > 0,
    },
    timestamp: Date,
    created: {
        type: Date,
        immutable: true,
    },
    flag: require("./schema/FlagSchema"),
    property: require("./schema/PropertySchema"),
});

DirectorySchema.pre("save", require("../cleaner/propertyCleaner"));
DirectorySchema.pre("save", require("../cleaner/flagCleaner"));
DirectorySchema.pre("save", function(next) {
    this.timestamp = new Date();

    if (this.isNew) {
        this.created = new Date();
    }

    next();
});

module.exports = mongoose.model("directory", DirectorySchema);
