import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useSelector, useDispatch } from 'react-redux';
import { selectModal, closeModal } from '../redux/slices/uiSlice';

const Modal = () => {
  const dispatch = useDispatch();
  const { isOpen, type, data } = useSelector(selectModal);

  const handleClose = () => {
    dispatch(closeModal());
  };

  // Modal content based on type
  const renderContent = () => {
    switch (type) {
      case 'modelDetails':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">
              {data?.name}
            </h3>
            <div className="space-y-2">
              <p className="text-sm text-white">
                {data?.description}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-white">
                    Version
                  </p>
                  <p className="mt-1 text-sm text-white">
                    {data?.version}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    Size
                  </p>
                  <p className="mt-1 text-sm text-white">
                    {(data?.size / 1024 / 1024 / 1024).toFixed(2)} GB
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'confirmDelete':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">
              Confirm Deletion
            </h3>
            <p className="text-sm text-white">
              Are you sure you want to delete {data?.name}? This action cannot be
              undone.
            </p>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={() => {
                  data?.onConfirm();
                  handleClose();
                }}
              >
                Delete
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-white shadow-sm px-4 py-2 bg-primary-500 text-base font-medium text-white hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:w-auto sm:text-sm"
                onClick={handleClose}
              >
                Cancel
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Transition.Root show={isOpen} as={React.Fragment}>
      <Dialog
        as="div"
        className="fixed z-50 inset-0 overflow-y-auto"
        onClose={handleClose}
      >
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* Center modal contents */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-primary-500 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6 border border-white">
              {/* Close button */}
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className="rounded-md text-white hover:text-gray-300 focus:outline-none"
                  onClick={handleClose}
                >
                  <span className="sr-only">Close</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              {/* Modal content */}
              {renderContent()}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Modal;
