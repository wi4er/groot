module.exports = {
    "in": (result, list, uniqSlug) => {
        result["uniq"] = {
            $elemMatch: {
                uniq: uniqSlug,
                value: {$in: list}
            }
        };
    }
}
