import React, { useState } from "react";

const SubmitForm = ({ onSubmit }) => {
  const [newTask, setNewTask] = useState("");

  const handleInputChange = (event) => {
    setNewTask(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      const response = await fetch("/api/tasks", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description: newTask }), // Wrap newTask in an object
      });
  
      if (!response.ok) {
        throw new Error("Server error");
      }
  
      const data = await response.json();
      // Assuming the server responds with the new task details
      onSubmit(data);
      setNewTask(""); // Clear the input field
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form classname="form" onSubmit={handleSubmit}>
      <label htmlFor="name">Enter something to get done!</label>
      <input
        type="text"
        id="name"
        name="name"
        value={newTask}
        onChange={handleInputChange}
        // required
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default SubmitForm;