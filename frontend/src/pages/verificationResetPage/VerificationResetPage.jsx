import React, { useState, useContext, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import "./VerificationResetPage.css";

const VerificationResetPage = () => {
  const { backendUrl, userData, isLoggedIn, getUserData } = useContext(AppContext); // Added getUserData
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(userData?.email || ""); // Pre-fill email if user is logged in
  const [otp, setOtp] = useState(["", "", "", "", "", ""]); // Array for 6 OTP digits
  const [newPassword, setNewPassword] = useState(""); // Ensure newPassword starts empty

  const navigate = useNavigate();
  const location = useLocation();

  // Refs for OTP input fields
  const otpRefs = useRef([useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)]);

  // Set activeTab based on URL
  const [activeTab, setActiveTab] = useState("verify");
  useEffect(() => {
    const pathname = location.pathname;
    if (pathname === "/verification/email-verification") {
      setActiveTab("verify");
    } else if (pathname === "/verification/reset-password") {
      setActiveTab("reset");
    } else {
      // Default to verify tab if URL doesn't match or is just /verification
      navigate("/verification/email-verification", { replace: true });
    }
  }, [location.pathname, navigate]);

  // Fetch user data on mount if logged in
  useEffect(() => {
    if (isLoggedIn && userData?.email) {
      setEmail(userData.email);
    }
    // Reset newPassword to empty when switching tabs or loading
    setNewPassword("");
  }, [isLoggedIn, userData, activeTab]);

  // Handle OTP input changes
  const handleOtpChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move focus to next input if a digit is entered
      if (value && index < 5) {
        otpRefs.current[index + 1].current.focus();
      }
    }
  };

  // Handle OTP input key down (for backspace navigation)
  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1].current.focus();
    }
  };

  // Send Verification OTP
  const handleSendVerificationOtp = async () => {
    if (!userData?._id) {
      toast.error("User not authenticated. Please log in.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/api/auth/send-verify-otp`, {
        userId: userData._id,
      });
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong while sending verification OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  // Verify Email by OTP
  const handleVerifyEmail = async () => {
    const otpString = otp.join("");
    if (!userData?._id || !otpString || otpString.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/api/auth/verify-account`, {
        userId: userData._id,
        otp: otpString,
      });
      if (response.data.success) {
        toast.success(response.data.message);
        // Refresh user data to update isAccountVerified in context
        await getUserData(); // This updates userData in AppContext
        navigate("/profile"); // Redirect to profile page after verification
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong while verifying email."
      );
    } finally {
      setLoading(false);
      setOtp(["", "", "", "", "", ""]); // Clear OTP fields
    }
  };

  // Send Password Reset OTP
  const handleSendResetOtp = async () => {
    if (!email) {
      toast.error("Please provide an email address.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/api/auth/send-reset-otp`, {
        email,
      });
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong while sending reset OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  // Reset Password
  const handleResetPassword = async () => {
    const otpString = otp.join("");
    if (!email || !otpString || otpString.length !== 6 || !newPassword) {
      toast.error("All fields (email, 6-digit OTP, and new password) are required.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/api/auth/reset-password`, {
        email,
        otp: otpString,
        newPassword,
      });
      if (response.data.success) {
        toast.success(response.data.message);
        setEmail("");
        setOtp(["", "", "", "", "", ""]);
        setNewPassword("");
        navigate("/"); // Redirect to home page after resetting password
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong while resetting password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verification-reset-page">
      <div className="verification-reset-card">
        <div className="tabs">
          <button
            className={activeTab === "verify" ? "active" : ""}
            onClick={() => {
              setActiveTab("verify");
              navigate("/verification/email-verification");
            }}
          >
            Verify Email
          </button>
          <button
            className={activeTab === "reset" ? "active" : ""}
            onClick={() => {
              setActiveTab("reset");
              navigate("/verification/reset-password");
            }}
          >
            Reset Password
          </button>
        </div>

        {activeTab === "verify" && (
          <div className="tab-content">
            <h2 className="title">Email Verification</h2>
            {userData?.isAccountVerified ? (
              <p className="verified-text">Your email is already verified! ✅</p>
            ) : (
              <>
                <button
                  className="verify-btn"
                  onClick={handleSendVerificationOtp}
                  disabled={loading || userData?.isAccountVerified}
                >
                  {loading ? "Sending..." : "Send Email Verification OTP"}
                </button>
                <div className="otp-container">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={otpRefs.current[index]}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="otp-input"
                      disabled={loading}
                      autoFocus={index === 0}
                    />
                  ))}
                </div>
                <button
                  className="verify-btn"
                  onClick={handleVerifyEmail}
                  disabled={loading || otp.join("").length !== 6}
                >
                  {loading ? "Verifying..." : "Verify Email"}
                </button>
              </>
            )}
          </div>
        )}

        {activeTab === "reset" && (
          <div className="tab-content">
            <h2 className="title">Reset Password</h2>
            <button
              className="reset-btn"
              onClick={handleSendResetOtp}
              disabled={loading || !email}
            >
              {loading ? "Sending..." : "Send Reset OTP"}
            </button>
            <div className="form-group">
              <label htmlFor="reset-email">Email:</label>
              <input
                id="reset-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                disabled={loading || (isLoggedIn && userData?.email)}
                autoComplete="off"
              />
            </div>
            <div className="otp-container">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={otpRefs.current[index]}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className="otp-input"
                  disabled={loading}
                  autoFocus={index === 0 && !email}
                  autoComplete="off"
                />
              ))}
            </div>
            <div className="form-group">
              <label htmlFor="new-password">New Password:</label>
              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                disabled={loading}
                autoComplete="new-password"
              />
            </div>
            <button
              className="reset-btn"
              onClick={handleResetPassword}
              disabled={loading || !email || otp.join("").length !== 6 || !newPassword}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificationResetPage;