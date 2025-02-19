// import ReactPixel from 'react-facebook-pixel';
import { useNavigate } from "react-router-dom";
import { logout } from "../Redux/features/userSlice";
import { useAppDispatch } from "../Redux/hooks";
import { useEffect } from 'react';
import { Link } from "react-router-dom";
import Layout from "../components/Layout";

// Navigation items configuration
const NAV_ITEMS = [
  { path: "/login", label: "Login" },
  { path: "/signup", label: "Signup" },
  { path: "/priceselection", label: "Price Selection" },
  { path: "/paymentmethod", label: "Payment Method" },
  { path: "/paymentdetail", label: "Payment Detail" },
  { path: "/cat-assistant", label: "Chatroom" },
  { path: "/cat-profile", label: "Profile" },
  { path: "/progress", label: "Go to Progress" },
] as const;

/**
 * Dashboard component that displays navigation links and logout functionality
 */
const Dashboard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Track ViewContent when dashboard loads
    // ReactPixel.track('ViewContent');
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <Layout>
      <nav className="w-full min-h-[700px] flex flex-col items-center justify-center gap-4">
        {NAV_ITEMS.map(({ path, label }) => (
          <Link
            key={path}
            to={path}
            className="text-xl hover:text-primary transition-colors"
          >
            {label}
          </Link>
        ))}

        <button
          onClick={handleLogout}
          className="text-xl hover:text-red-500 transition-colors cursor-pointer"
        >
          Logout
        </button>
      </nav>
    </Layout>
  );
};

export default Dashboard;
