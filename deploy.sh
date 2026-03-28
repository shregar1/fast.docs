#!/bin/bash

# Build the documentation site
echo "Building FastMVC Documentation..."

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Build
npm run build

# Deploy to GitHub Pages (optional)
if [ "$1" == "gh-pages" ]; then
  echo "Deploying to GitHub Pages..."
  cd dist
  git init
  git add .
  git commit -m "Deploy documentation"
  git push -f git@github.com:shregar1/fast.mvc.git main:gh-pages
  cd ..
  echo "Deployed to GitHub Pages!"
fi

echo "Build complete! Files are in the 'dist' directory."
