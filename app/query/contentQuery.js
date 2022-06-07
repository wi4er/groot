const filterList = {
    "field": (result, list, fieldName) => {
        if (fieldName === "id") {
            result["_id"] = {$in: list};
        } else {
            result[fieldName] = {$in: list};
        }
    },
    "status": (result, list) => {
        result["status"] = {$in: list};
    },
    "property": (result, list, propertySlug) => {
        result[`property.DEF.${propertySlug}`] = {$in: list};
    },
    "directory": (result, list, directorySlug) => {
        result[`directory.${directorySlug}`] = {$in: list};
    },
    "uniq": (result, list, uniqSlug) => {
        if (uniqSlug) {
            result["uniq"] = {$elemMatch: {uniq: uniqSlug, value: {$in: list}}};
        } else {
            result["uniq.value"] = {$in: list};
        }
    },
    "event": (result, list, eventSlug) => {
        if (
            !result[`event.${eventSlug}`]
            && list.length > 0
        ) {
            result[`event.${eventSlug}`] = {};
        }

        if (list[0]) {
            result[`event.${eventSlug}`].$gte = list[0];
        }

        if (list[1]) {
            result[`event.${eventSlug}`].$lte = list[1];
        }
    }
}

const sortList = {
    "field": (result, fieldName, direction) => {
        result[fieldName] = direction;
    },
    "status": (result, statusName, direction) => {
        result["status"] = "asc";
    },
}

module.exports = {
    parseFilter: require("./filterParser")(filterList),
    parseSort: require("./sortParser")(sortList),
};
