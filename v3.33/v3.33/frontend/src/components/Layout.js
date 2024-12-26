import React from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import NotificationStack from './NotificationStack';
import Modal from './Modal';
import { selectSidebarOpen, setSidebarOpen } from '../redux/slices/uiSlice';

const Layout = () => {
  const dispatch = useDispatch();
  const sidebarOpen = useSelector(selectSidebarOpen);

  const toggleSidebar = () => {
    dispatch(setSidebarOpen(!sidebarOpen));
  };

  // Close sidebar on window resize if screen becomes larger than mobile breakpoint
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && sidebarOpen) {
        dispatch(setSidebarOpen(false));
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch, sidebarOpen]);

  return (
    <div className="h-screen flex overflow-hidden bg-primary-500">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onToggle={toggleSidebar} />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Top navigation */}
        <Navbar onMenuClick={toggleSidebar} />

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto">
          <div className="py-3 md:py-6">
            <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6">
              {/* Page content */}
              <Outlet />
            </div>
          </div>
        </main>
      </div>

      {/* Notifications */}
      <NotificationStack />

      {/* Modal */}
      <Modal />
    </div>
  );
};

export default Layout;
