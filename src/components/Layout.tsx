
import React, { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Ticket, 
  Settings, 
  LogOut, 
  User,
  PlusCircle,
  Home
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-50 border-r border-gray-200 p-4">
        <div className="flex flex-col h-full">
          <div className="mb-8">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-blue-600 text-white p-1 rounded">
                <Ticket size={20} />
              </div>
              <h1 className="text-xl font-bold">HelpDesk</h1>
            </Link>
          </div>
          
          <nav className="space-y-1 flex-1">
            <p className="text-xs uppercase text-gray-500 mb-2 px-2">Menu</p>
            {isAdmin ? (
              <>
                <Link to="/admin/dashboard" className="flex items-center space-x-2 px-2 py-2 rounded-md hover:bg-slate-100">
                  <LayoutDashboard size={18} />
                  <span>Dashboard</span>
                </Link>
                <Link to="/admin/tickets" className="flex items-center space-x-2 px-2 py-2 rounded-md hover:bg-slate-100">
                  <Ticket size={18} />
                  <span>All Tickets</span>
                </Link>
              </>
            ) : (
              <>
                <Link to="/dashboard" className="flex items-center space-x-2 px-2 py-2 rounded-md hover:bg-slate-100">
                  <LayoutDashboard size={18} />
                  <span>Dashboard</span>
                </Link>
                <Link to="/my-tickets" className="flex items-center space-x-2 px-2 py-2 rounded-md hover:bg-slate-100">
                  <Ticket size={18} />
                  <span>My Tickets</span>
                </Link>
                <Link to="/new-ticket" className="flex items-center space-x-2 px-2 py-2 rounded-md hover:bg-slate-100">
                  <PlusCircle size={18} />
                  <span>New Ticket</span>
                </Link>
              </>
            )}
            <Link to="/settings" className="flex items-center space-x-2 px-2 py-2 rounded-md hover:bg-slate-100">
              <Settings size={18} />
              <span>Settings</span>
            </Link>
          </nav>

          <div className="mt-auto pt-4 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center mr-2">
                  <User size={16} />
                </div>
                <div className="text-sm">
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.role}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut size={18} />
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-background">
        <div className="container py-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
