#!/bin/bash

# Exit on any error
set -e

# Parse command line arguments
DEV_MODE=false
HELP=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --dev)
            DEV_MODE=true
            shift
            ;;
        -h|--help)
            HELP=true
            shift
            ;;
        *)
            echo "Unknown option $1"
            HELP=true
            shift
            ;;
    esac
done

if [ "$HELP" = true ]; then
    echo "🐍 Python Testing Agent - Launch Script"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --dev        Launch in development mode with hot reload"
    echo "  -h, --help   Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                # Launch with production build"
    echo "  $0 --dev          # Launch in dev mode with hot reload"
    exit 0
fi

echo "🚀 Starting Python Testing Agent setup..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
else
    echo "✅ Virtual environment already exists"
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install requirements
echo "📥 Installing Python requirements..."
pip install -r requirements.txt

echo "🎨 Setting up React UI..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required. Please install Node.js 16+ and npm."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check if npm dependencies are installed
if [ ! -d "ui/node_modules" ]; then
    echo "📦 Installing Node.js dependencies..."
    cd ui
    npm install
    cd ..
else
    echo "✅ Node.js dependencies already installed"
fi

if [ "$DEV_MODE" = true ]; then
    echo "🔥 Starting development mode..."
    echo "   - Backend server: http://localhost:8080"
    echo "   - Frontend dev server: http://localhost:3000"
    echo "   - Hot reload enabled ✨"
    echo ""

    # Start backend server in background. Debug mode is dev-only — production
    # ships gunicorn via the Dockerfile, never python server.py.
    echo "🐍 Starting Flask backend..."
    FLASK_DEBUG=1 python server.py &
    BACKEND_PID=$!

    # Start frontend dev server
    echo "⚛️ Starting React dev server..."
    cd ui
    npm run dev &
    FRONTEND_PID=$!
    cd ..

    # Function to handle cleanup
    cleanup() {
        echo ""
        echo "🛑 Shutting down servers..."
        kill $BACKEND_PID 2>/dev/null || true
        kill $FRONTEND_PID 2>/dev/null || true
        wait $BACKEND_PID 2>/dev/null || true
        wait $FRONTEND_PID 2>/dev/null || true
        echo "✅ Cleanup complete"
        exit 0
    }

    # Set up signal handlers
    trap cleanup SIGINT SIGTERM

    echo "🎯 Development servers started! Press Ctrl+C to stop."
    echo "📱 Open http://localhost:3000 in your browser"

    # Wait for processes
    wait $BACKEND_PID $FRONTEND_PID

else
    echo "🏗️ Building production React app..."
    cd ui
    npm run build
    cd ..

    echo "🚀 Starting server..."
    echo "📱 Open http://localhost:8080 in your browser"
    python server.py
fi
