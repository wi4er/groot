try {
    const app = require("express")();

    app.use(require("cors")({}));
    app.use(require('body-parser').json());
    app.use(require("./permission"));
    app.use(require("./model"));

    app.get("/", (req, res) => {
        res.send("<h1 style='display:flex; justify-content:center; align-items:center; height:100%'>Groot here!</h1>");
    });

    app.use("/permission/", require("./view/permission"));
    app.use("/content/", require("./view/content"));
    app.use("/description/", require("./view/description"));
    app.use("/directory/", require("./view/directory"));
    app.use("/value/", require("./view/value"));
    app.use("/flag/", require("./view/flag"));
    app.use("/property/", require("./view/property"));
    app.use("/section/", require("./view/section"));
    app.use("/image/", require("./view/image"));
    app.use("/event/", require("./view/event"));
    app.use("/uniq/", require("./view/uniq"));
    app.use("/lang/", require("./view/lang"));

    app.use(require("./exception"));

    module.exports = app;
} catch (e) {
    module.exports = (req, res) => {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify({message: e.message}));
        res.end();
    }
}

