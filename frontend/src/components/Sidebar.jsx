import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, LayoutDashboard, PiggyBank, Receipt, PieChart, Settings, FileText } from 'lucide-react';
import { useSelector } from 'react-redux';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  if (!user) return null; // Don't show sidebar if not logged in

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <aside className="sidebar">
      <ul className="sidebar-nav">
        <li className={isActive('/')}>
          <Link to="/">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
        </li>
        <li className={isActive('/transactions')}>
          <Link to="/transactions">
            <Receipt size={20} />
            <span>Transactions</span>
          </Link>
        </li>
        <li className={isActive('/budget')}>
          <Link to="/budget">
            <PieChart size={20} />
            <span>Budget</span>
          </Link>
        </li>
        <li className={isActive('/savings-goals')}>
          <Link to="/savings-goals">
            <PiggyBank size={20} />
            <span>Savings</span>
          </Link>
        </li>
        <li className={isActive('/bills')}>
          <Link to="/bills">
            <Bell size={20} />
            <span>Bills</span>
          </Link>
        </li>
        <li className={isActive('/reports')}>
          <Link to="/reports">
            <FileText size={20} />
            <span>Reports</span>
          </Link>
        </li>
        <li className={isActive('/profile')}>
          <Link to="/profile">
            <Settings size={20} />
            <span>Profile</span>
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
