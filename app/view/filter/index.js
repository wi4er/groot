const WrongQueryArgument = require("../../exception/WrongQueryArgument");

function formatArguments(args) {
    if (Array.isArray(args)) {
        return args;
    } else {
        return args.split(";");
    }
}

module.exports = list => (filter = []) => {
    const result = {};

    if (!Array.isArray(filter)) {
        filter = [filter];
    }
    
    for (const item of filter) {
        for (const key in item) {
            for (const field in item[key]) {
                if (typeof list[key][field] === "function") {
                    list[key][field](result, formatArguments(item[key][field]));

                    continue;
                }

                for (const operation in item[key][field]) {
                    const params = formatArguments(item[key][field][operation]);

                    if (typeof list[key][operation] === "function") {
                        list[key]?.[operation]?.(result, params, field);
                    } else if (typeof list[key]?.[field]?.[operation] === "function") {
                        list[key]?.[field]?.[operation]?.(result, params);
                    } else {
                        throw new WrongQueryArgument("Wrong query argument!");
                    }
                }
            }
        }
    }

    return result;
}
