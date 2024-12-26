# Think Around Blocks - Beta v1

A Windows-based web application for interacting with local AI models through Ollama.

## Important Notes

- **This is a Windows-only application (Beta v1)**
- **Requires [Ollama](https://ollama.ai) to be installed and running**
- **At least one AI model must be pulled in Ollama before using**

## System Requirements

- Windows operating system
- [Ollama](https://ollama.ai) installed and running
- Node.js 14+ and npm
- Sufficient RAM for running AI models (varies by model)
- Available disk space for model storage
- Port 11434 available for Ollama
- Ports 3000 (dev) and 5000 (prod) available for the application

## Quick Start

1. Install Ollama from [ollama.ai](https://ollama.ai)
2. Pull at least one model in Ollama (e.g., `ollama pull llama2`)
3. Clone this repository
4. Install dependencies:

```bash
npm install
cd frontend && npm install
```

## Running the Application

### Development Mode

1. Start the backend server:

```bash
npm run dev
```

1. Start the frontend development server:

```bash
cd frontend && npm start
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Production Mode

1. Build the application:

```bash
npm run build
```

This will:

- Install all backend dependencies
- Install all frontend dependencies
- Create an optimized production build
- Configure environment for production

1. Start the production server:

```bash
npm run prod
```

The production build will be available at [http://localhost:5000](http://localhost:5000)

Note: In production mode, the server will serve both the API and the static frontend files from the same port, eliminating the need for running separate development servers.

## Default Admin Credentials

- Email:admin@example.com
- Password: admin123

## Features

- User authentication with JWT
- Support for multiple user accounts
- Integration with local Ollama models
- Chat interface for model interaction
- Model management
- API explorer for testing endpoints
- Dark/Light theme support

## Architecture

- Backend: Node.js/Express.js server (port 5000)
- Frontend: React application
  - Development: Served via React dev server (port 3000)
  - Production: Served via Express.js (port 5000)
- AI: Local Ollama instance (port 11434)

## Security

- Default admin account is provided for initial setup only
- Create new user accounts for regular use
- All passwords are securely hashed
- JWT is used for session management

## Known Limitations

- Windows-only support
- Requires local Ollama installation
- Model availability depends on what's pulled in Ollama
- All AI processing is done locally through Ollama
- Internet connection required only for pulling new models

## Troubleshooting

1. Ensure Ollama is running:
   - Check if Ollama service is active
   - Verify port 11434 is accessible
   - Test with:

     ```bash
     curl "http://localhost:11434/api/tags"
     ```

2. Verify model availability:
   - List models with `ollama list`
   - Pull required model if missing: `ollama pull modelname`

3. Port conflicts:
   - Development: Ensure ports 3000 and 5000 are free
   - Production: Ensure port 5000 is available

## Support

This is a beta release. Please report any issues through the issue tracker.

## License

Proprietary software. All rights reserved.
