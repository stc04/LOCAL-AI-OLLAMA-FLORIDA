import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  HomeIcon,
  ChatBubbleLeftRightIcon,
  CubeIcon,
  CommandLineIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon,
  UserIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import { selectUser } from '../redux/slices/authSlice';

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Chat', href: '/chat', icon: ChatBubbleLeftRightIcon },
  { name: 'Models', href: '/models', icon: CubeIcon },
  { name: 'API Explorer', href: '/api-explorer', icon: CommandLineIcon },
  { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
  { name: 'Profile', href: '/profile', icon: UserIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
  { name: 'About', href: '/about', icon: InformationCircleIcon },
];

const Sidebar = ({ open, onToggle }) => {
  const user = useSelector(selectUser);
  const location = useLocation();
  const isChat = location.pathname === '/chat';

  if (isChat) {
    return null;
  }

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={onToggle}
        className="lg:hidden fixed top-3 left-3 z-50 p-2 rounded-md text-white hover:bg-primary-600 border border-white"
      >
        {open ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <Bars3Icon className="h-6 w-6" />
        )}
      </button>

      {/* Sidebar */}
      <div
        className={`${
          open ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-40 w-64 bg-primary-500 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 border-r border-white`}
      >
        {/* Logo */}
        <div className="h-14 flex items-center justify-center border-b border-white">
          <span className="text-base md:text-lg font-bold text-white px-2 text-center">
            Think Around the Blocks
          </span>
        </div>

        {/* Navigation */}
        <nav className="mt-3 px-1 md:px-2 space-y-0.5 md:space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={() => {
                if (window.innerWidth < 500) {
                  onToggle();
                }
              }}
            >
              {({ isActive }) => (
                <div
                  className={`group flex items-center px-2 md:px-3 py-2 md:py-2.5 text-xs md:text-sm font-medium rounded-md transition-colors duration-150 ${
                    isActive
                      ? 'bg-transparent text-white border-2 border-white font-semibold'
                      : 'text-white hover:bg-primary-600 border border-transparent hover:border-white'
                  }`}
                >
                  <item.icon
                    className={`mr-2 md:mr-3 flex-shrink-0 h-5 w-5 md:h-6 md:w-6 text-white ${
                      isActive ? 'stroke-2' : 'stroke-1'
                    }`}
                    aria-hidden="true"
                  />
                  {item.name}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User info */}
        <div className="absolute bottom-0 w-full border-t border-white">
          <div className="m-2 md:m-4">
            <div className="flex items-center p-2 md:p-3 rounded-lg border-2 border-white bg-primary-700">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-primary-600 border-2 border-white flex items-center justify-center">
                  <span className="text-base md:text-lg font-medium text-gray-50">
                    {user?.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-semibold text-gray-50">
                  {user?.username}
                </p>
                <p className="text-xs font-semibold text-gray-50">
                  {user?.role}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={onToggle}
        />
      )}
    </>
  );
};

export default Sidebar;
