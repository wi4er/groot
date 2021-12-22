const WrongQueryArgument = require("../exception/WrongQueryArgument");

module.exports = sortList => sort => {
    const result = {};

    if (sort) {
        if (!Array.isArray(sort)) {
            sort = [sort];
        }

        for (const item of sort) {
            const [entity, slug, direction] = item.split("-");

            if (
                !entity
                || !slug
                || !direction
            ) {
                throw new WrongQueryArgument("Wrong sort parameter!");
            }

            sortList[entity]?.(result, slug, direction);
        }
    }

    return result;
}
