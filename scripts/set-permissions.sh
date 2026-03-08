#!/bin/bash
# Script to set executable permissions for shell scripts
# Run this after cloning repository on Linux/Mac

echo "Setting executable permissions for scripts..."

chmod +x scripts/backup-db.sh
chmod +x scripts/restore-db.sh
chmod +x scripts/deploy.sh

echo "✓ Permissions set successfully!"
echo ""
echo "You can now run:"
echo "  ./scripts/backup-db.sh"
echo "  ./scripts/restore-db.sh"
echo "  ./scripts/deploy.sh"
