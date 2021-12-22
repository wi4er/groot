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
