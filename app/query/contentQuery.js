const filterList = {
    "field_id": (result, list) => {
        result["_id"] = {$in: list};
    },
    "field_slug": (result, list) => {
        result["slug"] = {$in: list};
    },
    "status": (result, list) => {
        result["status"] = {$in: list};
    },
}

const sortList = {
    "slug_asc": (result) => {
        result["slug"] = "asc";
    },
    "slug_desc": (result) => {
        result["slug"] = "asc";
    },
    "status_STATUS_asc": (result) => {
        result["status"] = "asc";
    },
}

module.exports = {
    parseFilter: require("./queryParser")(filterList),
    parseSort: sort => {
        const result = {};

        if (!Array.isArray(sort)) {
            sort = [sort];
        }
        
        for (let item of sort) {
            if (sortList[item]) {
                sortList[item](result);
            }
        }

        return result;
    }
};
