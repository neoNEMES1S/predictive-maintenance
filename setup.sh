#!/bin/bash

# Semiconductor Insights Platform - Setup Script
# This script sets up the development environment

set -e

echo "🏭 Semiconductor Insights Platform - Setup"
echo "=========================================="
echo ""

# Check prerequisites
echo "📋 Checking prerequisites..."

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 not found. Please install Python 3.11 or later."
    exit 1
fi
echo "✅ Python: $(python3 --version)"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 20 or later."
    exit 1
fi
echo "✅ Node.js: $(node --version)"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please install npm."
    exit 1
fi
echo "✅ npm: $(npm --version)"

echo ""
echo "🔧 Setting up backend..."
cd backend

# Create virtual environment
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install Python dependencies
echo "Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Create .env if not exists
if [ ! -f ".env" ]; then
    echo "Creating backend .env file..."
    cp .env.example .env
    echo "⚠️  Please update backend/.env with your Supabase credentials"
fi

# Create storage directories
echo "Creating storage directories..."
mkdir -p storage/{uploads,data,visualizations,anomaly,shap,reports}
mkdir -p models

echo "✅ Backend setup complete"
echo ""

# Setup frontend
echo "🎨 Setting up frontend..."
cd ../frontend

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
npm install

# Create .env if not exists
if [ ! -f ".env" ]; then
    echo "Creating frontend .env file..."
    cp .env.example .env
    echo "⚠️  Please update frontend/.env with your API and Supabase URLs"
fi

echo "✅ Frontend setup complete"
echo ""

cd ..

echo "🎉 Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Update backend/.env with your Supabase credentials"
echo "2. Update frontend/.env with API and Supabase URLs"
echo "3. Start backend: cd backend && source venv/bin/activate && uvicorn app.main:app --reload"
echo "4. Start frontend: cd frontend && npm run dev"
echo ""
echo "📚 For detailed instructions, see README.md"
echo "🚀 For deployment guide, see DEPLOYMENT.md"

