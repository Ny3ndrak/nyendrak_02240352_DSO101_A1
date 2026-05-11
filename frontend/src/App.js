import { useEffect, useMemo, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editTaskId, setEditTaskId] = useState(null);
  const [editText, setEditText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const remainingCount = useMemo(
    () => tasks.filter((task) => !task.completed).length,
    [tasks]
  );

  async function fetchTasks() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/tasks`);
      if (!response.ok) {
        throw new Error("Could not load tasks");
      }
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError(err.message || "Unexpected error while loading tasks");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  async function addTask(event) {
    event.preventDefault();
    if (!newTask.trim()) return;

    try {
      const response = await fetch(`${API_URL}/api/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTask.trim() }),
      });

      if (!response.ok) {
        throw new Error("Failed to add task");
      }

      const created = await response.json();
      setTasks((prev) => [created, ...prev]);
      setNewTask("");
    } catch (err) {
      setError(err.message || "Could not add task");
    }
  }

  async function updateTask(taskId, payload) {
    const response = await fetch(`${API_URL}/api/tasks/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to update task");
    }

    return response.json();
  }

  async function handleToggle(task) {
    try {
      const updated = await updateTask(task.id, {
        title: task.title,
        completed: !task.completed,
      });
      setTasks((prev) => prev.map((item) => (item.id === task.id ? updated : item)));
    } catch (err) {
      setError(err.message || "Could not update task status");
    }
  }

  async function handleDelete(taskId) {
    try {
      const response = await fetch(`${API_URL}/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch (err) {
      setError(err.message || "Could not delete task");
    }
  }

  async function saveEdit(task) {
    if (!editText.trim()) return;

    try {
      const updated = await updateTask(task.id, {
        title: editText.trim(),
        completed: task.completed,
      });
      setTasks((prev) => prev.map((item) => (item.id === task.id ? updated : item)));
      setEditTaskId(null);
      setEditText("");
    } catch (err) {
      setError(err.message || "Could not save task changes");
    }
  }

  return (
    <main className="app-shell">
      <section className="todo-card">
        <header>
          <h1>Task Planner</h1>
          <p>{remainingCount} task(s) remaining</p>
        </header>

        <form onSubmit={addTask} className="task-form">
          <input
            value={newTask}
            onChange={(event) => setNewTask(event.target.value)}
            placeholder="Add a new task"
          />
          <button type="submit">Add</button>
        </form>

        {error && <p className="error-text">{error}</p>}
        {loading ? <p>Loading tasks...</p> : null}

        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id} className={task.completed ? "completed" : ""}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggle(task)}
              />

              {editTaskId === task.id ? (
                <input
                  className="edit-input"
                  value={editText}
                  onChange={(event) => setEditText(event.target.value)}
                />
              ) : (
                <span>{task.title}</span>
              )}

              <div className="actions">
                {editTaskId === task.id ? (
                  <button onClick={() => saveEdit(task)}>Save</button>
                ) : (
                  <button
                    onClick={() => {
                      setEditTaskId(task.id);
                      setEditText(task.title);
                    }}
                  >
                    Edit
                  </button>
                )}
                <button className="delete" onClick={() => handleDelete(task.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default App;
