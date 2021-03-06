const mongoose = require("mongoose");
const env = require("../../environment");

class Model {
    connection = null;

    constructor() {
        const res = this.createConnection.bind(this)
        res.disconnect = this.disconnect.bind(this);
        res.connect = this.connect.bind(this);
        res.clearDatabase = this.clearDatabase.bind(this);

        return res;
    }

    getConnectionUrl() {
        if (env.DB_URL) {
            return env.DB_URL;
        }

        return [
            "mongodb://",
            env.DB_USER,
            ":",
            env.DB_PASSWORD,
            "@",
            env.DB_HOST,
            ":",
            env.DB_PORT,
            "/",
            env.DB_NAME,
        ].join("");
    }

    getConnectionOptions() {
        const options = {
            serverSelectionTimeoutMS: 1000,
        };

        if (env.USE_SSL) {
            options.ssl = true;
            options.sslCA = env.USE_SSL;
        }

        return options;
    }

    connect() {
        if (!this.connection) {
            return mongoose.connect(this.getConnectionUrl(), this.getConnectionOptions())
                .then(conn => this.connection = conn);
        } else {
            return Promise.resolve(this.connection);
        }
    }

    disconnect() {
        return this.connection?.close?.();
    }

    async clearDatabase() {
        const coll = Object.values(mongoose.connection.collections);

        for (const item of coll) {
            await item.deleteMany({});
        }
    }

    createConnection(req, res, next) {
        this.connect()
            .then(() => Promise.all([
                require("./Content").ensureIndexes(),
                require("./Section").ensureIndexes(),
            ]))
            .then(() => next())
            .catch(err => next(err));
    }
}

module.exports = new Model();
