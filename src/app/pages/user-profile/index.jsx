import React, { useState } from "react";
import UserProfileForm from "@app/_components/user/forms/userProfileForm/userProfileForm";
import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import UserChangePasswordForm from "@app/_components/user/forms/UserChangePasswordForm/UserChangePasswordForm";
import { useNavigate } from "react-router-dom";
import { ASSET_IMAGES } from "@app/_utilities/constants/paths";
import { getAssetPath } from "@app/_utilities/helpers";

const UserProfilePage = () => {
    const [activeTab, setActiveTab] = useState("profile");
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    async function handleLogout() {
        await logout();
        return navigate("/auth/login-1");
    }


    return (
        <div className="min-h-screen bg-gray-50">
            {/* Banner */}
            <div
                className="h-56 w-full bg-cover bg-center rounded-lg"
                style={{
                    backgroundImage: `url(${getAssetPath(`${ASSET_IMAGES}/profile-bg.jpg`)})`,
                }}
            ></div>
            <div className="max-w-5xl mx-auto -mt-16 px-4 pb-[10%] md:pb-[5%">
                {/* Avatar + Basic Info */}
                <div className="flex md:items-end md:justify-between flex-wrap flex-col md:flex-row gap-4">
                    <div className="flex items-end gap-4">
                        <img
                            src={user?.avatar || "https://via.placeholder.com/150"}
                            alt="User Avatar"
                            className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover"
                        />
                        <div>
                            <h2 className="h5">{`${user?.name || 'Mikey'}`}</h2>
                            <p className="text-gray-500 text-sm">
                                {`${user?.email || '193 followers · 21 following'}`} 
                            </p>
                        </div>
                    </div>

                    <button className="button !bg-red-600 text-white rounded-md hover:bg-red-700 transition" onClick={handleLogout}>
                        Logout
                    </button>
                </div>

                {/* Tabs */}
                <div className="mt-10 border-b border-gray-200 flex gap-8">
                    <button
                        onClick={() => setActiveTab("profile")}
                        className={`pb-2 h6 border-b-2 transition ${activeTab === "profile"
                            ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        Profile Details
                    </button>

                    <button
                        onClick={() => setActiveTab("password")}
                        className={`pb-2 h6 border-b-2 transition ${activeTab === "password"
                            ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        Change Password
                    </button>
                </div>

                {/* Content */}
                <div className="mt-8">
                    {activeTab === "profile" ? (
                        <UserProfileForm />
                    ) : (
                        <UserChangePasswordForm />
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfilePage;
