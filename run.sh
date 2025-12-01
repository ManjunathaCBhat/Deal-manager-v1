#!/bin/bash
# ============================================
# CRM Application - Single Command Runner
# Run with: ./run.sh [dev|docker|stop]
# ============================================

# Get script directory
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

# Command argument
CMD="${1:-dev}"

show_help() {
    echo ""
    echo "CRM Application Runner"
    echo "======================="
    echo "Usage: ./run.sh [command]"
    echo ""
    echo "Commands:"
    echo "  dev      - Run in development mode (default)"
    echo "  docker   - Run with Docker Compose"
    echo "  stop     - Stop all services"
    echo "  install  - Install dependencies"
    echo "  help     - Show this help"
    echo ""
}

install_deps() {
    echo ""
    echo "📦 Installing dependencies..."
    echo ""

    echo "Installing backend dependencies..."
    cd "$ROOT_DIR/fastapi_backend"
    pip install -r requirements.txt

    echo ""
    echo "Installing frontend dependencies..."
    cd "$ROOT_DIR/crm-frontend"
    npm install

    echo ""
    echo "✅ Dependencies installed!"
}

run_dev() {
    echo ""
    echo "🚀 Starting CRM in Development Mode..."
    echo ""

    # Copy .env to subdirectories
    echo "📝 Setting up environment..."
    cp "$ROOT_DIR/.env" "$ROOT_DIR/fastapi_backend/.env" 2>/dev/null
    cp "$ROOT_DIR/.env" "$ROOT_DIR/crm-frontend/.env" 2>/dev/null

    # Start backend in background
    echo "🔧 Starting Backend (FastAPI)..."
    cd "$ROOT_DIR/fastapi_backend"
    python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
    BACKEND_PID=$!
    echo "   Backend PID: $BACKEND_PID"

    # Wait a moment for backend to start
    sleep 3

    # Start frontend in background
    echo "🎨 Starting Frontend (React)..."
    cd "$ROOT_DIR/crm-frontend"
    npm start &
    FRONTEND_PID=$!
    echo "   Frontend PID: $FRONTEND_PID"

    # Save PIDs for later
    echo "$BACKEND_PID" > "$ROOT_DIR/.backend.pid"
    echo "$FRONTEND_PID" > "$ROOT_DIR/.frontend.pid"

    echo ""
    echo "✅ CRM Application is starting!"
    echo ""
    echo "📍 Frontend: http://localhost:3000"
    echo "📍 Backend API: http://localhost:8000"
    echo "📍 API Docs: http://localhost:8000/docs"
    echo ""
    echo "🛑 To stop: ./run.sh stop"
    echo ""

    # Wait for both processes
    wait
}

run_docker() {
    echo ""
    echo "🐳 Starting CRM with Docker..."
    echo ""

    docker-compose up --build -d

    echo ""
    echo "✅ CRM Application is starting!"
    echo ""
    echo "📍 Frontend: http://localhost:3000"
    echo "📍 Backend API: http://localhost:8000"
    echo "📍 API Docs: http://localhost:8000/docs"
    echo ""
    echo "📋 To view logs: docker-compose logs -f"
    echo "🛑 To stop: ./run.sh stop"
    echo ""
}

stop_services() {
    echo ""
    echo "🛑 Stopping CRM services..."
    echo ""

    # Stop Docker containers
    docker-compose down 2>/dev/null

    # Kill background processes
    if [ -f "$ROOT_DIR/.backend.pid" ]; then
        kill $(cat "$ROOT_DIR/.backend.pid") 2>/dev/null
        rm "$ROOT_DIR/.backend.pid"
    fi
    if [ -f "$ROOT_DIR/.frontend.pid" ]; then
        kill $(cat "$ROOT_DIR/.frontend.pid") 2>/dev/null
        rm "$ROOT_DIR/.frontend.pid"
    fi

    # Kill any remaining processes
    pkill -f "uvicorn app.main:app" 2>/dev/null
    pkill -f "react-scripts start" 2>/dev/null

    echo ""
    echo "✅ All services stopped!"
}

# Execute command
case "$CMD" in
    dev)
        run_dev
        ;;
    docker)
        run_docker
        ;;
    stop)
        stop_services
        ;;
    install)
        install_deps
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        echo "Unknown command: $CMD"
        show_help
        exit 1
        ;;
esac
