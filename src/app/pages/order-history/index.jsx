import React, { useEffect, useState } from "react";
import { getRequest } from "@app/backend managment/apiCalls/apiCalls";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Chip,
} from "@mui/material";
import * as XLSX from "xlsx";

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      getRequest(
        "/orders/my-orders",
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

  const filteredOrders = statusFilter === "all"
    ? orders
    : orders.filter(order => order.status === statusFilter);

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "success";
      case "shipped":
        return "info";
      case "cancelled":
        return "error";
      default:
        return "warning";
    }
  };
  const exportToExcel = () => {
    if (orders.length === 0) return;

    const exportData = filteredOrders.map((order) => ({
      "Order ID": order._id,
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
          md: "row"
        },
        justifyContent: {
          xs: "flex-start",
          md: "space-between"
        },
        alignItems: {
          xs: "flex-start",
          md: "center"
        }
      }}>
        <Typography variant="h4" gutterBottom>
          Your Purchase History
        </Typography>

        <Box sx={{
          display: "flex",
          flexDirection: {
            xs: "column",
            md: "row"
          },
          gap: 2, alignItems: "center"
        }}>
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
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "400px",
          }}
        >
          <CircularProgress />
        </Box>
      ) : orders.length === 0 ? (
        <Typography>No previous orders found.</Typography>
      ) : (
        <TableContainer component={Paper} sx={{ maxHeight: 700 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Items</TableCell>
                <TableCell>Total ($)</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.map((order, i) => (
                <TableRow key={order._id || i} hover
                  sx={{
                    "&:hover": {
                      backgroundColor: "#f5f5f5", // light grey hover
                    },
                  }}>
                  <TableCell>{order._id}</TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {order.items.map((item, j) => (
                      <div key={j}>
                        {item.name} × {item.quantity}
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>${order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Chip
                      label={order.status || "pending"}
                      color={getStatusColor(order.status)}
                      size="small"
                    />
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

export default OrderHistoryPage;
