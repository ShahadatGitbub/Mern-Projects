import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Materials from "./pages/Materials/Materials";
import Contact from "./pages/Contact/Contact";
import Footer from "./components/Footer/Footer";
import LoginPage from "./components/LoginPopUp/LoginPage";
import AttendanceManagement from "./pages/Attendance/AttendanceManagement";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // ✅ Import Toastify CSS
import ProfileCard from "./pages/Profile/ProfileCard";
import TestimonialPage from "./pages/Testimonials/TestimonialPage";

const App = () => {
  return (
    <div>
      <Navbar />
      <ToastContainer
  position="top-center"
  autoClose={3000}
  hideProgressBar={false}
  newestOnTop={true}
  closeOnClick
  rtl={false}
  pauseOnFocusLoss={false}
  draggable
  pauseOnHover
  closeButton={false} 
  toastStyle={{
    borderRadius: "15px",
    minHeight: "50px",
    fontSize: "14px",
    padding: "10px 16px",
  }}
/>

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<LoginPage />} />
        <Route path ="/profile" element = {<ProfileCard/>}></Route>
        <Route path ="/add-testimonials" element = {<TestimonialPage/>}></Route>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/attendance" element={<AttendanceManagement />} />
        <Route path="/materials" element={<Materials />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
