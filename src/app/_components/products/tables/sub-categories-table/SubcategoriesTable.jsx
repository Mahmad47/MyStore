import React, { useEffect, useState } from "react";
import {
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
import ManageSubcategoriesDialog from "../../forms/subcategoryForm/SubcategoryDialog";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getCookie } from "@jumbo/utilities/cookies";

export default function SubcategoriesTable() {
    const [subcategories, setSubcategories] = useState([]);
    const [categories, setCategories] = useState([]);

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [manageOpen, setManageOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const handleManage = (cat) => {
        setSelectedCategory(cat);
        setManageOpen(true);
    };

    const fetchSubcategories = () => {
        getRequest(
            "/subcategories",
            (res) => {
                console.log("Subcategories response:", res);
                // Ensure it's an array
                if (Array.isArray(res.data)) {
                    setSubcategories(res.data);
                } else {
                    setSubcategories([]); // fallback
                    console.warn("Subcategories is not an array:", res.data);
                }
            },
            (err) => console.error(err)
        );
    };

    const fetchCategories = () => {
    getRequest(
        "/categories",
        (res) => {
            console.log("Categories response:", res);
            if (Array.isArray(res.data)) {
                setCategories(res.data);
            } else {
                setCategories([]);
                console.warn("Categories is not an array:", res.data);
            }
        },
        (err) => console.error(err)
    );
};


    useEffect(() => {
        fetchSubcategories();
        fetchCategories();
    }, []);

    const handleDelete = (id) => {
        setDeleteId(id);
        setOpenDeleteDialog(true);
    };

    const confirmDelete = () => {
        deleteRequest(
            `/subcategories/${deleteId}`,
            () => {
                toast.success("Subcategory deleted");
                setSubcategories((prev) => prev.filter((s) => s._id !== deleteId));
                setOpenDeleteDialog(false);
            },
            (err) => {
                toast.error("Delete failed");
                console.error(err);
            }
        );
    };


    // Edit handler
    const handleEdit = (subcategory) => {
        setSelectedSubcategory(subcategory);
        setEditOpen(true);
    };

    const handleEditSuccess = () => {
        setSelectedSubcategory(null);
        setEditOpen(false);
        fetchSubcategories();
    };

    return (
        <>
            <TableContainer component={Paper} sx={{ mt: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Category</strong></TableCell>
                            <TableCell><strong>Subcategory</strong></TableCell>
                            <TableCell align="right"><strong>Actions</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {categories.map((cat) => {
                            const catSubs = subcategories.filter((s) => s.category?._id === cat._id);

                            return (
                                <TableRow key={cat._id}>
                                    {/* Category Name */}
                                    <TableCell>{cat.name}</TableCell>

                                    {/* Subcategories List */}
                                    <TableCell>
                                        {catSubs.length > 0 ? (
                                            <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                                                {catSubs.map((sub) => (
                                                    <li
                                                        key={sub._id}
                                                        style={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "space-between",
                                                        }}
                                                    >
                                                        <span>{sub.name}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            "—"
                                        )}
                                    </TableCell>

                                    {/* Category Actions */}
                                    <TableCell align="right">
                                        <Button
                                            variant="contained"
                                            color="success"
                                            size="small"
                                            onClick={() => handleManage(cat)}
                                        >
                                            Manage
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>

                </Table>

                {/* Delete Confirmation */}
                <Dialog
                    open={openDeleteDialog}
                    onClose={() => setOpenDeleteDialog(false)}
                >
                    <DialogTitle>Delete Subcategory</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete this subcategory? This action cannot be undone.
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

            {selectedCategory && (
                <ManageSubcategoriesDialog
                    open={manageOpen}
                    onClose={() => {
                        setManageOpen(false);
                        setSelectedCategory(null);
                        setSelectedSubcategory(null);}}
                    category={selectedCategory}
                    subcategories={subcategories}
                    onRefresh={fetchSubcategories}
                />
            )}
        </>
    );
}
