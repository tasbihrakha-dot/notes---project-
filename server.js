const express = require("express");
const AppDataSource = require("./data-source");

const app = express();

app.use(express.json());

AppDataSource.initialize()
    .then(() => {
        console.log("Database connected successfully");

        // Create User
        app.post("/users", async (req, res) => {
            try {
                const { name, email } = req.body;

                const userRepository =
                    AppDataSource.getRepository("User");

                const newUser = userRepository.create({
                    name,
                    email
                });

                const savedUser =
                    await userRepository.save(newUser);

                res.status(201).json(savedUser);
            } catch (error) {
                console.log(error);
                res.status(500).json({
                    message: "Error creating user"
                });
            }
        });

        // Get All Users
        app.get("/users", async (req, res) => {
            try {
                const userRepository =
                    AppDataSource.getRepository("User");

                const users =
                    await userRepository.find();

                res.status(200).json(users);
            } catch (error) {
                console.log(error);
                res.status(500).json({
                    message: "Error getting users"
                });
            }
        });

        // Get User By ID with Notes
        app.get("/users/:id", async (req, res) => {
            try {
                const userRepository =
                    AppDataSource.getRepository("User");

                const user = await userRepository.findOne({
                    where: {
                        id: Number(req.params.id)
                    },
                    relations: {
                        notes: true
                    }
                });

                if (!user) {
                    return res.status(404).json({
                        message: "User not found"
                    });
                }

                res.status(200).json(user);
            } catch (error) {
                console.log(error);
                res.status(500).json({
                    message: "Error getting user"
                });
            }
        });

        // Create Note
        app.post("/notes", async (req, res) => {
            try {
                const { title, content, user_id } = req.body;

                const noteRepository =
                    AppDataSource.getRepository("Note");

                const userRepository =
                    AppDataSource.getRepository("User");

                const user = await userRepository.findOneBy({
                    id: Number(user_id)
                });

                if (!user) {
                    return res.status(404).json({
                        message: "User not found"
                    });
                }

                const newNote = noteRepository.create({
                    title,
                    content,
                    user
                });

                const savedNote =
                    await noteRepository.save(newNote);

                res.status(201).json(savedNote);
            } catch (error) {
                console.log(error);
                res.status(500).json({
                    message: "Error creating note"
                });
            }
        });

        // Search Notes by Title using TypeORM QueryBuilder
        app.get("/notes/search", async (req, res) => {
            try {
                const title = req.query.title;

                if (!title || typeof title !== "string") {
                    return res.status(400).json({
                        message: "Please provide a title to search"
                    });
                }

                const noteRepository =
                    AppDataSource.getRepository("Note");

                const notes = await noteRepository
                    .createQueryBuilder("note")
                    .where("note.title ILIKE :title", {
                        title: `%${title}%`
                    })
                    .getMany();

                res.status(200).json(notes);
            } catch (error) {
                console.log(error);
                res.status(500).json({
                    message: "Search failed"
                });
            }
        });

        app.listen(3000, () => {
            console.log("Server running on port 3000");
        });
    })
    .catch((error) => {
        console.log("Database connection failed:", error);
    });