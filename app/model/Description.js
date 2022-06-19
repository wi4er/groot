const mongoose = require("mongoose");
const Flag = require("./Flag");

const DescriptionSchema = new mongoose.Schema({
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

DescriptionSchema.pre("save", require("../cleaner/propertyCleaner"));
DescriptionSchema.pre("save", require("../cleaner/flagCleaner"));
DescriptionSchema.pre("save", function (next) {
    this.timestamp = new Date();

    if (this.isNew) {
        this.created = new Date();
    }

    next();
});

module.exports = mongoose.model("description", DescriptionSchema);
