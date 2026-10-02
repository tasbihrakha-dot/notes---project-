const express = require("express");
const fs = require("fs");

const app = express();

app.use(express.json());



app.get("/notes", (req, res) => {

    fs.readFile("notes.json", "utf8", (err, data) => {

        if (err) {
            return res.status(500).send("Error reading notes");
        }

        res.json(JSON.parse(data));
    });

});



app.post("/notes", (req, res) => {

    fs.readFile("notes.json", "utf8", (err, data) => {

        if (err) {
            return res.status(500).send("Error reading notes");
        }

        let notes = JSON.parse(data);

        let newNote = {
            id: notes.length + 1


            title: req.body.title,
            content: req.body.content
        };

        notes.push(newNote);

        fs.writeFile(
            "notes.json",
            JSON.stringify(notes, null, 2),
            (err) => {

                if (err) {
                    return res.status(500).send("Error saving note");
                }

                res.json(newNote);
            }
        );

    });

});



app.put("/notes/:id", (req, res) => {

    fs.readFile("notes.json", "utf8", (err, data) => {

        if (err) {
            return res.status(500).send("Error reading notes");
        }

        let notes = JSON.parse(data);
        let id = Number(req.params.id);

        let found = false;

        for (let i = 0; i < notes.length; i++) {

            if (notes[i].id === id) {

                notes[i].title = req.body.title;
                notes[i].content = req.body.content;

                found = true;
            }
        }

        if (!found) {
            return res.status(404).send("Note not found");
        }

        fs.writeFile(
            "notes.json",
            JSON.stringify(notes, null, 2),
            (err) => {

                if (err) {
                    return res.status(500).send("Error saving note");
                }

                res.json(notes);
            }
        );

    });

})

app.delete("/notes/:id", (req, res) => {

    fs.readFile("notes.json", "utf8", (err, data) => {

        if (err) {
            return res.status(500).send("Error reading notes");
        }

        let notes = JSON.parse(data);
        let id = Number(req.params.id);

        let newNotes = [];

        for (let i = 0; i < notes.length; i++) {

            if (notes[i].id !== id) {
                newNotes.push(notes[i]);
            }
        }

        if (newNotes.length === notes.length) {
            return res.status(404).send("Note not found");
        }

        fs.writeFile(
            "notes.json",
            JSON.stringify(newNotes, null, 2),
            (err) => {

                if (err) {
                    return res.status(500).send("Error saving notes");
                }

                res.json({
                    message: "Note deleted successfully"
                });
            }
        );

    });

});

app.listen(4000, () => {
    console.log("Server is running on port 4000");
});