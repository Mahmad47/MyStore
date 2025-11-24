import Grid from "@mui/material/Grid";
import { Contacts } from "../Contact";
import ProfileTabs from "../ProfileTabs/ProfileTabs";

const UserProfileSidebar = ({ tab, setTab }) => {
    return (
        <Grid container spacing={3.75}>
            <Grid item xs={12} md={6} lg={12}>
                <Contacts />
            </Grid>
            <Grid item xs={12} md={12} lg={12} sx={{ display: "flex", justifyContent: { lg: "center" } }}
            >
                <ProfileTabs tab={tab} setTab={setTab} />
            </Grid>
        </Grid>
    );
};

export { UserProfileSidebar };
