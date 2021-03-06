const mongoose = require("mongoose");

const LangSchema = new mongoose.Schema({
    _id: {
        type: String,
        validate: v => v?.length > 0,
    },
    timestamp: Date,
    created: {
        type: Date,
        immutable: true,
    },
});

LangSchema.pre("save", function (next) {
    this.timestamp = new Date();

    if (this.isNew) {
        this.created = new Date();
    }

    next();
});

module.exports = mongoose.model("lang", LangSchema);
