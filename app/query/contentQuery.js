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
        // result[`property.DEF.${propertySlug}`] = {$in: list};
        // result["property"] = {$elemMatch: {[propertySlug]: {$in: list}}};
    },
    "directory": (result, list, directorySlug) => {
        result[`directory.${directorySlug}`] = {$in: list};
    },
    "event": (result, list, eventSlug) => {
        result[`event.${eventSlug}`] = {$gt: list[0], $lt: list[1]};
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
