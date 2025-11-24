import React from "react";
import { Box, Typography, Paper } from "@mui/material";


const UserDashboardPage = () => {
    return (
        <Box sx={{ p: 3 }}>
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard Page
      </Typography>
      <Typography variant="body1">
        Welcome to the Dashboard Page! This is a placeholder for your sidebar menu item.
        You can add widgets, charts, or any other content here.
      </Typography>
    </Paper>
  </Box>
    );
};

export default UserDashboardPage;