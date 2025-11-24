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
    Button,
    Box,
    TextField,
    MenuItem,
    Avatar
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { getRequest, deleteRequest } from "@app/backend managment/apiCalls/apiCalls";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditProductDialog from "../../forms/editProductDialog/editProductDialog";

export default function ProductTable() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedSubcategory, setSelectedSubcategory] = useState("");
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [openEdit, setOpenEdit] = useState(false);

    const fetchProducts = () => {
        getRequest(
            "/products",
            (res) => setProducts(res.data.products),
            (err) => console.error(err)
        );
    };

    useEffect(() => {
        fetchProducts();
        getRequest("/categories", (res) => setCategories(res.data));
        getRequest("/subcategories", (res) => setSubcategories(res.data));
    }, []);

    const handleDelete = (id) => {
        setDeleteId(id);
        setOpenDeleteDialog(true);
    };

    const confirmDelete = () => {
        deleteRequest(
            `/products/${deleteId}`,
            () => {
                toast.success("Product deleted");
                setProducts((prev) => prev.filter((p) => p._id !== deleteId));
                setOpenDeleteDialog(false);
            },
            (err) => {
                toast.error("Delete failed");
                console.error(err);
            }
        );
    };
     const filteredProducts = products.filter((p) => {
        const matchCategory = selectedCategory ? p.category?._id === selectedCategory : true;
        const matchSub = selectedSubcategory ? p.subcategory?._id === selectedSubcategory : true;
        return matchCategory && matchSub;
    });

    const filteredSubs = selectedCategory
        ? subcategories.filter((s) => s.category?._id === selectedCategory)
        : subcategories;

    return (
        <>
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <TextField
                    select
                    label="Filter by Category"
                    value={selectedCategory}
                    onChange={(e) => {
                        setSelectedCategory(e.target.value);
                        setSelectedSubcategory(""); // reset subcat filter when category changes
                    }}
                    sx={{ minWidth: 200 }}
                >
                    <MenuItem value="">All</MenuItem>
                    {categories.map((cat) => (
                        <MenuItem key={cat._id} value={cat._id}>
                            {cat.name}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    select
                    label="Filter by Subcategory"
                    value={selectedSubcategory}
                    onChange={(e) => setSelectedSubcategory(e.target.value)}
                    sx={{ minWidth: 200 }}
                    disabled={!selectedCategory}
                >
                    <MenuItem value="">All</MenuItem>
                    {filteredSubs.map((sub) => (
                        <MenuItem key={sub._id} value={sub._id}>
                            {sub.name}
                        </MenuItem>
                    ))}
                </TextField>
            </Box>
            <TableContainer component={Paper} sx={{ mt: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Image</strong></TableCell>
                            <TableCell><strong>Name</strong></TableCell>
                            <TableCell><strong>Category</strong></TableCell>
                            <TableCell><strong>Subcategory</strong></TableCell>
                            <TableCell><strong>Price</strong></TableCell>
                            <TableCell><strong>Stock</strong></TableCell>
                            <TableCell align="right"><strong>Actions</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredProducts.map((p) => (
                            <TableRow key={p._id}>
                                <TableCell>
                                    {p.featureImage ? (
                                        <Avatar
                                            src={`${import.meta.env.VITE_BACKEND_URL}${p.featureImage}`}
                                            alt={p.name}
                                            variant="square"
                                            sx={{ width: 56, height: 56 }}
                                        />
                                    ) : (
                                        "—"
                                    )}
                                </TableCell>
                                <TableCell>{p.name}</TableCell>
                                <TableCell>{p.category?.name || "—"}</TableCell>
                                <TableCell>{p.subcategory?.name || "—"}</TableCell>
                                <TableCell>${p.price}</TableCell>
                                <TableCell>{p.stock}</TableCell>
                                <TableCell align="right">
                                    <IconButton
                                        color="primary"
                                        onClick={() => { setSelectedProduct(p); setOpenEdit(true); }}
                                        size="small"
                                    >
                                        <EditIcon fontSize="inherit" />
                                    </IconButton>
                                    <IconButton
                                        color="error"
                                        onClick={() => handleDelete(p._id)}
                                        size="small"
                                    >
                                        <DeleteIcon fontSize="inherit" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Delete Confirmation */}
            <Dialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
            >
                <DialogTitle>Delete Product</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this product? This action cannot be undone.
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
            <EditProductDialog
                open={openEdit}
                onClose={() => setOpenEdit(false)}
                product={selectedProduct}
                onSuccess={fetchProducts} // refresh table
            />

            <ToastContainer position="top-right" autoClose={3000} />
        </>
    );
}
