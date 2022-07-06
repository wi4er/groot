module.exports = {
    "in": (result, list) => {
        result[`section`] = {$in: list};
    },
}
