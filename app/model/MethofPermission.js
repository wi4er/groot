const mongoose = require("mongoose");

const MethodPermissionSchema = new mongoose.Schema({
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
    method: {
        type: String,
        enum: Object.values(require("../permission/method")),
        required: true,
    },
    group: {
        type: String,
        required: true,
    },
});

MethodPermissionSchema.pre("save", function(next) {
    this.timestamp = new Date();

    if (this.isNew) {
        this.created = new Date();
    }

    next();
});

module.exports = mongoose.model("method_permission", MethodPermissionSchema);
