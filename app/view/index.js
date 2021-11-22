const app = require("express")();

app.use(require("cors")({}));
app.use(require('body-parser').json());
app.use(require("../permission"));
app.use(require("../model").createConnection());

app.get("/", (req, res) => {
    res.send("<h1 style='display:flex; justify-content:center; align-items:center; height:100%'>Groot here!</h1>");
});

app.use("/permission/", require("./permission"));
app.use("/content/", require("./content"));
app.use("/description/", require("./description"));
app.use("/directory/", require("./directory"));
app.use("/value/", require("./value"));
app.use("/status/", require("./status"));
app.use("/property/", require("./property"));
app.use("/section/", require("./section"));
app.use("/image/", require("./image"));

app.use(require("../exception"));

module.exports = app;
