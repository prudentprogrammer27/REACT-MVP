import React, { useEffect, useState } from "react";
import SubmitForm from "./submit";
import DeleteButton from "./delete";


const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  const handleInputChange = (event) => {
    setNewTask(event.target.value);
  };


  useEffect(() => {
    fetch("/api/tasks")
      .then((res) => res.json())
      .then((tasks) => {
        setTasks(tasks);
      });
  }, []);

  return (
    <main>
      <SubmitForm  />

      {tasks.map((task) => (
        <span className="task" key={task.id}>
          {task.description}
          <input type="checkbox" id="myCheckbox" name="myCheckbox"></input>
        </span>
      ))}
      <DeleteButton />
    </main>
  );
};

export default App;