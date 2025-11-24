import React from 'react'
import { Tabs, Tab, Box } from '@mui/material';
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";

const ProfileTabs = ({ tab, setTab }) => {
  return (
    <Tabs
  orientation="vertical"
  value={tab}
  onChange={(e, v) => setTab(v)}
  variant="fullWidth"
  TabIndicatorProps={{ style: { display: "none" } }}
  sx={{
    alignItems: "flex-start",
    width: 250,
    py: 2,
    ".MuiTab-root": {
      justifyContent: "flex-start",
      borderRadius: "12px",
      textTransform: "none",
      px: 2,
      minHeight: 55,
    },
    ".Mui-selected": {
      bgcolor: "primary.navactive",
      borderLeft: "4px solid",
      borderColor: "primary.main",
      color: "text.primary",
    },
  }}
>
  <Tab
    icon={<PersonIcon fontSize="small" />}
    iconPosition="start"
    label="User Profile"
  />
  <Tab
    icon={<LockIcon fontSize="small" />}
    iconPosition="start"
    label="Change Password"
  />
</Tabs>

  )
}

export default ProfileTabs