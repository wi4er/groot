const redis = require("redis");
const env = require("../../environment");
let client;

module.exports = key => (req, res, next) => {
    if (env.CACHE_PATH) {
        if (!client) {
            client = redis.createClient({
                host: env.CACHE_PATH
            });

            client.on("error", function (error) {
                console.error(error);
            });
        }
        res.cache = client;

        res.json = data => {
            res.json(data);
            client.set(req.originalUrl, JSON.stringify(data));
        }

        res.clearKey = clear => {
            client.flushall("ASYNC");
        }

        if (!key) {
            next();
        } else {
            client.get(req.originalUrl, (err, data) => {
                if (data) {
                    res.send(data);
                } else {
                    next();
                }
            });
        }
    } else {
        res.clearKey = clear => {}
        next();
    }
}
