import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    hotels: 0,
    rooms: 0,
    users: 0,
    bookings: 0
  });

  const fetchStats = React.useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (user?.role === 'manager') {
        const hotelsRes = await fetch('/api/hotels/manager/my-hotels', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const hotelsData = await hotelsRes.json();
        
        const roomsRes = await fetch('/api/rooms', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const roomsData = await roomsRes.json();
        
        setStats({
          hotels: hotelsData.success ? hotelsData.hotels.length : 0,
          rooms: roomsData.success ? roomsData.rooms.length : 0,
          users: 0,
          bookings: 0
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, [user]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const renderDashboardContent = () => {
    switch (user?.role) {
      case 'admin':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-8 rounded-2xl shadow-2xl relative overflow-hidden animate-fade-in-up">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 animate-pulse"></div>
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-white/5 rounded-full animate-bounce-slow"></div>
              <div className="relative">
                <h2 className="text-3xl font-bold mb-3 animate-slide-up">Admin Dashboard</h2>
                <p className="text-red-100 text-lg animate-fade-in" style={{animationDelay: '0.3s'}}>Complete control over your platform ecosystem</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition duration-500 transform hover:-translate-y-2 animate-fade-in-up opacity-0" style={{animationDelay: '0.2s', animationFillMode: 'forwards'}}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Total Users</h3>
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition duration-300">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">0</p>
                <div className="flex items-center">
                  <span className="text-gray-500 text-sm">No data available</span>
                </div>
              </div>

              <div className="group bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition duration-500 transform hover:-translate-y-2 animate-fade-in-up opacity-0" style={{animationDelay: '0.4s', animationFillMode: 'forwards'}}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Total Hotels</h3>
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition duration-300">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
                <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent mb-2">0</p>
                <div className="flex items-center">
                  <span className="text-gray-500 text-sm">No data available</span>
                </div>
              </div>

              <div className="group bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition duration-500 transform hover:-translate-y-2 animate-fade-in-up opacity-0" style={{animationDelay: '0.6s', animationFillMode: 'forwards'}}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Total Bookings</h3>
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition duration-300">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                </div>
                <p className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-2">0</p>
                <div className="flex items-center">
                  <span className="text-gray-500 text-sm">No data available</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200">
                  <h4 className="font-medium text-gray-900">Manage Users</h4>
                  <p className="text-sm text-gray-500 mt-1">View and manage all user accounts</p>
                </button>
                <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200">
                  <h4 className="font-medium text-gray-900">System Settings</h4>
                  <p className="text-sm text-gray-500 mt-1">Configure system-wide settings</p>
                </button>
              </div>
            </div>
          </div>
        );

      case 'manager':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-8 rounded-2xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="relative">
                <h2 className="text-3xl font-bold mb-3">Manager Dashboard</h2>
                <p className="text-green-100 text-lg">Your property management command center</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">My Hotels</h3>
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats.hotels}</p>
                <p className="text-sm text-gray-500 mt-2">Active properties</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Total Rooms</h3>
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                    </svg>
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats.rooms}</p>
                <p className="text-sm text-gray-500 mt-2">Across all properties</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200">
                  <h4 className="font-medium text-gray-900">Add New Hotel</h4>
                  <p className="text-sm text-gray-500 mt-1">Register a new property</p>
                </button>
                <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200">
                  <h4 className="font-medium text-gray-900">Manage Rooms</h4>
                  <p className="text-sm text-gray-500 mt-1">Add or edit room details</p>
                </button>
                <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200">
                  <h4 className="font-medium text-gray-900">View Bookings</h4>
                  <p className="text-sm text-gray-500 mt-1">Check recent reservations</p>
                </button>
              </div>
            </div>
          </div>
        );

      case 'customer':
      default:
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-8 rounded-2xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="relative">
                <h2 className="text-3xl font-bold mb-3">Customer Dashboard</h2>
                <p className="text-blue-100 text-lg">Your gateway to extraordinary experiences</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">My Bookings</h3>
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900">0</p>
                <p className="text-sm text-gray-500 mt-2">Active reservations</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Favorite Hotels</h3>
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900">0</p>
                <p className="text-sm text-gray-500 mt-2">Saved properties</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200">
                  <h4 className="font-medium text-gray-900">Search Hotels</h4>
                  <p className="text-sm text-gray-500 mt-1">Find your next destination</p>
                </button>
                <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200">
                  <h4 className="font-medium text-gray-900">My Bookings</h4>
                  <p className="text-sm text-gray-500 mt-1">View reservation details</p>
                </button>
                <Link to="/profile" className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200 block">
                  <h4 className="font-medium text-gray-900">Profile Settings</h4>
                  <p className="text-sm text-gray-500 mt-1">Update your information</p>
                </Link>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-12 text-center">
          <div className="w-24 h-24 bg-white rounded-full p-3 shadow-2xl mx-auto mb-6 animate-spin-slow">
            <img 
              src="/logo.png.png" 
              alt="HotelEase Logo" 
              className="w-full h-full object-contain rounded-full"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4 animate-fade-in-up">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {user?.role === 'admin' ? 'Manage your entire platform from here' : 
             user?.role === 'manager' ? 'Oversee your properties and bookings' : 
             'Discover amazing hotels and manage your trips'}
          </p>
        </div>
        
        {renderDashboardContent()}
      </div>
    </div>
  );
};

export default Dashboard;