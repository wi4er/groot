const mongoose = require("mongoose");


function getConnectionUrl() {
    if (process.env.DB_URL) {
        return process.env.DB_URL; //mongodb+srv://doadmin:2B8Fwe1M453E0vi6@db-mongodb-fra1-27972-824c3788.mongo.ondigitalocean.com/admin?authSource=admin&replicaSet=db-mongodb-fra1-27972
    }

    return [
        "mongodb://",
        process.env.DB_USER || "content",
        ":",
        process.env.DB_PASSWORD || "example",
        "@",
        process.env.DB_HOST || "localhost",
        ":",
        process.env.DB_PORT || "27017",
        "/",
        process.env.DB_NAME || "content"
    ].join("");
}

function getConnectionOptions() {
    const options = {};

    if (process.env.USE_SSL) {
        options.ssl = true;
        options.sslCA = process.env.USE_SSL;
    }

    return options;
}

module.exports = {
    connection: null,
    connect() {
        if (!this.connection) {
            return mongoose.connect(getConnectionUrl(), getConnectionOptions())
                .then(conn => this.connection = conn)

        } else {
            return Promise.resolve(this.connection);
        }
    },
    disconnect() {
        return this.connection?.close?.();
    },
    async clearDatabase() {
        const coll = Object.values(mongoose.connection.collections);

        for (const item of coll) {
            await item.deleteMany({});
        }
    },
    createConnection() {
        return (req, res, next) => {
            this.connect()
                .then(() => next())
                .catch(err => res.send(err.message));
        }
    }
}
