import React from 'react';
import { InformationCircleIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

const About = () => {
  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto bg-primary-500 rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <InformationCircleIcon className="h-8 w-8 mr-2" />
          About Think Around the Blocks
        </h2>

        <div className="space-y-6">
          {/* Company Information */}
          <div className="bg-primary-600 rounded-lg p-4 border border-white">
            <h3 className="text-lg font-semibold text-white mb-3">Company Information</h3>
            <div className="space-y-2 text-gray-100">
              <p>AI-IT Inc</p>
              <div className="flex items-center">
                <PhoneIcon className="h-5 w-5 mr-2" />
                <a href="tel:863-308-4979" className="hover:text-blue-300">863-308-4979</a>
              </div>
              <div className="flex items-center">
                <EnvelopeIcon className="h-5 w-5 mr-2" />
                <a href="mailto:steve@ai-itinc.com" className="hover:text-blue-300">steve@ai-itinc.com</a>
              </div>
            </div>
          </div>

          {/* Application Information */}
          <div className="bg-primary-600 rounded-lg p-4 border border-white">
            <h3 className="text-lg font-semibold text-white mb-3">Application Details</h3>
            <div className="space-y-2 text-gray-100">
              <p><span className="font-medium">Version:</span> 1.0.0</p>
              <p><span className="font-medium">Developer:</span> Steven Chason</p>
              <p><span className="font-medium">Description:</span> A comprehensive web application for managing Ollama LLM models and other AI services.</p>
            </div>
          </div>

          {/* Technologies */}
          <div className="bg-primary-600 rounded-lg p-4 border border-white">
            <h3 className="text-lg font-semibold text-white mb-3">Technologies</h3>
            <div className="space-y-2 text-gray-100">
              <p>This application is built using modern web technologies:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>React.js for the frontend interface</li>
                <li>Redux for state management</li>
                <li>Express.js for the backend server</li>
                <li>Integration with Ollama for LLM capabilities</li>
                <li>JWT for secure authentication</li>
                <li>Tailwind CSS for styling</li>
              </ul>
            </div>
          </div>

          {/* Support */}
          <div className="bg-primary-600 rounded-lg p-4 border border-white">
            <h3 className="text-lg font-semibold text-white mb-3">Support</h3>
            <div className="space-y-2 text-gray-100">
              <p>For support or inquiries, please contact:</p>
              <p className="font-medium">Steven Chason</p>
              <div className="flex items-center">
                <PhoneIcon className="h-5 w-5 mr-2" />
                <a href="tel:863-308-4979" className="hover:text-blue-300">863-308-4979</a>
              </div>
              <div className="flex items-center">
                <EnvelopeIcon className="h-5 w-5 mr-2" />
                <a href="mailto:steve@ai-itinc.com" className="hover:text-blue-300">steve@ai-itinc.com</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
