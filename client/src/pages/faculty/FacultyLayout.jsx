import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  LayoutDashboard, BookOpen, Users, Trophy, Bell, UserCircle, 
  LogOut, Menu, X, ChevronDown, ChevronUp, ClipboardCheck
} from 'lucide-react';

const FacultyLayout = ({ children }) => {
  const userID = JSON.parse(localStorage.getItem('user')).user.userID;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userName, setUserName] = useState('Faculty');
  const [Loading,setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const navigationItems = [
    { 
      name: 'Dashboard', 
      path: '/faculty/dashboard', 
      icon: <LayoutDashboard className="h-5 w-5" /> 
    },
    { 
      name: 'Students', 
      path: '/faculty/students', 
      icon: <Users className="h-5 w-5" /> 
    },
    { 
      name: 'Notes & Resources', 
      path: '/faculty/notes', 
      icon: <BookOpen className="h-5 w-5" /> 
    },
    { 
      name: 'Attendance', 
      path: '/faculty/attendance', 
      icon: <ClipboardCheck className="h-5 w-5" /> 
    },
    { 
      name: 'Leaderboard', 
      path: '/faculty/leaderboard', 
      icon: <Trophy className="h-5 w-5" /> 
    },
    { 
      name: 'Notifications', 
      path: '/faculty/notifications', 
      icon: <Bell className="h-5 w-5" /> 
    },
    { 
      name: 'Profile', 
      path: '/faculty/profile', 
      icon: <UserCircle className="h-5 w-5" /> 
    },
  ];

  useEffect(() => {
    const fetchData = async ()=> {
      try {
        if(localStorage.getItem('userName')){
          setUserName(localStorage.getItem('userName'));
          return ;
        }
        let user = await axios.post('/api/dashboard/getUserName',{userID});
        localStorage.setItem('userName',user.data.message.fullName);
        setUserName(user.data.message.fullName);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
      finally {
        setLoading(false);
      }
    };
    fetchData();
  },[]);

  const isActive = (path) => location.pathname === path;

  if(Loading)
    return (<></>);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and Hamburger */}
            <div className="flex">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <span className="sr-only">Open sidebar</span>
                <Menu className="h-6 w-6" />
              </button>
              <div className="flex-shrink-0 flex items-center">
                <Link to="/faculty/dashboard" className="flex items-center">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                  <span className="ml-2 text-xl font-bold text-gray-900">AceVihaari</span>
                </Link>
              </div>
            </div>

            {/* User Profile Dropdown */}
            <div className="flex items-center">
              <div className="ml-3 relative">
                <div>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium">
                        {userName.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span className="ml-2 hidden md:flex flex-col items-start">
                        <span className="text-sm font-medium text-gray-700">{userName}</span>
                        <span className="text-xs text-gray-500">{ userID.toUpperCase()}</span>
                      </span>
                      {dropdownOpen ? (
                        <ChevronUp className="ml-1 h-4 w-4 text-gray-500" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4 text-gray-500" />
                      )}
                    </div>
                  </button>
                </div>
                {dropdownOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Your Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Overlay */}
        <div
          className={`fixed inset-0 bg-gray-600 bg-opacity-75 z-40 md:hidden transition-opacity duration-300 ease-in-out ${
            sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={closeSidebar}
        ></div>

        {/* Sidebar */}
        <div
          className={`fixed md:sticky top-0 inset-y-0 left-0 flex flex-col w-64 max-w-64 pt-5 pb-4 bg-white border-r border-gray-200 transform md:translate-x-0 transition duration-300 ease-in-out z-40 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Close button (mobile only) */}
          <div className="absolute right-0 top-0 -mr-12 pt-2 md:hidden">
            <button
              onClick={closeSidebar}
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Close sidebar</span>
              <X className="h-6 w-6 text-white" />
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 h-0">
            <div className="mt-5 flex-1 flex flex-col">
              <nav className="flex-1 px-2 space-y-1">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={closeSidebar}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive(item.path)
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                  >
                    <div className={`mr-3 ${isActive(item.path) ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-600'}`}>
                      {item.icon}
                    </div>
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Logout Button */}
          <div className="flex-shrink-0 p-2 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center justify-center w-full px-4 py-2 text-sm text-gray-600 rounded-md hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sign out
            </button>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default FacultyLayout;