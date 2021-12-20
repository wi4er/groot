const mongoose = require("mongoose");

const LangSchema = new mongoose.Schema({
    _id: {
        type: String,
        validate: v => v.length > 0,
    },
});

module.exports = mongoose.model("lang", LangSchema);
