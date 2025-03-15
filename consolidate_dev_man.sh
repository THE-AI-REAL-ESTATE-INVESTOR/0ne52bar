#!/bin/bash

# Consolidate _DEV_MAN directories script
# This script consolidates the two _DEV_MAN directories into one

# Set up variables
ROOT_DIR="/Users/markcarpenter/152bar"
APP_DEV_MAN="${ROOT_DIR}/my_app/_DEV_MAN"
ROOT_DEV_MAN="${ROOT_DIR}/_DEV_MAN"

# Create backup directory
BACKUP_DIR="${ROOT_DIR}/backup_dev_man_$(date +%Y%m%d%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Backup both directories first
echo "Backing up directories to $BACKUP_DIR..."
cp -r "$APP_DEV_MAN" "$BACKUP_DIR/my_app_DEV_MAN"
cp -r "$ROOT_DEV_MAN" "$BACKUP_DIR/root_DEV_MAN"
echo "Backup complete."

# Copy app _DEV_MAN files to root _DEV_MAN
echo "Copying files from $APP_DEV_MAN to $ROOT_DEV_MAN..."
cp -r "$APP_DEV_MAN"/* "$ROOT_DEV_MAN/"
echo "Copy complete."

# Remove the app _DEV_MAN directory
echo "Removing $APP_DEV_MAN..."
rm -rf "$APP_DEV_MAN"
echo "Removal complete."

# Create a symlink from app to root _DEV_MAN
echo "Creating symlink from app to root _DEV_MAN..."
ln -s "$ROOT_DEV_MAN" "$APP_DEV_MAN"
echo "Symlink created."

echo "Consolidation complete. The app now uses the root _DEV_MAN directory."
echo "A backup of both directories is available at $BACKUP_DIR" 