const mongoose = require("mongoose");

function validate(map) {
    for (const [key, value] of map) {
        if (
            typeof value !== "string"
            && typeof value !== "number"
            && typeof value !== "boolean"
            && value !== undefined
            && value !== null
            && !Array.isArray(value)
        ) {
            throw new Error("Wrong property value");
        }
    }
}

const PropertyItemSchema = {
    type: Map,
    of: {
        type: Map,
        of: mongoose.Types.Mixed,
        validate,
    },
};


module.exports = PropertyItemSchema;
