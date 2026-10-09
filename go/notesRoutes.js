const express = require("express");
const AppDataSource = require("./db");
const Note = require("./note");
const authMiddleware = require("./middleware/auth.middleware");
const router = express.Router();

const noteRepository = () => AppDataSource.getRepository(Note);

// GET: Get all notes for the logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const notes = await noteRepository().find({
      where: { user: { id: req.user.id } }
    });

    res.json(notes);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get notes" });
  }
});

// GET: Search notes by title or content
router.get("/search", authMiddleware, async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        message: "Please provide a search query using ?q="
      });
    }

    const notes = await noteRepository()
      .createQueryBuilder("note")
      .where("note.user_id = :userId", { userId: req.user.id })
      .andWhere(
        "(note.title ILIKE :q OR note.content ILIKE :q)",
        { q: `%${q}%` }
      )
      .getMany();

    res.json(notes);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Search failed" });
  }
});

// POST: Create a note
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required"
      });
    }

    const note = noteRepository().create({
      title,
      content,
      user: { id: req.user.id }
    });

    const savedNote = await noteRepository().save(note);

    res.status(201).json(savedNote);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to create note" });
  }
});

// PUT: Update a note belonging to the logged-in user
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, content } = req.body;

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: "Invalid note ID" });
    }

    const repository = noteRepository();

    const note = await repository.findOne({
      where: {
        id,
        user: { id: req.user.id }
      }
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;

    const updatedNote = await repository.save(note);

    res.json(updatedNote);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update note" });
  }
});

// DELETE: Delete a note belonging to the logged-in user
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: "Invalid note ID" });
    }

    const repository = noteRepository();

    const note = await repository.findOne({
      where: {
        id,
        user: { id: req.user.id }
      }
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    await repository.remove(note);

    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to delete note" });
  }
});

module.exports = router;