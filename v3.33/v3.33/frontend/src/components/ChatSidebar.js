import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { TrashIcon, PlusIcon, Bars3Icon, XMarkIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { setSelectedModel } from '../redux/slices/modelsSlice';
import { selectUser } from '../redux/slices/authSlice';

const ChatSidebar = ({ conversations, onSelectConversation, onDeleteConversation, activeConversationId, onNewChat }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedModel, models, loading } = useSelector((state) => state.models);
  const user = useSelector(selectUser);
  const [isOpen, setIsOpen] = useState(false);

  const handleNewChatClick = () => {
    onNewChat();
    setIsOpen(false);
  };

  const handleConversationClick = (conversation) => {
    onSelectConversation(conversation);
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-lg text-gray-500 hover:bg-gray-100"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <Bars3Icon className="h-6 w-6" />
        )}
      </button>

      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } fixed inset-y-0 left-0 w-64 bg-gray-50 border-r border-gray-200 flex flex-col h-full lg:translate-x-0 z-30 transform transition-transform duration-300 ease-in-out overflow-hidden`}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 rounded-lg hover:bg-gray-100"
              aria-label="Back to Home"
            >
              <ArrowLeftIcon className="h-5 w-5 text-gray-500" />
            </button>
            <div className="text-sm font-medium text-gray-500">Current Model</div>
          </div>
        {loading ? (
          <div className="text-sm text-gray-500">Loading models...</div>
        ) : models?.length > 0 ? (
          <select
            value={selectedModel?.name || 'tinyllama:latest'}
            onChange={(e) => {
              const model = models.find(m => m.name === e.target.value);
              dispatch(setSelectedModel(model));
            }}
            className="w-full p-2 border rounded-lg bg-white text-gray-900 focus:outline-none focus:border-blue-500"
            disabled={loading}
          >
            {models.map(model => (
              <option key={model.name} value={model.name}>
                {model.name}
              </option>
            ))}
          </select>
        ) : (
          <div className="text-sm text-gray-500">No models available</div>
        )}
        </div>
      
        <div className="p-4">
          <button
            onClick={handleNewChatClick}
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="px-4 py-2">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Conversations
            </h2>
          </div>
          <div className="space-y-1 px-2">
            {conversations?.map((conversation) => (
              <div
                key={conversation.id}
                className={`flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-gray-100 ${
                  activeConversationId === conversation.id ? 'bg-gray-100' : ''
                }`}
                onClick={() => handleConversationClick(conversation)}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {conversation.title || 'New Chat'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {new Date(conversation.timestamp).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteConversation(conversation.id);
                  }}
                  className="ml-2 p-1 rounded-md hover:bg-gray-200"
                >
                  <TrashIcon className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            ))}
            {conversations?.length === 0 && (
              <div className="text-center py-4 text-sm text-gray-500">
                No conversations yet
              </div>
            )}
          </div>
        </div>

        {/* User info */}
        <div className="absolute bottom-0 w-full border-t border-gray-200">
          <div className="m-2 md:m-4">
            <div className="flex items-center p-2 md:p-3 rounded-lg border border-gray-200 bg-white">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
                  <span className="text-base md:text-lg font-medium text-gray-700">
                    {user?.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-semibold text-gray-700">
                  {user?.username}
                </p>
                <p className="text-xs font-semibold text-gray-500">
                  {user?.role}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default ChatSidebar;
