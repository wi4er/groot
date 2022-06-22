module.exports = {
    "in": (result, list, uniqSlug) => {
        if (uniqSlug) {
            result["uniq"] = {
                $elemMatch: {
                    uniq: uniqSlug,
                    value: {$in: list}
                }
            };
        } else {
            result["uniq"] = {
                $elemMatch: {
                    value: {$in: list}
                }
            };
        }
    }
}
