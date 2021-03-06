module.exports = {
    "in": (result, list) => {
        result[`flag`] = {$in: list};
    },
    "and": (result, list) => {
        if (!result["$and"]) {
            result["$and"] = [];
        }

        for (const item of list) {
            result["$and"].push({flag: item})
        }
    },
}
