module.exports = {
    "id": {
        "in": (result, list) => result["_id"] = {$in: list},
    },
    "timestamp": {
        "gt": (result, list) => {
            if (!result["timestamp"]) {
                result["timestamp"] = {};
            }

            result["timestamp"].$gte = list[0];
        },
        "lt": (result, list) => {
            if (!result["timestamp"]) {
                result["timestamp"] = {};
            }

            result["timestamp"].$lte = list[0];
        },
    },
    "created": {
        "gt": (result, list) => {
            if (!result["created"]) {
                result["created"] = {};
            }

            result["created"].$gte = list[0];
        },
        "lt": (result, list) => {
            if (!result["created"]) {
                result["created"] = {};
            }

            result["created"].$lte = list[0];
        },
    },
}
