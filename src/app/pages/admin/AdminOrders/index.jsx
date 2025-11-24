import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Select,
  MenuItem,
  FormControl,
  CircularProgress,
  Stack,
} from "@mui/material";
import { getRequest, putRequest } from "@app/backend managment/apiCalls/apiCalls";
import * as XLSX from "xlsx";

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true); // 👈 loader state
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchUser, setSearchUser] = useState("");



  // Fetch all orders
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      getRequest(
        "/orders",
        (res) => {
          setOrders(res.data);
          setLoading(false);
        },
        (err) => {
          console.error(err);
          setLoading(false);
        }
      );
    };
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    const userName = order.user?.name?.toLowerCase() || "";
    const matchesSearch =
      searchUser.trim() === "" || userName.includes(searchUser.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  // Handle status update
  const handleStatusChange = (orderId, newStatus) => {
    putRequest(
      `/orders/${orderId}`,
      { status: newStatus },
      (res) => {
        // Update UI instantly
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
      },
      (err) => console.error(err)
    );
  };

  const exportToExcel = () => {
    if (orders.length === 0) return;

    const exportData = filteredOrders.map((order) => ({
      "Order ID": order._id,
      User: order.user?.name || "N/A",
      Date: new Date(order.createdAt).toLocaleString(),
      Items: order.items.map((i) => `${i.name} x ${i.quantity}`).join(", "),
      Total: order.total,
      Status: order.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

    XLSX.writeFile(workbook, "order-history.xlsx");
  };

  return (
    <Box sx={{ py: 2 }}>
      <Box sx={{
        pb: 2, display: "flex",
        gap: 1,
        flexDirection: {
          xs: "column",
          md: "column",
          lg: "row"
        },
        justifyContent: {
          xs: "flex-start",
          md: "space-between"
        },
        alignItems: {
          xs: "flex-start",
          md: "flex-start",
          lg: "center"
        }
      }}>
        <Typography variant="h4" gutterBottom>
          Admin Orders Management
        </Typography>
        <Box sx={{
          display: "flex",
          flexDirection: {
            xs: "column",
            md: "row"
          },
          gap: 2, 
          alignItems: {
          xs: "flex-start",
          md: "flex-start",
          lg: "flex-end"
        }
        }}>
          <input
            type="text"
            placeholder="Search by user name"
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: 6,
              border: "1px solid #ccc",
              outline: "none",
              width: "200px"
            }}
          />
          <Select
            size="small"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="delivered">Delivered</MenuItem>
            <MenuItem value="shipped">Shipped</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
          </Select>

          {/* Export Button */}
          {!loading && orders.length > 0 && (
            <Button variant="contained" onClick={exportToExcel}>
              Export Orders
            </Button>
          )}
        </Box>
      </Box>

      {/* 🔄 Show loader while fetching */}
      {loading ? (
        <Stack
          alignItems="center"
          justifyContent="center"
          sx={{ height: "300px" }}
        >
          <CircularProgress size={50} thickness={4} color="primary" />
          <Typography mt={2} color="text.secondary">
            Loading orders...
          </Typography>
        </Stack>
      ) : orders.length === 0 ? (
        <Typography>No orders found.</Typography>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            boxShadow: 3,
            maxHeight: 700,
            overflowY: "auto",
          }}
        >
          <Table stickyHeader>
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Order ID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>User</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Items</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Total ($)</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order._id} hover>
                  <TableCell>{order._id}</TableCell>
                  <TableCell>
                    {order.user?.name || "N/A"} <br />
                    <Typography variant="body2" color="text.secondary">
                      {order.userId?.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {order.items.map((item, i) => (
                      <Typography key={i} variant="body2">
                        {item.name} × {item.quantity}
                      </Typography>
                    ))}
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    {order.total.toFixed(2)}
                  </TableCell>

                  {/* Status Dropdown */}
                  <TableCell>
                    <FormControl size="small" fullWidth>
                      <Select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                      >
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="shipped">Shipped</MenuItem>
                        <MenuItem value="delivered">Delivered</MenuItem>
                        <MenuItem value="cancelled">Cancelled</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default AdminOrdersPage;
