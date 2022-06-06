const mongoose = require("mongoose");

const UniqSchema = new mongoose.Schema({
    _id: {
        type: String,
        validate: v => v.length > 0,
    },
    timestamp: Date,
});

UniqSchema.pre("save", function(next) {
    this.timestamp = new Date();

    next();
});

module.exports = mongoose.model("uniq", UniqSchema);
