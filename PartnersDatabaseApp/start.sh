#!/bin/bash

# Exit on any error
set -e

# Verify correct working directory
if [ ! -f "pom.xml" ]; then
    if [ -d "PartnersDatabaseApp" ]; then
        echo "Error: You are in the wrong directory."
        echo "Please run: cd PartnersDatabaseApp && ./start.sh"
        exit 1
    else
        echo "Error: pom.xml not found. Please run this script from the PartnersDatabaseApp directory."
        exit 1
    fi
fi

# Determine if sudo is needed for docker
DOCKER_CMD="docker"
if ! docker ps >/dev/null 2>&1; then
    if sudo docker ps >/dev/null 2>&1; then
        DOCKER_CMD="sudo docker"
        echo "Note: Using 'sudo' for Docker commands."
    else
        echo "Error: Docker seems to be not running or missing permissions."
        exit 1
    fi
fi

if ! command -v docker &> /dev/null
then
    echo "Error: Docker is not installed."
    echo "To install Docker on Fedora, run the following commands:"
    echo "  sudo dnf install -y moby-engine docker-compose"
    echo "  sudo systemctl enable --now docker"
    echo "Then try running this script again."
    exit 1
fi

if ! command -v mvn &> /dev/null || ! command -v java &> /dev/null
then
    echo "Error: Maven or Java is not installed."
    echo "To install them on Fedora, run the following command:"
    echo "  sudo dnf install -y maven java-17-openjdk-devel"
    echo "Then try running this script again."
    exit 1
fi

# Port cleanup to prevent "Port already in use" errors
echo "Cleaning up existing processes on ports 8081 and 5173..."
fuser -k 8081/tcp 5173/tcp 5174/tcp 2>/dev/null || true

echo "Starting PostgreSQL database container..."
$DOCKER_CMD compose up -d

echo "Waiting for the database to be ready..."
# Give it enough time to start
for i in {1..10}; do
    if $DOCKER_CMD exec arttu_postgres pg_isready -U postgres -d partnersdatabaseupdated >/dev/null 2>&1; then
        echo "Database is ready!"
        break
    fi
    echo "Waiting... ($i/10)"
    sleep 2
done

echo "Initializing database schema (if not already done)..."
$DOCKER_CMD exec -i arttu_postgres psql -U postgres -d partnersdatabaseupdated < init-db.sql

echo "Building and starting the Spring Boot Backend..."
mvn clean compile spring-boot:run -Dspring-boot.run.arguments="--server.port=8081" &
BACKEND_PID=$!

echo "Starting the React Frontend (Vite)..."
cd frontend
npm install
npm run dev -- --host &
FRONTEND_PID=$!

echo "---------------------------------------------------"
echo "All services are starting up!"
echo "Backend: http://localhost:8081"
echo "Frontend: http://localhost:5173"
echo "---------------------------------------------------"
echo "Press Ctrl+C to stop all services."

# Trap SIGINT (Ctrl+C) to kill both processes
trap "kill $BACKEND_PID $FRONTEND_PID; exit" SIGINT

wait
