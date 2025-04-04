import { useNavigate, Link, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FiMenu, FiHome, FiLogOut, FiMail, FiPackage, FiBarChart2 } from 'react-icons/fi';
import { ShoppingBag, List, ClipboardList, UserPlus } from 'lucide-react';
import AddProduct from '../addProduct/AddProduct';
import ListProduct from '../listproduct/ListProduct';
import ViewOrders from '../vieworders/ViewOrders';
import AddAdmin from '../Add/AdddAmin';
import AdminNewsletter from '../NewsLatter/AdminNewsLetter';
import AdminSignup from '../AdminSignup/AdminSignup';
import AdminStockManagement from '../StockManagement/StockManagement';
import AnalyticsDashboard from '../Analytics/Analytics';
import './AdminPanel.css';
import AdminLogin from '../AdminLogin/AdminLogin';

const AdminPanel = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [showWelcome, setShowWelcome] = useState(true);
  const navigate = useNavigate();

  // Add a state to track authentication
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isLoggedIn') === 'true'
  );

  const handleMenuClick = (menuItem) => {
    setActiveMenu(menuItem);
    setShowWelcome(false);
    setIsSidebarOpen(false);
  };

  // Modify your handleLogout function
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('auth-token');
    setIsAuthenticated(false);
    navigate('/admin');
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const menuItems = [
    { path: '/adminpanel', name: 'dashboard', displayName: 'Dashboard', icon: <FiHome className="icon" /> },
    { path: '/adminpanel/addproduct', name: 'addproduct', displayName: 'Add Product', icon: <ShoppingBag size={24} /> },
    { path: '/adminpanel/listproduct', name: 'listproduct', displayName: 'Product List', icon: <List size={24} /> },
    { path: '/adminpanel/vieworders', name: 'vieworders', displayName: 'View Orders', icon: <ClipboardList size={24} /> },
    { path: '/adminpanel/stock-management', name: 'stockmanagement', displayName: 'stock management', icon: <FiPackage size={24} /> },
    { path: '/adminpanel/add-admin', name: 'add-admin', displayName: 'Add Admin', icon: <UserPlus size={24} /> },
    { path: '/adminpanel/adminnewsletter', name: 'adminnewsletter', displayName: 'Newsletter', icon: <FiMail size={24} /> },
    
  ];


  if (!isAuthenticated) {
    // Don't redirect, just render the login component
    return <AdminLogin setIsLoggedIn={setIsAuthenticated} />;
  }

  return (
    <div className="admin-container">
      {/* Sidebar Navigation */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Admin Portal</h2>
        </div>
        
        <div className="menu-items">
          {menuItems.map((item) => (
            <Link 
              key={item.path}
              to={item.path}
              className={`sidebar-item ${activeMenu === item.name ? 'active' : ''}`}
              onClick={() => handleMenuClick(item.name)}
            >
              {item.icon}
              <p>{item.displayName}</p>
            </Link>
          ))}
        </div>

        <Link to="#" onClick={(e) => { e.preventDefault(); handleLogout(); }} className="logout-section">
          <FiLogOut className="icon" />
          <span className="menu-text">Logout</span>
        </Link>
      </div>

      {/* Main Content */}
      <div className={`main-content ${isSidebarOpen ? 'shifted' : ''}`}>
        <div className="header">
          <button className="menu-toggle" onClick={toggleSidebar}>
            <FiMenu size={24} />
          </button>
          {showWelcome && <h1 className="amazing-text">Welcome to Admin Dashboard</h1>}
        </div>

        <div className="content">
          <Routes>
            <Route path="/" element={<AnalyticsDashboard />} />
            <Route path="/addproduct" element={<AddProduct />} />
            <Route path="/listproduct" element={<ListProduct />} />
            <Route path="/sales-analytics" element={<AnalyticsDashboard />} />
            <Route path="/vieworders/update-status/:orderId" element={<ViewOrders />} />
            <Route path="/vieworders" element={<ViewOrders />} />
            <Route path='/stock-management' element={<AdminStockManagement/>} />
            <Route path="/add-admin" element={<AddAdmin />} />
            <Route path="/adminnewsletter" element={<AdminNewsletter />} />
            <Route path="/signup" element={<AdminSignup />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;