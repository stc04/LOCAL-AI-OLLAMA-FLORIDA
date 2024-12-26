import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Bars3Icon,
  BellIcon,
  UserCircleIcon,
  SunIcon,
  MoonIcon,
} from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import { logout } from '../redux/slices/authSlice';
import { toggleTheme, selectTheme } from '../redux/slices/uiSlice';
import { selectUser } from '../redux/slices/authSlice';

const Navbar = ({ onMenuClick }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useSelector(selectTheme);
  const user = useSelector(selectUser);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <nav className="bg-primary-500 border-b border-white">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex justify-between h-14 md:h-16">
          {/* Left section */}
          <div className="flex">
            <button
              onClick={onMenuClick}
              className="px-2 md:px-4 text-white focus:outline-none"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            {/* Theme toggle */}
            <button
              onClick={handleThemeToggle}
              className="p-1.5 md:p-2 text-white hover:bg-primary-600 rounded-md"
            >
              {theme === 'dark' ? (
                <SunIcon className="h-6 w-6" />
              ) : (
                <MoonIcon className="h-6 w-6" />
              )}
            </button>

            {/* Notifications */}
            <button className="p-1.5 md:p-2 text-white hover:bg-primary-600 rounded-md">
              <BellIcon className="h-6 w-6" />
            </button>

            {/* Profile dropdown */}
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center space-x-2 p-1.5 md:p-2 rounded-md hover:bg-primary-600">
                <UserCircleIcon className="h-6 w-6 md:h-8 md:w-8 text-white" />
                <span className="hidden md:block text-sm font-medium text-white">
                  {user?.username}
                </span>
              </Menu.Button>

              <Transition
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-primary-500 border border-white focus:outline-none">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => navigate('/profile')}
                          className={`${
                            active
                              ? 'bg-primary-600'
                              : ''
                          } block w-full text-left px-3 py-2 text-sm text-white`}
                        >
                          Profile
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => navigate('/settings')}
                          className={`${
                            active
                              ? 'bg-primary-600'
                              : ''
                          } block w-full text-left px-3 py-2 text-sm text-white`}
                        >
                          Settings
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          className={`${
                            active
                              ? 'bg-primary-600'
                              : ''
                          } block w-full text-left px-3 py-2 text-sm text-white`}
                        >
                          Sign out
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
