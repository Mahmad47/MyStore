// SubcategoryDialog.jsx
import React, { useState } from "react";
import {
  Dialog, DialogTitle, DialogContent,
  DialogActions, Button, TextField, Autocomplete, Chip, ListItem, ListItemText, List, IconButton
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { postRequest, putRequest, deleteRequest } from "@app/backend managment/apiCalls/apiCalls";
import { toast } from "react-toastify";
import { set } from "mongoose";

export default function ManageSubcategoriesDialog({ open, onClose, category, subcategories, onRefresh }) {
  const catSubs = subcategories.filter((s) => s.category?._id === category._id);
  const [newName, setNewName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [editId, setEditId] = useState(null);
  const handleDelete = (id) => {
    deleteRequest(`/subcategories/${id}`, () => {
      toast.success("Deleted");
      onRefresh();
    });
  };
  const handleEdit = (sub) => {
    setEditId(sub._id);
    setNewName(sub.name);
  };
  const handleAdd = () => {
    setIsProcessing(true);
    if (!newName.trim()) {
      toast.error("Please enter a name");
      setIsProcessing(false);
      return;
    }

    postRequest(
      "/subcategories",
      { name: newName, category: category._id },
      () => {
        toast.success("Subcategory added");
        setIsProcessing(false);
        setNewName("");
        onRefresh();
      },
      () => toast.error("Failed to add subcategory")
    );
  };
  const handleUpdate = () => {
    setIsProcessing(true);
    if (!newName.trim()) {
      toast.error("Please enter a name");
      setIsProcessing(false);
      return;
    }

    putRequest(
      `/subcategories/${editId}`,
      { name: newName, category: category._id },
      () => {
        toast.success("Subcategory updated");
        setNewName("");
        setEditId(null);
        setIsProcessing(false);
        onRefresh();
      },
      () => {
        setIsProcessing(false);
        toast.error("Failed to update subcategory")
      }
    );
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Manage Subcategories for {category.name}</DialogTitle>
      <DialogContent>
        <List>
          {catSubs.length > 0 ? (
            catSubs.map((sub) => (
              <ListItem
                key={sub._id}
                secondaryAction={
                  <>
                    <IconButton edge="end" onClick={() => handleEdit(sub)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" onClick={() => handleDelete(sub._id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </>
                }
              >
                <ListItemText primary={sub.name} />
              </ListItem>
            ))
          ) : (
            <p>No subcategories yet.</p>
          )}
        </List>

        <TextField
          label={editId ? "Edit Subcategory" : "New Subcategory"}
          size="small"
          fullWidth
          value={newName || ""}
          onChange={(e) => setNewName(e.target.value)}
          sx={{ mt: 2 }}
        />
        {editId ? (
          <LoadingButton
                    loading={isProcessing}
                    sx={{ mt: 1 }}
                    onClick={handleUpdate}
                    variant="contained"
                    color="primary"
                    loadingPosition="center"
                  >
                    Save
                  </LoadingButton>
        ) : (
          <LoadingButton
                    loading={isProcessing}
                    sx={{ mt: 1 }}
                    onClick={handleAdd}
                    variant="contained"
                    color="primary"
                    loadingPosition="center"
                  >
                    Save
                  </LoadingButton>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}