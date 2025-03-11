import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
    axios.defaults.withCredentials = true;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    const [userId, setUserId] = useState(null);
    const [profilePic, setProfilePic] = useState(""); // Stores the filename of the profile picture

    const getAuthState = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/auth/is-auth`);

            if (response.data.success) {
                setIsLoggedIn(true);
                await getUserData();
            } else {
                setIsLoggedIn(false);
                setUserId(null);
                setProfilePic(""); 
            }
        } catch (error) {
            setIsLoggedIn(false);
            setUserId(null);
            setProfilePic("");
        }
    };

    const getUserData = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/user/user-details`);

            if (response.data.success) {
                setUserData(response.data.userData);
                setUserId(response.data.userData._id);
                getProfilePic(response.data.userData._id); // Call getProfilePic after userId is set
            } else {
                toast.error("User data not found: " + response.data.message);
            }
        } catch (error) {
            if (error.response?.status !== 401) {
                toast.error(error.response?.data?.message || "Failed to fetch user data.");
            }
        }
    };

    const getProfilePic = async (userId) => {
        try {
            if (!userId) return;

            const response = await axios.get(`${backendUrl}/api/user/get-profile-pic/${userId}`);

            if (response.data.success) {
                setProfilePic(response.data.filename); // Store just the filename
            } else {
                setProfilePic("");
            }
        } catch (error) {
            setProfilePic("");
        
        }
    };

    useEffect(() => {
        getAuthState();
    }, []);

    const value = {
        backendUrl,
        isLoggedIn,
        setIsLoggedIn,
        userData,
        setUserData,
        getUserData,
        userId,
        profilePic,       
        setProfilePic,    
        getProfilePic,    
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};