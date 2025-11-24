import React, { useEffect, useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import axios from "axios";
import { postRequest, putRequest } from "@app/backend managment/apiCalls/apiCalls";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";


const SimpleTaskForm = ({ fetchTasks, editingTask, setEditingTask }) => {
  const [task, setTask] = useState("");
  const [message, setMessage] = useState("");
  const { user } = useAuth();


  useEffect(() => {
    console.log(user.id);
    if (editingTask) {
      setTask(editingTask.task);
    }
  }, [editingTask])
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!task.trim()) return;
    try {
      if (editingTask) {
        putRequest(`/tasks/${editingTask._id}`, { task }, () => {
        setMessage("Task updated successfully!");
        fetchTasks();
        setEditingTask(null);
        setTask("")
      }, (err) => console.log(err));
      } else {
      postRequest("/tasks/", { task }, () => {
      setMessage("Task saved successfully!");
      setTask("");
      fetchTasks();
      });
    }} catch (error) {
      setMessage("Error saving task.");
    }
  
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          fullWidth
          required
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          {editingTask ? "Update Task" : "Save Task"}
        </Button>
      </form>
      {message && <Box mt={2}>{message}</Box>}
    </Box>
  );
};

export default SimpleTaskForm;