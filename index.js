const env = require("./environment")
const chalk = require("chalk");
const http = require("http");

http.createServer(require("./app")).listen(env.PORT, err => {
    if (err) {
        console.log(chalk.bgRed(err));
    } else {
        console.log(chalk.greenBright(`>>> Server starts at ${env.PORT} >>>>`));
    }
});
