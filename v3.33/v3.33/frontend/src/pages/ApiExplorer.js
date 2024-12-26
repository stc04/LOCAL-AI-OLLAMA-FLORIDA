import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  CodeBracketIcon,
  PlayIcon,
  ClipboardIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import { ollamaAPI } from '../api/api';
import { showNotification } from '../redux/slices/uiSlice';
//import { selectAllModels } from '../redux/slices/modelsSlice';

const ApiExplorer = () => {
  const dispatch = useDispatch();
  //const models = useSelector(selectAllModels);
  const [endpoints, setEndpoints] = useState([]);
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);
  const [requestBody, setRequestBody] = useState('');
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchEndpoints = async () => {
      try {
        const response = await ollamaAPI.getEndpoints();
        setEndpoints(response.data);
      } catch (error) {
        dispatch(
          showNotification({
            title: 'Error',
            message: 'Failed to fetch API endpoints',
            type: 'error',
          })
        );
      }
    };

    fetchEndpoints();
  }, [dispatch]);

  const getExampleRequestBody = (path) => {
    switch (path) {
      case '/api/generate':
        return {
          model: 'llama2',
          prompt: 'Write a story about a young Black entrepreneur who starts a successful tech company in Silicon Valley',
          options: {
            temperature: 0.7,
            max_tokens: 500,
          },
        };
      case '/api/chat':
        return {
          model: 'llama2',
          messages: [
            {
              role: 'user',
              content: 'Tell me about the contributions of Black scientists to the field of computer science'
            }
          ],
          options: {
            temperature: 0.7,
            max_tokens: 500
          }
        };
      case '/api/pull':
        return {
          name: 'llama2'
        };
      default:
        return {};
    }
  };

  const handleEndpointSelect = (endpoint) => {
    setSelectedEndpoint(endpoint);
    // Set request body with example based on endpoint
    const exampleBody = getExampleRequestBody(endpoint.path);
    setRequestBody(JSON.stringify(exampleBody, null, 2));
    setResponse(null);
  };

  const handleSendRequest = async () => {
    if (!selectedEndpoint) return;

    // Validate JSON format
    if (requestBody.trim() && (!requestBody.trim().startsWith('{') || !requestBody.trim().endsWith('}'))) {
      dispatch(
        showNotification({
          title: 'Error',
          message: 'Request body must be valid JSON wrapped in curly braces {}',
          type: 'error',
        })
      );
      return;
    }

    setIsLoading(true);
    try {
      let response;
      const body = requestBody.trim() ? JSON.parse(requestBody) : {};

      switch (selectedEndpoint.path) {
        case '/api/generate':
          response = await ollamaAPI.generateText(
            body.model,
            body.prompt,
            body.options
          );
          break;
        case '/api/status':
          response = await ollamaAPI.getStatus();
          break;
        default:
          throw new Error('Endpoint not implemented');
      }

      setResponse({
        status: response.status,
        data: response.data,
      });

      dispatch(
        showNotification({
          title: 'Success',
          message: 'API request completed successfully',
          type: 'success',
        })
      );
    } catch (error) {
      setResponse({
        status: error.response?.status || 500,
        data: error.response?.data || { error: error.message },
      });

      dispatch(
        showNotification({
          title: 'Error',
          message: 'API request failed',
          type: 'error',
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
          <h1 className="text-2xl font-semibold text-blue-600 dark:text-white">
          API Explorer
        </h1>
          <p className="mt-2 text-sm text-blue-600 dark:text-gray-400">
          Test and explore Ollama API endpoints
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left panel - Endpoints and Request */}
        <div className="space-y-6">
          {/* Endpoints List */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4">
            <h2 className="text-lg font-medium text-blue-600 dark:text-white mb-4">
              Available Endpoints
            </h2>
            <div className="space-y-2">
              {endpoints.map((endpoint) => (
                <button
                  key={endpoint.path}
                  onClick={() => handleEndpointSelect(endpoint)}
                  className={`w-full text-left px-4 py-2 rounded-md text-sm ${
                    selectedEndpoint?.path === endpoint.path
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-100'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center">
                    <span
                      className={`inline-block w-16 text-xs font-medium ${
                        endpoint.method === 'GET'
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-blue-600 dark:text-blue-400'
                      }`}
                    >
                      {endpoint.method}
                    </span>
                    <span className="text-blue-600 dark:text-white">
                      {endpoint.path}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Request Body */}
          {selectedEndpoint && (
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4">
              <h2 className="text-lg font-medium text-blue-600 dark:text-white mb-4">
                Request Body
              </h2>
              <div className="space-y-4">
                <div className="relative">
                  <textarea
                    value={requestBody}
                    onChange={(e) => setRequestBody(e.target.value)}
                    rows={10}
                    className="block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm font-mono text-blue-600 dark:bg-gray-900 dark:text-white"
    placeholder="Enter request body (JSON - must be wrapped in {})"
                  />
                </div>
                <button
                  onClick={handleSendRequest}
                  disabled={isLoading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <PlayIcon className="h-5 w-5 mr-2" />
                      Send Request
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right panel - Response */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-blue-600 dark:text-white">
              Response
            </h2>
            {response && (
              <button
                onClick={() =>
                  copyToClipboard(JSON.stringify(response.data, null, 2))
                }
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                {copied ? (
                  <CheckIcon className="h-5 w-5 mr-1" />
                ) : (
                  <ClipboardIcon className="h-5 w-5 mr-1" />
                )}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            )}
          </div>
          {response ? (
            <div className="space-y-4">
              <div className="flex items-center">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    response.status >= 200 && response.status < 300
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                  }`}
                >
                  Status: {response.status}
                </span>
              </div>
              <pre className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-md overflow-auto">
                <code className="text-sm text-blue-600 dark:text-gray-200">
                  {JSON.stringify(response.data, null, 2)}
                </code>
              </pre>
            </div>
          ) : (
            <div className="text-center py-12">
              <CodeBracketIcon className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-blue-600 dark:text-gray-400">
                Send a request to see the response
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiExplorer;
