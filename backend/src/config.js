require('dotenv').config();

module.exports = {
    postgres: {
        user: process.env.PG_USER,
        host: process.env.PG_HOST,
        database: process.env.PG_DB,
        password: process.env.PG_PASSWORD,
        port: process.env.PG_PORT
    },
    port : process.env.BACKEND_PORT
};