const { EntitySchema } = require("typeorm");

const User = new EntitySchema({
  name: "User",
  tableName: "users",

  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },

    name: {
      type: "varchar",
    },

    email: {
      type: "varchar",
      unique: true,
    },

    password: {
      type: "varchar",
    },
  },

  relations: {
    notes: {
      type: "one-to-many",
      target: "Note",
      inverseSide: "user",
    },
  },
});

module.exports = User;