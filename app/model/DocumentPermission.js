const mongoose = require("mongoose");

const DocumentPermissionSchema = new mongoose.Schema({
    timestamp: Date,
    created: {
        type: Date,
        immutable: true,
    },
    entity: {
        type: String,
        enum: Object.values(require("../permission/entity")),
        required: true,
    },
    property: {
        type: String,
        required: true,
    },
    group: {
        type: String,
        required: true,
    },
});

DocumentPermissionSchema.pre("save", function(next) {
    this.timestamp = new Date();

    if (this.isNew) {
        this.created = new Date();
    }

    next();
});

module.exports = mongoose.model("document_permission", DocumentPermissionSchema);
