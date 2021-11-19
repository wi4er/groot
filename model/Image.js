const mongoose = require("mongoose");
const Status = require("./Status");
const Lang = require("./Lang");
const Property = require("./Property");

const ImagePropertySchema = new mongoose.Schema({
    value: [String],
    property: {
        type: String,
        ref: Property,
    },
    lang: {
        type: String,
        ref: Lang,
    },
});

const ImageSchema = new mongoose.Schema({
    _id: String,
    timestamp: Date,
    status: [{
        type: String,
        ref: Status,
    }],
    property: [ImagePropertySchema],
});

ImageSchema.pre("save", require("../cleaner/propertyCleaner"));
ImageSchema.pre("save", require("../cleaner/statusCleaner"));

ImageSchema.pre("save", function (next) {
    this.timestamp = new Date();

    next();
});

module.exports = mongoose.model("image", ImageSchema);
