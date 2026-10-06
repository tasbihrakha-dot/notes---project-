const express = require("express");
const pool = require("./db");

const app = express();
console.log("THIS IS MY SERVER FILE");

app.use(express.json());


app.get("/notes", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM notes");

        res.json(result.rows);
    } catch (error) {
        console.log(error);
        res.status(500).send("Database error");
    }
});


app.post("/notes", async (req, res) => {
    try {
        const { title, content } = req.body;

        const result = await pool.query(
            "INSERT INTO notes (title, content) VALUES ($1, $2) RETURNING *",
            [title, content]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.log(error);
        res.status(500).send("Database error");
    }
});


app.put("/notes/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;

        const result = await pool.query(
            "UPDATE notes SET title = $1, content = $2 WHERE id = $3 RETURNING *",
            [title, content, id]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.log(error);
        res.status(500).send("Database error");
    }
});
app.delete("/notes/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM notes WHERE id = $1 RETURNING *",
            [id]
        );

        res.json({
            message: "Note deleted successfully",
            note: result.rows[0]
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Database error");
    }
});


app.get("/notes/search", async (req, res) => {
    try {
        const { title } = req.query;

        const result = await pool.query(
            "SELECT * FROM notes WHERE title ILIKE $1",
            [`%${title}%`]
        );

        res.json(result.rows);
    } catch (error) {
        console.log(error);
        res.status(500).send("Database error");
    }
});

app.listen(4000, () => {
    console.log("Server is running on port 4000");
});