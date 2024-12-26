import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Transition } from '@headlessui/react';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { selectNotifications, removeNotification } from '../redux/slices/uiSlice';

const icons = {
  success: CheckCircleIcon,
  error: ExclamationCircleIcon,
  info: InformationCircleIcon,
  warning: ExclamationCircleIcon,
};

const NotificationStack = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(selectNotifications);

  const getNotificationStyle = (type) => {
    switch (type) {
      case 'success':
        return 'bg-primary-500 text-white border-2 border-white';
      case 'error':
        return 'bg-primary-500 text-white border-2 border-red-500';
      case 'warning':
        return 'bg-primary-500 text-white border-2 border-yellow-500';
      default:
        return 'bg-primary-500 text-white border-2 border-white';
    }
  };

  return (
    <div className="fixed inset-0 flex items-end px-2 py-4 pointer-events-none sm:p-4 md:p-6">
      <div className="w-full flex flex-col items-center space-y-3 sm:items-end">
        {notifications.map((notification) => {
          const Icon = icons[notification.type] || icons.info;

          return (
            <Transition
              key={notification.id}
              show={true}
              enter="transform ease-out duration-300 transition"
              enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
              enterTo="translate-y-0 opacity-100 sm:translate-x-0"
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div
                className={`max-w-sm w-full shadow-lg rounded-md pointer-events-auto overflow-hidden ${getNotificationStyle(
                  notification.type
                )}`}
              >
                <div className="p-3 md:p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <Icon className="h-5 w-5 md:h-6 md:w-6" aria-hidden="true" />
                    </div>
                    <div className="ml-3 w-0 flex-1 pt-0.5">
                      <p className="text-sm font-medium">
                        {notification.title}
                      </p>
                      {notification.message && (
                        <p className="mt-1 text-xs md:text-sm opacity-90">
                          {notification.message}
                        </p>
                      )}
                    </div>
                    <div className="ml-4 flex-shrink-0 flex">
                      <button
                        className="rounded-md inline-flex text-white hover:text-gray-200 focus:outline-none"
                        onClick={() =>
                          dispatch(removeNotification(notification.id))
                        }
                      >
                        <span className="sr-only">Close</span>
                        <XMarkIcon className="h-4 w-4 md:h-5 md:w-5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Transition>
          );
        })}
      </div>
    </div>
  );
};

export default NotificationStack;
