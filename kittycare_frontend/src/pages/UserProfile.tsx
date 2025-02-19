import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { isAuthenticated, clearTokens } from '../utils/auth';

export const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = isAuthenticated();
    if (!userData) {
      navigate('/login');
    } else {
      setUser(userData);
    }
  }, [navigate]);

  const handleLogout = () => {
    clearTokens();
    navigate('/login');
  };

  if (!user) {
    return null;
  }

  const photo = localStorage.getItem('photo');
  console.log('photo on profile: ', photo);

  const displayName = user.name || user.email || 'User';

  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Profile</h1>
        <div className="flex items-center space-x-4 mb-8">
          {photo ? (
            <img
              src={photo}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-2xl text-white">?</span>
            </div>
          )}
          <div>
            <p className="text-2xl font-semibold">{displayName}</p>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
        >
          Logout
        </button>
      </div>
    </Layout>
  );
};
