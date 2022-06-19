const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
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

ImageSchema.pre("save", require("../cleaner/propertyCleaner"));
ImageSchema.pre("save", require("../cleaner/flagCleaner"));

ImageSchema.pre("save", function (next) {
    this.timestamp = new Date();

    if (this.isNew) {
        this.created = new Date();
    }

    next();
});

module.exports = mongoose.model("image", ImageSchema);
