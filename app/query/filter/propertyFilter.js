module.exports = {
    "in": (result, list, propertySlug) => {
        result[`property.DEF.${propertySlug}`] = {$in: list};
    }
}
