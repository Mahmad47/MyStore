import { CardHeader, Typography, Avatar } from "@mui/material";
import { Div } from "@jumbo/shared";
import { useAuth } from "../AuthProvider/hooks";
import { ASSET_AVATARS } from "@app/_utilities/constants/paths";

const ContentHeader = ({
    avatar,
    title,
    subheader,
    body,
    back,
    action,
    tabs,
    children,
    elevation,
    sx,
}) => {

    const { user } = useAuth();
    const profilePic =
        user?.avatar ||
        getAssetPath(`${ASSET_AVATARS}/avatar10.jpg`, `60x60`);
    return (
        <Div sx={{ ...sx }}>
            {back && <Div sx={{ mb: 2 }}>{back}</Div>}
            <CardHeader
                sx={{ p: 0, mb: 4 }}
                avatar={
                    <Avatar src={profilePic} sx={{ width: 80, height: 80 }} alt="Profile picture" />
                }
                title={title}
                subheader={subheader}
                action={children}
            />
            {body && (
                <Typography variant={"body1"} mb={2}>
                    {body}
                </Typography>
            )}
            {(!!tabs || !!action) && (
                <Div
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    {tabs && <Div sx={{ flex: "1 1 auto" }}>{tabs}</Div>}
                    {action && <Div sx={{ flex: "0 0 auto" }}>{action}</Div>}
                </Div>
            )}
            {elevation}
        </Div>
    );
};

export { ContentHeader };
