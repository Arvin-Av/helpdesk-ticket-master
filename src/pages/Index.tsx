
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { LayoutDashboard, LogIn, Ticket, UserPlus } from 'lucide-react';

const Index = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate(isAdmin ? '/admin/dashboard' : '/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 text-white p-1 rounded">
              <Ticket size={24} />
            </div>
            <h1 className="text-xl md:text-2xl font-bold">HelpDesk</h1>
          </div>
          
          <nav className="flex items-center space-x-4">
            {isAuthenticated ? (
              <Button onClick={() => navigate(isAdmin ? '/admin/dashboard' : '/dashboard')}>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                  Login
                </Link>
                <Link to="/register">
                  <Button variant="outline" size="sm">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Internal Support Ticketing System
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Streamline your IT support processes with our easy-to-use helpdesk ticketing system. Get faster resolutions and better tracking.
          </p>
          <Button size="lg" onClick={handleGetStarted}>
            {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="bg-blue-100 text-blue-600 p-2 rounded-md inline-block mb-4">
                <Ticket size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Submit Support Tickets</h3>
              <p className="text-gray-600">
                Create detailed support requests with priority levels, department routing, and file attachments.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="bg-green-100 text-green-600 p-2 rounded-md inline-block mb-4">
                <LayoutDashboard size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Track Progress</h3>
              <p className="text-gray-600">
                Monitor the status of your tickets in real-time with notifications when updates are made.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="bg-purple-100 text-purple-600 p-2 rounded-md inline-block mb-4">
                <UserPlus size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Admin Management</h3>
              <p className="text-gray-600">
                IT staff can manage all tickets, assign tasks, update statuses, and communicate with users.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to streamline your support process?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join our helpdesk system today and experience faster resolutions.
          </p>
          
          <div className="flex justify-center gap-4">
            {isAuthenticated ? (
              <Button variant="secondary" size="lg" onClick={() => navigate(isAdmin ? '/admin/dashboard' : '/dashboard')}>
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button variant="secondary" size="lg" onClick={() => navigate('/login')}>
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Button>
                <Button variant="outline" size="lg" onClick={() => navigate('/register')}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Register
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 text-white p-1 rounded">
                <Ticket size={20} />
              </div>
              <h2 className="text-lg font-bold">HelpDesk</h2>
            </div>
            
            <div className="mt-4 md:mt-0">
              <p className="text-gray-600 text-sm">
                &copy; {new Date().getFullYear()} Company, Inc. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
