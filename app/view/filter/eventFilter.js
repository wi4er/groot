module.exports = {
    "in": (result, list) => {
        result[`flag`] = {$in: list};
    },
    "gt": (result, list, eventSlug) => {
        if (!result[`event.${eventSlug}`]) {
            result[`event.${eventSlug}`] = {};
        }

        result[`event.${eventSlug}`].$gte = list[0];
    },
    "lt": (result, list, eventSlug) => {
        if (!result[`event.${eventSlug}`]) {
            result[`event.${eventSlug}`] = {};
        }

        result[`event.${eventSlug}`].$lte = list[0];
    },
}
