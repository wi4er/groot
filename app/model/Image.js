const mongoose = require("mongoose");
const Status = require("./Status");

const ImageSchema = new mongoose.Schema({
    _id: {
        type: String,
        validate: v => v.length > 0,
    },
    timestamp: Date,
    status: [{
        type: String,
        ref: Status,
    }],
    property: {
        type: Map,
        of: {
            type: Map,
            of: [String],
        },
    },
});

ImageSchema.pre("save", require("../cleaner/propertyCleaner"));
ImageSchema.pre("save", require("../cleaner/statusCleaner"));

ImageSchema.pre("save", function (next) {
    this.timestamp = new Date();

    next();
});

module.exports = mongoose.model("image", ImageSchema);
