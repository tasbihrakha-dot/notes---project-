const { EntitySchema } = require("typeorm");

const Note = new EntitySchema({
    name: "Note",

    tableName: "notes",

    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },

        title: {
            type: "varchar"
        },

        content: {
            type: "text"
        }
    },

    relations: {
        user: {
            type: "many-to-one",
            target: "User",
            inverseSide: "notes",
            joinColumn: {
                name: "user_id"
            },
            nullable: false
        }
    }
});

module.exports = Note;