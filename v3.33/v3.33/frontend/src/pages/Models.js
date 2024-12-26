import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import {
  fetchModels,
  downloadModel,
  deleteModel,
  setSearchQuery,
  setFilters,
  filterModels,
  selectFilteredModels,
  selectModelsLoading,
  selectSearchQuery,
  selectFilters,
} from '../redux/slices/modelsSlice';
import { openModal } from '../redux/slices/uiSlice';

const Models = () => {
  const dispatch = useDispatch();
  const models = useSelector(selectFilteredModels);
  const isLoading = useSelector(selectModelsLoading);
  const searchQuery = useSelector(selectSearchQuery);
  const filters = useSelector(selectFilters);

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(fetchModels());
  }, [dispatch]);

  const handleSearch = (e) => {
    dispatch(setSearchQuery(e.target.value));
    dispatch(filterModels());
  };

  const handleFilterChange = (filterType, value) => {
    dispatch(setFilters({ [filterType]: value }));
    dispatch(filterModels());
  };

  const handleDownload = (modelName) => {
    dispatch(downloadModel(modelName));
  };

  const handleDelete = (model) => {
    dispatch(
      openModal({
        type: 'confirmDelete',
        data: {
          name: model.name,
          onConfirm: () => dispatch(deleteModel(model.name)),
        },
      })
    );
  };

  const handleShowDetails = (model) => {
    dispatch(
      openModal({
        type: 'modelDetails',
        data: model,
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-black-900 dark:text-white">
          Models
        </h1>
        <div className="mt-4 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto"
          >
            Add New Model
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              className="block w-full rounded-md border-gray-300 dark:border-gray-700 pl-10 focus:border-primary-500 focus:ring-primary-500 sm:text-sm bg-white text-black placeholder-gray-500"
              placeholder="Search models..."
            />
          </div>
        </div>
        <div>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <FunnelIcon className="h-5 w-5 mr-2" aria-hidden="true" />
            Filters
          </button>
        </div>
      </div>

      {/* Filter options */}
      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm bg-white text-black"
            >
              <option value="all">All</option>
              <option value="available">Available</option>
              <option value="downloading">Downloading</option>
              <option value="error">Error</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Size
            </label>
            <select
              value={filters.size}
              onChange={(e) => handleFilterChange('size', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm bg-white text-black"
            >
              <option value="all">All</option>
              <option value="small">Small (&lt;5GB)</option>
              <option value="medium">Medium (5-10GB)</option>
              <option value="large">Large (&gt;10GB)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Architecture
            </label>
            <select
              value={filters.architecture}
              onChange={(e) => handleFilterChange('architecture', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm bg-white text-black"
            >
              <option value="all">All</option>
              <option value="llama">Llama</option>
              <option value="gpt">GPT</option>
              <option value="bert">BERT</option>
            </select>
          </div>
        </div>
      )}

      {/* Models Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          // Loading skeletons
          [...Array(6)].map((_, index) => (
            <div
              key={index}
              className="animate-pulse bg-white dark:bg-gray-800 shadow rounded-lg p-4"
            >
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="space-y-3 mt-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
              </div>
            </div>
          ))
        ) : (
          // Actual model cards
          models.map((model) => (
            <div
              key={model.name}
              className="bg-white dark:bg-blue-800 shadow rounded-lg p-4"
            >
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {model.name}
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleShowDetails(model)}
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  >
                    <InformationCircleIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDownload(model.name)}
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                    disabled={model.status === 'downloading'}
                  >
                    <ArrowDownTrayIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(model)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {model.description}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {(model.size / 1024 / 1024 / 1024).toFixed(2)} GB
                </span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    model.status === 'available'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                      : model.status === 'downloading'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                  }`}
                >
                  {model.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Models;
