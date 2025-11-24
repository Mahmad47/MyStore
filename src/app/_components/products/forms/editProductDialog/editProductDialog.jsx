import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    Typography,
    Grid,
    Box,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { getRequest, updateRequest } from "@app/backend managment/apiCalls/apiCalls";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function EditProductDialog({ open, onClose, product, onSuccess }) {
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [form, setForm] = useState({
        name: "",
        price: "",
        category: "",
        subcategory: "",
        shortDescription: "",
        description: "",
        featureImage: null,
        galleryImages: [],
    });

    // initialize form when dialog opens
    useEffect(() => {
        if (product) {
            setForm({
                name: product.name || "",
                price: product.price || "",
                stock: product.stock || "",
                category: product.category?._id || "",
                subcategory: product.subcategory?._id || "",
                shortDescription: product.shortDescription || "",
                description: product.description || "",
                featureImage: "",
                galleryImages: [
                    ...(product?.galleryImages || []).map(img => ({
                        src: `${import.meta.env.VITE_BACKEND_URL}${img}`,
                        file: null,          // existing image from DB
                        isNew: false,
                        path: img            // keep backend path for delete
                    }))
                ],
            });
            if (product?.featureImage) {
                const src = import.meta.env.VITE_BACKEND_URL + product.featureImage;
                console.log("Feature image src:", src);
            }
        }
    }, [product]);

    // fetch categories and subcategories
    useEffect(() => {
        getRequest("/categories", (res) => setCategories(res.data));
        getRequest("/subcategories", (res) => setSubcategories(res.data));
    }, []);

    // filter subs by selected category
    const filteredSubs = subcategories.filter(
        (s) => s.category?._id === form.category
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleFeatureChange = (e) => {
        setForm((prev) => ({ ...prev, featureImage: e.target.files[0] }));
    };

    const handleGalleryChange = (e) => {
        const files = Array.from(e.target.files);
        const total = form.galleryImages.length + files.length;
        if (total > 5) {
            toast.error("You can upload a maximum of 5 gallery images.");
            return;
        }
        setForm(prev => ({
            ...prev,
            galleryImages: [
                ...prev.galleryImages,
                ...files.map(file => ({
                    src: URL.createObjectURL(file),
                    file,
                    isNew: true,
                }))
            ]
        }));
    };
    const handleRemoveGalleryImage = (index) => {
        setForm(prev => {
            const updated = [...prev.galleryImages];
            updated.splice(index, 1);
            return { ...prev, galleryImages: updated };
        });
    };
    const handleSubmit = () => {
        setIsProcessing(true);
        if (!form.name || !form.price || !form.category || (!form.featureImage && !product?.featureImage)) {
            console.log(form);
            toast.error("Name, price, category and Featured Image are required");
            setIsProcessing(false);
            return;
        }

        const data = new FormData();
        data.append("name", form.name);
        data.append("price", form.price);
        data.append("stock", form.stock || 0);
        data.append("category", form.category);
        if (form.subcategory) data.append("subcategory", form.subcategory);
        if (form.shortDescription) data.append("shortDescription", form.shortDescription);
        if (form.description) data.append("description", form.description);
        if (form.featureImage) {
            data.append("featureImage", form.featureImage);
        }
        // Separate new and existing gallery images
        const remainingExisting = form.galleryImages.filter(img => !img.isNew).map(img => img.path);
        const newFiles = form.galleryImages.filter(img => img.isNew).map(img => img.file);

        // Send existing images list (backend should replace gallery with this list + new uploads)
        data.append("existingGalleryImages", JSON.stringify(remainingExisting));

        // Append new files
        newFiles.forEach(file => data.append("galleryImages", file));
        console.log(...data);

        updateRequest(`/products/${product._id}`, data,
            () => {
                toast.success("Product updated");
                setIsProcessing(false);
                onSuccess?.();   // refresh parent table
                onClose();
            },
            () => {
                toast.error("Failed to update product")
                setIsProcessing(false);
            }
        );
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogContent dividers>
                <Box sx={{ display: "grid", gap: 2 }}>
                    <TextField
                        label="Product Name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        fullWidth
                    />
                    <Grid container spacing={2}>
                        <Grid item md={6} xs={12}>
                            <TextField
                                label="Price"
                                name="price"
                                type="number"
                                value={form.price}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <TextField
                                label="Stock"
                                name="stock"
                                type="number"
                                value={form.stock}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item md={12} xs={12}>
                            <TextField
                                label="Short Description"
                                name="shortDescription"
                                value={form.shortDescription}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <TextField
                                select
                                label="Category"
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                fullWidth
                            >
                                {categories.map((cat) => (
                                    <MenuItem key={cat._id} value={cat._id}>
                                        {cat.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid item md={6} xs={12}>
                            <TextField
                                select
                                label="Subcategory"
                                name="subcategory"
                                value={form.subcategory}
                                onChange={handleChange}
                                fullWidth
                                disabled={!form.category}
                            >
                                {filteredSubs.map((sub) => (
                                    <MenuItem key={sub._id} value={sub._id}>
                                        {sub.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                    </Grid>
                    <Box>
                        <Typography variant="subtitle2">Description</Typography>
                        <ReactQuill
                            theme="snow"
                            value={form.description}
                            modules={{
                                toolbar: {
                                    container: [
                                        [{ header: [1, 2, 3, 4, 5, 6, false] }], // 👈 Added up to h6
                                        ["bold", "italic", "underline", "strike"],
                                        [{ list: "ordered" }, { list: "bullet" }],
                                        ["link", "image"],
                                        ["clean"],
                                    ],
                                },
                            }}
                            onChange={(value) =>
                                setForm((prev) => ({ ...prev, description: value }))
                            }
                            style={{ marginTop: "10px" }}
                        />
                    </Box>

                    {/* Feature Image */}
                    <Box>
                        <Typography variant="subtitle2">Feature Image</Typography>
                        <Button variant="outlined" component="label" sx={{ mt: 1 }}>
                            Upload Feature Image
                            <input type="file" hidden accept="image/*" onChange={handleFeatureChange} />
                        </Button>

                        {form.featureImage ? (
                            // Show preview of newly uploaded feature image
                            <Box sx={{ mt: 2, position: "relative" }}>
                                {(() => {
                                    const src = URL.createObjectURL(form.featureImage);
                                    return (
                                        <img
                                            src={src}
                                            alt="Preview"
                                            style={{ maxWidth: "150px", borderRadius: "8px" }}
                                        />
                                    );
                                })()}
                            </Box>
                        ) : (
                            // Show existing feature image (from DB) if no new upload
                            product?.featureImage && (
                                <Box sx={{ mt: 2, position: "relative", width: "150px" }}>
                                    {(() => {
                                        const src = `${import.meta.env.VITE_BACKEND_URL}${product.featureImage}`;
                                        return (
                                            <img
                                                src={src}
                                                alt={product.name}
                                                style={{ width: "150px", borderRadius: "8px" }}
                                            />
                                        );
                                    })()}
                                </Box>
                            )
                        )}

                    </Box>

                    {/* Gallery Images */}
                    <Box>
                        <Typography variant="subtitle2">Gallery Images (max 5 Images)</Typography>
                        <Button variant="outlined" component="label" sx={{ mt: 1 }}>
                            Upload Gallery Images
                            <input type="file" hidden accept="image/*" multiple onChange={handleGalleryChange} />
                        </Button>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
                            {form.galleryImages.map((img, index) => (
                                <Box key={index} sx={{ position: "relative" }}>
                                    <img
                                        src={img.src}
                                        alt={`Gallery ${index}`}
                                        style={{
                                            width: "120px",
                                            height: "120px",
                                            objectFit: "cover",
                                            borderRadius: "8px",
                                        }}
                                    />
                                    <Button
                                        size="small"
                                        variant="contained"
                                        color="error"
                                        sx={{
                                            position: "absolute",
                                            top: 4,
                                            right: 4,
                                            minWidth: "24px",
                                            width: "24px",
                                            height: "24px",
                                            borderRadius: "50%",
                                            p: 0,
                                        }}
                                        onClick={() => handleRemoveGalleryImage(index)}
                                    >
                                        ✕
                                    </Button>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <LoadingButton
                    loading={isProcessing}
                    onClick={handleSubmit}
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
