import React, { useState } from "react";

const DeleteButton = ({ onSubmit }) => {
  const [taskId, setTaskId] = useState("");

  const handleInputChange = (event) => {
    setTaskId(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Server error");
      }

      // Assuming the server responds with a confirmation or updated task list
      onSubmit();

      // Clear the input field after successful deletion
      setTaskId("");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <label htmlFor="deleteInput">Delete selected tasks:</label>
      <input
        type="text"
        id="deleteInput"
        value={taskId}
        onChange={handleInputChange}
        placeholder="Enter Task ID"
      />
      <button onClick={handleSubmit}>Delete Tasks</button>
    </div>
  );
};

export default DeleteButton;