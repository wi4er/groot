const mongoose = require("mongoose");

const LangSchema = new mongoose.Schema({
    _id: String,
});

module.exports = mongoose.model("lang", LangSchema);
