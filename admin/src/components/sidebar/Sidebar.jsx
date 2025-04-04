import React from "react";
import "./Sidebar.css";
import { Link, useLocation } from 'react-router-dom';
import { 
    ShoppingBag, 
    List, 
    ClipboardList, 
    UserPlus, 
    Package, 
    Mail,
    BarChart2 
} from 'lucide-react';

const Sidebar = () => {
    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <div className="sidebar">
            <div className="sidebar-item">
                <Link to="/adminpanel/addproduct" style={{ textDecoration: "none" }}>
                    <div className={`sidebaritem ${currentPath === '/adminpanel/addproduct' ? 'active' : ''}`}>
                        <ShoppingBag size={24} />
                        <p>Add Product</p>
                    </div>
                </Link>
            </div>

            <Link to="/adminpanel/listproduct" style={{ textDecoration: "none" }}>
                <div className={`sidebaritem ${currentPath === '/adminpanel/listproduct' ? 'active' : ''}`}>
                    <List size={24} />
                    <p>Product List</p>
                </div>
            </Link>

            <Link to="/adminpanel/stock-management" style={{ textDecoration: "none" }}>
                <div className={`sidebaritem ${currentPath === '/adminpanel/stock-management' ? 'active' : ''}`}>
                    <Package size={24} />
                    <p>Stock Management</p>
                </div>
            </Link>

            <Link to="/adminpanel/vieworders" style={{ textDecoration: "none" }}>
                <div className={`sidebaritem ${currentPath === '/adminpanel/vieworders' ? 'active' : ''}`}>
                    <ClipboardList size={24} />
                    <p>View Orders</p>
                </div>
            </Link>
            <Link to="/adminpanel/add-admin" style={{ textDecoration: "none" }}>
                <div className={`sidebaritem ${currentPath === '/adminpanel/add-admin' ? 'active' : ''}`}>
                    <UserPlus size={24} />
                    <p>Add Admin</p>
                </div>
            </Link>

            <Link 
                to="/adminpanel/adminnewsletter" 
                style={{ textDecoration: "none" }}
            >
                <div className={`sidebaritem ${currentPath === '/adminpanel/adminnewsletter' ? 'active' : ''}`}>
                    <Mail size={24} />
                    <p>Newsletter</p>
                </div>
            </Link>
        </div>
    );
};

export default Sidebar;