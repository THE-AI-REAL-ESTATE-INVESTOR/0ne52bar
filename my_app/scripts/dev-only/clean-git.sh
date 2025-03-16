#!/bin/bash

# Script to clean the git repository and remove node_modules
# This script will:
# 1. Update .gitignore
# 2. Remove node_modules from git tracking
# 3. Commit the changes

# Exit on error
set -e

echo "🧹 Cleaning git repository..."

# Check if node_modules is tracked by git
if git ls-files | grep -q "node_modules/"; then
  echo "⚠️ node_modules is tracked by git. Removing..."
  
  # Make sure .gitignore has node_modules
  if ! grep -q "^node_modules$" .gitignore; then
    echo "Adding node_modules to .gitignore..."
    echo "node_modules" >> .gitignore
  fi
  
  # Remove node_modules from git without deleting the actual files
  git rm -r --cached node_modules/
  echo "✅ node_modules removed from git tracking"
  
  # Commit the changes
  echo "Committing changes..."
  git add .gitignore
  git commit -m "chore: Remove node_modules from git tracking"
  
  echo "🎉 Done! node_modules is now ignored by git."
else
  echo "✅ node_modules is not tracked by git."
fi

# Check for other common ignored files
for file in ".env" ".DS_Store" "*.log"; do
  if git ls-files | grep -q "$file"; then
    echo "⚠️ $file is tracked by git. You might want to remove it."
  fi
done

echo "👍 Git repository cleanup complete." 