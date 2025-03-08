import React, { useContext } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import user from "../../assets/user.png";
import search_icon from "../../assets/search.png";
import "./Navbar.css";
import { use } from "react";
import { AppContext } from "../../context/AppContext"
import { toast } from "react-toastify";
import axios from "axios";

const Navbar = () => {

  const location = useLocation(); // Get the current URL
  const currentPath = location.pathname;
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn, userData, setUserData, backendUrl } = useContext(AppContext);

  const logoutHandler = async () => {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.post(`${backendUrl}/api/auth/logout`);
      if (response.data.success) {
        navigate('/');
        setIsLoggedIn(false);
        toast.success("Logged out successfully");
        setUserData(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  }



  return (
    <div className="navbar">
      <NavLink to="/">
        <img src={logo} alt="Logo" className="logo" />
      </NavLink>
      <ul className="nav-links">
        <li>
          <NavLink to="/" className={({ isActive }) => (isActive ? "active-navbar" : "")}>Home</NavLink>
        </li>
        <li>
          <NavLink to="/about" className={({ isActive }) => (isActive ? "active-navbar" : "")}>About</NavLink>
        </li>
        <li>
          <NavLink to="/attendance" className={({ isActive }) => (isActive ? "active-navbar" : "")}>Attendance</NavLink>
        </li>
        <li>
          <NavLink to="/materials" className={({ isActive }) => (isActive ? "active-navbar" : "")}>Materials</NavLink>
        </li>
        <li>
          <NavLink to="/contact" className={({ isActive }) => (isActive ? "active-navbar" : "")}>Contact</NavLink>
        </li>
      </ul>


      <div className="nav-search">
        <input type="text" placeholder="Search..." className="search-input" />
        <img src={search_icon} alt="Search Icon" className="search-icon" />
      </div>

      <div className="nav-right">

        {userData && isLoggedIn && <div className="user-info">{userData.name[0].toUpperCase()}</div>}

        <div className="user-dropdown">
          <ul>
            <li onClick={()=> navigate('/profile')} >Profile</li>
            {userData && !userData.isAccountVerified && <li>Verify Email</li>}
            <li onClick={logoutHandler}>Logout</li>
          </ul>
        </div>


        {!isLoggedIn && <button className="login-btn" onClick={() => navigate('/register')}> Sign Up</button>}
        {!isLoggedIn && <button className="login-btn" onClick={() => navigate('/login')}> Login</button>}

      </div>
    </div>
  );
};

export default Navbar;
