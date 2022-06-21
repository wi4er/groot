const WrongIdError = require("../../exception/WrongIdError");

function createGet(Model, query) {
    return (req, res, next) => {
        const {query: {filter, sort, limit, offset}} = req;
        
        const parsedFilter = query.parseFilter(filter);
        const parsedSort = query.parseSort(sort);

        Promise.all([
            Model.count(parsedFilter),
            Model.find(parsedFilter)
                .sort(parsedSort)
                .limit(+limit)
                .skip(+offset)
        ])
            .then(([count, result]) => {
                res.header("total-row-count", count);
                res.header("Access-Control-Expose-Headers", "total-row-count");

                res.json(result);
            })
            .catch(next);
    }
}

function createGetById(Model) {
    return (req, res, next) => {
        const {params: {id}} = req;

        Model.findById(id)
            .then(result => {
                WrongIdError.assert(result, `Cant find ${Model.modelName} with id ${id}!`);

                res.json(result);
            })
            .catch(next);
    }
}

function createPost(Model) {
    return (req, res, next) => {
        new Model(req.body).save()
            .then(inst => {
                res.status(201);

                res.json(inst);
            })
            .catch(next);
    }
}

function createPut(Model) {
    return (req, res, next) => {
        const {params: {id}} = req;

        WrongIdError.assert(id === req.body._id, "Wrong id in body request");

        Model.findById(id)
            .then(result => {
                WrongIdError.assert(result, `Cant update ${Model.modelName} with id ${id}!`);

                return Object.assign(result, req.body).save();
            })
            .then(saved => res.json(saved))
            .catch(next);
    }
}

function createDelete(Model) {
    return  (req, res, next) => {
        const {params: {id}} = req;

        Model.findById(id)
            .then(async property => {
                WrongIdError.assert(property, `Cant delete ${Model.modelName} with id ${id}!`);
                WrongIdError.assert(await property.delete(), `Cant delete ${Model.modelName} with id ${id}!`);

                res.json(property);
            })
            .catch(next);
    }
}

module.exports = {
    createGet,
    createGetById,
    createPost,
    createPut,
    createDelete,
};
