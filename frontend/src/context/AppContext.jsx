import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
    axios.defaults.withCredentials = true;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null); // ✅ Ensure it's initially null, not false

    const getAuthState = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/auth/is-auth`);
            
            if (response.data.success) {
                setIsLoggedIn(true);
                await getUserData();  // ✅ Call only if authenticated
            }
        } catch (error) {
            console.error("Auth verification failed:", error?.response?.data?.message || error.message);
            
            if (error.response?.status !== 401) { 
                toast.error(error.response?.data?.message || "Failed to verify authentication.");
            }
        }
    };
    
    

    const getUserData = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/user/user-details`);
            
            if (response.data.success) {
                setUserData(response.data.userData);
            } else {
                toast.error("User data not found:", response.data.message);
            }
        } catch (error) {
            console.error("Error fetching user data:", error.message);
            
            if (error.response?.status !== 401) {
                toast.error(error.response?.data?.message || "Failed to fetch user data.");
            }
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
         getUserData 
        
        };

    return (
        <AppContext.Provider value={{ backendUrl, isLoggedIn, setIsLoggedIn, userData, setUserData, getUserData }}>
            {props.children}
        </AppContext.Provider>
    );
};
