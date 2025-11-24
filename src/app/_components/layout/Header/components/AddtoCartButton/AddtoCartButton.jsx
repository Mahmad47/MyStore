import { useCart } from "@app/_components/_core/CartContext/CartContext";
import { useNavigate } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Badge, IconButton } from "@mui/material";

const AddtoCartButton = () => {
  const { getTotalItems } = useCart();
  const navigate = useNavigate();

  return (
    <IconButton
      color="primary"
      onClick={() => navigate("/checkout")}
      sx={{ ml: 2 }}
    >
      <Badge badgeContent={getTotalItems()} color="error">
        <ShoppingCartIcon />
      </Badge>
    </IconButton>
  );
};

export default AddtoCartButton;
