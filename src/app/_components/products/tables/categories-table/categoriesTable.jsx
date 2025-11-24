import React, { useEffect, useState } from "react";
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { getRequest, deleteRequest } from "@app/backend managment/apiCalls/apiCalls";
import CategoryDialog from "../../forms/categoryForm/CategoryDialog";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

export default function CategoriesTable() {
    const [categories, setCategories] = useState([]);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [taskToDeleteId, setTaskToDeleteId] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [openDialog, setopenDialog] = useState(false);


    const fetchCategories = () => {
        getRequest("/categories",
            (res) => setCategories(res.data),
            (err) => console.error(err)
        );
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleDelete = (id) => {
        setOpenDeleteDialog(true)
        setTaskToDeleteId(id)
    };
    const handleEdit = (category) => {
        setSelectedCategory(category)
        setopenDialog(true)
    };
    const handleEditSuccess = () => {
        setSelectedCategory(null)
        setopenDialog(false)
        fetchCategories()
    };
    const confirmDelete = () => {
        deleteRequest(`/categories/${taskToDeleteId}`,
            () => {
                toast.success("Category deleted");
                setCategories((prev) => prev.filter((c) => c._id !== taskToDeleteId));
                setOpenDeleteDialog(false)

            },
            (err) => {
                toast.error("Delete failed");
                console.error(err);
            }
        );
    };

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                }}
            >
                <h2 style={{ margin: 0 }}>Manage Categories</h2>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={()=>{
                        setSelectedCategory(null)
                        setopenDialog(true)
                        console.log(openDialog);
                    }}
                >
                    Add Category
                </Button>
            </Box>
            <TableContainer component={Paper} sx={{ mt: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Name</strong></TableCell>
                            <TableCell align="right"><strong>Actions</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {categories.map((cat) => (
                            <TableRow key={cat._id}>
                                <TableCell>{cat.name}</TableCell>
                                <TableCell align="right">
                                    <IconButton
                                        color="primary"
                                        onClick={() => handleEdit(cat)}
                                        size="small"
                                    >
                                        <EditIcon fontSize="inherit" />
                                    </IconButton>
                                    <IconButton
                                        color="error"
                                        onClick={() => handleDelete(cat._id)}
                                        size="small"
                                    >
                                        <DeleteIcon fontSize="inherit" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Dialog
                    open={openDeleteDialog}
                    onClose={() => setOpenDeleteDialog(false)}
                >
                    <DialogTitle>Delete Category</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete this category? This action cannot be undone.
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
                <ToastContainer position="top-right" autoClose={3000} />
            </TableContainer>
            {(
                <CategoryDialog
                    open={openDialog}
                    onClose={() => {
                        setopenDialog(false)
                        setSelectedCategory(null)
                    }}
                    category={selectedCategory}
                    onSuccess={handleEditSuccess}
                    allCategories={categories}
                />
            )}
        </>
    );
}
