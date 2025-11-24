import React, { useState, useEffect } from "react";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import {
    Box,
    Avatar,
    Typography,
    TextField,
    Button,
    Stack,
    alpha,
    Divider,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { ASSET_AVATARS } from "@app/_utilities/constants/paths";
import { ASSET_IMAGES } from "@app/_utilities/constants/paths";
import { getAssetPath } from "@app/_utilities/helpers";
import { updateRequest } from "@app/backend managment/apiCalls/apiCalls";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { set } from "mongoose";

const AdminProfileForm = () => {
    const { user, updateUserInCookie } = useAuth();
    const [isProcessing, setIsProcessing] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        age: "",
        phone: "",
    });

    useEffect(() => {
        setFormData({
            name: user?.name || "",
            email: user?.email || "",
            age: user?.age || "",
            phone: user?.phone || "",

        });
    }, [user]);

    const [avatarFile, setavatarFile] = useState(null)
    const [avatarPreview, setavatarPreview] = useState(null)

    // const profilePic =
    //     user?.avatar ||
    //     getAssetPath(`${ASSET_AVATARS}/avatar10.jpg`, `100x100`);
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setavatarFile(file);
            setavatarPreview(URL.createObjectURL(file));
        }
    };
    const handleUpdate = (e) => {
        e.preventDefault();
        setIsProcessing(true);

        if (formData.name === "") {
            toast.error("Invalid user name")
            setIsProcessing(false);
            return;
        }
        if (formData.age === "") {
            toast.error("Invalid user name")
            setIsProcessing(false);
            return;
        }
        if (formData.phone === "") {
            toast.error("Invalid user phone number")
            setIsProcessing(false);
            return;
        }
        const data = new FormData();
        data.append("name", formData.name);
        data.append("email", formData.email);
        data.append("age", formData.age);
        data.append("phone", formData.phone);
        if (avatarFile) data.append("avatar", avatarFile);
        updateRequest(
            `/auth/users/${user?.id}`,
            data,
            (res) => {
                const updatedUser = {
                    ...res.data,
                    id: res.data._id,
                };
                console.log(res);
                console.log("updated user", updatedUser);
                updateUserInCookie(updatedUser);
                setFormData({
                    name: updatedUser.name,
                    email: updatedUser.email,
                    age: updatedUser.age,
                    phone: updatedUser.phone,
                })
                setIsProcessing(false);
                toast.success("Profile updated successfully!")
                setavatarFile(null);
                setavatarPreview(null);
            },
            (err) => {
                toast.error("Error updating profile")
                setIsProcessing(false);
                console.error(err);
            }
        );
    };

    return (
        <Box sx={{ width: "100%", mx: "auto" }}>
            <Stack spacing={3} alignItems="center">
                <Typography variant="h4">Update Profile Details</Typography>
            </Stack>

            <Divider sx={{ my: 3 }} />

            <form onSubmit={handleUpdate}>
                <Stack spacing={2}>
                    <TextField
                        name="name"
                        label="Name"
                        value={formData.name}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        name="email"
                        label="Email"
                        value={formData.email}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        name="age"
                        label="Age"
                        value={formData.age}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        name="phone"
                        label="Phone Number"
                        value={formData.phone}
                        onChange={handleChange}
                        fullWidth
                    />

                    {(avatarPreview) && (
                        <Avatar
                            src={avatarPreview}
                            alt={formData.name}
                            sx={{ width: 100, height: 100 }}
                        />
                    )}

                    <Button variant="outlined" component="label">
                        Upload Avatar
                        <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                    </Button>

                    <LoadingButton type="submit" variant="contained" color="primary" loading={isProcessing} loadingPosition="center">
                        Update Profile
                    </LoadingButton>
                </Stack>
            </form>

            <ToastContainer position="top-right" autoClose={3000} />
        </Box>
    )
}

export default AdminProfileForm
