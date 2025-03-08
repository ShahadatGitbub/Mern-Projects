import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoginPage.css"; 
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";

const LoginPage = () => {
  const { backendUrl, setIsLoggedIn, getUserData, userData } = useContext(AppContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [currLoginState, setCurrLoginState] = useState("Sign Up");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    setCurrLoginState(location.pathname === "/register" ? "Sign Up" : "Login");
  }, [location.pathname]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      axios.defaults.withCredentials = true;
      let response;

      if (currLoginState === "Sign Up") {
        response = await axios.post(`${backendUrl}/api/auth/register`, { name, email, password });
      } else {
        response = await axios.post(`${backendUrl}/api/auth/login`, { email, password });
      }

      if (response.data.success) {
        toast.success(currLoginState === "Sign Up" ? "Account created successfully" : "Logged in successfully");

        if (currLoginState === "Sign Up") {
          navigate("/login");
        } else {
          setIsLoggedIn(true);
          await getUserData(); 
          navigate("/");
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="login-page">
      <form className="login-page-container" onSubmit={handleSubmit}>
        <div className="login-page-title">
          <h2>{currLoginState}</h2>
        </div>

        <div className="login-page-inputs">
          {currLoginState === "Sign Up" && (
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" required />
          )}
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" required />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" required />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? <span className="spinner"></span> : currLoginState === "Sign Up" ? "Create Account" : "Login"}
        </button>

        {currLoginState === "Sign Up" ? (
          <p className="login-page-text">
            Already have an account? <span onClick={() => navigate("/login")}>Click Here</span>
          </p>
        ) : (
          <p>
            Don't have an account? <span onClick={() => navigate("/register")}>Create here</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPage;
