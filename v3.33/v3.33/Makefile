# Makefile for Ollama Web UI

# Variables
NODE_ENV ?= development
BACKEND_PORT ?= 5000
FRONTEND_PORT ?= 3000
MONGODB_URI ?= mongodb://localhost:27017/ollama-web-ui

# Commands
.PHONY: all install clean start stop dev test

# Default target
all: install start

# Install dependencies
install:
	@echo "Installing backend dependencies..."
	npm install
	@echo "Installing frontend dependencies..."
	cd frontend && npm install

# Start development servers
dev:
	@echo "Starting development servers..."
	@echo "Starting backend server on port $(BACKEND_PORT)..."
	npm run dev & \
	@echo "Starting frontend server on port $(FRONTEND_PORT)..."
	cd frontend && npm start

# Start production servers
start:
	@echo "Starting production servers..."
	NODE_ENV=production npm start & \
	cd frontend && npm run build && npx serve -s build -l $(FRONTEND_PORT)

# Stop all servers
stop:
	@echo "Stopping servers..."
	pkill -f "node"

# Clean up
clean:
	@echo "Cleaning up..."
	rm -rf node_modules
	rm -rf frontend/node_modules
	rm -rf frontend/build

# Run tests
test:
	@echo "Running backend tests..."
	npm test
	@echo "Running frontend tests..."
	cd frontend && npm test

# Setup environment
setup:
	@echo "Setting up environment..."
	@echo "PORT=$(BACKEND_PORT)\nMONGODB_URI=$(MONGODB_URI)\nJWT_SECRET=your_jwt_secret_key_here\nOLLAMA_API_URL=http://localhost:11434" > .env
	@echo "REACT_APP_API_URL=http://localhost:$(BACKEND_PORT)/api" > frontend/.env

# Help
help:
	@echo "Available commands:"
	@echo "  make install  - Install all dependencies"
	@echo "  make dev      - Start development servers"
	@echo "  make start    - Start production servers"
	@echo "  make stop     - Stop all servers"
	@echo "  make clean    - Remove dependencies and build files"
	@echo "  make test     - Run all tests"
	@echo "  make setup    - Setup environment files"
	@echo "  make help     - Show this help message"
