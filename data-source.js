require("reflect-metadata");

const { DataSource } = require("typeorm");

const User = require("./user");
const Note = require("./note");

const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "22446688",
    database: "users_notes",

    synchronize: true,
    logging: false,

    entities: [User, Note]
});

module.exports = AppDataSource;