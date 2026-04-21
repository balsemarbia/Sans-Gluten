import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiCall, getToken } from '@/constants/api';
import { Shield } from 'lucide-react';

interface AdminAuthProps {
  children: React.ReactNode;
}

export default function AdminAuth({ children }: AdminAuthProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    const token = getToken();

    if (!token) {
      // Not logged in - redirect to admin login
      navigate('/admin/login', {
        state: { from: { pathname: location.pathname } },
        replace: true
      });
      return;
    }

    try {
      // Check if user has admin role
      const response = await apiCall('/users/role', 'GET', undefined, token);

      if (response.role !== 'admin') {
        // Not an admin - logout and redirect to admin login
        localStorage.removeItem('userToken');
        localStorage.removeItem('isAdmin');
        navigate('/admin/login', {
          state: {
            from: { pathname: location.pathname },
            error: 'Accès refusé. Compte non autorisé.'
          },
          replace: true
        });
        return;
      }

      // User is admin
      localStorage.setItem('isAdmin', 'true');
      setIsAdmin(true);
      setIsChecking(false);
    } catch (error) {
      console.error('Admin check failed:', error);
      // Error checking role - redirect to login
      localStorage.removeItem('userToken');
      localStorage.removeItem('isAdmin');
      navigate('/admin/login', {
        state: { from: { pathname: location.pathname } },
        replace: true
      });
      return;
    }

    setIsChecking(false);
  };

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-500 mb-4">
            <Shield className="w-8 h-8 text-white animate-pulse" />
          </div>
          <p className="text-white text-lg">Vérification des droits d'accès...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect
  }

  return <>{children}</>;
}
