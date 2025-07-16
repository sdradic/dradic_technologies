#!/bin/bash

# Dradic Technologies Monorepo - Start Script
# This script starts the backend and lets you select a frontend project

set -e

# Load environment variables from root .env if it exists
if [ -f ".env" ]; then
    echo "📄 Loading environment variables from .env"
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "⚠️  No .env file found. Run './scripts/setup-env.sh' to create one."
fi

echo "🚀 Dradic Technologies Development"
echo "=================================="

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  Port $1 is already in use. Please stop the service using that port."
        return 1
    fi
    return 0
}

# Check if backend port is available
echo "🔍 Checking port availability..."
check_port 8000 || exit 1
check_port 3000 || exit 1

echo "✅ Ports are available"

# Start backend in background
echo "🔧 Starting backend server..."
cd unified_backend/apis
uv run uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!
cd ../..

echo "⏳ Waiting for backend to start..."
sleep 3

# Check if backend is running
if curl -f http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ Backend API is running on http://localhost:8000"
else
    echo "⚠️  Backend API might still be starting up..."
fi

# Frontend project selection
echo ""
echo "🌐 Select a frontend project to run on port 3000:"
echo "1) Dradic Tech"
echo "2) Expense Tracker"
echo "3) Exit"
echo ""
read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo "🚀 Starting Dradic Tech..."
        cd dradic_tech
        pnpm dev
        ;;
    2)
        echo "🚀 Starting Expense Tracker..."
        cd expense_tracker
        pnpm dev
        ;;
    3)
        echo "👋 Goodbye!"
        kill $BACKEND_PID 2>/dev/null || true
        exit 0
        ;;
    *)
        echo "❌ Invalid choice"
        kill $BACKEND_PID 2>/dev/null || true
        exit 1
        ;;
esac 