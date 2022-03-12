const process = require("process");

class Environment {
    get PORT() {
        return process.env.PORT || 8080;
    }

    get DB_USER() {
        return process.env.DB_USER || "content";
    }

    get DB_PASSWORD() {
        return process.env.DB_PASSWORD || "example";
    }

    /**
     * Хост для базы данных
     */
    get DB_HOST() {
        return process.env.DB_HOST || "localhost";
    }

    /**
     * Порт для базы данных
     */
    get DB_PORT() {
        return process.env.DB_PORT || "27017";
    }

    /**
     * Имя базы банных
     */
    get DB_NAME() {
        return process.env.DB_NAME || "content";
    }

    get DB_URL() {
        return process.env.DB_URL;
    }

    get USE_SSL() {
        return process.env.USE_SSL;
    }

    get SECRET() {
        return process.env.SECRET || "hello world !";
    }

    get CACHE_PATH() {
        return process.env.CACHE_PATH;
    }

    /**
     * Разрешает доступ к публичным ендпоинтам
     */
    get GRAND_PUBLIC_GET() {
        return process.env.GRAND_PUBLIC_GET || false;
    }
}

module.exports = new Environment();
