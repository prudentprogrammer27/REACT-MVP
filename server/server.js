import express from "express";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const { PORT, DATABASE_URL } = process.env;

const client = new pg.Client({
  connectionString: DATABASE_URL,
});

await client.connect();

const app = express();

app.use(express.json());

app.get("/api/tasks", (req, res) => {
  client.query("SELECT * FROM tasks").then((result) => {
    res.send(result.rows);
  });
});

app.get("/api/tasks/:taskId", (req, res) => {
  const taskId = req.params.taskId;

  if (!(/^\d+$/.test(taskId))) {
    return res.status(400).json({ error: "Invalid task ID"})
  };

  const query = "SELECT * FROM tasks WHERE id = $1";
  const values = [taskId];

  client.query(query, values) 
    .then((result) => {
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Task not found" })
      };

      const deletedTask = result.rows[0];
      res.status(200).json(deletedTask);
    })

})

app.post("/api/tasks", (req, res) => {
  const { description } = req.body;

  if (typeof description !== 'string') {
    return res.status(400).json({ error: "Input required"})
  };

  const query = "INSERT INTO tasks (description) VALUES ($1) RETURNING *"
  const values = [description]

  client.query(query, values)
  .then((result) => {
    const newTask = result.rows[0];
    res.status(201).json(newTask);
  })
  .catch((error) => {
    console.error("Error adding task:", error);
    res.status(500).json({ error: "Internal Server Error" });
  });
});

app.delete("/api/tasks/:id", (req, res) => {
  const id = req.params.id; // Corrected from req.params.taskId to req.params.id

  if (!(/^\d+$/.test(id))) {
    return res.status(400).json({ error: "Invalid task ID" });
  }

  const query = "DELETE FROM tasks WHERE id = $1 RETURNING *";
  const values = [id];

  client.query(query, values)
    .then((result) => {
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Task not found" });
      }

      const deletedTask = result.rows[0];
      res.status(200).json(deletedTask);
    })
    .catch((error) => {
      console.error("Error deleting task:", error);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
