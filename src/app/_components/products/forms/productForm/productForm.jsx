import React, { useEffect, useState } from "react";
import {
    Box,
    TextField,
    Button,
    MenuItem,
    Typography,
    Paper,
    Grid,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { getRequest, createRequest } from "@app/backend managment/apiCalls/apiCalls";
import { toast, ToastContainer } from "react-toastify";
import { JumboCard } from "@jumbo/components"
import ReactQuill from "react-quill";;
import "react-quill/dist/quill.snow.css";

export default function ProductForm() {
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

    const MAX_IMAGE_SIZE_MB = 2; // 2 MB
    const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;


    // fetch categories and subcategories
    useEffect(() => {
        getRequest("/categories", (res) => setCategories(res.data));
        getRequest("/subcategories", (res) => setSubcategories(res.data));
    }, []);

    // filter subs by selected category
    const filteredSubs = Array.isArray(subcategories)
        ? subcategories.filter((s) => s.category?._id === form.category)
        : [];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // Feature Image
    const handleFeatureImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > MAX_IMAGE_SIZE_BYTES) {
                toast.error(`Feature image must be under ${MAX_IMAGE_SIZE_MB} MB.`);
                return;
            }
            setForm((prev) => ({ ...prev, featureImage: file }));
        }
    };

    // Gallery Images
    const handleGalleryChange = (e) => {
        const files = Array.from(e.target.files);
        const total = form.galleryImages.length + files.length;

        if (total > 5) {
            toast.error("You can upload a maximum of 5 gallery images.");
            return;
        }

        // ✅ Validate each image size
        const oversizedFiles = files.filter((file) => file.size > MAX_IMAGE_SIZE_BYTES);
        if (oversizedFiles.length > 0) {
            toast.error(`Each gallery image must be under ${MAX_IMAGE_SIZE_MB} MB.`);
            return;
        }

        setForm((prev) => ({
            ...prev,
            galleryImages: [...prev.galleryImages, ...files],
        }));
    };

    const handleRemoveGalleryImage = (index) => {
        setForm((prev) => ({
            ...prev,
            galleryImages: prev.galleryImages.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsProcessing(true);

        if (!form.name || !form.price || !form.category || !form.featureImage) {
            toast.error("Name, price, category and Featured Image are required");
            setIsProcessing(false);
            return;
        }

        const data = new FormData();
        data.append("name", form.name);
        data.append("price", form.price);
        data.append("category", form.category);
        data.append("stock", form.stock || 0);
        if (form.subcategory) data.append("subcategory", form.subcategory);
        if (form.shortDescription) data.append("shortDescription", form.shortDescription);
        if (form.description) data.append("description", form.description);
        data.append("featureImage", form.featureImage);
        form.galleryImages.forEach((img) => {
            data.append("galleryImages", img);
        });
        console.log(...data);
        createRequest(
            "/products",
            data,
            () => {
                toast.success("Product created");
                setForm({
                    name: "",
                    price: "",
                    stock: "",
                    category: "",
                    subcategory: "",
                    shortDescription: "",
                    description: "",
                    featureImage: null,
                    galleryImages: [],
                });
                setIsProcessing(false);
            },
            () => {
                toast.error("Failed to create product")
                setIsProcessing(false);
            }
        );
    };

    return (
        <JumboCard sx={{ p: 4, maxWidth: 800, mx: "auto", mt: 4 }}>
            <Box >
                <Typography variant="h6" gutterBottom>
                    Add Product
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: 2 }}>
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
                                value={form.stock || ""}
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
                                fullWidth
                                onChange={handleChange}
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
                                fullWidth
                                onChange={handleChange}
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
                    <Box sx={{
                        width: "100%",
                        maxWidth: 800,
                        ".ql-container": {
                            width: "100%",
                        },
                        ".ql-editor": {
                            minHeight: "150px",
                            maxHeight: "300px",
                            overflowY: "auto",
                            whiteSpace: "pre-wrap",
                            overflowWrap: "break-word",
                            wordBreak: "break-word",
                        },
                        ".ql-editor p": {
                            margin: 0,
                            wordBreak: "break-word",
                        },
                    }}>
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
                            onChange={(value) => setForm((prev) => ({ ...prev, description: value }))}
                            style={{
                                marginTop: "10px",
                            }}
                        />
                    </Box>

                    <Typography variant="subtitle2">Feature Image</Typography>
                    <Button variant="outlined" component="label">
                        Upload Feature Image
                        <input type="file" hidden accept="image/*" onChange={handleFeatureImageChange} />
                    </Button>
                    {form.featureImage && (
                        <Box sx={{ mt: 2, position: "relative", width: 120 }}>
                            <img
                                src={URL.createObjectURL(form.featureImage)}
                                alt="Feature"
                                style={{
                                    width: "120px",
                                    height: "120px",
                                    objectFit: "cover",
                                    borderRadius: "8px",
                                }}
                            />
                        </Box>
                    )}

                    {/* Gallery Images Upload */}
                    <Typography variant="subtitle2" sx={{ mt: 2 }}>
                        Gallery Images (max 5 Images)
                    </Typography>
                    <Button variant="outlined" component="label">
                        Upload Gallery Images
                        <input type="file" hidden accept="image/*" multiple onChange={handleGalleryChange} />
                    </Button>

                    {form.galleryImages.length > 0 && (
                        <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 2 }}>
                            {form.galleryImages.map((img, index) => (
                                <Box key={index} sx={{ position: "relative" }}>
                                    <img
                                        src={URL.createObjectURL(img)}
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
                                            minWidth: "24px", lineHeight: "20px",
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
                    )}
                    {/* <Button type="submit" variant="contained" color="primary">
                        Save Product
                    </Button> */}
                    <LoadingButton
                        type="submit"
                        loading={isProcessing}
                        variant="contained"
                        color="primary"
                        loadingPosition="center"
                    >
                        Save Product
                    </LoadingButton>
                </Box>
            </Box>
            <ToastContainer position="top-right" autoClose={3000} />
        </JumboCard>
    );
};