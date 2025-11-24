import React, { useState, useEffect } from "react";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { ProfileHeader } from "@app/_components/user/profile/components/ProfileHeader";
import { UserProfileSidebar } from "@app/_components/user/profile/components/UserProfileSidebar";
import AdminProfileForm from "@app/_components/user/forms/AdminProfileForm/AdminProfileForm";
import ChangePasswordForm from "@app/_components/user/forms/changePasswordForm/changePasswordForm";
import {
  Box,
  Tabs,
  Tab,
  Avatar,
  Typography,
  Button,
  Stack,
  alpha,
  Divider,
  Grid,
} from "@mui/material";
import { ASSET_AVATARS } from "@app/_utilities/constants/paths";
import { ASSET_IMAGES } from "@app/_utilities/constants/paths";
import { getAssetPath } from "@app/_utilities/helpers";
import { updateRequest } from "@app/backend managment/apiCalls/apiCalls";
import { ToastContainer, toast } from 'react-toastify';
import { useJumboTheme } from "@jumbo/components/JumboTheme/hooks";
import { ContentLayout } from "@app/_layouts/ContentLayout";
import { JumboCard } from "@jumbo/components";

const useProfileLayout = () => {
  const { theme } = useJumboTheme();
  return React.useMemo(
    () => ({
      headerOptions: {
        sx: {
          mt: -4,
          mb: -7.25,
          mx: { xs: -4, lg: -6 },
          p: { xs: theme.spacing(6, 4, 11), lg: theme.spacing(6, 6, 11) },
          background: `#002447 url(${getAssetPath(`${ASSET_IMAGES}/profile-bg.jpg`, "1920x580")}) no-repeat center`,
          backgroundSize: "cover",
          color: "common.white",
          position: "relative",
          "&::after": {
            display: "inline-block",
            position: "absolute",
            content: `''`,
            inset: 0,
            backgroundColor: alpha(theme.palette.common.black, 0.65),
          },
        },
      },
      sidebarOptions: {
        sx: {
          mr: 3.75,
          width: { xs: "100%", lg: "33%" },
          [theme.breakpoints.down("lg")]: {
            minHeight: 0,
            mr: 0,
            order: 1,
            mt: 3.75,
          },
        },
      },
      wrapperOptions: {
        sx: {
          [theme.breakpoints.down("lg")]: {
            flexDirection: "column",
          },
        },
        container: true,
      },
      mainOptions: {
        sx: {
          [theme.breakpoints.down("lg")]: {
            minHeight: 0,
            order: 2,
          },
        },
      },
      contentOptions: {
        sx: {
          p: { lg: 0, xs: 0 },
          mt: 7,
          [theme.breakpoints.down("lg")]: {
            mt: 0,
          },
        },
      },
    }),
    [theme]
  );
};

const ProfilePage = () => {
  const { user, updateUserInCookie } = useAuth();
  const [tab, setTab] = useState(0);

  const profileLayoutOptions = useProfileLayout();
  console.log("ProfilePage tab:", tab);

  return (
    <ContentLayout
      header={<ProfileHeader />}
        sidebar={<UserProfileSidebar tab={tab} setTab={setTab}/>}
      {...profileLayoutOptions}
    >

<JumboCard sx={{ mt: 4}}>

        {/* Main Content */}
        <Grid container item  sx={{ p: 3, bgcolor: "background.paper", width: "100%" }}>
          {tab === 0 && <AdminProfileForm />}
          {tab === 1 && <ChangePasswordForm />}
        </Grid>
</JumboCard>

    </ContentLayout>
  );
};

export default ProfilePage;
