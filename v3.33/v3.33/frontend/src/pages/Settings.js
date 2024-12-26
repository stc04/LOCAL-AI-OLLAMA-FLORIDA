import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setOllamaApiUrl, selectOllamaApiUrl } from '../redux/slices/settingsSlice';
import { selectUser, updateProfile } from '../redux/slices/authSlice';

const Settings = () => {
  const dispatch = useDispatch();
  const currentApiUrl = useSelector(selectOllamaApiUrl);
  const [apiUrl, setApiUrl] = useState(currentApiUrl);
  const [saved, setSaved] = useState(false);
  const [username, setUsername] = useState('');
  const user = useSelector(selectUser);

  useEffect(() => {
    if (user?.username) {
      setUsername(user.username);
    }
  }, [user]);

  // Initialize API URL on component mount
  useEffect(() => {
    if (!currentApiUrl) {
      const defaultUrl = 'http://127.0.0.1:11434';
      dispatch(setOllamaApiUrl(defaultUrl));
      setApiUrl(defaultUrl);
    }
  }, [currentApiUrl, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(setOllamaApiUrl(apiUrl));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    const defaultUrl = 'http://127.0.0.1:11434';
    setApiUrl(defaultUrl);
    dispatch(setOllamaApiUrl(defaultUrl));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    await dispatch(updateProfile({ username }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto bg-primary-500 rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Settings</h2>

        <div className="mb-8">
          <h3 className="text-lg font-medium text-white mb-4">Profile Settings</h3>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-white">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-white text-gray-900"
                placeholder="Enter your username"
                required
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 border border-white"
            >
              Update Profile
            </button>
          </form>
        </div>

        <div className="border-t border-gray-600 my-6"></div>

        <div className="mb-8">
          <h3 className="text-lg font-medium text-white mb-4">Ollama API Configuration</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="apiUrl" className="block text-sm font-medium text-white">
                API URL
              </label>
              <input
                type="url"
                id="apiUrl"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-white text-gray-900"
                placeholder="http://127.0.0.1:11434"
                required
              />
              <p className="mt-2 text-sm text-gray-200">
                The URL where your Ollama server is running
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 border border-white"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 bg-transparent text-white rounded-md hover:bg-primary-600 border border-white"
              >
                Reset to Default
              </button>
            </div>
          </form>
        </div>

        {saved && (
          <div className="rounded-md bg-green-600 p-4">
            <p className="text-sm font-medium text-white">
              Settings saved successfully
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
