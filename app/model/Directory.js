const mongoose = require("mongoose");
const Status = require("./Status");

const DirectorySchema = new mongoose.Schema({
    _id: {
        type: String,
        validate: v => v.length > 0,
    },    timestamp: Date,
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

DirectorySchema.pre("save", require("../cleaner/propertyCleaner"));
DirectorySchema.pre("save", require("../cleaner/statusCleaner"));
DirectorySchema.pre("save", function(next) {
    this.timestamp = new Date();

    next();
});

module.exports = mongoose.model("directory", DirectorySchema);
