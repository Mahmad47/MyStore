// EditCategoryDialog.jsx
import React, { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent,
  DialogActions, Button, TextField, Autocomplete
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { putRequest, postRequest } from "@app/backend managment/apiCalls/apiCalls";
import { toast } from "react-toastify";

export default function CategoryDialog({ open, onClose, category, onSuccess, allCategories }) {
  const [name, setName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (category) {
      setName(category.name || "");
    } else {
      setName("");
    }
  }, [category, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    if (category) {
      putRequest(
        `/categories/${category._id}`,
        { name },
        () => {
          toast.success("Category updated successfully");
          setIsProcessing(false);
          console.log(name);
          onSuccess();
          onClose();
        },
        (err) => {
          toast.error("Update failed");
          setIsProcessing(false);
          console.error(err);
        }
      );
    }
    else {

      try {
        postRequest('/categories', { name }, () => {
          setName('');
          toast.success("Category added successfully!")
          setIsProcessing(false);
          onSuccess();
          onClose();
        })
      } catch (error) {
        toast.error("Error Adding Category")
        setIsProcessing(false);
        console.log(error)
      };
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{category ? "Edit Category" : "Add Category"}</DialogTitle>
      <DialogContent>
        <form id="category-form" onSubmit={handleSubmit}>
          <TextField
            label="Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <LoadingButton
          loading={isProcessing}
          type="submit"
          form="category-form"
          variant="contained"
          color="primary"
          loadingPosition="center"
        >
          Save
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
