import React, {useState, useContext, useRef } from "react";
import "./ProfileCard.css";
import defaultProfilePic from "/default-user-profile.png";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ProfileCard = () => {
  const { userData, backendUrl, profilePic, setProfilePic } = useContext(AppContext);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // API Endpoints
  const uploadUrl = `${backendUrl}/api/user/upload-profile-pic`;
  const updateUrl = `${backendUrl}/api/user/update-profile-pic`;
  const deleteUrl = `${backendUrl}/api/user/delete-profile-pic`;

  // Handle file upload click
  const handleFileSelect = () => {
    fileInputRef.current.click();
  };

  // Upload or Update Profile Picture
  const handleProfilePicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("profilePic", file);
    formData.append("userId", userData._id);

    try {
      let response;
      if (profilePic) {
        // Update existing profile picture
        response = await axios.put(updateUrl, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        // Upload new profile picture
        response = await axios.post(uploadUrl, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      if (response.data.success) {
        setProfilePic(response.data.filename); // Update profilePic in context
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error("Error uploading profile picture");
    } finally {
      setLoading(false);
    }
  };

  // Remove Profile Picture
  const handleRemoveProfilePic = async () => {
    if (!profilePic) return;

    setLoading(true);
    try {
      const response = await axios.delete(deleteUrl, {
        data: { userId: userData._id },
      });

      if (response.data.success) {
        setProfilePic(""); // Reset profilePic in context
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error("Error removing profile picture");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-card-container">
      <div className="profile-card">
        <div className="profile-header">
          <h2>Profile</h2>
        </div>

        <div className="profile-pic">
          <img
            src={profilePic ? `${backendUrl}/profile-images/${profilePic}` : defaultProfilePic}
            alt="Profile"
            onError={(e) => (e.target.src = defaultProfilePic)} // Fallback to default if image fails
          />
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleProfilePicUpload}
        />

        <div className="profile-pic-buttons">
          <button
            className={profilePic ? "update-btn" : "upload-btn"}
            onClick={handleFileSelect}
            disabled={loading}
          >
            {loading ? <span className="loader"></span> : profilePic ? "Change Profile Picture" : "Add Profile Picture"}
          </button>

          {profilePic && (
            <button className="delete-btn" onClick={handleRemoveProfilePic} disabled={loading}>
              {loading ? <span className="loader"></span> : "Remove Profile Picture"}
            </button>
          )}
        </div>

        <div className="profile-info">
          <h2>{userData?.name || "User Name"}</h2>
          <p className="detail">
            <span className="label">Email:</span> 
            
            <div>
              <span>{userData?.email || "N/A"}</span>
              <span className="verified">{userData?.isAccountVerified ? "✅" : <a href="/verification/email-verification" className="verify-link">verify</a>}</span>
            </div>
           

          </p>
          <p className="detail">
            <span className="label">User ID:</span> {userData?._id || "N/A"}
          </p>
        </div>

        <button className="change-password-btn" onClick={()=>navigate("/verification/reset-password")}>Change Password</button>
      </div>
    </div>
  );
};

export default ProfileCard;