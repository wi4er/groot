const mongoose = require("mongoose");

const StatusSchema = new mongoose.Schema({
    _id: {
        type: String,
        validate: v => v.length > 0,
    },
    timestamp: Date,
});

StatusSchema.pre("save", function(next) {
    this.timestamp = new Date();

    next();
});

module.exports = mongoose.model("status", StatusSchema);
