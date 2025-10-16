import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '🏠' },
    { name: 'Profile', path: '/profile', icon: '👤' },
    ...(user.role === 'admin' ? [
      { name: 'Users', path: '/users', icon: '👥' },
      { name: 'Analytics', path: '/analytics', icon: '📊' },
      { name: 'All Hotels', path: '/hotels', icon: '🏨' },
      { name: 'All Rooms', path: '/rooms', icon: '🛏️' }
    ] : []),
    ...(user.role === 'manager' ? [
      { name: 'My Hotels', path: '/hotels', icon: '🏨' },
      { name: 'My Rooms', path: '/rooms', icon: '🛏️' }
    ] : []),
    ...(user.role === 'customer' ? [
      { name: 'Bookings', path: '/bookings', icon: '📅' },
      { name: 'Favorites', path: '/favorites', icon: '❤️' }
    ] : [])
  ];

  return (
    <div className="w-64 bg-white shadow-lg h-screen fixed left-0 top-16 z-40">
      <div className="p-4">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Menu</h3>
        </div>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition duration-200 ${
                location.pathname === item.path
                  ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;