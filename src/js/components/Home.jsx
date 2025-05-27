import React, { useState, useEffect } from "react";

const Home = () => {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const username = "daniacornejoh1";

  const getTasks = async () => {
    try {
      const res = await fetch(`https://playground.4geeks.com/todo/todos/${username}`);
      const data = await res.json();
      if (Array.isArray(data)) setTasks(data);
    } catch (err) {
      console.error("Error al obtener tareas:", err);
    }
  };

  const createUser = async () => {
    try {
      await fetch(`https://playground.4geeks.com/todo/users/${username}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([]),
      });
    } catch (err) {
      console.error("Error al crear usuario:", err);
    }
  };

  useEffect(() => {
    const init = async () => {
      await createUser();
      await getTasks();
    };
    init();
  }, []);

  const handleKeyDown = async (e) => {
    if (e.key === "Enter" && task.trim() !== "") {
      try {
        await fetch(`https://playground.4geeks.com/todo/todos/${username}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            label: task.trim(),
            done: false
          }),
        });
        setTask("");
        await getTasks();
      } catch (err) {
        console.error("Error al agregar tarea:", err);
      }
    }
  };

  const removeTask = async (index) => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);

    try {
      await fetch(`https://playground.4geeks.com/todo/todos/${username}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTasks),
      });
      await getTasks();
    } catch (err) {
      console.error("Error al eliminar tarea:", err);
    }
  };

  const clearAllTasks = async () => {
    try {
      await fetch(`https://playground.4geeks.com/todo/users/${username}`, {
        method: "DELETE"
      });
      setTasks([]);
    } catch (err) {
      console.error("Error al eliminar todas las tareas:", err);
    }
  };

  return (
    <div className="todo-container">
      <h1>todos</h1>
      <div className="task-box">
        <input
          type="text"
          placeholder="Add your task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        {tasks.length === 0 ? (
          <p className="no-tasks">No hay tareas, añadir tareas</p>
        ) : (
          tasks.map((t, i) => (
            <div key={i} className="task">
              {t.label}
              <span className="delete" onClick={() => removeTask(i)}>❌</span>
            </div>
          ))
        )}
        <div className="counter">
          {tasks.length} {tasks.length === 1 ? "item" : "items"} left
        </div>
        <button onClick={clearAllTasks} style={{ marginTop: "15px" }}>
          Eliminar todas las tareas
        </button>
      </div>
    </div>
  );
};

export default Home;