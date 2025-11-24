import React, { useEffect, useState } from "react";
import SimpleTaskForm from "@app/_components/sample/simple-form/simpleTaskForm";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SimpleTable from "@app/_components/sample/simple-table/simpleTable";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button
} from "@mui/material";
import { getRequest, deleteRequest } from "@app/backend managment/apiCalls/apiCalls";

const SimpleTask = () => {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [taskToDeleteId, setTaskToDeleteId] = useState(null);

  const fetchTasks = async () => {
    getRequest("/tasks", (res) => setTasks(res.data), (err)=> console.log(err));
  };

  const handleDelete = (id) => {
    setOpenDeleteDialog(true);
    setTaskToDeleteId(id);
  };

  const confirmDelete = async () => {

deleteRequest(`/tasks/${taskToDeleteId}`, () => {
      setTasks(tasks.filter(task => task._id !== taskToDeleteId));
      setOpenDeleteDialog(false);
      setTaskToDeleteId(null);
    },(err)=> console.log(err));
    
  };

  const handleEdit = (task) => {
    setEditingTask(task);
  };
  const clearEdit = () => {
    setEditingTask(null);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div>
      <h2>Sample Task Form</h2>
      <SimpleTaskForm fetchTasks={fetchTasks} editingTask={editingTask} setEditingTask={setEditingTask} />
      
      <SimpleTable handleEdit={handleEdit} handleDelete={handleDelete} tasks={tasks} />

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Delete Task</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this task? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SimpleTask;