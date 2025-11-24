import { useJumboTheme } from "@jumbo/components/JumboTheme/hooks";
import { Div } from "@jumbo/shared";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import RepeatOutlinedIcon from "@mui/icons-material/RepeatOutlined";
import { ASSET_AVATARS } from "@app/_utilities/constants/paths";
import { getAssetPath } from "@app/_utilities/helpers";
import {
  Avatar,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { JumboDdPopover } from "@jumbo/components/JumboDdPopover";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { useNavigate } from "react-router-dom";

const AuthUserPopover = () => {
    const { user } = useAuth();
  const { theme } = useJumboTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    return navigate("/auth/login-1");
  }
  const profilePic =
    `${import.meta.env.VITE_BACKEND_URL}${user?.avatar}` ||
    getAssetPath(`${ASSET_AVATARS}/avatar10.jpg`, `60x60`);

  return (
    <ThemeProvider theme={theme}>
      <JumboDdPopover
        triggerButton={
          <Avatar
            src={profilePic}
            sizes={"small"}
            sx={{ boxShadow: 23, cursor: "pointer" }}
          />
        }
        sx={{ ml: 3 }}
      >
        <Div
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            p: (theme) => theme.spacing(2.5),
          }}
        >
          <Avatar
            src={profilePic}
            alt={user?.name}
            sx={{ width: 60, height: 60, mb: 2 }}
          />
          <Typography variant={"h5"}>{user?.name}</Typography>
          <Typography variant={"body1"} color="text.secondary">
            {user?.email}
          </Typography>
        </Div>
        <Divider />
        <nav>
          <List disablePadding sx={{ pb: 1 }}>
            <ListItemButton onClick={()=>navigate(user?.role === "admin" ? "/admin/profile" : "/user/profile")}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <PersonOutlineIcon />
              </ListItemIcon>
              <ListItemText primary="Profile" sx={{ my: 0 }} />
            </ListItemButton>
            {/* <ListItemButton>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <EditOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Edit Profile" sx={{ my: 0 }} />
            </ListItemButton> */}
            {/* <ListItemButton>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <RepeatOutlinedIcon />
              </ListItemIcon>
              <ListItemText
                // onClick={() => navigate('/samples/content-layout')}
                primary="Switch User"
                sx={{ my: 0 }}
              />
            </ListItemButton> */}
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" sx={{ my: 0 }} />
            </ListItemButton>
          </List>
        </nav>
      </JumboDdPopover>
    </ThemeProvider>
  );
};

export { AuthUserPopover };
