#!/bin/bash

# Exit on any error
set -e

# Parse command line arguments
DEV_MODE=false
USE_NEW_UI=true
HELP=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --dev)
            DEV_MODE=true
            USE_NEW_UI=true
            shift
            ;;
        --new-ui)
            USE_NEW_UI=true
            shift
            ;;
        --old-ui)
            USE_NEW_UI=false
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
    echo "  --dev        Launch in development mode with new UI and hot reload"
    echo "  --new-ui     Use the new React UI (production build)"
    echo "  --old-ui     Use the original HTML UI (default)"
    echo "  -h, --help   Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                # Launch with original UI"
    echo "  $0 --new-ui       # Launch with new React UI"
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

# Handle UI setup
if [ "$USE_NEW_UI" = true ]; then
    echo "🎨 Setting up modern React UI..."
    
    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js is required for the new UI. Please install Node.js 16+ and npm."
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
        
        # Set environment variable for new UI
        export USE_NEW_UI=true
        
        # Start backend server in background
        echo "🐍 Starting Flask backend..."
        python server.py &
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
        
        # Set environment variable for new UI
        export USE_NEW_UI=true
        
        echo "🚀 Starting server with new UI..."
        echo "📱 Open http://localhost:8080 in your browser"
        python server.py
    fi
    
else
    echo "📄 Using original HTML UI..."
    export USE_NEW_UI=false
    
    echo "🚀 Starting server with original UI..."
    echo "📱 Open http://localhost:8080 in your browser"
    python server.py
fi
